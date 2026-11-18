# Implementation status

Scope: local branch `reference-replication/local`, based on preserved checkpoint `523d77e07fccfacf40af8dc4ebd10d109c60f431`. GitHub Pages configuration, workflow, hosting and remote branches are excluded by the user's latest instruction. No deployment is claimed.

| Interaction / requirement | Status | Evidence / limitations |
|---|---|---|
| All 16 recordings reviewed and indexed | Implemented and verified | 518 sampled frames, 16 complete storyboards; mixed-site boundaries in CLIP_INDEX; annotations and metadata. Overview sampling is approximately 0.5s, not every source frame. |
| Hero chapter controls, thumbnails, independent silhouette, right stories | Implemented but parity incomplete | Functional browser tests and matched Delta comparison; actual RR background footage blocked. |
| Names-only comfortable seamless 27-player parade | Implemented and verified | 243-second loop; identical groups, keyboard focus and route cleanup tests. |
| Individual heritage photo entrances/hover captions/reverse | Implemented but parity incomplete | Actual private-review archive and desktop/mobile recording; trophy subject and cleared production imagery missing. |
| Journey/hotspots/portrait row/editorial bridge/notes | Implemented but parity incomplete | Real Chromium continuous homepage and six viewport captures. Original photo sources and reference content differ. |
| Discovery drift / real quiz | Implemented and verified | Eight independent transparent-figure drifts, reverse-scroll checks; continuous recording calls real recommendation API. Exact reference timing is not claimed. |
| CRL letter assembly/depth/takeover, every refresh | Implemented but parity incomplete | Five full reload tests; Escape and reduced-motion checks; matched CRL comparison. Seven-letter geometry differs. |
| Non-home mixed typography, image preview and underline | Implemented but parity incomplete | Pointer movement and reset test; matched Extrafazant comparison. |
| Cyera thin-surface → tall card → image → content, reverse close | Implemented but parity incomplete | Selection-origin measurement, image/text stages, rapid-close and keyboard focus/scroll tests; matched video. Native page background replaces source's 3D world. |
| AUGE diamond/context label/local media translation/track | Implemented but parity incomplete | Pointer/label reset and route cleanup, matched AUGE video; no unverified shader claim. |
| Silhouette-only transparent logo across shared placements | Implemented and verified | Existing clean original symbol viewport reused; no generated halos or visible KHILADI logo text. |
| Real in-page RR video playback | Blocked with evidence | Official embed HTML returns 200, but browser player says “This video cannot be played on this site”; all three video clocks remain zero. See official-browser-check.json, official-localhost-playback.json, official-playback-attempt.webm and official-media-0/1/2.png. No restriction bypass or video download performed. |
| Authentic 2008 title-lift centrepiece | Blocked with evidence | No cleared title-lift asset supplied; existing Warne archive is explicitly not a substitute for the requested subject. Previous sourcing evidence: ../phase2/trophy-source-checks.json. |
| Sam Curran, Dasun Shanaka, Emanjot Singh Chahal portraits | Blocked with evidence | Official IPL primary profile views render generic player art, captured in official-media-3/4/5.png. No third-party or wrong-player substitution; redistribution/editing permission still missing. |
| Canonical data, model, rankings, exports, backend | Implemented and verified (preserved) | Six integrity tests pass; all 17 tracked backend/data files byte-identical to the checkpoint; canonical 1,217 players and 27 RR records. |
| GitHub Pages / cloud public deployment | Not implemented (excluded by user) | No workflow/configuration changes or publish/push action in this task. |

## Evidence files

- `homepage-continuous.webm`: uninterrupted desktop homepage, chapter changes, all sections, discovery and reverse scroll.
- `mobile-walkthrough.webm`: homepage/menu/database/profile on 390×844 touch viewport.
- `official-playback-attempt.webm`: actual local-origin embed attempt showing the domain restriction; this is failed playback evidence, not a working film.
- `player-discovery.webm`: real quiz → recommendations → selected profile → reverse close.
- `cyera-profile.webm`: surface/image/text/evidence/close stages, plus intermediate PNGs.
- `delta-comparison.mp4`, `crl-comparison.mp4`, `extrafazant-comparison.mp4`, `cyera-comparison.mp4`, `auge-comparison.mp4`: paired supplied references and native-size browser captures.
- `*-side-by-side.png`, `*-overlay.png`, `*-annotated-source.png`: diagnostic comparison stills and labelled source geometry.
- `viewport-checks.json`, `browser-errors.json`, `performance.json`, `functional-results.json`: actual run results. Performance is cloud headless requestAnimationFrame timing, not a hardware-independent FPS guarantee.

Protected source recordings, private review images and generated QA videos/stills are ignored by Git and remain local. No original competition pack, secrets or uncleared media were added to application production assets. Production continues to use the existing approved-media manifest and deliberate fallbacks.

## Reproduction

Run FastAPI using `python -m uvicorn main:app --host 127.0.0.1 --port 8010` from `khiladi/backend`; run `npm run dev -- --host 0.0.0.0` from `khiladi/frontend`. Then run `npm --prefix khiladi/frontend test`, `python scripts/test_takeover.py` and `npm --prefix khiladi/frontend run build`.

With the original uploaded clips downloaded to the paths in `clip-metadata.json`, run `python scripts/qa/capture_reference_replication.py`, `python scripts/qa/capture_matched_references.py`, then `python scripts/qa/compare_reference_replication.py`. These scripts require Python Playwright, Chromium, Pillow, FFmpeg and the local private review assets for photographic captures.

See `handoff.json` for the implementation commit, modified files, integrity checks and final verification summary.
