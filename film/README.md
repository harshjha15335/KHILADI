# Khiladi animated film checkpoint

Start with [`../CODEX_HANDOFF.md`](../CODEX_HANDOFF.md). Production is **paused**, not complete. The website under `../khiladi/` is a separate existing application and is unchanged by this package.

This folder preserves selected source, the approved-direction V3 asset, incomplete V4 acting state, existing narration and caption timing, 21 completed environment plates, and 43 corrected character frames. It deliberately omits obsolete renders, Windows executables/venvs, caches, restricted source data and uncleared reference footage.

Safe migration checks (no Blender rendering):

```bash
cd film
python3 scripts/verify_snapshot.py
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements-cloud.txt
.venv/bin/python scripts/verify_snapshot.py --media
.venv/bin/python scripts/rebase_paths.py --dry-run
.venv/bin/python scripts/cloud_preflight.py
```

Verify hashes before rebasing metadata. The rebaser only adjusts copied Windows absolute paths; it does not repair the intentionally stale actor manifest or finish the compositor. Renderer, graphics-device availability and Linux fonts still need environment-specific validation. No command above starts production.

The user's original reference footage/review images are in the separate private archive listed by `private-reference-manifest.json`, not in this public repository. Extract that archive at repository root to populate ignored `film/private/`.
