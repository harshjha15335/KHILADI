import React, { useEffect, useMemo, useState } from "react";
import { Player } from "../types";
import { loadPlayers, describePlayer, metric } from "../utils/api";
import { playerImage } from "../utils/media";
import { AugeWarpSurface } from "../components/AugeWarpSurface";
import { KhiladiKineticText } from "../components/KhiladiKineticText";
import { PlayerEditorialTrack } from "../components/PlayerEditorialTrack";
import { AnalyticsIntro } from "../components/AnalyticsIntro";
export const PlayerDatabasePage: React.FC<{
  onSelectPlayer: (p: Player) => void;
}> = ({ onSelectPlayer }) => {
  const [players, setPlayers] = useState<Player[]>([]),
    [query, setQuery] = useState(""),
    [role, setRole] = useState("All"),
    [page, setPage] = useState(0),
    [advanced, setAdvanced] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    loadPlayers()
      .then((ps) => {
        if (active) setPlayers(ps);
      })
      .catch(() =>
        setError("Players could not be loaded. Please reload to try again."),
      );
    return () => {
      active = false;
    };
  }, []);
  const filtered = useMemo(
    () =>
      players
        .filter(
          (p) =>
            (role === "All" || (role === "RR" ? p.is_rr : p.role === role)) &&
            (p.player_name.toLowerCase().includes(query.toLowerCase()) ||
              String(p.player_id) === query),
        )
        .sort((a, b) => b.pressure_impact_index - a.pressure_impact_index),
    [players, query, role],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / 18));
  return (
    <div className="min-h-screen pt-32 pb-20 px-5">
      <div className="max-w-7xl mx-auto space-y-8">
        <KhiladiKineticText
          preview={players.map(playerImage).find(Boolean)}
          as="h1"
          text="Find your match-winner."
          className="text-4xl sm:text-6xl font-bold tracking-tight"
        />
        <AnalyticsIntro details="The model index orders players by their stored pressure performance. Small samples can be misleading; inspect the evidence before comparing roles. Confidence intervals are not available in the current export.">
          Discover the players who fit your team. Open a profile to see what
          their recorded performance tells us.
        </AnalyticsIntro>
        <PlayerEditorialTrack
          players={players}
          onSelectPlayer={onSelectPlayer}
        />
        <div className="discovery-controls">
          <label>
            Find a player
            <input
              type="search"
              placeholder="Search player name or ID"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(0);
              }}
            />
          </label>
          <label>
            Playing role
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setPage(0);
              }}
            >
              {["All", "Batter", "Bowler", "All-Rounder", "RR"].map((value) => (
                <option key={value} value={value}>
                  {value === "RR" ? "Rajasthan Royals" : value}
                </option>
              ))}
            </select>
          </label>
          <label className="advanced-toggle">
            <input
              type="checkbox"
              checked={advanced}
              onChange={(e) => setAdvanced(e.target.checked)}
            />
            Show detailed metrics
          </label>
        </div>
        {error && <p role="alert">{error}</p>}
        <p role="status">
          {filtered.length} players{" "}
          {players.length === 0 && !error ? "· Loading…" : ""}
        </p>
        <div className="discovery-grid">
          {filtered.slice(page * 18, page * 18 + 18).map((player) => (
            <article
              key={player.player_id}
              className="discovery-player"
              data-player-id={player.player_id}
            >
              <button
                className="discovery-open"
                data-cursor-label="View player"
                onClick={(event) => {
                  event.currentTarget.focus({ preventScroll: true });
                  onSelectPlayer(player);
                }}
              >
                <AugeWarpSurface className="discovery-photo">
                  {playerImage(player) ? (
                    <img
                      src={playerImage(player)}
                      alt=""
                      width="240"
                      height="240"
                      loading="lazy"
                    />
                  ) : (
                    <span aria-label="Portrait unavailable">
                      {player.player_name
                        .split(" ")
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                  )}
                </AugeWarpSurface>
                <span className="discovery-role">{player.role}</span>
                <strong>{player.player_name} ↗</strong>
                <span className="discovery-description">
                  {describePlayer(player)}
                </span>
              </button>
              {advanced && (
                <dl className="discovery-metrics">
                  <div>
                    <dt>Model index</dt>
                    <dd>{metric(player.pressure_impact_index, 2)}</dd>
                  </div>
                  <div>
                    <dt>Pressure batting balls</dt>
                    <dd>{player.batting.press_balls}</dd>
                  </div>
                  <div>
                    <dt>Pressure bowling balls</dt>
                    <dd>{player.bowling.press_balls}</dd>
                  </div>
                </dl>
              )}
              <a className="text-link" href="#comparison">
                Compare players ↗
              </a>
            </article>
          ))}
        </div>
        {filtered.length === 0 && players.length > 0 && (
          <p>No players match this search. Try another name or playing role.</p>
        )}
        <div className="discovery-pagination">
          <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            ← Previous
          </button>
          <span>
            Page {page + 1} of {pages}
          </span>
          <button
            disabled={page + 1 >= pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};
