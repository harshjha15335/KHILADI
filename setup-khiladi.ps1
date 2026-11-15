#requires -Version 5.1
[CmdletBinding()]
param([switch]$SkipInstall)
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
if ($env:OS -ne 'Windows_NT') { throw 'Run setup-khiladi.ps1 on your Windows computer.' }
$RepoRoot = $PSScriptRoot
$FrontendDirectory = Join-Path $RepoRoot 'khiladi/frontend'
$BackendDirectory = Join-Path $RepoRoot 'khiladi/backend'
foreach ($relative in @('khiladi/frontend/package-lock.json', 'khiladi/backend/requirements.txt')) {
    if (-not (Test-Path -LiteralPath (Join-Path $RepoRoot $relative))) { throw "Missing repository file: $relative. Run from a complete KHILADI checkout." }
}
. (Join-Path $PSScriptRoot 'scripts/local-environment.ps1')
Import-KhiladiLocalEnvironment
$node = Get-Command 'node.exe' -ErrorAction SilentlyContinue
$npm = Get-Command 'npm.cmd' -ErrorAction SilentlyContinue
if (-not $node -or -not $npm) {
    throw 'Install Node.js 24 LTS from https://nodejs.org/, reopen PowerShell, then rerun this script.'
}
$nodeVersion = (& $node.Source --version).Trim()
if ($LASTEXITCODE -ne 0 -or ([version]$nodeVersion.TrimStart('v')) -lt [version]'22.20.0') {
    throw "Node.js $nodeVersion is unsupported by this setup. Install Node.js 24 LTS."
}

$venvDirectory = Join-Path $RepoRoot '.venv'
$python = Join-Path $venvDirectory 'Scripts/python.exe'
if (-not (Test-Path -LiteralPath $python -PathType Leaf)) {
    if (Test-Path -LiteralPath $venvDirectory) {
        throw 'An existing .venv is not a usable Windows virtual environment. Preserve/rename that directory or use a fresh checkout; this script will not overwrite it.'
    }
    $bootstrap = Get-Command 'py.exe' -ErrorAction SilentlyContinue
    $bootstrapArguments = @('-3')
    if (-not $bootstrap) {
        $bootstrap = Get-Command 'python.exe' -ErrorAction SilentlyContinue
        $bootstrapArguments = @()
    }
    if (-not $bootstrap) {
        throw 'Install Python 3.11 or newer from https://www.python.org/downloads/windows/ (including the Python launcher), reopen PowerShell, and retry.'
    }
    & $bootstrap.Source @bootstrapArguments -c 'import sys; sys.exit(0 if sys.version_info >= (3, 11) else 1)'
    if ($LASTEXITCODE -ne 0) { throw 'Python 3.11 or newer is required; the detected Python could not pass its version check.' }
    Write-Host 'Creating the repository-local Python virtual environment...'
    & $bootstrap.Source @bootstrapArguments -m venv $venvDirectory
    if ($LASTEXITCODE -ne 0) { throw 'Python virtual-environment creation failed.' }
}

& $python -c 'import sys; sys.exit(0 if sys.version_info >= (3, 11) else 1)'
if ($LASTEXITCODE -ne 0) { throw 'The existing .venv requires Python 3.11 or newer. Preserve it and recreate it with a supported Python version.' }

if (-not $SkipInstall) {
    Write-Host 'Installing pinned backend requirements...'
    & $python -m pip install -r (Join-Path $BackendDirectory 'requirements.txt')
    if ($LASTEXITCODE -ne 0) { throw 'Backend dependency installation failed. Read the pip error above; TLS verification has not been disabled.' }
    & $python -m pip check
    if ($LASTEXITCODE -ne 0) { throw 'Backend dependency compatibility check failed.' }
    Push-Location $FrontendDirectory
    try {
        Write-Host 'Installing the frontend from package-lock.json...'
        & $npm.Source ci --include=dev --no-audit --no-fund
        if ($LASTEXITCODE -ne 0) { throw 'Frontend dependency installation failed. Read the npm error above.' }
    }
    finally { Pop-Location }
}

$viteEntry = Join-Path $FrontendDirectory 'node_modules/vite/bin/vite.js'
if (-not (Test-Path -LiteralPath $viteEntry -PathType Leaf)) {
    throw 'Vite is missing. Rerun without -SkipInstall.'
}
& $python -c 'import fastapi, uvicorn'
if ($LASTEXITCODE -ne 0) { throw 'FastAPI or Uvicorn is missing. Rerun without -SkipInstall.' }

Write-Host 'KHILADI dependency checks passed. No API keys or secrets are required.'
