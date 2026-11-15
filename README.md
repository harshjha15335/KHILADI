# KHILADI

Cricket player discovery and pressure-performance research, with a React/Vite
frontend and a FastAPI backend. The source datasets and model exports are retained
from the original project.

## Run on Windows in Brave

From a **local Windows checkout**, not a Codex Cloud terminal:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\start-khiladi.ps1
```

The launcher installs dependencies, checks for port conflicts, starts both services
and verifies frontend/API health before opening Brave. Keep its terminal open.
Frontend: `http://127.0.0.1:3000`; backend: `http://127.0.0.1:8010`.

Read [LOCAL_WINDOWS.md](LOCAL_WINDOWS.md) for prerequisites, Git transfer steps,
Codex Local/CLI instructions, manual startup and troubleshooting. The launcher
cannot make a cloud `127.0.0.1` server accessible from your PC.

## Development status

The functional frontend rebuild is implemented and tested in the cloud runtime.
Windows-native startup has not been verified from that remote machine. Original
reference recordings, media reuse permission, the specific 2008 trophy image and
exact Cyera motion matching remain outstanding. No public deployment is implied.

- [Implementation and validation](docs/CODEX_TAKEOVER.md)
- [Reference observations and differences](docs/CODEX_REFERENCE_MAP.md)
- [Installed skill sources](docs/CODEX_SKILL_READINESS.md)

Private review images and recordings are kept outside the public Git handoff.
Their separate archive can restore `docs/qa/` for local review. The site also runs
without that archive, showing the documented media gaps.
