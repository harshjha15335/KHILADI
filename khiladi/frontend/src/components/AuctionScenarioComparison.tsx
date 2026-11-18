import React, { useState } from "react";
import type { Player } from "../types";
import {
  createSquadPlan,
  validateSquadPlan,
  type SquadPlan,
} from "../utils/planner";

type PlanSummary = {
  count: number;
  priced: number;
  unpriced: number;
  spent: number;
  budget: number;
  remaining: number;
};

const money = (amount: number) => `₹${amount.toFixed(2)} cr`;
const summarize = (plan: SquadPlan): PlanSummary => {
  const entered = plan.players.filter((player) => player.bidCr !== undefined);
  const spent = entered.reduce((sum, player) => sum + player.bidCr!, 0);
  return {
    count: plan.players.length,
    priced: entered.length,
    unpriced: plan.players.length - entered.length,
    spent,
    budget: plan.budgetCr,
    remaining: plan.budgetCr - spent,
  };
};

/**
 * Compare two user-entered hypothetical auction plans.
 * This component does not read or export accepted D20 research or official prices.
 * Importing a reference plan never alters the active squad or its bids.
 */
export function AuctionScenarioComparison({
  players,
  squadIds,
  budget,
  bids,
}: {
  players: Player[];
  squadIds: number[];
  budget: number;
  bids: Record<number, number>;
}) {
  const [reference, setReference] = useState<SquadPlan | null>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const current = createSquadPlan(squadIds, budget, bids);
  const active = summarize(current);
  const baseline = reference && summarize(reference);

  const playerNames = new Map(
    players.map((player) => [player.player_id, player.player_name]),
  );
  const currentBids = new Map(
    current.players.map((player) => [player.playerId, player.bidCr]),
  );
  const previousBids = new Map(
    (reference?.players ?? []).map((player) => [player.playerId, player.bidCr]),
  );
  const allIds = [...new Set([...currentBids.keys(), ...previousBids.keys()])]
    .sort((a, b) => (playerNames.get(a) ?? "").localeCompare(playerNames.get(b) ?? ""));

  const loadReference = async (file: File) => {
    if (file.size > 100_000) {
      setError("Comparison plans must be smaller than 100 KB.");
      return;
    }
    try {
      const parsed = JSON.parse(await file.text()) as unknown;
      const validated = validateSquadPlan(
        parsed,
        new Set(players.map((player) => player.player_id)),
      );
      setReference(validated);
      setFileName(file.name);
      setError("");
    } catch (reason) {
      setError(
        reason instanceof SyntaxError
          ? "The comparison plan is not valid JSON."
          : reason instanceof Error
            ? reason.message
            : "The comparison plan could not be read.",
      );
    }
  };

  const displayBid = (planBids: Map<number, number | undefined>, id: number) =>
    !planBids.has(id)
      ? "Not selected"
      : planBids.get(id) === undefined
        ? "No bid entered"
        : money(planBids.get(id)!);

  const metrics: Array<{ label: string; current: string; previous: string }> =
    baseline
      ? [
          {
            label: "Players selected",
            current: String(active.count),
            previous: String(baseline.count),
          },
          {
            label: "Hypothetical budget",
            current: money(active.budget),
            previous: money(baseline.budget),
          },
          {
            label: "Total entered bids",
            current: money(active.spent),
            previous: money(baseline.spent),
          },
          {
            label: "Remaining (unpriced excluded)",
            current: money(active.remaining),
            previous: money(baseline.remaining),
          },
          {
            label: "Players without bids",
            current: String(active.unpriced),
            previous: String(baseline.unpriced),
          },
        ]
      : [];

  return (
    <section
      className="rounded-3xl border border-[#CBD5E9] bg-white p-5 sm:p-8 space-y-5"
      aria-labelledby="auction-scenario-compare-heading"
    >
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-[#2450B8]">
          Auction planning / Scenario comparison
        </p>
        <h2
          id="auction-scenario-compare-heading"
          className="text-2xl sm:text-3xl font-bold text-[#182643]"
        >
          Compare two squad plans.
        </h2>
        <p className="text-sm leading-relaxed text-[#536079] max-w-2xl">
          Import an earlier KHILADI plan as a reference. Compare squad changes,
          hypothetical budgets and entered bids without replacing the squad
          you are working on. These are your assumptions, not official
          auction prices or player projections.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex flex-col gap-2 text-sm font-semibold text-[#182643]">
          Choose reference plan (.json)
          <input
            aria-label="Choose reference plan"
            type="file"
            accept=".json,application/json"
            disabled={!players.length}
            className="max-w-full text-sm"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              event.currentTarget.value = "";
              if (file) void loadReference(file);
            }}
          />
        </label>
        {reference && (
          <button
            type="button"
            className="rounded-full border border-[#2450B8] px-5 py-2.5 text-sm font-semibold text-[#2450B8] hover:bg-[#E8F1FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            onClick={() => {
              setReference(null);
              setFileName("");
              setError("");
            }}
          >
            Clear reference
          </button>
        )}
      </div>
      {error && <p role="alert" className="text-sm text-[#A21954]">{error}</p>}
      {reference && baseline ? (
        <div className="space-y-5">
          <p role="status" className="text-sm text-[#536079]">
            Reference loaded: {fileName}. Your active plan was not changed.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm text-left">
              <caption className="sr-only">
                Comparison of the current hypothetical plan and an imported reference plan
              </caption>
              <thead>
                <tr className="border-b border-[#CBD5E9]">
                  <th scope="col" className="p-3">Measure</th>
                  <th scope="col" className="p-3">Current plan</th>
                  <th scope="col" className="p-3">Reference plan</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((metric) => (
                  <tr key={metric.label} className="border-b border-[#E8F1FF]">
                    <th scope="row" className="p-3 font-medium">{metric.label}</th>
                    <td className="p-3 tabular-nums">{metric.current}</td>
                    <td className="p-3 tabular-nums">{metric.previous}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3 className="text-xl font-bold text-[#182643]">
            Which players changed?
          </h3>
          {allIds.length === 0 ? (
            <p className="text-sm text-[#536079]">Both squads are empty.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm text-left">
                <caption className="sr-only">Player-by-player hypothetical bid comparison</caption>
                <thead>
                  <tr className="border-b border-[#CBD5E9]">
                    <th scope="col" className="p-3">Player</th>
                    <th scope="col" className="p-3">Current bid</th>
                    <th scope="col" className="p-3">Reference bid</th>
                    <th scope="col" className="p-3">Selection</th>
                  </tr>
                </thead>
                <tbody>
                  {allIds.map((id) => {
                    const currentHas = currentBids.has(id);
                    const previousHas = previousBids.has(id);
                    return (
                      <tr key={id} className="border-b border-[#E8F1FF]">
                        <th scope="row" className="p-3 font-medium">
                          {playerNames.get(id) ?? `Player #${id}`}
                        </th>
                        <td className="p-3 tabular-nums">
                          {displayBid(currentBids, id)}
                        </td>
                        <td className="p-3 tabular-nums">
                          {displayBid(previousBids, id)}
                        </td>
                        <td className="p-3">
                          {currentHas && previousHas
                            ? "Both plans"
                            : currentHas
                              ? "Current only"
                              : "Reference only"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {(active.unpriced > 0 || baseline.unpriced > 0) && (
            <p className="text-sm text-[#536079]">
              Unpriced players are excluded from entered-bid totals. Zero bids
              are explicitly entered amounts, not missing prices.
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-[#536079]">
          No reference loaded. Export or save an earlier scenario using the
          tools above, then choose its JSON file here to compare it with your
          active plan.
        </p>
      )}
    </section>
  );
}
