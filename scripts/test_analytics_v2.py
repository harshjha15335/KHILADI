"""Gate 2 contracts plus optional private golden integration; never embeds research exports.

Set KHILADI_TEST_STEP78 and KHILADI_TEST_STEP9 to original results directories.
The canonical CSV remains in the ignored Data Pack, or KHILADI_TEST_CANONICAL.
"""
import csv
import os
from pathlib import Path
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "khiladi/backend"))
from fastapi import FastAPI
from fastapi.testclient import TestClient
from pydantic import ValidationError
from analytics_v2 import (Exposure, FormatExposure, RatingInterval, RankingRecord,
                          create_analytics_router, load_bundle)
from analytics_import import prepare_bundle, write_bundle

TOKEN = "synthetic-test-only-access-token-not-a-real-secret"
PRIVATE = bool(os.getenv("KHILADI_TEST_STEP78") and os.getenv("KHILADI_TEST_STEP9"))
EXPECTED_IDS = {
    "batting": [813, 6281, 3125, 6396, 6819, 1077, 2756, 1107, 4106, 2921],
    "bowling": [2933, 781, 5979, 3644, 6523, 5944, 2411, 4101, 6450, 4373],
}


def client(directory=None, names=None, token=TOKEN):
    app = FastAPI()
    app.include_router(create_analytics_router(names or {}, str(directory) if directory else None, token))
    return TestClient(app)


class ContractTests(unittest.TestCase):
    def test_intervals_reject_missing_nonfinite_and_reversed(self):
        for values in [dict(lower=2, upper=1), dict(lower=float("nan"), upper=1),
                       dict(lower=0, upper=float("inf")), dict(lower=None, upper=1)]:
            with self.subTest(values=values), self.assertRaises(ValidationError):
                RatingInterval(**values)

    def test_eligibility_boundaries_and_consistency(self):
        valid = dict(pressure_events=60, pressure_matches=12, total_matches=15, seasons=2, opponents=4)
        Exposure(**valid)
        for field in valid:
            with self.subTest(field=field), self.assertRaises(ValidationError):
                Exposure(**{**valid, field: valid[field] - 1})
        with self.assertRaises(ValidationError):
            Exposure(**{**valid, "pressure_matches": 16})

    def test_zero_is_valid_and_missing_is_not_zero(self):
        self.assertEqual(FormatExposure(ipl=0, t20i=0, other_t20=0).ipl, 0)
        with self.assertRaises(ValidationError):
            FormatExposure(ipl=None, t20i=0, other_t20=0)
        with self.assertRaises(ValidationError):
            FormatExposure(ipl=0, t20i=0, other_t20=0, invented_default=0)

    def test_missing_or_short_token_fails_closed(self):
        for token in [None, "short", " " * 40]:
            api = client(token=token)
            self.assertEqual(api.get("/api/v2/readiness").status_code, 503)
            self.assertEqual(api.get("/api/v2/rankings/batting").status_code, 503)

    def test_authorization_precedes_missing_data(self):
        api = client()
        response = api.get("/api/v2/rankings/batting")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.headers["www-authenticate"], "Bearer")
        self.assertEqual(api.get("/api/v2/rankings/batting", headers={"Authorization": "Bearer wrong"}).status_code, 401)
        response = api.get("/api/v2/rankings/batting", headers={"Authorization": "Bearer " + TOKEN})
        self.assertEqual(response.status_code, 503)
        self.assertNotIn(str(ROOT), response.text)

    def test_private_paths_in_checkout_are_rejected(self):
        with self.assertRaises(ValueError):
            load_bundle(ROOT / "khiladi/frontend/public/data", {})


