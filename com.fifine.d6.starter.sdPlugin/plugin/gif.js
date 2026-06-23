/** Размер клавиши Fifine D6 / Stream Dock (пиксели) */
const D6_KEY_SIZE = 126;

const gifPlayers = {};

function toFileUrl(path) {
    if (!path || path.startsWith("data:") || path.startsWith("http")) return path;
    const normalized = path.replace(/\\/g, "/");
    if (normalized.startsWith("file:")) return normalized;
    return "file:///" + (normalized.startsWith("/") ? normalized.slice(1) : normalized);
}

function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

function loadLocalFile(path) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", toFileUrl(path), true);
        xhr.responseType = "blob";
        xhr.onload = () => {
            if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 300)) {
                blobToDataUrl(xhr.response).then(resolve).catch(reject);
            } else {
                reject(new Error("Не удалось прочитать файл: " + path));
            }
        };
        xhr.onerror = () => reject(new Error("Ошибка чтения файла: " + path));
        xhr.send();
    });
}

async function loadRemoteGif(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error("HTTP " + response.status);
    return blobToDataUrl(await response.blob());
}

async function resolveGifData(settings) {
    if (settings.gifData) return settings.gifData;
    if (settings.gifUrl) return loadRemoteGif(settings.gifUrl);
    if (settings.gifPath) return loadLocalFile(settings.gifPath);
    return null;
}

function stopGifPlayer(context) {
    const player = gifPlayers[context];
    if (!player) return;
    if (player.timerId) plugin.clearInterval(player.timerId);
    player.img.src = "";
    delete gifPlayers[context];
}

function drawFit(ctx, img, size) {
    const w = img.naturalWidth || size;
    const h = img.naturalHeight || size;
    const scale = Math.min(size / w, size / h);
    const dw = w * scale;
    const dh = h * scale;
    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(img, (size - dw) / 2, (size - dh) / 2, dw, dh);
}

async function applyGifToButton(context, settings, pluginRef) {
    stopGifPlayer(context);

    let dataUrl;
    try {
        dataUrl = await resolveGifData(settings);
    } catch (err) {
        console.error("[gifbutton]", err);
        window.socket.setTitle(context, "GIF?");
        return;
    }

    if (!dataUrl) {
        window.socket.setTitle(context, "GIF");
        return;
    }

    const fps = Math.min(30, Math.max(1, Number(settings.fps) || 15));
    const isGif = dataUrl.startsWith("data:image/gif") || /\.gif(\?|$)/i.test(settings.gifUrl || settings.gifPath || "");

    if (settings.title) {
        window.socket.setTitle(context, settings.title);
    } else if (settings.showTitle !== true) {
        window.socket.setTitle(context, "");
    }

    if (isGif) {
        const img = new Image();
        img.src = dataUrl;
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = () => reject(new Error("Не удалось декодировать GIF"));
        });

        // GIF в интерфейсе ПО (анимация нативно)
        window.socket.setImage(context, dataUrl, true, 2);

        const canvas = document.createElement("canvas");
        canvas.width = D6_KEY_SIZE;
        canvas.height = D6_KEY_SIZE;
        const ctx = canvas.getContext("2d");

        const timerId = `gif-${context}`;
        pluginRef.setInterval(timerId, () => {
            drawFit(ctx, img, D6_KEY_SIZE);
            window.socket.setImageData(context, canvas.toDataURL("image/jpeg", 0.92), 1);
        }, Math.round(1000 / fps));

        gifPlayers[context] = { img, timerId };
    } else {
        window.socket.setImage(context, dataUrl);
    }

    if (!settings.gifData && dataUrl.length < 1_500_000) {
        window.socket.setSettings(context, { ...settings, gifData: dataUrl });
    }
}
