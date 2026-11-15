# KHILADI cricket footage - current status

The live hero currently has **no approved in-page RR video assets**.
`khiladi/frontend/src/config/approved-media.json` is the production authority.
Official external links are a disclosed fallback, not completion of the montage.

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
