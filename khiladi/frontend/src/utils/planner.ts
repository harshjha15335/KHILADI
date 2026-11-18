/** User-entered hypothetical planning data only: never accepted research or credentials. */
export interface SquadPlan {
  version: 1;
  budgetCr: number;
  players: Array<{ playerId: number; bidCr?: number }>;
}
export const PLAN_STORAGE_KEY = "khiladi-hypothetical-plan-v1";
export function validateSquadPlan(
  input: unknown,
  canonicalIds: Set<number>,
): SquadPlan {
  const object = (x: unknown): x is Record<string, unknown> =>
    !!x && typeof x === "object" && !Array.isArray(x);
  const amount = (x: unknown): x is number =>
    typeof x === "number" && Number.isFinite(x) && x >= 0 && x <= 1e12;
  if (
    !object(input) ||
    Object.keys(input).some(
      (k) => !["version", "budgetCr", "players"].includes(k),
    ) ||
    input.version !== 1 ||
    !amount(input.budgetCr) ||
    !Array.isArray(input.players) ||
    input.players.length > canonicalIds.size
  )
    throw new Error(
      "Invalid plan. Use a KHILADI version 1 plan with a non-negative budget.",
    );
  const seen = new Set<number>();
  const players = input.players.map((row) => {
    if (
      !object(row) ||
      Object.keys(row).some((k) => !["playerId", "bidCr"].includes(k)) ||
      !Number.isInteger(row.playerId) ||
      !canonicalIds.has(row.playerId as number) ||
      seen.has(row.playerId as number) ||
      (row.bidCr !== undefined && !amount(row.bidCr))
    )
      throw new Error(
        "The plan contains an unknown or duplicate player, or an invalid hypothetical bid.",
      );
    const id = row.playerId as number;
    seen.add(id);
    return row.bidCr === undefined
      ? { playerId: id }
      : { playerId: id, bidCr: row.bidCr as number };
  });
  return { version: 1, budgetCr: input.budgetCr, players };
}
export function createSquadPlan(
  ids: number[],
  budgetCr: number,
  bids: Record<number, number>,
): SquadPlan {
  return {
    version: 1,
    budgetCr,
    players: ids.map((playerId) =>
      bids[playerId] === undefined
        ? { playerId }
        : { playerId, bidCr: bids[playerId] },
    ),
  };
}
