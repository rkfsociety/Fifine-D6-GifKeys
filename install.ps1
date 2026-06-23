# Устанавливает плагин Fifine D6 Starter в каталог StreamDock / fifine Control Deck

$ErrorActionPreference = "Stop"

$PluginName = "com.fifine.d6.starter.sdPlugin"
$Source = Join-Path $PSScriptRoot $PluginName
$TargetDir = Join-Path $env:APPDATA "HotSpot\StreamDock\plugins"
$Target = Join-Path $TargetDir $PluginName

if (-not (Test-Path $Source)) {
    Write-Error "Не найдена папка плагина: $Source"
}

if (-not (Test-Path $TargetDir)) {
    Write-Host "Каталог плагинов не найден, создаю: $TargetDir"
    New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
}

if (Test-Path $Target) {
    Write-Host "Удаляю предыдущую версию..."
    Remove-Item -Recurse -Force $Target
}

Write-Host "Копирую $PluginName -> $Target"
Copy-Item -Recurse -Force $Source $Target

Write-Host ""
Write-Host "Готово! Перезапустите fifine Control Deck, чтобы увидеть плагин."
Write-Host "Категория в библиотеке: Fifine D6 Starter"
