/** Размер клавиши Fifine D6 / Stream Dock (пиксели) */
const D6_KEY_SIZE = 126;

const gifPlayers = {};
let bgImageCache = null;

function toFileUrl(path) {
    if (!path || path.startsWith("data:") || path.startsWith("http")) return path;
    const normalized = path.replace(/\\/g, "/");
    if (normalized.startsWith("file:")) return normalized;
    return "file:///" + (normalized.startsWith("/") ? normalized.slice(1) : normalized);
}

function loadArrayBufferFromUrl(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "arraybuffer";
        xhr.onload = () => {
            if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 300)) {
                resolve(xhr.response);
            } else {
                reject(new Error("HTTP " + xhr.status));
            }
        };
        xhr.onerror = () => reject(new Error("Ошибка загрузки"));
        xhr.send();
    });
}

async function loadPluginStaticBuffer(relativePath) {
    const url = new URL(relativePath, new URL("../", window.location.href)).href;
    return loadArrayBufferFromUrl(url);
}

async function resolveGifBuffer(settings) {
    if (settings.gifData) {
        return loadArrayBufferFromUrl(settings.gifData);
    }
    if (settings.gifUrl) {
        return loadArrayBufferFromUrl(settings.gifUrl);
    }
    if (settings.gifPath) {
        return loadArrayBufferFromUrl(toFileUrl(settings.gifPath));
    }
    if (settings.demoGif) {
        return loadPluginStaticBuffer(settings.demoGif);
    }
    return loadPluginStaticBuffer("static/demo.gif");
}

function stopGifPlayer(context) {
    const player = gifPlayers[context];
    if (!player) return;
    if (player.timerId) plugin.clearInterval(player.timerId);
    delete gifPlayers[context];
}

function logGif(context, message) {
    window.socket?.send(JSON.stringify({
        event: "logMessage",
        payload: { message: "[Fifine D6 Starter] " + message + " (" + context + ")" }
    }));
}

function loadBackgroundImage() {
    if (bgImageCache) return Promise.resolve(bgImageCache);
    const url = new URL("../static/default.jpg", window.location.href).href;
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            bgImageCache = img;
            resolve(img);
        };
        img.onerror = reject;
        img.src = url;
    });
}

function buildFrameSnapshots(gr) {
    const width = gr.width;
    const height = gr.height;
    const numFrames = gr.numFrames();
    const pixels = new Uint8ClampedArray(width * height * 4);
    const snapshots = [];

    for (let i = 0; i < numFrames; i++) {
        const info = gr.frameInfo(i);
        if (i === 0 || info.disposal === 2) {
            pixels.fill(0);
        }
        gr.decodeAndBlitFrameRGBA(i, pixels);
        snapshots.push(new Uint8ClampedArray(pixels));
    }

    return { width, height, snapshots };
}

function drawFitImage(ctx, img, size) {
    const w = img.width || img.naturalWidth || size;
    const h = img.height || img.naturalHeight || size;
    const scale = Math.min(size / w, size / h);
    const dw = w * scale;
    const dh = h * scale;
    ctx.drawImage(img, (size - dw) / 2, (size - dh) / 2, dw, dh);
}

function snapshotToCanvas(snapshot, width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d").putImageData(new ImageData(snapshot, width, height), 0, 0);
    return canvas;
}

async function applyGifToButton(context, settings, pluginRef) {
    stopGifPlayer(context);

    let buffer;
    try {
        buffer = await resolveGifBuffer(settings);
    } catch (err) {
        console.error("[gifbutton]", err);
        logGif(context, "GIF load error: " + err.message);
        window.socket.setTitle(context, "GIF?");
        return;
    }

    if (!buffer || !buffer.byteLength) {
        window.socket.setTitle(context, "GIF");
        return;
    }

    let gr;
    try {
        gr = new GifReader(new Uint8Array(buffer));
    } catch (err) {
        console.error("[gifbutton]", err);
        logGif(context, "GIF parse error: " + err.message);
        window.socket.setTitle(context, "GIF?");
        return;
    }

    const fps = Math.min(30, Math.max(1, Number(settings.fps) || 15));
    const bgOpacity = Math.min(1, Math.max(0, (Number(settings.bgOpacity ?? 50)) / 100));
    const frameDelay = Math.round(1000 / fps);

    window.socket.setTitle(context, settings.title || "");

    let bgImage = null;
    if (bgOpacity > 0) {
        try {
            bgImage = await loadBackgroundImage();
        } catch {
            bgImage = null;
        }
    }

    const { width, height, snapshots } = buildFrameSnapshots(gr);
    if (!snapshots.length) {
        window.socket.setTitle(context, "GIF?");
        return;
    }

    const frameCanvas = snapshotToCanvas(snapshots[0], width, height);
    const outCanvas = document.createElement("canvas");
    outCanvas.width = D6_KEY_SIZE;
    outCanvas.height = D6_KEY_SIZE;
    const outCtx = outCanvas.getContext("2d");

    let frameIndex = 0;

    const pushFrame = () => {
        const snapshot = snapshots[frameIndex];
        frameCanvas.getContext("2d").putImageData(new ImageData(snapshot, width, height), 0, 0);

        outCtx.clearRect(0, 0, D6_KEY_SIZE, D6_KEY_SIZE);

        if (bgImage && bgOpacity > 0) {
            outCtx.globalAlpha = bgOpacity;
            drawFitImage(outCtx, bgImage, D6_KEY_SIZE);
            outCtx.globalAlpha = 1;
        }

        drawFitImage(outCtx, frameCanvas, D6_KEY_SIZE);
        window.socket.setImageData(context, outCanvas.toDataURL("image/jpeg", 0.92), 0);

        frameIndex = (frameIndex + 1) % snapshots.length;
    };

    pushFrame();

    const timerId = `gif-${context}`;
    pluginRef.setInterval(timerId, pushFrame, frameDelay);
    gifPlayers[context] = { timerId, frames: snapshots.length };

    logGif(context, `Анимация: ${snapshots.length} кадр(ов), ${fps} FPS`);

    const userSource = settings.gifData || settings.gifUrl || settings.gifPath;
    if (userSource && !settings.gifData && buffer.byteLength < 1_500_000) {
        const blob = new Blob([buffer], { type: "image/gif" });
        const reader = new FileReader();
        reader.onload = () => {
            window.socket.setSettings(context, { ...settings, gifData: reader.result });
        };
        reader.readAsDataURL(blob);
    }
}
