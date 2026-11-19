import officialIPLPortraits from "../components/player-cards/official-portraits.json";
import licensedPortraits from "../components/player-cards/licensed-portraits.json";
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
/** The dataset decides which players exist. External photography can only
 * decorate an existing, exactly matching player_id + player_name.
 * Previously verified IPL studio portraits remain first preference. A
 * separately cleared Commons asset is used only when no IPL image is valid.
 * Neither official profile links nor unreviewed source candidates automatically
 * grant KHILADI permission to redistribute an image.
 */
type OfficialRecord = {name:string;source:string;url:string;previewUrl?:string};
type LicensedRecord = {
  name:string;source:string;url:string;author:string;license:string;
  license_url:string;identity_verified:boolean;rights_status:string;
};
const normalizePlayerName = (v:string) =>
  v.trim().replace(/\s+/g," ").toLocaleLowerCase("en");
const unavailablePlayerIds = new Set([2379,6097,31205,43965,63497,2933,3644]);
const noOfficialPhotoNames = new Set(["sam curran","dasun shanaka"]);
export function playerImage(player:{
  player_id:number;
  player_name?:string;
  cutout_url?:string;
  portrait_url?:string;
}):string|undefined {
  if(!player.player_name || !Number.isInteger(player.player_id)) return undefined;
  const name = normalizePlayerName(player.player_name);
  const record = (officialIPLPortraits as Record<string,OfficialRecord>)[String(player.player_id)];
  if(record && normalizePlayerName(record.name)===name
      && !unavailablePlayerIds.has(player.player_id)
      && !noOfficialPhotoNames.has(name)
      && /^https:\/\/www\.iplt20\.com\/(?:players|teams)\//.test(record.source)
      && /^https:\/\/(?:www|documents)\.iplt20\.com\//.test(record.url))
    return record.url;

  const licensed = (licensedPortraits as Record<string,LicensedRecord>)[String(player.player_id)];
  if(licensed && normalizePlayerName(licensed.name)===name
      && licensed.identity_verified === true
      && licensed.rights_status === "licensed"
      && /^CC-BY(?:-SA)?-(?:3\.0|4\.0)$/.test(licensed.license)
      && /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/.test(licensed.source)
      && /^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\//.test(licensed.url)
      && /^https:\/\/creativecommons\.org\/licenses\//.test(licensed.license_url)
      && licensed.author.trim().length>1)
    return licensed.url;
  return undefined;
}
export const officialPortraitCount=Object.keys(officialIPLPortraits).length;
export const licensedPortraitCount=Object.keys(licensedPortraits).length;
