/// <reference path="../utils/common.js" />
/// <reference path="../utils/action.js" />

const $local = false, $back = false, $dom = {
    main: $('.sdpi-wrapper')
};

function pickPath(data) {
    if (!data) return "";
    if (typeof data === "string") return data;
    return data.path || data.file || data.url || data[0] || "";
}

function updatePreview() {
    const preview = document.getElementById("preview");
    if ($settings.gifData) {
        preview.src = $settings.gifData;
    } else if ($settings.gifUrl) {
        preview.src = $settings.gifUrl;
    } else if ($settings.gifPath) {
        preview.src = "file:///" + $settings.gifPath.replace(/\\/g, "/");
    } else {
        preview.src = "../../static/default.jpg";
    }
}

function syncFields() {
    $("#gifUrl").value = $settings.gifUrl || "";
    $("#fps").value = $settings.fps ?? 15;
    $("#title").value = $settings.title || "";
    updatePreview();
}

const $propEvent = {
    didReceiveSettings() {
        syncFields();
    }
};

$emit.on("File-gifFile", (data) => {
    const path = pickPath(data);
    $settings.gifPath = path;
    $settings.gifUrl = "";
    $settings.gifData = "";
    $("#gifUrl").value = "";
    updatePreview();
    $websocket.sendToPlugin({ settings: { ...$settings } });
});

$("#gifUrl").on("change", () => {
    const url = $("#gifUrl").value.trim();
    $settings.gifUrl = url;
    if (url) {
        $settings.gifPath = "";
        $settings.gifData = "";
    }
    updatePreview();
});

$("#fps").on("change", () => {
    $settings.fps = Math.min(30, Math.max(1, Number($("#fps").value) || 15));
});

$("#title").on("change", () => {
    $settings.title = $("#title").value.trim();
});

$("#clear").on("click", () => {
    $settings.gifPath = "";
    $settings.gifUrl = "";
    $settings.gifData = "";
    $("#gifUrl").value = "";
    updatePreview();
    $websocket.sendToPlugin({ settings: { ...$settings } });
});
