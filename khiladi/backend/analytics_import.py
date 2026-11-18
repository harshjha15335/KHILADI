"""Validate accepted exports and prepare a private top-20 serving bundle.

Only transport/schema adaptation happens here. Original scores, bootstrap outputs
and rank order are imported, never estimated or recomputed.
"""
from __future__ import annotations

import csv
import hashlib
import io
import json
import math
import os
from pathlib import Path

if __package__:
    from .analytics_v2 import (
        ACCEPTED_SOURCES, CANONICAL_SHA256, COHORT, REPOSITORY, Exposure,
        FormatExposure, ModelMetadata, PrivateBundle, RankingRecord, RatingInterval, model_id,
    )
else:
    from analytics_v2 import (
        ACCEPTED_SOURCES, CANONICAL_SHA256, COHORT, REPOSITORY, Exposure,
        FormatExposure, ModelMetadata, PrivateBundle, RankingRecord, RatingInterval, model_id,
    )


def csv_rows(path: Path, expected_hash: str) -> list[dict[str, str]]:
    contents = path.read_bytes()
    if hashlib.sha256(contents).hexdigest() != expected_hash:
        raise ValueError(f"Accepted artifact integrity mismatch: {path.name}")
    return list(csv.DictReader(io.StringIO(contents.decode("utf-8-sig"))))


def number(row: dict[str, str], key: str) -> float:
    value = float(row[key])
    if not math.isfinite(value):
        raise ValueError(f"Missing or non-finite required metric: {key}")
    return value


def integer(row: dict[str, str], key: str) -> int:
    value = number(row, key)
    if not value.is_integer():
        raise ValueError(f"Fractional count: {key}")
    return int(value)


def prepare_bundle(step78: Path, step9: Path, canonical: Path) -> PrivateBundle:
    names: dict[int, str] = {}
    for row in csv_rows(canonical, CANONICAL_SHA256):
        pid = integer(row, "player_id")
        if pid in names and names[pid] != row["player_name"]:
            raise ValueError("Conflicting canonical identity")
        names[pid] = row["player_name"]
    all_rows = csv_rows(step78 / "all_eligible_player_ratings.csv",
                        ACCEPTED_SOURCES["step78/all_eligible_player_ratings.csv"])
    full = {}
    for row in all_rows:
        role = {"batter": "batting", "bowler": "bowling"}[row["role"]]
        pid = integer(row, "player_id")
        key = (role, pid)
        if key in full or names.get(pid) != row["name"]:
            raise ValueError("Duplicate or noncanonical analytical identity")
        # Validate eligibility for the whole reference cohort, not just the top ten.
        Exposure(pressure_events=integer(row, "pressure_events"),
                 pressure_matches=integer(row, "pressure_matches"),
                 total_matches=integer(row, "matches"), seasons=integer(row, "seasons"),
                 opponents=integer(row, "opponents"))
        full[key] = row
    for role, count in COHORT.items():
        rows = [r for (kind, _), r in full.items() if kind == role]
        ranked = sorted(rows, key=lambda r: (-number(r, "score"), integer(r, "player_id")))
        if len(rows) != count or [integer(r, "rank") for r in ranked] != list(range(1, count + 1)):
            raise ValueError("Full-precision eligible cohort order mismatch")
    formats = {}
    for row in csv_rows(step9 / "top20_format_mix.csv", ACCEPTED_SOURCES["step9/top20_format_mix.csv"]):
        role = {"batter": "batting", "bowler": "bowling"}[row["role"]]
        key = (role, integer(row, "player_id"))
        if key in formats:
            raise ValueError("Duplicate format exposure record")
        formats[key] = row
    rankings = {}
    selected_keys = set()
    for role, filename in [("batting", "top_10_batters.csv"), ("bowling", "top_10_bowlers.csv")]:
        selected = csv_rows(step9 / filename, ACCEPTED_SOURCES["step9/" + filename])
        records = []
        for final in selected:
            pid = integer(final, "player_id")
            key = (role, pid)
            selected_keys.add(key)
            source, fmt = full[key], formats[key]
            if final["player_name"] != names[pid] or integer(final, "rank") != integer(source, "rank"):
                raise ValueError("Final rank or identity mismatch")
            for left, right in [("rating", "score"), ("rating_ci_low", "ci_low"),
                                ("rating_ci_high", "ci_high"), ("probability_top10", "p_top10")]:
                if not math.isclose(number(final, left), number(source, right), rel_tol=0, abs_tol=6e-11):
                    raise ValueError("Step9 serialization disagrees with full-precision source")
            for left, right in [("pressure_balls_or_events", "pressure_events"),
                                ("pressure_matches", "pressure_matches"), ("matches", "matches"),
                                ("seasons", "seasons"), ("opponents", "opponents")]:
                if integer(final, left) != integer(source, right):
                    raise ValueError("Exposure discrepancy between accepted artifacts")
            if integer(fmt, "total_pressure_events") != integer(source, "pressure_events"):
                raise ValueError("Format denominator mismatch")
            records.append(RankingRecord(
                rank=integer(source, "rank"), player_id=pid, player_name=names[pid], analytical_role=role,
                rating=number(source, "score"),
                rating_interval=RatingInterval(lower=number(source, "ci_low"), upper=number(source, "ci_high")),
                probability_top10=number(source, "p_top10"), evidence_tier=final["tier"],
                exposure=Exposure(pressure_events=integer(source, "pressure_events"),
                    pressure_matches=integer(source, "pressure_matches"), total_matches=integer(source, "matches"),
                    seasons=integer(source, "seasons"), opponents=integer(source, "opponents")),
                format_exposure=FormatExposure(ipl=integer(fmt, "ipl_pressure_events"),
                    t20i=integer(fmt, "t20i_pressure_events"), other_t20=integer(fmt, "other_pressure_events")),
                pressure_quality_eb=number(source, "quality_eb_run_eq"),
                pressure_delta_eb=number(source, "delta_eb_run_eq"),
                delta_status="shrunk_to_zero" if role == "bowling" else "estimated_unvalidated",
                positive_match_share=number(source, "p_share"),
                source_row=f"step78/all_eligible_player_ratings.csv:role={source['role']};player_id={pid}",
            ))
        rankings[role] = records
    if set(formats) != selected_keys or len(selected_keys) != 20:
        raise ValueError("Format artifact must cover exactly the selected top20")
    return PrivateBundle(metadata=ModelMetadata(model_id=model_id(),
        data_version="sha256:" + CANONICAL_SHA256, cohort_sizes=COHORT, sources=ACCEPTED_SOURCES),
        rankings=rankings)


def write_bundle(bundle: PrivateBundle, output: Path) -> None:
    output = output.resolve()
    if output.is_relative_to(REPOSITORY):
        raise ValueError("Choose a private output directory outside the checkout")
    output.mkdir(parents=True, exist_ok=True, mode=0o700)
    payload = bundle.model_dump_json(indent=2).encode()
    # Never overwrite an existing version, including a partially staged bundle.
    for name in ("rankings.json", "manifest.json"):
        if (output / name).exists():
            raise ValueError("Output already contains a bundle; select a new version directory")
    manifest = json.dumps({"schema_version": "2.0", "payload_sha256": hashlib.sha256(payload).hexdigest()}, indent=2).encode()
    for name, contents in [("rankings.json", payload), ("manifest.json", manifest)]:
        fd = os.open(output / name, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
        with os.fdopen(fd, "wb") as handle:
            handle.write(contents)
