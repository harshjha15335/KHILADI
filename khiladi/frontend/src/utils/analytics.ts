import { apiURL, staticPages } from "./urls";
import type { AnalyticalRole, D20Response } from "../types/analytics";

// No public/static transport, snapshots, legacy fallback, storage, or VITE secret.
export const privateAnalyticsAvailable = import.meta.env.DEV && !staticPages;

export async function loadD20Rankings(
  role: AnalyticalRole,
  token: string,
  signal: AbortSignal,
): Promise<D20Response> {
  if (!privateAnalyticsAvailable)
    throw new Error("Private analytics requires local development.");
  const url = apiURL(`/api/v2/rankings/${role}?scenario=primary`);
  // Gate 2 does not authorize sending research credentials to a remote service.
  const target = new URL(url, window.location.href);
  if (
    !["http:", "https:"].includes(target.protocol) ||
    (target.origin !== window.location.origin &&
      !["127.0.0.1", "localhost", "[::1]"].includes(target.hostname))
  )
    throw new Error(
      "Private analytics currently requires the local API proxy or a loopback backend.",
    );
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
    redirect: "error",
    signal,
  });
  if (!response.ok) {
    if (response.status === 401)
      throw new Error("Access token was not accepted. Unlock again to retry.");
    if (response.status === 503)
      throw new Error(
        "The verified private D20 service is not configured or available.",
      );
    throw new Error(`Private D20 request failed (${response.status}).`);
  }
  const data: D20Response = await response.json();
  const rows = data.rankings;
  const finite = (x: unknown): x is number =>
    typeof x === "number" && Number.isFinite(x);
  if (
    data.metadata?.schema_version !== "2.0" ||
    data.metadata?.pressure_definition !== "D20" ||
    data.metadata?.publication !== "private_only" ||
    data.analytical_role !== role ||
    !Array.isArray(rows) ||
    rows.length !== 10 ||
    new Set(rows.map((row) => row.player_id)).size !== 10 ||
    rows.some(
      (row, index) =>
        row.rank !== index + 1 ||
        row.analytical_role !== role ||
        !finite(row.rating) ||
        !finite(row.probability_top10) ||
        !finite(row.rating_interval?.lower) ||
        !finite(row.rating_interval?.upper) ||
        row.rating_interval.lower > row.rating_interval.upper ||
        !finite(row.pressure_quality_eb) ||
        !finite(row.pressure_delta_eb) ||
        !finite(row.positive_match_share) ||
        !finite(row.exposure?.pressure_events) ||
        !finite(row.exposure?.pressure_matches) ||
        !finite(row.format_exposure?.ipl) ||
        !finite(row.format_exposure?.t20i) ||
        !finite(row.format_exposure?.other_t20),
    )
  ) {
    throw new Error(
      "The service returned an incompatible analytical contract.",
    );
  }
  return data;
}
