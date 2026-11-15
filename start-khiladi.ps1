#requires -Version 5.1
<#
.SYNOPSIS
Starts KHILADI on this Windows computer, verifies both services, then opens Brave.
.DESCRIPTION
Run from any directory. Uses the repository beside this script, a local Python
virtual environment, FastAPI on 127.0.0.1:8010 and Vite on 127.0.0.1:3000.
Keep this terminal open. Ctrl+C stops only the processes started by this script.
#>
[CmdletBinding()]
param(
    [switch]$SkipInstall,
    [switch]$NoBrowser,
    [switch]$CheckOnly,
    [ValidateRange(5, 600)][int]$StartupTimeoutSeconds = 90
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$RepoRoot = $PSScriptRoot
$FrontendDirectory = Join-Path $RepoRoot 'khiladi/frontend'
$BackendDirectory = Join-Path $RepoRoot 'khiladi/backend'
$FrontendUrl = 'http://127.0.0.1:3000'
$BackendUrl = 'http://127.0.0.1:8010'
. (Join-Path $PSScriptRoot 'scripts/local-environment.ps1')
Import-KhiladiLocalEnvironment

function Test-KhiladiReady {
    try {
        $backend = Invoke-RestMethod -Uri "$BackendUrl/api/health" -TimeoutSec 3
        $html = Invoke-WebRequest -Uri "$FrontendUrl/" -UseBasicParsing -TimeoutSec 3
        $proxy = Invoke-RestMethod -Uri "$FrontendUrl/api/health" -TimeoutSec 3
        return ($backend.status -eq 'healthy' -and
            $backend.app -like 'KHILADI*' -and
            $backend.canonical_players_count -gt 0 -and
            $html.StatusCode -eq 200 -and $html.Content -match '<title>KHILADI' -and
            $proxy.status -eq 'healthy' -and $proxy.app -eq $backend.app -and
            $proxy.canonical_players_count -eq $backend.canonical_players_count)
    }
    catch { return $false }
}

function Open-KhiladiInBrave {
    if ($NoBrowser) { return }
    $candidates = @()
    $command = Get-Command 'brave.exe' -ErrorAction SilentlyContinue
    if ($command) { $candidates += $command.Source }
    foreach ($directory in @($env:ProgramFiles, ${env:ProgramFiles(x86)}, $env:LOCALAPPDATA)) {
        if ($directory) {
            $candidates += Join-Path $directory 'BraveSoftware/Brave-Browser/Application/brave.exe'
        }
    }
    $brave = $candidates | Where-Object { Test-Path -LiteralPath $_ -PathType Leaf } | Select-Object -First 1
    if ($brave) {
        Start-Process -FilePath $brave -ArgumentList @($FrontendUrl) | Out-Null
    }
    else {
        Write-Host "Brave was not found automatically. Open Brave and paste $FrontendUrl"
    }
}

function Stop-OwnedProcess($Process) {
    if ($null -eq $Process) { return }
    try {
        $Process.Refresh()
        if (-not $Process.HasExited) {
            # A specific owned process tree, never every Python or Node process.
            & taskkill.exe /PID $Process.Id /T /F 2>$null | Out-Null
        }
    }
    catch { Write-Warning "Could not stop process $($Process.Id): $($_.Exception.Message)" }
}

if ($CheckOnly) {
    if (-not (Test-KhiladiReady)) {
        throw "KHILADI health checks failed. Expected frontend $FrontendUrl, backend $BackendUrl/api/health, and frontend API forwarding."
    }
    Write-Host 'Frontend, backend, and API forwarding are healthy in this terminal environment.'
    Write-Host 'This does not verify access from a different computer.'
    return
}

if ($env:OS -ne 'Windows_NT') {
    throw 'This launcher must run on your Windows PC, not in Codex Cloud. Switch Codex to Work in > This computer (Local), open this repository, and run it there.'
}

foreach ($path in @('khiladi/frontend/package-lock.json', 'khiladi/backend/main.py', 'khiladi/backend/requirements.txt')) {
    if (-not (Test-Path -LiteralPath (Join-Path $RepoRoot $path) -PathType Leaf)) {
        throw "Missing repository file: $path. Put this script in the complete KHILADI repository root."
    }
}

$listeners = [System.Net.NetworkInformation.IPGlobalProperties]::GetIPGlobalProperties().GetActiveTcpListeners()
$busyPorts = @($listeners | Where-Object { $_.Port -in @(3000, 8010) } | ForEach-Object { $_.Port } | Sort-Object -Unique)
if ($busyPorts.Count -gt 0) {
    if ((Test-KhiladiReady)) {
        Write-Host "KHILADI is already healthy on this computer at $FrontendUrl"
        Open-KhiladiInBrave
        return
    }
    throw "Port(s) $($busyPorts -join ', ') are already in use. No processes were stopped. Close the conflicting server or the previous launcher terminal, then retry."
}

& (Join-Path $PSScriptRoot 'setup-khiladi.ps1') -SkipInstall:$SkipInstall
$node = Get-Command 'node.exe' -ErrorAction Stop
$python = Join-Path $RepoRoot '.venv/Scripts/python.exe'
$viteEntry = Join-Path $FrontendDirectory 'node_modules/vite/bin/vite.js'

$logDirectory = Join-Path $RepoRoot '.khiladi/logs'
New-Item -ItemType Directory -Path $logDirectory -Force | Out-Null
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss-fff'
$backendOut = Join-Path $logDirectory "backend-$stamp.log"
$backendErr = Join-Path $logDirectory "backend-$stamp.error.log"
$frontendOut = Join-Path $logDirectory "frontend-$stamp.log"
$frontendErr = Join-Path $logDirectory "frontend-$stamp.error.log"
$backendProcess = $null
$frontendProcess = $null

try {
    $backendProcess = Start-Process -FilePath $python -WorkingDirectory $BackendDirectory -ArgumentList @('-m', 'uvicorn', 'main:app', '--host', '127.0.0.1', '--port', '8010') -RedirectStandardOutput $backendOut -RedirectStandardError $backendErr -PassThru
    # Direct Node avoids npm.cmd wrappers and supports repository paths with spaces.
    $frontendProcess = Start-Process -FilePath $node.Source -WorkingDirectory $FrontendDirectory -ArgumentList @("`"$viteEntry`"", '--host', '127.0.0.1', '--port', '3000', '--strictPort') -RedirectStandardOutput $frontendOut -RedirectStandardError $frontendErr -PassThru
    Write-Host 'Waiting for the frontend, backend and frontend API proxy...'
    $deadline = (Get-Date).AddSeconds($StartupTimeoutSeconds)
    $ready = $false
    while ((Get-Date) -lt $deadline) {
        $backendProcess.Refresh()
        $frontendProcess.Refresh()
        if ($backendProcess.HasExited -or $frontendProcess.HasExited) { break }
        if ((Test-KhiladiReady)) { $ready = $true; break }
        Start-Sleep -Milliseconds 500
    }
    if (-not $ready) {
        foreach ($log in @($backendErr, $frontendErr)) {
            if (Test-Path -LiteralPath $log) { Get-Content -LiteralPath $log -Tail 20 | Write-Host }
        }
        throw "Startup failed or timed out. Logs: $logDirectory"
    }
    Write-Host "KHILADI is ready on this computer: $FrontendUrl" -ForegroundColor Green
    Write-Host "API health: $BackendUrl/api/health"
    Write-Host "Logs: $logDirectory"
    Write-Host 'Keep this terminal open. Press Ctrl+C to stop these two servers.'
    Open-KhiladiInBrave
    while ($true) {
        Start-Sleep -Seconds 1
        $backendProcess.Refresh()
        $frontendProcess.Refresh()
        if ($backendProcess.HasExited -or $frontendProcess.HasExited) {
            throw "A KHILADI server exited. Check the logs in $logDirectory"
        }
    }
}
finally {
    Stop-OwnedProcess $frontendProcess
    Stop-OwnedProcess $backendProcess
}
