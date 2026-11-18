import { RoyalIdentityPreview } from "../components/player-cards/RoyalIdentityPreview";
import { ResearchAccess, useRoyalResearch } from "../components/player-cards/RoyalResearch";
import React, { useEffect, useMemo, useState } from "react";
import { Player } from "../types";
import { loadPlayers, describePlayer, metric } from "../utils/api";
import { playerImage } from "../utils/media";
import { privateAnalyticsAvailable } from "../utils/analytics";
import { AugeWarpSurface } from "../components/AugeWarpSurface";
import { KhiladiKineticText } from "../components/KhiladiKineticText";
import { PlayerEditorialTrack } from "../components/PlayerEditorialTrack";
import { AnalyticsIntro } from "../components/AnalyticsIntro";
import { EditorialSpotlight } from "../components/EditorialSpotlight";
export const PlayerDatabasePage: React.FC<{
  onSelectPlayer: (p: Player) => void;
  onComparePlayer?: (id: number, role?: "batting" | "bowling") => void;
}> = ({ onSelectPlayer, onComparePlayer }) => {
  const [players, setPlayers] = useState<Player[]>([]),
    [query, setQuery] = useState(""),
    [role, setRole] = useState("All"),
    [page, setPage] = useState(0),
    [advanced, setAdvanced] = useState(false),
    [sortMode, setSortMode] = useState<"name" | "legacy" | "d20-batting" | "d20-bowling">("name"),
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
  const research = useRoyalResearch();
  const acceptedRole =
    !privateAnalyticsAvailable ? null : sortMode === "d20-batting"
      ? "batting"
      : sortMode === "d20-bowling"
        ? "bowling"
        : null;
  const acceptedRecords = acceptedRole
    ? research.responses[acceptedRole]?.rankings ?? []
    : [];
  const acceptedRanks = new Map(
    acceptedRecords.map((record) => [record.player_id, record.rank]),
  );
  const filtered = players
    .filter(
      (player) =>
        (role === "All" || (role === "RR" ? player.is_rr : player.role === role)) &&
        (player.player_name.toLowerCase().includes(query.trim().toLowerCase()) ||
          String(player.player_id) === query.trim()) &&
        (!acceptedRole || acceptedRanks.has(player.player_id)),
    )
    .sort((a, b) => {
      if (acceptedRole)
        return (acceptedRanks.get(a.player_id) ?? Infinity) -
          (acceptedRanks.get(b.player_id) ?? Infinity);
      if (sortMode === "legacy")
        return b.pressure_impact_index - a.pressure_impact_index;
      return a.player_name.localeCompare(b.player_name) || a.player_id - b.player_id;
    });
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
        <EditorialSpotlight
          title="See the player. Read the performance."
          subtitle="Rajasthan-associated identities are featured for photographic discovery; the searchable pool below remains complete."
          entries={players.filter(p=>p.is_rr && Boolean(playerImage(p))).slice(0,3).map(p=>({
            player_id:p.player_id, player_name:p.player_name, role:p.role,
            label:"Recorded pressure deliveries",
            value:String(p.batting.press_balls+p.bowling.press_balls),
          }))}
          onInspect={id=>{const player=players.find(p=>p.player_id===id);if(player)onSelectPlayer(player)}}
        />
        <PlayerEditorialTrack
          players={players}
          onSelectPlayer={onSelectPlayer}
        />
        <ResearchAccess />
        <p className="pc-identity-scope">
          Public canonical player identities and recorded pressure metrics are searchable below. Player images come from matched official IPL profile sources where available; otherwise a branded fallback is shown.
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
          <label>
            Catalogue order
            <select
              aria-label="Catalogue order"
              value={sortMode}
              onChange={(event) => {
                setSortMode(event.target.value as typeof sortMode);
                setPage(0);
              }}
            >
              <option value="name">Player name (A–Z)</option>
              {privateAnalyticsAvailable && (
                <>
                  <option value="d20-batting">Accepted D20 batting (served records)</option>
                  <option value="d20-bowling">Accepted D20 bowling (served records)</option>
                </>
              )}
              <option value="legacy">Legacy heuristic index (separate model)</option>
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
        {acceptedRole && (
          <p className="pc-identity-scope">
            Accepted D20 {acceptedRole} order only includes records actually
            served by the private primary model. The private serving scope is
            currently top ten per role; unserved identities are not assumed
            ineligible. This is a dimensionless historical rating, not an
            official auction recommendation.
          </p>
        )}
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
                <RoyalIdentityPreview
                  player={player}
                  role={acceptedRole ?? undefined}
                />
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
          <p role="status">
            {acceptedRole && !research.responses[acceptedRole]
              ? "Accepted D20 evidence is locked or unavailable. Unlock an authorized research session above; no legacy scores are substituted."
              : "No players match this search and evidence selection. Try another name, role or catalogue order."}
          </p>
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
