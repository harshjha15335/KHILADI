import reviewPortraits from "../config/review-portraits.json";
import media from "../config/approved-media.json";
interface ApprovedAsset {
  src: string;
  source: string;
  permission: string;
  caption: string;
}
const approved = media as {
  crest: string;
  heroClips: ApprovedAsset[];
  archive: ApprovedAsset[];
  portraits: Record<string, ApprovedAsset>;
};
export const approvedHeroClips = approved.heroClips;
// Existing protected assets are available only for local review until permission is documented.
// Production defaults to no protected media; approved paths can be supplied with Vite variables.
export const reviewMedia =
  import.meta.env.DEV && import.meta.env.VITE_MEDIA_REVIEW !== "false";
export const crestURL =
  approved.crest ||
  (reviewMedia
    ? "https://www.rajasthanroyals.com/static-assets/images/svg/logo.svg?v=5.14"
    : "");
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
export const rrClips = [
  {
    id: "x9j1xrq",
    title: "First ball. No problem.",
    caption: "Yashasvi Jaiswal · RCB v RR, 2025",
    source:
      "https://www.rajasthanroyals.com/royals-tv/ipl-2025-rcb-vs-rr-first-ball-no-problem-jaiswal-launches-it-x9j1xrq",
  },
  {
    id: "x9i1kti",
    title: "Make your moment.",
    caption: "Jofra Archer · PBKS v RR, 2025",
    source:
      "https://www.rajasthanroyals.com/royals-tv/ipl-2025-pbks-vs-rr-archer-strikes-first-ball-x9i1kti",
  },
  {
    id: "x9i1jyo",
    title: "Every chance matters.",
    caption: "Riyan Parag · RR v CSK, 2025",
    source:
      "https://www.rajasthanroyals.com/royals-tv/ipl-2025-rr-vs-csk-parags-stunning-catch-to-dismiss-dube-x9i1jyo",
  },
];
// Four inherited jersey graphics were presented as photos. Never use them as portraits.
const sourceVerifiedIDs = new Set([
  3298, 7503, 7312, 8580, 6423, 6806, 25139, 8182, 3297, 152, 7260, 26663, 1487,
  7269, 47523, 43798, 41503, 48557, 7545, 67036, 2411, 60700, 50284,
]);
export function playerImage(player: {
  player_id: number;
  cutout_url?: string;
  portrait_url?: string;
}) {
  return (
    approved.portraits[String(player.player_id)]?.src ||
    (reviewMedia
      ? (reviewPortraits as Record<string, string>)[String(player.player_id)]
      : undefined) ||
    (reviewMedia && sourceVerifiedIDs.has(player.player_id)
      ? player.cutout_url || player.portrait_url
      : undefined)
  );
}
