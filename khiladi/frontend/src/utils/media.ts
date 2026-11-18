import officialIPLPortraits from "../components/player-cards/official-portraits.json";
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
/** Only exact-identity IPL profile images are eligible for public player photos.
 *  Do not substitute Wikipedia photos, another player, kit artwork or guessed IDs.
 *  We hotlink original source URLs; image rights still require separate review.
 */
export function playerImage(player: {
  player_id:number;
  player_name?:string;
  cutout_url?:string;
  portrait_url?:string;
}):string|undefined {
  const record=(officialIPLPortraits as Record<string,{
    name:string;source:string;url:string;previewUrl?:string;
  }>)[String(player.player_id)];
  if (!record || !player.player_name) return undefined;
  const norm=(v:string)=>v.trim().replace(/\\s+/g," ").toLocaleLowerCase("en");
  if(norm(record.name)!==norm(player.player_name)) return undefined;
  if(!/^https:\/\/www\.iplt20\.com\/players\//.test(record.source)
    && !/^https:\/\/www\.iplt20\.com\/teams\//.test(record.source)) return undefined;
  if(!/^https:\/\/(?:www|documents)\.iplt20\.com\//.test(record.url))return undefined;
  return record.url;
}
export const officialPortraitCount=Object.keys(officialIPLPortraits).length;
