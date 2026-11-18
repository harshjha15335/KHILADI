import reviewPortraits from "../config/review-portraits.json";
import publicPortraits from "../config/public-portraits.json";
import officialIPLPortraits from "../components/player-cards/official-portraits.json";
import { officialPortrait } from "../components/player-cards/portraitSource";
import { siteURL } from "./urls";
import media from "../config/approved-media.json";
interface ApprovedAsset {
  src: string;
  source: string;
  permission: string;
  caption: string;
}
export interface ApprovedClip extends ApprovedAsset {
  poster: string;
}
const approved = media as {
  crest: string;
  heroClips: ApprovedClip[];
  moments?: ApprovedClip[];
  archive: ApprovedAsset[];
  portraits: Record<string, ApprovedAsset>;
};
const playable = (clips: ApprovedClip[]) =>
  clips
    .filter((clip) => clip.src && clip.poster && clip.source && clip.permission)
    .map((clip) => ({
      ...clip,
      src: siteURL(clip.src),
      poster: siteURL(clip.poster),
    }));
export const approvedHeroClips = playable(approved.heroClips);
export const approvedMoments = playable(approved.moments || []);
// Existing protected assets are available only for local review until permission is documented.
// Production defaults to no protected media; approved paths can be supplied with Vite variables.
export const reviewMedia =
  import.meta.env.DEV && import.meta.env.VITE_MEDIA_REVIEW !== "false";
export const archivalImages = approved.archive.length
  ? approved.archive
  : reviewMedia && __ARCHIVE_REVIEW_AVAILABLE__
    ? [
        {
          src: "trophy-story",
          caption: "Shane Warne and Rajasthan Royals",
          source:
            "https://www.rajasthanroyals.com/latest-news/shane-warne-rajasthan-royals-ipl",
        },
        ...Array.from({ length: 6 }, (_, i) => ({
          src: `archive-${i}`,
          caption: "Remembering Shane Warne, our first Royal",
          source:
            "https://www.rajasthanroyals.com/photos/remembering-shane-warne-our-first-royal",
        })),
      ].map((image) => ({ ...image, src: `/__review-media/${image.src}.jpg` }))
    : [];
// Four inherited jersey graphics were presented as photos. Never use them as portraits.
const sourceVerifiedIDs = new Set([
  3298, 7503, 7312, 8580, 6423, 6806, 25139, 8182, 3297, 152, 7260, 26663, 1487,
  7269, 47523, 43798, 41503, 48557, 7545, 67036, 2411, 60700, 50284,
]);
export function playerImage(player: {
  player_id: number;
  player_name?: string;
  cutout_url?: string;
  portrait_url?: string;
}) {
  const ipl = (officialIPLPortraits as Record<string, {
    name: string; source: string; url: string; previewUrl?: string;
  }>)[String(player.player_id)];
  // Use only exact identity matches from publicly visible IPL player profiles.
  // We link to official image endpoints; do not copy or claim ownership.
  const officialIPLImage =
    player.player_name && ipl?.name?.trim().toLocaleLowerCase("en") ===
      player.player_name.trim().toLocaleLowerCase("en")
      ? ipl.previewUrl ?? ipl.url
      : undefined;
  return (
    ((publicPortraits as Record<string, { name: string; src: string }>)[String(player.player_id)]?.name === player.player_name
      ? (publicPortraits as Record<string, { name: string; src: string }>)[String(player.player_id)].src
      : undefined) ||
    approved.portraits[String(player.player_id)]?.src ||
    officialIPLImage ||
    (reviewMedia
      ? (reviewPortraits as Record<string, string>)[String(player.player_id)]
      : undefined) ||
    (reviewMedia
      ? (() => {
          const portrait = officialPortrait(player.player_id);
          // A canonical player ID must never display a portrait assigned to a
          // different cricket identity, even if a manifest entry is wrong.
          if (
            !portrait ||
            (player.player_name &&
              portrait.name.trim().toLocaleLowerCase("en") !==
                player.player_name.trim().toLocaleLowerCase("en"))
          )
            return undefined;
          return portrait.previewUrl ?? portrait.url;
        })()
      : undefined) ||
    (reviewMedia && sourceVerifiedIDs.has(player.player_id)
      ? player.cutout_url || player.portrait_url
      : undefined)
  );
}
