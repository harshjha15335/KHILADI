---
name: player-whitelist-integrity
description: Use for player lists, squad marquees, searches, quizzes, rankings, profile records, CSV ingestion and Unstop dropdown eligibility. Enforces only player_id values in the user-provided competition pack.
---

# Player Whitelist Integrity

## Objective
Establish the immutable player universe before any player UI or model is generated.
## Workflow
1. Locate the uploaded `6af458274c1e8_data_pack(1).zip` or equivalent original supplied pack; do not create an external master player roster.
2. Read `Data Pack/competition_team_player_mapping.csv` and validate the schema `comp_id,comp_name,team_id,team_name,player_id,player_name`. Retain raw data unchanged.
3. Build `canonical_players` by unique `player_id`, keeping all source aliases, competition participation, and raw spelling. Flag ambiguous names and duplicate names with distinct IDs.
4. Define `ALLOWED_PLAYER_IDS` from this file only. Reject any inserted, searched, photographed, recommended or ranked player ID outside the set. Player portraits may enrich an existing ID only if they originate from the official IPL player profile website and their use is permitted; otherwise show a silhouette/name fallback.
5. Define `rr_latest_pack_season_players` using source competition rows matching Rajasthan Royals and the latest IPL season present in this pack (currently IPL 2026); badge this as 'IPL 2026 — from supplied data', not an independently current roster.
6. Screenshot captures of Unstop dropdowns are partial. Where a machine-readable full dropdown list can be legally obtained, map exact names to IDs and use the intersection for final dropdown recommendations. Flag unresolved matches, never force a match by fuzzy guess.
7. Historical RR 2008 group photos may remain historical editorial content; pictured individuals outside the CSV must NOT be turned into selectable player cards or rankings.
8. Quiz suggestions, profile routes, marquee cards, hero featured players, pressure charts and exports must all query the same canonical player table.
## Deliverables
`data/canonical_players.parquet` (private), `data/allowed_player_ids.json` (private), `docs/PLAYER_UNIVERSE.md`, `docs/PLAYER_IDENTITY_AUDIT.md`, integrity tests.
## Exit gate
Test that every displayed selectable player and exported rank maps to a whitelisted `player_id`; no non-whitelisted records or arbitrary famous-player placeholders.
