import { Player } from "../types";
export async function requestJSON<T>(
  url: string,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return response.json();
}
let playersPromise: Promise<Player[]> | undefined;
export function loadPlayers(): Promise<Player[]> {
  if (!playersPromise)
    playersPromise = requestJSON<Player[]>("/data/player_database.json")
      .catch(async () => {
        const first = await requestJSON<{
          players: Player[];
          total_pages: number;
        }>("/api/players?limit=200");
        const rest = await Promise.all(
          Array.from({ length: first.total_pages - 1 }, (_, i) =>
            requestJSON<{ players: Player[] }>(
              `/api/players?limit=200&page=${i + 2}`,
            ),
          ),
        );
        return [first, ...rest].flatMap((page) => page.players);
      })
      .catch((error) => {
        playersPromise = undefined;
        throw error;
      });
  return playersPromise;
}
export function describePlayer(player: Player): string {
  const bat = player.batting,
    bowl = player.bowling;
  if (!bat?.press_balls && !bowl?.press_balls)
    return "Not enough recorded pressure deliveries to assess this player.";
  if (player.role === "Bowler" && bowl?.press_balls)
    return bowl.econ_delta > 0
      ? "Concedes fewer runs in the recorded pressure situations than in their overall sample."
      : "Explore their bowling record to see how they handle difficult situations.";
  if (bat?.press_balls)
    return bat.sr_delta > 0
      ? "Scores faster in the recorded pressure situations than in their overall sample."
      : "Explore their batting record to find the situations that suit them.";
  return "Explore their recorded bowling performance in difficult situations.";
}
export const metric = (value: number | undefined, digits = 1) =>
  Number.isFinite(value) ? value!.toFixed(digits) : "Unavailable";
