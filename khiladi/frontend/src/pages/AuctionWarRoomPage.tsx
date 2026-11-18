import {
  PLAN_STORAGE_KEY,
  createSquadPlan,
  validateSquadPlan,
} from "../utils/planner";
import { AuctionScenarioComparison } from "../components/AuctionScenarioComparison";
import { RoyalIdentityPreview } from "../components/player-cards/RoyalIdentityPreview";
import { ResearchAccess } from "../components/player-cards/RoyalResearch";
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
  planningBudget: number;
  setPlanningBudget: React.Dispatch<React.SetStateAction<number>>;
  planningBids: Record<number, number>;
  setPlanningBids: React.Dispatch<React.SetStateAction<Record<number, number>>>;
  onReplaceSquad: (players: Player[]) => void;
}
export const AuctionWarRoomPage: React.FC<Props> = ({
  onSelectPlayer,
  warRoomSquad,
  onRemoveFromSquad,
  onAddToSquad,
  purseTotalCr = 120,
  planningBudget: budget,
  setPlanningBudget: setBudget,
  planningBids: bids,
  setPlanningBids: setBids,
  onReplaceSquad,
}) => {
  const [players, setPlayers] = useState<Player[]>([]),
    [query, setQuery] = useState(""),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
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
  const currentPlan = () =>
    validateSquadPlan(
      createSquadPlan(
        warRoomSquad.map((p) => p.player_id),
        budget,
        bids,
      ),
      new Set(players.map((p) => p.player_id)),
    );
  const restorePlan = (text: string) => {
    if (text.length > 100000)
      throw new Error("Plan files must be smaller than 100 KB.");
    const plan = validateSquadPlan(
      JSON.parse(text),
      new Set(players.map((p) => p.player_id)),
    );
    const byId = new Map(players.map((p) => [p.player_id, p]));
    onReplaceSquad(plan.players.map((p) => byId.get(p.playerId)!));
    setBudget(plan.budgetCr);
    setBids(
      Object.fromEntries(
        plan.players
          .filter((p) => p.bidCr !== undefined)
          .map((p) => [p.playerId, p.bidCr!]),
      ),
    );
    setError("");
    setNotice("Hypothetical squad plan loaded.");
  };
  const reportError = (e: unknown) => {
    setError(
      e instanceof SyntaxError
        ? "The selected file is not valid JSON."
        : e instanceof Error
          ? e.message
          : "The plan could not be processed.",
    );
    setNotice("");
  };
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
        <ResearchAccess />
        <section
          className="pc-plan-tools"
          aria-label="Save and transfer your hypothetical squad plan"
        >
          <div>
            <button
              type="button"
              disabled={!players.length}
              onClick={() => {
                try {
                  localStorage.setItem(
                    PLAN_STORAGE_KEY,
                    JSON.stringify(currentPlan()),
                  );
                  setNotice(
                    "Plan saved on this browser. It contains only selected player IDs, your budget and your hypothetical bids.",
                  );
                  setError("");
                } catch (e) {
                  reportError(e);
                }
              }}
            >
              Save plan locally
            </button>
            <button
              type="button"
              disabled={!players.length}
              onClick={() => {
                try {
                  const saved = localStorage.getItem(PLAN_STORAGE_KEY);
                  if (!saved)
                    throw new Error(
                      "No saved squad plan exists in this browser.",
                    );
                  restorePlan(saved);
                } catch (e) {
                  reportError(e);
                }
              }}
            >
              Load saved plan
            </button>
            <button
              type="button"
              disabled={!players.length}
              onClick={() => {
                try {
                  const payload = JSON.stringify(currentPlan(), null, 2),
                    blob = new Blob([payload], { type: "application/json" }),
                    url = URL.createObjectURL(blob),
                    a = document.createElement("a");
                  a.href = url;
                  a.download = "khiladi-hypothetical-plan.json";
                  a.click();
                  setTimeout(() => URL.revokeObjectURL(url), 1000);
                  setNotice(
                    "Plan exported without analytical data or credentials.",
                  );
                  setError("");
                } catch (e) {
                  reportError(e);
                }
              }}
            >
              Export plan
            </button>
            <label className="pc-plan-import">
              Import plan
              <input
                type="file"
                accept="application/json,.json"
                disabled={!players.length}
                onChange={async (e) => {
                  const file = e.currentTarget.files?.[0];
                  e.currentTarget.value = "";
                  if (!file) return;
                  try {
                    if (file.size > 100000)
                      throw new Error(
                        "Plan files must be smaller than 100 KB.",
                      );
                    restorePlan(await file.text());
                  } catch (reason) {
                    reportError(reason);
                  }
                }}
              />
            </label>
          </div>
          <p>
            Save/export includes only canonical IDs and your hypothetical
            budget/bids. Loading or importing replaces the current plan. No D20
            evidence or credentials are saved. Your working plan stays in memory
            when you navigate between pages.
          </p>
          {notice && <p role="status">{notice}</p>}
        </section>
        <AuctionScenarioComparison
          players={players}
          squadIds={warRoomSquad.map((player) => player.player_id)}
          budget={budget}
          bids={bids}
        />
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
                      <div className="pc-war-preview">
                        <RoyalIdentityPreview player={p} compact />
                      </div>
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
