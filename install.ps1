# Installs Fifine D6 Starter plugin into StreamDock / fifine Control Deck

$ErrorActionPreference = "Stop"

$PluginName = "com.fifine.d6.starter.sdPlugin"
$Source = Join-Path $PSScriptRoot $PluginName
$TargetDir = Join-Path $env:APPDATA "HotSpot\StreamDock\plugins"
$Target = Join-Path $TargetDir $PluginName

if (-not (Test-Path $Source)) {
    Write-Error "Plugin folder not found: $Source"
}

if (-not (Test-Path $TargetDir)) {
    Write-Host "Creating plugins directory: $TargetDir"
    New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
}

if (Test-Path $Target) {
    Write-Host "Removing previous version..."
    Remove-Item -Recurse -Force $Target
}

Write-Host "Copying $PluginName -> $Target"
Copy-Item -Recurse -Force $Source $Target

Write-Host ""
Write-Host "Done. Restart fifine Control Deck to load the plugin."
Write-Host "Category: Fifine D6 Starter"
