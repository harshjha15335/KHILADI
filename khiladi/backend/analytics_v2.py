"""Private, immutable D20 contracts. No model fitting or legacy fallback."""
from __future__ import annotations

import hashlib
import hmac
import json
from pathlib import Path
from typing import Annotated, Literal

from fastapi import APIRouter, Depends, HTTPException, Query, Response
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, ConfigDict, Field, model_validator

Role = Literal["batting", "bowling"]
REPOSITORY = Path(__file__).resolve().parents[2]
# Accepted artifacts verified during Gate 1; changing these is a model-version decision.
ACCEPTED_SOURCES = {
    "step78/all_eligible_player_ratings.csv": "eadf1c69f7441b6769b72d360b1ed60a5d1510b79d1a46d02c4983ee0aa02970",
    "step9/top_10_batters.csv": "9d36e409affab911ce2cf5a18e2f43388a5cb75d7a1733ef80cff59e78df32ae",
    "step9/top_10_bowlers.csv": "e54349e3b094e8c9e1bccfba81d5d9bad9ce3d3be6739a11666de69b1c29b0d9",
    "step9/top20_format_mix.csv": "ea2ae2da9e1d1cf1c73f212145ba6ec67234a191ecc5f9eb8f644f21ebc6a15b",
}
CANONICAL_SHA256 = "1ded4e42a933618572d6e2c3a521c3257eb1844fab4456d567d77cbb2d3bbb12"
COHORT = {"batting": 157, "bowling": 154}


class Contract(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True, allow_inf_nan=False)


class Exposure(Contract):
    pressure_events: int = Field(ge=60)
    pressure_matches: int = Field(ge=12)
    total_matches: int = Field(ge=15)
    seasons: int = Field(ge=2)
    opponents: int = Field(ge=4)

    @model_validator(mode="after")
    def consistent_counts(self):
        if self.pressure_matches > self.total_matches or self.pressure_matches > self.pressure_events:
            raise ValueError("Inconsistent exposure counts")
        return self


class RatingInterval(Contract):
    lower: float
    upper: float
    level: Literal[0.95] = 0.95
    method: Literal["conditional_within_player_match_bootstrap"] = "conditional_within_player_match_bootstrap"

    @model_validator(mode="after")
    def ordered(self):
        if self.lower > self.upper:
            raise ValueError("Interval bounds must be ordered")
        return self


class FormatExposure(Contract):
    ipl: int = Field(ge=0)
    t20i: int = Field(ge=0)
    other_t20: int = Field(ge=0)


class RankingRecord(Contract):
    rank: int = Field(ge=1, le=10)
    player_id: int = Field(gt=0)
    player_name: str = Field(min_length=1)
    analytical_role: Role
    rating: float
    rating_interval: RatingInterval
    probability_top10: float = Field(ge=0, le=1)
    evidence_tier: Literal["robust", "probable", "borderline"]
    exposure: Exposure
    format_exposure: FormatExposure
    pressure_quality_eb: float
    pressure_delta_eb: float
    delta_status: Literal["estimated_unvalidated", "shrunk_to_zero"]
    positive_match_share: float = Field(ge=0, le=1)
    source_row: str

    @model_validator(mode="after")
    def scientific_invariants(self):
        expected = ("robust" if self.probability_top10 >= .65 and self.rating_interval.lower > 0
                    else "probable" if self.probability_top10 >= .45 else "borderline")
        if self.evidence_tier != expected:
            raise ValueError("Tier does not match probability and interval")
        f = self.format_exposure
        if f.ipl + f.t20i + f.other_t20 != self.exposure.pressure_events:
            raise ValueError("Format exposure must reconcile with pressure events")
        if self.analytical_role == "bowling":
            if self.pressure_delta_eb != 0 or self.delta_status != "shrunk_to_zero":
                raise ValueError("Accepted bowling delta is structurally zero")
        elif self.delta_status != "estimated_unvalidated":
            raise ValueError("Unexpected batting delta status")
        return self


class ModelMetadata(Contract):
    schema_version: Literal["2.0"] = "2.0"
    pipeline_version: Literal["accepted_steps7_9_2026-11-16"] = "accepted_steps7_9_2026-11-16"
    ranking_code_sha256: Literal["26ef962349112fb845048eb8b2016c86e12496508ab918a5db9d146861f1c7c1"] = "26ef962349112fb845048eb8b2016c86e12496508ab918a5db9d146861f1c7c1"
    model_id: str
    data_version: str
    pressure_definition: Literal["D20"] = "D20"
    scope: Literal["primary_pooled_descriptive_opponent_adjusted"] = "primary_pooled_descriptive_opponent_adjusted"
    formats: tuple[Literal["IPL"], Literal["T20I"], Literal["Other_T20"]] = ("IPL", "T20I", "Other_T20")
    rating_units: Literal["dimensionless_within_role"] = "dimensionless_within_role"
    contribution_units: Literal["run_equivalents_per_eligible_event"] = "run_equivalents_per_eligible_event"
    wicket_equivalent: Literal[15] = 15
    weights: tuple[Literal[0.7], Literal[0.2], Literal[0.1]] = (0.7, 0.2, 0.1)
    cohort_sizes: dict[Role, int]
    bootstrap_draws: Literal[750] = 750
    base_seed: Literal[42] = 42
    bootstrap_seed: Literal[120] = 120
    verification: Literal["source_integrity_and_contract_checked"] = "source_integrity_and_contract_checked"
    full_pipeline_replayed: Literal[False] = False
    event_features: Literal["source_missing"] = "source_missing"
    publication: Literal["private_only"] = "private_only"
    sources: dict[str, str]

    @model_validator(mode="after")
    def accepted_identity(self):
        if self.sources != ACCEPTED_SOURCES or self.cohort_sizes != COHORT:
            raise ValueError("Unrecognized accepted artifact set or cohort")
        if self.data_version != "sha256:" + CANONICAL_SHA256:
            raise ValueError("Canonical dataset version mismatch")
        return self