@unittest.skipUnless(PRIVATE, "Private recovered exports are required; no substitute fixtures generated")
class PrivateGoldenTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.step78 = Path(os.environ["KHILADI_TEST_STEP78"])
        cls.step9 = Path(os.environ["KHILADI_TEST_STEP9"])
        cls.canonical = Path(os.getenv("KHILADI_TEST_CANONICAL", ROOT / "Data Pack/competition_team_player_mapping.csv"))
        cls.bundle = prepare_bundle(cls.step78, cls.step9, cls.canonical)
        cls.names = {r.player_id: r.player_name for rows in cls.bundle.rankings.values() for r in rows}
        cls.temp = tempfile.TemporaryDirectory(prefix="khiladi-private-d20-tests-")
        cls.directory = Path(cls.temp.name) / "accepted"
        write_bundle(cls.bundle, cls.directory)
        cls.api = client(cls.directory, cls.names)
        cls.headers = {"Authorization": "Bearer " + TOKEN}

    @classmethod
    def tearDownClass(cls):
        cls.temp.cleanup()

    def test_all_twenty_independent_source_fields_and_frozen_ids(self):
        with (self.step78 / "all_eligible_player_ratings.csv").open() as f:
            golden = {(r["role"], int(r["player_id"])): r for r in csv.DictReader(f)}
        for role, ids in EXPECTED_IDS.items():
            response = self.api.get("/api/v2/rankings/" + role, headers=self.headers)
            self.assertEqual(response.status_code, 200)
            body = response.json()
            self.assertEqual([r["player_id"] for r in body["rankings"]], ids)
            with (self.step9 / ("top_10_batters.csv" if role == "batting" else "top_10_bowlers.csv")).open() as f:
                final = {int(r["player_id"]): r for r in csv.DictReader(f)}
            for row in body["rankings"]:
                pid = row["player_id"]
                expected = golden[("batter" if role == "batting" else "bowler", pid)]
                with self.subTest(role=role, player_id=pid):
                    for actual, source in [("rating", "score"), ("probability_top10", "p_top10"),
                                           ("pressure_quality_eb", "quality_eb_run_eq"),
                                           ("pressure_delta_eb", "delta_eb_run_eq")]:
                        self.assertEqual(row[actual], float(expected[source]))
                    self.assertEqual(row["rank"], int(expected["rank"]))
                    self.assertEqual(row["player_name"], expected["name"])
                    self.assertEqual(row["evidence_tier"], final[pid]["tier"])
                    self.assertEqual(row["rating_interval"]["lower"], float(expected["ci_low"]))
                    self.assertEqual(row["rating_interval"]["upper"], float(expected["ci_high"]))
                    for field, source in [("pressure_events", "pressure_events"), ("pressure_matches", "pressure_matches"),
                                          ("total_matches", "matches"), ("seasons", "seasons"), ("opponents", "opponents")]:
                        self.assertEqual(row["exposure"][field], int(expected[source]))

    def test_format_counts_match_independent_artifact(self):
        with (self.step9 / "top20_format_mix.csv").open() as f:
            golden = {int(r["player_id"]): r for r in csv.DictReader(f)}
        for rows in self.bundle.rankings.values():
            for row in rows:
                expected = golden[row.player_id]
                self.assertEqual(row.format_exposure.ipl, int(expected["ipl_pressure_events"]))
                self.assertEqual(row.format_exposure.t20i, int(expected["t20i_pressure_events"]))
                self.assertEqual(row.format_exposure.other_t20, int(expected["other_pressure_events"]))

    def test_tie_order_and_structural_zero(self):
        rows = self.bundle.rankings["batting"]
        self.assertEqual(round(rows[8].rating, 3), round(rows[9].rating, 3))
        self.assertGreater(rows[8].rating, rows[9].rating)
        for row in self.bundle.rankings["bowling"]:
            self.assertEqual(row.pressure_delta_eb, 0)
            self.assertEqual(row.delta_status, "shrunk_to_zero")
            with self.assertRaises(ValidationError):
                RankingRecord.model_validate({**row.model_dump(), "pressure_delta_eb": None})

    def test_metadata_and_no_public_cache(self):
        response = self.api.get("/api/v2/rankings/batting", headers=self.headers)
        self.assertEqual(response.headers["cache-control"], "private, no-store")
        self.assertEqual(response.headers["vary"], "Authorization")
        metadata = response.json()["metadata"]
        self.assertFalse(metadata["full_pipeline_replayed"])
        self.assertEqual(metadata["bootstrap_seed"], 120)
        self.assertEqual(metadata["pipeline_version"], "accepted_steps7_9_2026-11-16")
        self.assertEqual(len(metadata["ranking_code_sha256"]), 64)
        self.assertEqual(metadata["publication"], "private_only")
        self.assertEqual(metadata["cohort_sizes"], {"batting": 157, "bowling": 154})
        self.assertEqual(self.api.get("/api/v2/readiness").status_code, 200)

    def test_unsupported_filters_roles_models_and_scenarios_rejected(self):
        for suffix in ["allrounder", "batting?scenario=IPL", "batting?format=IPL", "batting?limit=200"]:
            with self.subTest(suffix=suffix):
                self.assertEqual(self.api.get("/api/v2/rankings/" + suffix, headers=self.headers).status_code, 422)
        self.assertEqual(self.api.get("/api/v2/rankings/batting?model=legacy", headers=self.headers).status_code, 404)

    def test_tampered_missing_and_noncanonical_bundles_fail_closed(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory)
            write_bundle(self.bundle, path)
            content = (path / "rankings.json").read_text()
            (path / "rankings.json").write_text(content + " ")
            self.assertEqual(client(path, self.names).get("/api/v2/readiness").status_code, 503)
            (path / "rankings.json").write_text(content)
            (path / "manifest.json").write_text("[]")
            self.assertEqual(client(path, self.names).get("/api/v2/readiness").status_code, 503)
        self.assertEqual(client(self.directory, {}).get("/api/v2/readiness").status_code, 503)
        self.assertEqual(client(self.directory / "absent", self.names).get("/api/v2/readiness").status_code, 503)

    def test_unknown_source_and_mutation_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            fake = Path(directory)
            (fake / "all_eligible_player_ratings.csv").write_text("not accepted research")
            with self.assertRaises(ValueError):
                prepare_bundle(fake, self.step9, self.canonical)
        with self.assertRaises(ValueError):
            write_bundle(self.bundle, self.directory)
        data = self.bundle.model_dump()
        data["rankings"]["batting"][0]["evidence_tier"] = "borderline"
        with self.assertRaises(ValidationError):
            type(self.bundle).model_validate(data)
        data = self.bundle.model_dump()
        data["rankings"]["batting"][8:10] = reversed(data["rankings"]["batting"][8:10])
        with self.assertRaises(ValidationError):
            type(self.bundle).model_validate(data)


if __name__ == "__main__":
    unittest.main(verbosity=2)
