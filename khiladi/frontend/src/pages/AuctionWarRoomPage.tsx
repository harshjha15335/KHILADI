import React, { useEffect, useState } from "react";
import { Player } from "../types";
import { loadPlayers, metric } from "../utils/api";
import { AnalyticsIntro } from "../components/AnalyticsIntro";
import { KhiladiKineticText } from "../components/KhiladiKineticText";
interface Props {
  onSelectPlayer: (p: Player) => void;
  warRoomSquad: Player[];
  onRemoveFromSquad: (id: number) => void;
  onAddToSquad: (p: Player) => void;
  purseTotalCr?: number;
}
export const AuctionWarRoomPage: React.FC<Props> = ({
  onSelectPlayer,
  warRoomSquad,
  onRemoveFromSquad,
  onAddToSquad,
  purseTotalCr = 120,
}) => {
  const [players, setPlayers] = useState<Player[]>([]),
    [query, setQuery] = useState(""),
    [budget, setBudget] = useState(purseTotalCr),
    [bids, setBids] = useState<Record<number, number>>({}),
    [error, setError] = useState("");
  useEffect(() => {
    loadPlayers()
      .then(setPlayers)
      .catch(() => setError("Player search is unavailable. Please reload."));
  }, []);
  const spent = warRoomSquad.reduce(
      (sum, p) => sum + (bids[p.player_id] ?? 0),
      0,
    ),
    unknown = warRoomSquad.filter(
      (p) => bids[p.player_id] === undefined,
    ).length;
  const matches = query.trim()
    ? players
        .filter(
          (p) =>
            p.player_name.toLowerCase().includes(query.toLowerCase()) &&
            !warRoomSquad.some((s) => s.player_id === p.player_id),
        )
        .slice(0, 8)
    : [];
  return (
    <div className="min-h-screen pt-32 pb-20 px-5">
      <div className="max-w-6xl mx-auto space-y-8">
        <KhiladiKineticText
          as="h1"
          text="Build your squad."
          className="text-4xl sm:text-6xl font-bold"
        />
        <AnalyticsIntro details="This is a planning workspace. Enter your own hypothetical bids and budget; these are not official auction prices. The dataset does not supply reliable nationality or official auction eligibility for every player. No automatic optimizer is claimed.">
          Add players you like. Balance your roles. Try a budget that works for
          you.
        </AnalyticsIntro>
        <div className="discovery-controls">
          <label>
            Your planning budget (₹ crore)
            <input
              type="number"
              min="0"
              step=".1"
              value={budget}
              onChange={(e) => setBudget(Math.max(0, Number(e.target.value)))}
            />
          </label>
          <label>
            Find a player
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search players to add"
            />
          </label>
        </div>
        {error && <p role="alert">{error}</p>}
        {matches.length > 0 && (
          <div className="squad-search-results">
            {matches.map((p) => (
              <button
                key={p.player_id}
                onClick={() => {
                  onAddToSquad(p);
                  setQuery("");
                }}
              >
                {p.player_name}
                <span>{p.role} · Add +</span>
              </button>
            ))}
          </div>
        )}
        <p role="status">
          {warRoomSquad.length} players · ₹{spent.toFixed(2)} crore in entered
          bids · ₹{(budget - spent).toFixed(2)} crore remaining
          {unknown > 0 ? ` · ${unknown} players still need a bid` : ""}
        </p>
        {spent > budget && (
          <p role="alert">Your entered bids exceed your planning budget.</p>
        )}
        <div className="overflow-x-auto">
          <table className="planning-table">
            <thead>
              <tr>
                <th>Player</th>
                <th>Role</th>
                <th>Your bid (₹ crore)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {warRoomSquad.map((p) => (
                <tr key={p.player_id}>
                  <td>
                    <button
                      className="text-link"
                      onClick={() => onSelectPlayer(p)}
                    >
                      {p.player_name} ↗
                    </button>
                  </td>
                  <td>{p.role}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      step=".1"
                      aria-label={`Planning bid for ${p.player_name}`}
                      value={bids[p.player_id] ?? ""}
                      placeholder="Not entered"
                      onChange={(e) => {
                        const value = e.target.value;
                        setBids((old) => {
                          const next = { ...old };
                          if (value === "") delete next[p.player_id];
                          else next[p.player_id] = Math.max(0, Number(value));
                          return next;
                        });
                      }}
                    />
                  </td>
                  <td>
                    <button
                      aria-label={`Remove ${p.player_name}`}
                      onClick={() => onRemoveFromSquad(p.player_id)}
                    >
                      Remove ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!warRoomSquad.length && (
          <p>
            Start by searching for a player above, or add someone from their
            profile.
          </p>
        )}
        <details>
          <summary>See squad evidence and planning guidelines</summary>
          <p className="my-4">
            Common planning constraints: 18–25 squad members, up to 8 overseas
            players. Verify the applicable competition rules and each player's
            eligibility separately. Nationality is unavailable in this export.
          </p>
          <ul>
            {warRoomSquad.map((p) => (
              <li key={p.player_id}>
                {p.player_name} · model index{" "}
                {metric(p.pressure_impact_index, 2)}
              </li>
            ))}
          </ul>
        </details>
      </div>
    </div>
  );
};
