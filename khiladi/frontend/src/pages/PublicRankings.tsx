import React, { useEffect, useState } from "react";
import { RoyalIdentityPreview } from "../components/player-cards/RoyalIdentityPreview";
import { RankingFilmstrip } from "../components/RankingFilmstrip";
import { playerImage } from "../utils/media";
import { requestJSON } from "../utils/api";
import type { AnalyticalRole } from "../types/analytics";

type PublicRank = {
  rank: number;
  player_id: number;
  player_name: string;
  pressure_impact_index: number;
  pressure_strike_rate?: number;
  pressure_economy?: number;
  pressure_balls_faced?: number;
  pressure_balls_bowled?: number;
};
export function PublicRankings({
  onSelectPlayerById,
}: {
  onSelectPlayerById: (id: number, role?: AnalyticalRole) => void;
}) {
  const [role, setRole] = useState<AnalyticalRole>("batting");
  const [rows, setRows] = useState<PublicRank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    requestJSON<PublicRank[]>(
      role === "batting" ? "/data/top_10_batters.json" : "/data/top_10_bowlers.json",
      controller.signal,
    )
      .then((data) => setRows(data))
      .catch((cause) => {
        if (cause?.name !== "AbortError") setError("The recorded leaderboard could not be loaded.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [role]);
  return (
    <div className="public-rankings min-h-screen pt-28 pb-20 px-5">
      <div className="max-w-7xl mx-auto">
        <header className="public-ranking-heading">
          <p className="eyebrow">THE PLAYER SHORTLIST</p>
          <h1>Who could be your <em>match-winner?</em></h1>
          <p>Explore recorded pressure performances. This public ranking uses the
             inherited legacy heuristic and is <strong>not</strong> the private, accepted D20 research.</p>
        </header>
        <div className="public-ranking-switch" role="group" aria-label="Player ranking type">
          {(["batting", "bowling"] as const).map((key) => (
            <button type="button" key={key} aria-pressed={role === key} onClick={() => setRole(key)}>
              {key === "batting" ? "Batting" : "Bowling"}
            </button>
          ))}
        </div>
        {!loading && !error && rows.length>0 && (
          <RankingFilmstrip key={role} rows={rows} role={role}
            onInspect={id=>onSelectPlayerById(id,role)}/>
        )}
        {loading && <p role="status">Loading player records…</p>}
        {error && <p role="alert">{error}</p>}
        {!loading && !error && (
          <div className="public-ranking-grid">
            {rows.map((player) => (
              <button
                className="public-ranking-player"
                key={player.player_id}
                onClick={() => onSelectPlayerById(player.player_id, role)}
                aria-label={`Open player card for ${player.player_name}, legacy rank ${player.rank}`}
              >
                <RoyalIdentityPreview player={player} role={role} compact />
                <div className="public-ranking-player-stats">
                  <span>Legacy #{player.rank}</span>
                  <span>Pressure index {player.pressure_impact_index.toFixed(2)}</span>
                  <span>
                    {role === "batting"
                      ? `SR ${player.pressure_strike_rate?.toFixed(1) ?? "—"}`
                      : `Economy ${player.pressure_economy?.toFixed(2) ?? "—"}`}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
        <p className="public-ranking-note">
          Rankings reflect the legacy public sample. Small sample sizes may distort
          comparisons. A missing private D20 score must never be treated as zero
          or replaced by a legacy score.
        </p>
      </div>
    </div>
  );
}
