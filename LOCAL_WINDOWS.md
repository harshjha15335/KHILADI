# Run KHILADI in Brave on your Windows PC

The coding session that created this launcher ran in **Codex Cloud**. A cloud
server is not reachable using your Windows computer's `127.0.0.1`. These steps
start both services on your PC. Windows execution and access from your PC cannot
be verified from the cloud session.

## Get the updated files

If you already have the repository on your PC, open PowerShell in that folder:

```powershell
git status
git pull --ff-only origin main
```

Keep any existing local changes. If Git reports a conflict or divergent history,
let Codex Local inspect it; do not reset or overwrite your files.

For a new clone:

```powershell
git clone https://github.com/harshjha15335/KHILADI.git
cd KHILADI
```

If the cloud push was blocked, use the incremental Git bundle supplied in the
handoff instead. Inside an existing clone containing the original `a12c132`
commit, fetch the bundle into a separate local branch without overwriting work:

```powershell
git fetch "$HOME\Downloads\KHILADI-local-handoff.bundle" HEAD:codex-local-handoff
git switch codex-local-handoff
```

The private review archive, if supplied, is separate from the public Git branch.
Extract it into the repository root to restore its ignored `docs/qa/...` files.
These assets are for local review and remain excluded from production output.
The site also starts without them, with its documented media gaps visible.

## Start both services

Install **Node.js 24 LTS**, **Python 3.11+**, Git, and Brave if they are not already
installed. Reopen PowerShell after installation so the tools are on `PATH`.

Run this command from the repository root:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\start-khiladi.ps1
```

`-ExecutionPolicy Bypass` applies only to this PowerShell process so the downloaded
launcher can run. It does not change the machine execution policy, Brave Shields,
CORS settings or browser security. If an organization blocks script execution,
use its approved script policy or the manual startup commands below.

The launcher:

1. Checks ports **3000** and **8010**, without killing existing applications.
2. Reuses an already healthy KHILADI instance when both services are running.
3. Creates `.venv` without overwriting an incompatible existing environment.
4. Installs the backend requirements and runs `npm ci --include=dev`.
5. Starts FastAPI on `127.0.0.1:8010` and Vite on `127.0.0.1:3000`.
6. Verifies the frontend HTML, backend health and frontend `/api/health` proxy.
7. Opens Brave if it can locate it, **after checks pass on this computer**.

Keep the PowerShell window open. **Ctrl+C** stops only the process trees this
launcher started. Logs are stored in `.khiladi/logs/`.

Later launches can skip installation:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\start-khiladi.ps1 -SkipInstall
```

To test a running instance without installing or launching anything:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\start-khiladi.ps1 -CheckOnly
```

Then open **http://127.0.0.1:3000** in Brave on that same Windows PC.

## Continue with Codex Local or Codex CLI

In the desktop app, select **Work in → This computer (Local)** and open this
repository folder. Alternatively, start Codex CLI from PowerShell in that folder:

```powershell
codex
```

Tell that local session:

> Run `start-khiladi.ps1` on this Windows computer. Verify frontend and API health,
> then continue the KHILADI reference-based redesign while I inspect it in Brave.
> Preserve existing work. Do not create external tunnels or publish the site.

If Codex CLI runs inside WSL, use `powershell.exe` to invoke the Windows launcher
from a Windows checkout; do not assume a WSL/cloud process and a native Windows
browser share a network or Python virtual environment.

## Manual startup

Backend, from a fresh repository checkout without an existing `.venv`:

```powershell
py -3 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r .\khiladi\backend\requirements.txt
.\.venv\Scripts\python.exe -m uvicorn main:app --app-dir .\khiladi\backend --host 127.0.0.1 --port 8010
```

Frontend, in a second PowerShell window:

```powershell
cd .\khiladi\frontend
npm.cmd ci --include=dev
npm.cmd run dev -- --host 127.0.0.1 --port 3000 --strictPort
```

No environment variables, API keys or external services are required for this
workflow. Vite forwards `/api` to `http://127.0.0.1:8010`, so the browser uses the
same origin. Keep Brave Shields and normal browser security enabled.

## Verification performed during the cloud handoff

The frontend production build passed. PowerShell 7.7 on Linux parsed the launcher
without errors and executed its live frontend/backend/proxy health check. A
negative check rejected an unreachable frontend; the launcher also rejected a
normal launch from the non-Windows cloud environment. These are meaningful cloud
checks, **not a Windows-native execution test**. The actual process startup,
Windows dependency installation, Brave discovery and Ctrl+C cleanup must still
be exercised on your PC by the local session.

Private source recordings, licensed RR footage, the specific 2008 trophy photo
and exact Cyera motion remain separate redesign prerequisites. The launcher does
not claim that those missing deliverables are finished.
