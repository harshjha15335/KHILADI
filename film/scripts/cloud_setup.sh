#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements-cloud.txt
.venv/bin/python scripts/cloud_preflight.py
printf '%s\n' 'Setup only. Production remains paused. Read ../CODEX_HANDOFF.md before rendering.'
