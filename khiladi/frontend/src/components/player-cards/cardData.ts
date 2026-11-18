import type {
  D20Response,
  D20Ranking,
  AnalyticalRole,
} from "../../types/analytics";
export interface CardData {
  record: D20Ranking;
  metadata: D20Response["metadata"];
  identity: string;
}
export function toCardData(
  response: D20Response,
  playerId: number,
  role: AnalyticalRole,
  modelId: string,
): CardData {
  if (
    response.metadata?.publication !== "private_only" ||
    response.metadata.model_id !== modelId ||
    response.analytical_role !== role
  )
    throw new Error("The analytical role or model does not match this card.");
  const matches = response.rankings.filter((r) => r.player_id === playerId);
  if (matches.length !== 1)
    throw new Error(
      "Accepted evidence is unavailable for this identity in the current serving scope.",
    );
  const r = matches[0];
  const finite = (v: unknown) => typeof v === "number" && Number.isFinite(v);
  if (
    r.analytical_role !== role ||
    !Number.isInteger(r.player_id) ||
    !finite(r.rating) ||
    !finite(r.probability_top10) ||
    r.probability_top10 < 0 ||
    r.probability_top10 > 1 ||
    !finite(r.rating_interval.lower) ||
    !finite(r.rating_interval.upper) ||
    r.rating_interval.lower > r.rating_interval.upper ||
    r.rating_interval.level !== 0.95
  )
    throw new Error("Incompatible accepted evidence.");
  const e = r.exposure,
    f = r.format_exposure;
  if (
    ![
      e.pressure_events,
      e.pressure_matches,
      e.total_matches,
      e.seasons,
      e.opponents,
      f.ipl,
      f.t20i,
      f.other_t20,
    ].every((v) => Number.isInteger(v) && v >= 0) ||
    e.pressure_events <= 0 ||
    f.ipl + f.t20i + f.other_t20 !== e.pressure_events ||
    e.pressure_matches > e.total_matches ||
    !finite(r.pressure_quality_eb) ||
    !finite(r.pressure_delta_eb) ||
    !finite(r.positive_match_share)
  )
    throw new Error("Inconsistent exposure or contribution evidence.");
  const tier =
    r.probability_top10 >= 0.65 && r.rating_interval.lower > 0
      ? "robust"
      : r.probability_top10 >= 0.45
        ? "probable"
        : "borderline";
  if (
    tier !== r.evidence_tier ||
    (role === "bowling" &&
      (r.pressure_delta_eb !== 0 || r.delta_status !== "shrunk_to_zero"))
  )
    throw new Error("The accepted tier or structural delta is inconsistent.");
  return {
    record: r,
    metadata: response.metadata,
    identity: `${playerId}:${role}:${modelId}`,
  };
}
export const number = (n: number | null | undefined, d = 3) =>
  typeof n === "number" && Number.isFinite(n) ? n.toFixed(d) : "Unavailable";
export const tierLabel = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
