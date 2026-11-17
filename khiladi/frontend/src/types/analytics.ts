/** Private v2 is deliberately separate from every legacy player/index type. */
export type AnalyticalRole = "batting" | "bowling";
export interface D20Ranking {
  rank: number;
  player_id: number;
  player_name: string;
  analytical_role: AnalyticalRole;
  rating: number;
  rating_interval: {
    lower: number;
    upper: number;
    level: 0.95;
    method: "conditional_within_player_match_bootstrap";
  };
  probability_top10: number;
  evidence_tier: "robust" | "probable" | "borderline";
  exposure: {
    pressure_events: number;
    pressure_matches: number;
    total_matches: number;
    seasons: number;
    opponents: number;
  };
  format_exposure: { ipl: number; t20i: number; other_t20: number };
  pressure_quality_eb: number;
  pressure_delta_eb: number;
  delta_status: "estimated_unvalidated" | "shrunk_to_zero";
  positive_match_share: number;
  source_row: string;
}
export interface D20Response {
  metadata: {
    schema_version: "2.0";
    pipeline_version: "accepted_steps7_9_2026-11-16";
    ranking_code_sha256: string;
    model_id: string;
    data_version: string;
    pressure_definition: "D20";
    scope: "primary_pooled_descriptive_opponent_adjusted";
    formats: ["IPL", "T20I", "Other_T20"];
    rating_units: "dimensionless_within_role";
    contribution_units: "run_equivalents_per_eligible_event";
    wicket_equivalent: 15;
    weights: [0.7, 0.2, 0.1];
    cohort_sizes: Record<AnalyticalRole, number>;
    bootstrap_draws: 750;
    base_seed: 42;
    bootstrap_seed: 120;
    verification: "source_integrity_and_contract_checked";
    full_pipeline_replayed: false;
    event_features: "source_missing";
    publication: "private_only";
    sources: Record<string, string>;
  };
  analytical_role: AnalyticalRole;
  rankings: D20Ranking[];
}
