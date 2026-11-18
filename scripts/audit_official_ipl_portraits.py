#!/usr/bin/env python3
"""Audit verified official IPL portrait metadata without downloading or publishing images.

The public website must not automatically redistribute these photos.
Exit nonzero for identity mismatches or non-IPL asset domains.
"""
from __future__ import annotations

import json
import re
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
CATALOGUE = ROOT / "khiladi/data/player_database.json"
MANIFEST = ROOT / "khiladi/frontend/src/components/player-cards/official-portraits.json"
OUTPUT = ROOT / "khiladi/frontend/visual-review-output/official-portrait-coverage.json"
OFFICIAL_HOSTS = {"www.iplt20.com", "iplt20.com", "documents.iplt20.com"}
# Primary accepted D20 batting and bowling top-ten canonical identities only.
PRIORITY = {
    813, 6281, 3125, 6396, 6819, 1077, 2756, 1107, 4106, 2921,
    2933, 781, 5979, 3644, 6523, 5944, 2411, 4101, 6450, 4373,
}


def normalize(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip().casefold()


def main() -> None:
    players = json.loads(CATALOGUE.read_text(encoding="utf-8"))
    portraits = json.loads(MANIFEST.read_text(encoding="utf-8"))
    by_id = {int(p["player_id"]): p["player_name"] for p in players}
    problems = []
    mapped = set()
    for raw_id, portrait in portraits.items():
        try:
            player_id = int(raw_id)
        except ValueError:
            problems.append(f"Non-numeric canonical ID: {raw_id}")
            continue
        if player_id not in by_id:
            problems.append(f"Unknown player ID: {player_id}")
            continue
        if normalize(portrait.get("name", "")) != normalize(by_id[player_id]):
            problems.append(f"Canonical identity mismatch: ID {player_id} / {portrait.get('name')!r} / {by_id[player_id]!r}")
        source = urlparse(portrait.get("source", ""))
        image = urlparse(portrait.get("url", ""))
        if source.scheme != "https" or source.netloc not in OFFICIAL_HOSTS:
            problems.append(f"Invalid official profile source for {player_id}")
        if image.scheme != "https" or image.netloc not in OFFICIAL_HOSTS:
            problems.append(f"Nonofficial image source for {player_id}")
        if portrait.get("redistribution_permission") != "unverified":
            problems.append(f"Unexpected redistribution claim for {player_id}")
        mapped.add(player_id)

    priority_covered = PRIORITY & mapped
    report = {
        "identity_count": len(by_id),
        "source_mapped_portraits": len(mapped),
        "not_source_mapped": len(by_id) - len(mapped),
        "accepted_top20_portrait_coverage": len(priority_covered),
        "accepted_top20_unmapped_ids": sorted(PRIORITY - mapped),
        "publication_permission": "not_established",
        "release_disposition": "private_development_review_only",
        "identity_errors": problems,
    }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print("KHILADI_PORTRAIT_COVERAGE " + json.dumps(report))
    if problems:
        raise SystemExit("Portrait manifest has canonical or provenance errors")


if __name__ == "__main__":
    main()
