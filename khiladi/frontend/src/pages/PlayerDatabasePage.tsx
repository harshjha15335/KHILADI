import { RoyalIdentityPreview } from "../components/player-cards/RoyalIdentityPreview";
import { ResearchAccess } from "../components/player-cards/RoyalResearch";
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
  onComparePlayer?: (id: number, role?: "batting" | "bowling") => void;
}> = ({ onSelectPlayer, onComparePlayer }) => {
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
    <div className="pc-inner-catalogue min-h-screen pt-32 pb-20 px-5">
      <div className="max-w-7xl mx-auto space-y-8">
        <KhiladiKineticText
          preview={players.map(playerImage).find(Boolean)}
          as="h1"
          text="Find your match-winner."
          className="text-4xl sm:text-6xl font-bold tracking-tight"
        />
        <AnalyticsIntro details="Catalogue ordering uses the inherited legacy pressure index. Accepted D20 is a separate private model; its conditional intervals appear only where a matching accepted record is available. Small samples remain uncertain.">
          Discover the players who fit your team. Open a profile to see what
          their recorded performance tells us.
        </AnalyticsIntro>
        <PlayerEditorialTrack
          players={players}
          onSelectPlayer={onSelectPlayer}
        />
        <ResearchAccess />
        <p className="pc-identity-scope">
          1,217 canonical identities. Official photographs are used where
          source-verified for private review; other identities have a labelled
          initials fallback. D20 evidence is available only for matching records
          in the private serving scope.
        </p>
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
                aria-label={`Inspect ${player.player_name}`}
                onClick={(event) => {
                  event.currentTarget.focus({ preventScroll: true });
                  onSelectPlayer(player);
                }}
              >
                <RoyalIdentityPreview player={player} />
              </button>
              {advanced && (
                <dl className="discovery-metrics">
                  <div>
                    <dt>Legacy model index</dt>
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
              <button
                type="button"
                className="text-link"
                onClick={() =>
                  onComparePlayer?.(
                    player.player_id,
                    player.role === "Bowler" ? "bowling" : "batting",
                  )
                }
              >
                Compare players ↗
              </button>
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
