import portraits from "./official-portraits.json";
import { siteURL } from "../../utils/urls";
export function officialPortrait(playerId: number) {
  // Private source-reviewed use requested by the user; no production redistribution.
  if (!import.meta.env.DEV || import.meta.env.VITE_GITHUB_PAGES === "true")
    return null;
  return (
    (
      portraits as Record<
        string,
        { name: string; source: string; url: string; previewUrl?: string }
      >
    )[String(playerId)] ?? null
  );
}
export const royalSymbol = () => siteURL("/assets/brand/khiladi-symbol.svg");
