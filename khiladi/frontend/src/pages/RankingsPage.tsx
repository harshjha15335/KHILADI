import React, { useEffect, useRef, useState } from "react";
import type { AnalyticalRole, D20Response } from "../types/analytics";
import { loadD20Rankings, privateAnalyticsAvailable } from "../utils/analytics";

interface RankingsPageProps {
  onSelectPlayerById: (playerId: number) => void;
}
const decimal = (value: number | null | undefined, digits = 3) =>
  typeof value === "number" && Number.isFinite(value)
    ? value.toFixed(digits)
    : "Unavailable";

/** Gate 2: the existing light table surface, with a separate accepted-data contract. */
export const RankingsPage: React.FC<RankingsPageProps> = ({
  onSelectPlayerById,
}) => {
  const [role, setRole] = useState<AnalyticalRole>("batting");
  const [draft, setDraft] = useState("");
  const [token, setToken] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<D20Response | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const generation = useRef(0);
  const responseIsCurrent = result?.analytical_role === role;

  useEffect(() => {
    const controller = new AbortController();
    const request = ++generation.current;
    setResult(null);
    setError("");
    if (!token) {
      setLoading(false);
      return () => controller.abort();
    }
    setLoading(true);
    loadD20Rankings(role, token, controller.signal)
      .then((data) => {
        if (generation.current === request && !controller.signal.aborted)
          setResult(data);
      })
      .catch((reason) => {
        if (generation.current === request && !controller.signal.aborted)
          setError(
            reason instanceof Error
              ? reason.message
              : "Private analytics is unavailable.",
          );
      })
      .finally(() => {
        if (generation.current === request && !controller.signal.aborted)
          setLoading(false);
      });
    return () => controller.abort();
  }, [role, token, attempt]);

  const lock = () => {
    generation.current += 1;
    setToken("");
    setDraft("");
    setResult(null);
    setError("");
    setLoading(false);
  };
  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#22263C] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="space-y-4 border-b border-[#E8E6ED] pb-8">
          <p className="text-sm font-bold uppercase tracking-wider text-[#2549BD]">
            Primary D20 · private analytical review
          </p>
          <h1 className="text-3xl sm:text-5xl font-black font-display">
            Who delivers under pressure?
          </h1>
          <p className="text-[#505A70] max-w-3xl leading-relaxed">
            Accepted historical rankings, with conditional uncertainty. D20
            pools IPL, T20I and Other T20 evidence; it is not an IPL-only
            ranking or a forecast of psychological pressure ability.
          </p>
        </header>

        {!privateAnalyticsAvailable ? (
          <section
            className="bg-white rounded-3xl border border-[#E8E6ED] p-6"
            aria-label="D20 availability"
          >
            <h2 className="text-xl font-bold">D20 results are private</h2>
            <p className="mt-3 text-[#505A70]">
              The recovered research is not approved for public distribution.
              Use the configured local development service to inspect it. No
              legacy rankings have been substituted.
            </p>
          </section>
        ) : (
          <>
            <form
              className="bg-white rounded-3xl border border-[#E8E6ED] p-6 space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                setResult(null);
                setToken(draft.trim());
                setDraft("");
                setAttempt((value) => value + 1);
              }}
            >
              <label htmlFor="d20-token" className="block font-bold">
                Private analytics access token
              </label>
              <div className="flex flex-wrap gap-3">
                <input
                  id="d20-token"
                  type="password"
                  autoComplete="off"
                  required={!token}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  className="border border-[#68738A] rounded-xl px-4 py-3 w-full sm:w-80"
                  placeholder={
                    token
                      ? "Enter another token to reconnect"
                      : "Token from your private backend configuration"
                  }
                />
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  className="rounded-full px-6 py-3 bg-[#2549BD] text-white font-bold disabled:opacity-50"
                >
                  Unlock D20
                </button>
                {token && (
                  <button
                    type="button"
                    onClick={lock}
                    className="rounded-full border border-[#68738A] px-6 py-3"
                  >
                    Lock results
                  </button>
                )}
              </div>
              <p className="text-sm text-[#505A70]">
                Kept in memory for this page only. It is never saved to browser
                storage or placed in a URL.
              </p>
            </form>

            <div
              role="group"
              aria-label="Analytical role"
              className="flex flex-wrap gap-3"
            >
              {(["batting", "bowling"] as const).map((tab) => (
                <button
                  type="button"
                  key={tab}
                  aria-pressed={role === tab}
                  onClick={() => setRole(tab)}
                  className={`rounded-full px-6 py-3 font-bold border ${role === tab ? "bg-[#F22E83] text-white border-[#F22E83]" : "bg-white border-[#E8E6ED]"}`}
                >
                  Top 10 {tab === "batting" ? "batters" : "bowlers"}
                </button>
              ))}
            </div>
            <div aria-live="polite" aria-atomic="true">
              {loading && <p role="status">Loading verified {role} results…</p>}
              {!token && (
                <p>Unlock the private service to load accepted results.</p>
              )}
            </div>
            {error && (
              <p role="alert" className="rounded-xl bg-[#FFEAF2] p-4">
                {error} No legacy fallback was used.
              </p>
            )}

            {responseIsCurrent && result && !loading && !error && (
              <>
                <p className="text-sm text-[#505A70]">
                  Rating: dimensionless, standardized within the {role} cohort.
                  Intervals and P(top 10) use 750 conditional within-player
                  match resamples, not future selection probabilities.
                </p>
                <div
                  className="overflow-x-auto rounded-3xl border border-[#E8E6ED] bg-white"
                  tabIndex={0}
                  aria-label="Scrollable accepted ranking table"
                >
                  <table className="w-full text-left text-sm">
                    <caption className="text-left p-5 font-bold">
                      Accepted primary D20 — {role}
                    </caption>
                    <thead className="bg-[#FFF3F8] text-[#505A70]">
                      <tr>
                        {[
                          "Rank",
                          "Player",
                          "Rating",
                          "95% rating interval",
                          "P(top 10)",
                          "Evidence tier",
                          "Pressure events",
                          "Pressure matches",
                        ].map((label) => (
                          <th
                            key={label}
                            scope="col"
                            className="p-4 whitespace-nowrap"
                          >
                            {label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8E6ED]">
                      {result.rankings.map((row) => (
                        <tr key={row.player_id}>
                          <td className="p-4 font-bold">#{row.rank}</td>
                          <th scope="row" className="p-4 min-w-48 text-left">
                            <span className="block">{row.player_name}</span>
                            <span className="text-xs font-normal text-[#505A70]">
                              Canonical ID {row.player_id}
                            </span>
                          </th>
                          <td className="p-4 font-bold tabular-nums text-[#2549BD]">
                            {decimal(row.rating)}
                          </td>
                          <td className="p-4 whitespace-nowrap tabular-nums">
                            {decimal(row.rating_interval.lower)} to{" "}
                            {decimal(row.rating_interval.upper)}
                          </td>
                          <td className="p-4 tabular-nums">
                            {decimal(row.probability_top10 * 100, 1)}%
                          </td>
                          <td className="p-4 capitalize">
                            {row.evidence_tier}
                          </td>
                          <td className="p-4 tabular-nums">
                            {row.exposure.pressure_events}
                          </td>
                          <td className="p-4 tabular-nums">
                            {row.exposure.pressure_matches}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <section
                  className="space-y-3"
                  aria-label="Player evidence and provenance"
                >
                  <h2 className="text-xl font-bold">
                    Inspect the supporting evidence
                  </h2>
                  {result.rankings.map((row) => (
                    <details
                      key={row.player_id}
                      className="border border-[#E8E6ED] rounded-xl bg-white p-4"
                    >
                      <summary className="font-bold cursor-pointer">
                        #{row.rank} {row.player_name}: exposure, formats and
                        provenance
                      </summary>
                      <div className="mt-4 space-y-3 text-[#505A70]">
                        <p>
                          {row.exposure.total_matches} total matches ·{" "}
                          {row.exposure.seasons} seasons ·{" "}
                          {row.exposure.opponents} opponents. Meets the five
                          primary exposure requirements.
                        </p>
                        <p>
                          Pressure-event format counts: IPL{" "}
                          {row.format_exposure.ipl}, T20I{" "}
                          {row.format_exposure.t20i}, Other T20{" "}
                          {row.format_exposure.other_t20}.
                        </p>
                        <p>
                          EB pressure quality {decimal(row.pressure_quality_eb)}{" "}
                          run-equivalents/event. EB pressure delta{" "}
                          {decimal(row.pressure_delta_eb)} —{" "}
                          {row.delta_status === "shrunk_to_zero"
                            ? "fully shrunk to zero; no validated repeatable bowling pressure delta"
                            : "unvalidated player-specific effect"}
                          .
                        </p>
                        <p>
                          Positive pressure-match share{" "}
                          {decimal(row.positive_match_share * 100, 1)}%; matches
                          without pressure exposure are excluded.
                        </p>
                        <p className="break-words">
                          Full-precision rating: {row.rating}. Source:{" "}
                          {row.source_row}.
                        </p>
                        <button
                          type="button"
                          onClick={() => onSelectPlayerById(row.player_id)}
                          className="underline text-[#2549BD]"
                        >
                          Open existing player record (legacy statistics)
                        </button>
                      </div>
                    </details>
                  ))}
                </section>
                <aside
                  className="rounded-2xl bg-[#FFEAF2] p-5 space-y-2"
                  aria-label="Analytical limitations"
                >
                  <h2 className="font-bold">
                    What these results do not establish
                  </h2>
                  <p>
                    Batting forward predictive skill is not established. Bowling
                    superiority over ordinary economy is not established.
                    First-innings win-probability calibration is weak. Primary
                    intervals exclude model-choice uncertainty.
                  </p>
                  <p>
                    The accepted downstream results were verified from supplied
                    match composites; full raw-to-final replay remains
                    incomplete.
                  </p>
                </aside>
                <details className="text-sm break-words">
                  <summary className="cursor-pointer font-bold">
                    Model and artifact versions
                  </summary>
                  <p className="mt-3">
                    {result.metadata.model_id} · API schema{" "}
                    {result.metadata.schema_version} ·{" "}
                    {result.metadata.data_version}
                  </p>
                  <p>
                    Base seed {result.metadata.base_seed}; bootstrap seed{" "}
                    {result.metadata.bootstrap_seed}. Public export is not
                    approved.
                  </p>
                  <ul className="mt-3 space-y-2">
                    {Object.entries(result.metadata.sources).map(
                      ([name, sha]) => (
                        <li key={name}>
                          {name}: {sha}
                        </li>
                      ),
                    )}
                  </ul>
                </details>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
