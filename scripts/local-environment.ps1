# Read only known, optional local settings. Never evaluate dotenv contents as code.
function Import-KhiladiLocalEnvironment {
    $environmentPath = Join-Path (Split-Path $PSScriptRoot -Parent) '.env'
    $known = @('VITE_MEDIA_REVIEW', 'VITE_BASE_PATH', 'VITE_API_BASE_URL', 'VITE_GITHUB_PAGES', 'KHILADI_ALLOWED_ORIGINS', 'KHILADI_ANALYTICS_DIR', 'KHILADI_ANALYTICS_TOKEN')
    if (Test-Path -LiteralPath $environmentPath) {
        foreach ($line in Get-Content -LiteralPath $environmentPath) {
            $text = $line.Trim()
            if (-not $text -or $text.StartsWith('#')) { continue }
            if ($text -notmatch '^([A-Z][A-Z0-9_]*)\s*=\s*(.*)$') { throw 'Invalid .env line. Use NAME=value; do not put commands in .env.' }
            $name = $Matches[1]
            $value = $Matches[2].Trim().Trim('"').Trim("'")
            if ($known -contains $name -and $value) {
                [Environment]::SetEnvironmentVariable($name, $value, 'Process')
            }
        }
    }
    foreach ($flag in @('VITE_MEDIA_REVIEW', 'VITE_GITHUB_PAGES')) {
        $value = [Environment]::GetEnvironmentVariable($flag, 'Process')
        if ($value -and $value -notin @('true', 'false')) { throw "$flag must be blank, true or false." }
    }
    if ($env:VITE_BASE_PATH -and $env:VITE_BASE_PATH -ne '/') { throw 'For local Windows development, clear VITE_BASE_PATH or set it to /. /KHILADI/ is for the Pages build only.' }
    if ($env:VITE_GITHUB_PAGES -eq 'true') { throw 'Clear VITE_GITHUB_PAGES for local development so the live FastAPI backend is used.' }
    if ($env:VITE_API_BASE_URL -and $env:VITE_API_BASE_URL -ne 'http://127.0.0.1:8010') { throw 'For this local launcher, clear VITE_API_BASE_URL to use the Vite proxy, or set http://127.0.0.1:8010.' }
    if (-not $env:KHILADI_ALLOWED_ORIGINS) { $env:KHILADI_ALLOWED_ORIGINS = 'http://127.0.0.1:3000,http://localhost:3000' }
    if ($env:KHILADI_ALLOWED_ORIGINS.Split(',').Trim() -notcontains 'http://127.0.0.1:3000') { throw 'KHILADI_ALLOWED_ORIGINS must include http://127.0.0.1:3000 for local development.' }
}
