# KHILADI: Windows development and Codex Local

Use branch **`migration/windows-and-pages`**. This branch preserves the Phase 2
implementation at `955dca9`; migration changes affect startup, URL routing and
static deployment, not the UI design or cricket model.

## 1. Get a fresh, safe checkout

Install Git, Node.js **24 LTS**, Python **3.11+** and Brave. Reopen PowerShell.
A new folder avoids the earlier ASTFLOW remote and does not overwrite local work:

```powershell
cd $HOME
git clone --branch migration/windows-and-pages https://github.com/harshjha15335/KHILADI.git KHILADI-Local
cd KHILADI-Local
git remote get-url origin
git status
```

The remote must be `https://github.com/harshjha15335/KHILADI.git`. If you already
have a **clean checkout of this branch**, update it with:

```powershell
git fetch origin
git pull --ff-only origin migration/windows-and-pages
```

If there are local changes, a different remote, or divergent history, keep that
folder intact and use the fresh-clone instructions. Do not reset or force-push.

## 2. Optional environment settings

No secrets, API keys or required environment variables are needed. Defaults run
both services on this computer, use the Vite API proxy, and allow loopback origins.
The root `.env.example` contains **names with blank values only**. You may copy it:

```powershell
Copy-Item .env.example .env
```

Leave blank values to keep defaults. `VITE_MEDIA_REVIEW=false` disables optional
private media. `VITE_BASE_PATH` must be blank or `/` locally. Leave
`VITE_API_BASE_URL` blank to use the Vite proxy (or set
`http://127.0.0.1:8010` for direct local calls). Leave `VITE_GITHUB_PAGES` blank or
false locally; only the Pages CI build sets it true. If configuring
`KHILADI_ALLOWED_ORIGINS`, include `http://127.0.0.1:3000`.

Never put credentials in `VITE_` variables: Vite embeds them in browser code.
`.env` files are ignored by Git. The launcher reads known keys without evaluating
commands. Invalid values produce named errors without printing values.

## 3. Install and start

From the repository root:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\setup-khiladi.ps1
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\start-khiladi.ps1 -SkipInstall
```

Or run only `start-khiladi.ps1`; it installs dependencies automatically unless
`-SkipInstall` is supplied. This process-scoped execution option does not change
system policy or browser security. Follow organization policy if execution is
centrally restricted.

The setup creates `.venv`, installs pinned backend requirements and the frontend
lockfile, and validates dependencies. The launcher starts **separate processes**:
FastAPI at `127.0.0.1:8010` and Vite at `127.0.0.1:3000`, then checks frontend HTML,
direct API health and proxied API health before opening Brave. Keep PowerShell
open. Ctrl+C stops only the processes the launcher owns. Logs are in
`.khiladi/logs/`. Port conflicts are reported; unrelated processes are not killed.

To check a running local instance:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\start-khiladi.ps1 -CheckOnly
Invoke-RestMethod http://127.0.0.1:8010/api/health
Invoke-RestMethod http://127.0.0.1:3000/api/health
```

After those checks pass **on your PC**, open **http://127.0.0.1:3000** in Brave.
Cloud checks do not establish access from that Windows browser.

## 4. Private files and completed work

The separate **KHILADI-private-local-files.zip** preserves raw Data Pack files,
uncleared review imagery, earlier reports and ignored QA recordings with a SHA256
inventory. Extract it into the repository root only for private local review.
Do not commit or publish those files. Dependency folders, compiled outputs and
scratch traces are regenerated; they are not a source-of-truth backup.

The runtime uses the existing processed aggregate exports under `khiladi/data`
and `khiladi/frontend/public/data`; it does not need the raw Data Pack to start.
Canonical source-integrity tests and model rebuilding require privately restoring
the original pack. All source CSVs remain unchanged in the cloud workspace.
Permitted-media manifest `src/config/approved-media.json` currently has no cleared
portraits, archive photos or clips, so a clean public checkout uses intentional
fallbacks. Private review images remain excluded from production builds.

The raw pack and protected review assets were already in earlier public Git
history. This branch stops tracking them going forward. It does **not** erase
existing history or revoke previously published copies; no history rewrite was
performed.

## 5. Continue with Codex Local

Select **Work in > This computer (Local)** and open `KHILADI-Local`. Or run Codex
CLI from that directory. Tell it to preserve this branch, UI and model. Keep the
launcher terminal running while reviewing in Brave.

## Verification boundary

Cloud validation covers PowerShell parsing, environment validation, health-check
execution, frontend builds, browser flows and backend/data checks. Native Windows
process creation, paths with spaces, Brave discovery, antivirus/firewall behaviour
and Ctrl+C process-tree cleanup still require a real Windows run. No Windows
browser connection has been claimed.
