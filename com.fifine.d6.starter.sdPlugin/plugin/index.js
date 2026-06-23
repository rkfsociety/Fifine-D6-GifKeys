/// <reference path="./utils/common.js" />

const plugin = new Plugins("fifine-d6-starter");

function formatCounterTitle(count) {
    return String(count);
}

function formatUrlTitle(url) {
    if (!url) return "URL";
    try {
        return new URL(url).hostname.replace(/^www\./, "");
    } catch {
        return "URL";
    }
}

plugin.counter = new Actions({
    default: { count: 0, step: 1 },
    _willAppear({ context, payload: { settings } }) {
        window.socket.setTitle(context, formatCounterTitle(settings.count ?? 0));
    },
    keyUp({ context, payload: { settings } }) {
        const step = Number(settings.step) || 1;
        const count = (Number(settings.count) || 0) + step;
        const next = { ...settings, count, step };
        window.socket.setSettings(context, next);
        window.socket.setTitle(context, formatCounterTitle(count));
    },
    didReceiveSettings({ context, payload: { settings } }) {
        window.socket.setTitle(context, formatCounterTitle(settings.count ?? 0));
    }
});

plugin.openurl = new Actions({
    default: { url: "https://fifinemicrophone.com" },
    _willAppear({ context, payload: { settings } }) {
        window.socket.setTitle(context, formatUrlTitle(settings.url));
    },
    keyUp({ payload: { settings } }) {
        if (settings.url) {
            window.socket.openUrl(settings.url);
        }
    },
    didReceiveSettings({ context, payload: { settings } }) {
        window.socket.setTitle(context, formatUrlTitle(settings.url));
    }
});
