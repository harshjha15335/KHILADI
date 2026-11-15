---
name: khiladi-player-whitelist
description: Project workflow for player whitelist.
---

# khiladi-player-whitelist

Read Data Pack/competition_team_player_mapping.csv. All selectable IDs, squad IDs, quiz results and exports must belong to that file. Derive the latest RR IPL season from its rows. Do not add a player based on a live roster. Run scripts/test_takeover.py for canonical and export regression checks.

Use the existing isolated checkout; do not create worktrees unless explicitly requested. Never publish or deploy without authorization.
