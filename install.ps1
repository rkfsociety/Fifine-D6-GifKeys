# Installs plugin and restarts fifine Control Deck

$ErrorActionPreference = "Stop"

$PluginName = "com.fifine.d6.starter.sdPlugin"
$Source = Join-Path $PSScriptRoot $PluginName
$TargetDir = Join-Path $env:APPDATA "HotSpot\StreamDock\plugins"
$Target = Join-Path $TargetDir $PluginName
$FifineExe = "C:\Program Files (x86)\fifine Control Deck\fifine Control Deck.exe"

if (-not (Test-Path $Source)) {
    Write-Error "Plugin folder not found: $Source"
}

if (-not (Test-Path $TargetDir)) {
    New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
}

if (Test-Path $Target) {
    Write-Host "Removing previous version..."
    Remove-Item -Recurse -Force $Target
}

Write-Host "Copying $PluginName -> $Target"
Copy-Item -Recurse -Force $Source $Target

$procs = Get-Process -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*fifine Control Deck*" }
if ($procs) {
    Write-Host "Restarting fifine Control Deck..."
    $procs | Stop-Process -Force
    Start-Sleep -Seconds 2
}

if (Test-Path $FifineExe) {
    Start-Process -FilePath $FifineExe
    Write-Host "fifine Control Deck started."
} else {
    Write-Host "Start fifine Control Deck manually."
}

Write-Host ""
Write-Host "Done. Category in library: Fifine D6 Starter"
Write-Host "Drag 'GIF Button' onto a key."
