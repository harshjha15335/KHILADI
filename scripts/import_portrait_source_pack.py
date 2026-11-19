#!/usr/bin/env python3
"""Import licensed portrait metadata from a KHILADI source/collector ZIP.

This is deliberately fail-closed: a source URL or a photo stored in a ZIP is
NOT proof of identity or permission. Only exact RR-data-pack player IDs, exact
names, explicitly reviewed identities, and freely licensed Commons assets can
reach the public photo registry. Official IPL/RR/BCCI/ICC URLs are discovery
candidates until separate reuse permission is documented.

Usage:
  py scripts/import_portrait_source_pack.py path/to/KHILADI_Player_Portrait_Source_Pack.zip
  py scripts/import_portrait_source_pack.py path/to/pack.zip --write

Default: audit only. --write merges approved records into licensed-portraits.json.
Requires Python 3.10+, standard library only.
"""
from __future__ import annotations

import argparse
import csv
import io
import json
import re
import zipfile
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "khiladi/frontend/public/data/player_database.json"
TARGET = ROOT / "khiladi/frontend/src/components/player-cards/licensed-portraits.json"
SUPPORTED = {"CC-BY-3.0", "CC-BY-4.0", "CC-BY-SA-3.0", "CC-BY-SA-4.0"}
MAX_MEMBER = 12_000_000
MAX_FILES = 300

def norm(value: object) -> str:
    return " ".join(str(value or "").split()).casefold()

def truthy(value: object) -> bool:
    return value is True or norm(value) in {"true", "yes", "approved", "verified"}

def field(obj: dict, *names: str) -> str:
    for key in names:
        val = obj.get(key)
        if val not in (None, "", False):
            return str(val).strip()
    return ""

def records(payload: object) -> list[dict]:
    if isinstance(payload, list):
        return [item for item in payload if isinstance(item, dict)]
    if isinstance(payload, dict):
        for key in ("portraits", "players", "entries", "records", "verified"):
            if key in payload:
                return records(payload[key])
        output = []
        for key, value in payload.items():
            if isinstance(value, dict) and any(k in value for k in
                ("image_url", "portrait_url", "url", "image", "source_url")):
                output.append({"player_id": key, **value})
        return output
    return []

def candidates(source: Path) -> list[dict]:
    out: list[dict] = []
    if source.suffix.lower() == ".zip":
        with zipfile.ZipFile(source) as pack:
            if len(pack.infolist()) > MAX_FILES:
                raise ValueError("Too many ZIP entries; review the pack manually")
            for item in pack.infolist():
                suffix = Path(item.filename).suffix.lower()
                if item.is_dir() or suffix not in {".json", ".csv"}:
                    continue
                if item.file_size > MAX_MEMBER:
                    continue
                try:
                    raw = pack.read(item).decode("utf-8-sig")
                    obj = json.loads(raw) if suffix == ".json" else list(csv.DictReader(io.StringIO(raw)))
                    out.extend(records(obj))
                except (UnicodeError, ValueError, csv.Error) as exc:
                    print(f"Skipped {item.filename}: {exc}")
    else:
        text = source.read_text(encoding="utf-8-sig")
        if source.suffix.lower() == ".csv":
            out = records(list(csv.DictReader(io.StringIO(text))))
        else:
            out = records(json.loads(text))
    return out

def audit(row: dict, whitelist: dict[str, str]) -> tuple[dict | None, str]:
    raw_id = field(row, "player_id", "canonical_player_id", "id")
    try:
        player_id = str(int(raw_id))
    except (ValueError, TypeError):
        return None, "missing numeric player_id"
    if player_id not in whitelist:
        return None, "not in RR hackathon canonical player pool"
    name = field(row, "player_name", "name")
    if norm(name) != whitelist[player_id]:
        return None, "ID/name mismatch"
    verified = row.get("identity_verified", row.get("visually_verified", row.get("reviewed_identity", False)))
    if not truthy(verified):
        return None, "identity not manually verified"
    style = field(row, "portrait_style").strip().lower()
    if style not in {"studio_cutout", "studio_portrait"}:
        return None, "not a KHILADI studio portrait (event/action photos excluded)"
    if not truthy(row.get("visual_style_approved", False)):
        return None, "studio portrait visual style not explicitly approved"
    asset = field(row, "image_url", "portrait_url", "asset_url", "image", "url")
    source = field(row, "source_page", "source_url", "profile_url", "source")
    author = field(row, "author", "photographer", "credit")
    license_name = field(row, "license", "licence", "spdx").upper().replace(" ", "-")
    license_url = field(row, "license_url", "licence_url")
    rights = field(row, "rights_status", "redistribution_permission", "rights")
    if license_name not in SUPPORTED:
        return None, "license missing or not supported; official source URL is not permission"
    if norm(rights) not in {"licensed", "granted", "cleared", "approved"}:
        return None, "redistribution/use rights not explicitly cleared"
    if (urlparse(source).scheme != "https" or
        urlparse(source).hostname != "commons.wikimedia.org" or
        not urlparse(source).path.startswith("/wiki/File:")):
        return None, "source is not an individual Wikimedia Commons file page"
    if (urlparse(asset).scheme != "https" or
        urlparse(asset).hostname != "upload.wikimedia.org" or
        not urlparse(asset).path.startswith("/wikipedia/commons/")):
        return None, "not a direct Commons image URL"
    if not author:
        return None, "no author attribution"
    if (urlparse(license_url).scheme != "https" or
        urlparse(license_url).hostname != "creativecommons.org" or
        not urlparse(license_url).path.startswith("/licenses/")):
        return None, "missing CC license link"
    return {
        "name": name,
        "source": source,
        "url": asset,
        "author": author,
        "license": license_name,
        "license_url": license_url,
        "identity_verified": True,
        "rights_status": "licensed",
        "portrait_style": style,
        "visual_style_approved": True,
        "modified": truthy(row.get("modified", False)),
    }, ""

def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("pack", type=Path, help="ZIP/JSON/CSV collector source pack")
    parser.add_argument("--write", action="store_true", help="merge only fully verified, licensed photos")
    args = parser.parse_args()

    canonical = {
        str(p["player_id"]): norm(p["player_name"])
        for p in json.loads(DATA.read_text(encoding="utf-8"))
    }
    if len(canonical) != 1217:
        raise SystemExit(f"Refusing unexpected dataset size: {len(canonical)} (expected 1217)")
    existing: dict = json.loads(TARGET.read_text(encoding="utf-8"))
    accepted, denied = {}, {}
    for row in candidates(args.pack):
        image, reason = audit(row, canonical)
        if image:
            key = str(int(field(row, "player_id", "canonical_player_id", "id")))
            if key in accepted and accepted[key]["url"] != image["url"]:
                denied["duplicate conflicting ID"] = denied.get("duplicate conflicting ID", 0) + 1
                continue
            accepted[key] = image
        else:
            denied[reason] = denied.get(reason, 0) + 1

    print(f"Canonical RR IDs: {len(canonical)} | existing licensed portraits: {len(existing)}")
    print(f"New identity, license and studio-style approved candidates: {len(accepted)}")
    for reason, total in sorted(denied.items()):
        print(f"  Skipped {total:4d}: {reason}")
    if not args.write:
        print("Audit only. Re-run with --write after manual visual + license verification.")
        return
    merged = {**existing, **accepted}
    TARGET.write_text(json.dumps(merged, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {len(merged)} source-audited licensed portrait records to {TARGET}")

if __name__ == "__main__":
    main()
