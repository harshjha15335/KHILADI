# KHILADI cricket footage - current status

The live hero currently has **no approved in-page RR video assets**.
`khiladi/frontend/src/config/approved-media.json` is the production authority.
The hero external-link fallback has been removed. There is no actual montage until permitted clips are supplied.

An older version of this manifest claimed four Commons clips were verified and
playing. That claim was not supported by asset URLs, licence records or current
playback and is superseded by this record. Those unrelated clips are not used.

## Phase 2 recheck - 15 November 2026

| Verified official RR source | Scene | Supported embed attempt |
| --- | --- | --- |
| [Jaiswal, RCB v RR](https://www.rajasthanroyals.com/royals-tv/ipl-2025-rcb-vs-rr-first-ball-no-problem-jaiswal-launches-it-x9j1xrq) | Batting | Dailymotion `x9j1xrq`: HTTP 403 |
| [Archer, PBKS v RR](https://www.rajasthanroyals.com/royals-tv/ipl-2025-pbks-vs-rr-archer-strikes-first-ball-x9i1kti) | Wicket | Dailymotion `x9i1kti`: HTTP 403 |
| [Parag, RR v CSK](https://www.rajasthanroyals.com/royals-tv/ipl-2025-rr-vs-csk-parags-stunning-catch-to-dismiss-dube-x9i1jyo) | Catch | Dailymotion `x9i1jyo`: HTTP 403 |

The first embed was also opened in Chromium and returned a visible Forbidden
response. These are observations from this cloud network, not proof that every
browser or territory is blocked. No permission to download, re-edit or rehost
these protected match clips has been established. No player restrictions were
bypassed and no unrelated video was substituted.

Evidence: `docs/qa/phase2/source-checks.json` and
`docs/qa/phase2/browser-source-checks.json`; original official-page provenance is
in `docs/qa/reference-fidelity/rr-video-sources.json`.

The RR montage remains **blocked**, including three-scene playback, transition,
poster/codec, mobile cropping and black-frame acceptance checks. Those cannot be
passed using URLs or an empty video component. A permitted media package or a
supported, reachable official player is needed before processing footage.


## Targeted homepage correction — 16 November 2026

Both `heroClips` and `moments` are empty. No real match footage was found in local project/attachment inventories or Git LFS. FFmpeg/ffprobe are available and yt-dlp was installed in an isolated tools environment after inspecting the suggested skill. The official RR YouTube channel metadata request returned cloud proxy HTTP 403; no video was downloaded. The legitimate official RR Dailymotion embeds return player HTML but show “This video cannot be played on this site” inside localhost, with all three clocks at zero. No reuse/rehosting/editing permission has been established.

Native playback, production-base-aware URLs, posters, crossfade, hidden/offscreen pause, reduced motion and failed-clip poster fallback were tested with explicitly synthetic QA patterns only. This is not RR footage verification. No portrait-card or external-link substitute is presented as a moments sequence. See `docs/qa/homepage-corrections/MEDIA_REQUIREMENTS.md` for evidence and the exact 3–6 authorized MP4 clips required.

## 18 November 2026 — opt-in official video fallback

The homepage's existing `RoyalsMoments` section now contains a **click-to-load embedded official Rajasthan Royals YouTube team film** when `approvedMoments` is empty. The source is [Class of '25: Signing Out](https://www.youtube.com/watch?v=kYym8oJ0Dvg), published as a Rajasthan Royals video. The embed is loaded from `youtube-nocookie.com` only after a visitor presses Play; a link to the original source is always visible.

This does **not** clear or replace the requested three-to-six-clip match-highlights montage behind the homepage hero. `heroClips` and `moments` still contain no downloadable, rehostable licensed match video. The in-page YouTube embed may also be blocked if the rights owner disallows embedding in the visitor's region. Never mislabel the team film as live IPL highlights, extract its footage, strip logos, or use it in a self-hosted montage without separate permission.

The approved-media manifest remains the publication authority for licensed local media. If valid footage is later supplied, the normal `CinematicVideo` scene takes precedence over the official-embed fallback.