class PrivateBundle(Contract):
    metadata: ModelMetadata
    rankings: dict[Role, list[RankingRecord]]

    @model_validator(mode="after")
    def exact_order(self):
        if set(self.rankings) != set(COHORT):
            raise ValueError("Both analytical roles are required")
        for role, rows in self.rankings.items():
            if [r.rank for r in rows] != list(range(1, 11)):
                raise ValueError("Exactly ten ordered ranks are required")
            if len({r.player_id for r in rows}) != 10 or any(r.analytical_role != role for r in rows):
                raise ValueError("Duplicate identity or mixed analytical role")
            if rows != sorted(rows, key=lambda r: (-r.rating, r.player_id)):
                raise ValueError("Ranks must follow full-precision score and canonical ID")
        return self


class RankingResponse(Contract):
    metadata: ModelMetadata
    analytical_role: Role
    rankings: list[RankingRecord]


class Readiness(Contract):
    status: Literal["ready", "unavailable"]
    reason: Literal["configured", "access_not_configured", "bundle_missing_or_invalid"]


class RankingQuery(Contract):
    model: str | None = None
    scenario: Literal["primary"] = "primary"


def load_bundle(directory: Path, canonical_names: dict[int, str]) -> PrivateBundle:
    directory = directory.resolve()
    if directory.is_relative_to(REPOSITORY):
        raise ValueError("Private analytics must be outside the checkout")
    payload = (directory / "rankings.json").read_bytes()
    manifest = json.loads((directory / "manifest.json").read_text())
    if not isinstance(manifest, dict) or manifest.get("schema_version") != "2.0":
        raise ValueError("Invalid bundle manifest")
    if hashlib.sha256(payload).hexdigest() != manifest.get("payload_sha256"):
        raise ValueError("Bundle integrity mismatch")
    bundle = PrivateBundle.model_validate_json(payload)
    if bundle.metadata.model_id != model_id():
        raise ValueError("Model version mismatch")
    for rows in bundle.rankings.values():
        for row in rows:
            if canonical_names.get(row.player_id) != row.player_name:
                raise ValueError("Ranking identity is not canonical")
    return bundle


def model_id() -> str:
    source_identity = json.dumps(ACCEPTED_SOURCES, sort_keys=True).encode()
    return "superr-d20-" + hashlib.sha256(source_identity).hexdigest()[:16]


def create_analytics_router(canonical_names: dict[int, str], directory: str | None,
                            token: str | None) -> APIRouter:
    router = APIRouter(prefix="/api/v2", tags=["private D20"])
    bundle = None
    if directory:
        try:
            bundle = load_bundle(Path(directory), canonical_names)
        except (OSError, ValueError, KeyError, TypeError):
            pass  # Fail closed; never disclose filesystem paths or serve legacy data.
    configured = bool(token and len(token) >= 32 and token.isascii() and not any(c.isspace() for c in token))
    bearer = HTTPBearer(auto_error=False)

    def authorize(credentials: HTTPAuthorizationCredentials | None = Depends(bearer)):
        if not configured:
            raise HTTPException(503, "Private analytics access is not configured")
        supplied = credentials.credentials if credentials else ""
        if not hmac.compare_digest(supplied.encode(), token.encode()):
            raise HTTPException(401, "Private analytics access required", headers={"WWW-Authenticate": "Bearer"})
        if bundle is None:
            raise HTTPException(503, "Verified D20 bundle is unavailable")

    @router.get("/readiness", response_model=Readiness)
    def readiness(response: Response):
        ready = configured and bundle is not None
        response.headers["Cache-Control"] = "no-store"
        response.status_code = 200 if ready else 503
        return Readiness(status="ready" if ready else "unavailable", reason=("configured" if ready
                         else "access_not_configured" if not configured else "bundle_missing_or_invalid"))

    @router.get("/rankings/{role}", response_model=RankingResponse, dependencies=[Depends(authorize)])
    def rankings(role: Role, response: Response,
                 filters: Annotated[RankingQuery, Query()]):
        if filters.model is not None and filters.model != bundle.metadata.model_id:
            raise HTTPException(404, "Requested analytical model is unavailable")
        response.headers["Cache-Control"] = "private, no-store"
        response.headers["Vary"] = "Authorization"
        return RankingResponse(metadata=bundle.metadata, analytical_role=role, rankings=bundle.rankings[role])

    return router
