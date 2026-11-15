# KHILADI Codex takeover

The working frontend has been rebuilt in the existing checkout. This is a functional implementation milestone, **not completion of the exact-reference brief**. No push, deployment, environment-draft update or publication has been performed.

## Run locally

From the repository root:

```bash
python -m venv .venv
.venv/bin/pip install -r khiladi/backend/requirements.txt
.venv/bin/python -m uvicorn main:app --app-dir khiladi/backend --host 127.0.0.1 --port 8010
```

In a second terminal:

```bash
cd khiladi/frontend
npm ci
npm run dev -- --host 0.0.0.0
```

Optional private photo review: run `python scripts/fetch_review_media.py` from the repository root before starting Vite. Those protected review assets are ignored by Git; without them the archive shows its explicit media gap.

The frontend uses port 3000 and proxies `/api` to 8010. The current cloud instance already has the Python runtime dependencies; the pinned requirement versions were read from that runtime. No raw source CSVs are copied into the web bundle.

Validation:

```bash
cd khiladi/frontend
npm run build
npm test
npm run test:data
npm run qa:capture
```

The Playwright configuration uses `/usr/bin/chromium`; override `CHROMIUM_PATH` on another machine. Python Playwright plus its FFmpeg helper are needed only for `qa:capture`. Install those separately with `python -m pip install playwright` and `python -m playwright install ffmpeg`. FFmpeg/ffprobe are used to inspect evidence recordings. Use the existing isolated checkout; do not create a worktree unless explicitly requested.

## Preserved checkpoint and data

`checkpoint/pre-codex-takeover` points to `a12c132a8c52c4211a1812c23d8c7485f9194d94`. Backend application code, the pressure-model script, source Data Pack and all stored model/ranking exports are unchanged. Six regression checks verify canonical IDs, uniqueness, latest RR pack season, both top-ten JSON exports, nine quiz role/phase combinations, and API/profile contracts. Model backtesting and mathematical validity are not claimed by these regression checks.

## Replaced modules

- Homepage, loader, menu, footer and CTA family.
- Single cursor controller; character motion and scoped image displacement.
- Layered accessible player profile with real evidence behind disclosure.
- Player discovery and squad planning, with real fields and user-entered hypothetical bids.
- Methodology copy now describes the actual inherited heuristic, including limitations, rather than claiming a calibrated win-probability model.
- Shared loading, formatting, player descriptions and media gates.

Existing rankings, match replay, comparison, batting, bowling and overview routes remain accessible. Wrong field aliases (`pressure_balls`, `pressure_sr`, `pressure_score`) have been corrected to actual export fields. The overview labels its budget as an editable scenario. No prices, match counts, confidence estimates or fallback performance scores are invented in the replaced modules.

## Media and original-reference blockers

The reference-recording directory contains only README.txt: no source MP4s were committed. Existing webms depict the rejected site. The five original recordings are required to finish exact frame/timing comparisons.

Three official RR video pages were located and verified, covering Jaiswal batting, Archer's first-ball wicket, and Parag's catch. Standard Dailymotion embedding is Forbidden in this runtime; the official geo player reports “This video cannot be played on this site.” The interface links to the official source pages instead of showing generic footage or a broken embed. A locally hosted multishot hero pipeline is implemented, but it requires permission-cleared footage.

Real Warne archive photographs were found on the official Royals site for private visual review. They are not the requested 2008 trophy-lift photograph. That specific photograph remains outstanding. The old generated “archival” graphics and four generated player jerseys are no longer represented as real photographs. All 23 inherited portrait image paths were independently matched to live official IPL squad/profile links. Yashasvi’s official transparent original was additionally located for private review. Sam Curran, Dasun Shanaka and Emanjot Singh Chahal still have deliberate initials fallbacks; an official profile alone does not establish an available photograph.

The inherited 23-image portrait manifest's “editorial use” strings are not evidence of a license. Live IPL source verification is recorded separately from rights. Production use of protected images is disabled by default. The production build removes the inherited `assets/portraits`, `assets/cutouts`, and `assets/archival` directories from its output. Dev-only photo review uses a whitelisted middleware endpoint and is excluded from preview/production. Set `VITE_MEDIA_REVIEW=false` for the no-protected-media development view.

Cleared media can be registered in `src/config/approved-media.json`: `crest` is an approved URL; `heroClips` and `archive` contain `{src, source, permission, caption}`; `portraits` is keyed by canonical player ID with the same asset fields. Approved local files should live in a separate `public/assets/approved` directory. Do not add an asset until its permission covers the intended use and transformations. The current empty manifest is deliberate; the production visual experience is therefore incomplete.

Cyera returned “Your browser is not supported” even after enabling software WebGL2. The layered reveal is implemented but exact Cyera matching remains unverified. CRL/Delta/AUGE/Extrafazant adaptations and remaining differences are listed in `CODEX_REFERENCE_MAP.md`.

## Evidence

`python scripts/build_review_artifacts.py` regenerates the scene-indexed excerpts and reference comparison after a fresh capture; this optional helper uses Pillow, NumPy and Matplotlib in addition to FFmpeg.

See `qa/reference-fidelity/` for the fresh desktop/mobile/tablet walkthroughs, loader states, hover/card/quiz screenshots, reference videos and captures, provenance records, Playwright result JSON, frame intervals and long-task measurements. The 25 FPS encoding of recordings is independent of application frame timing. Performance is measured with requestAnimationFrame intervals during scrolling/pointer updates in headless cloud Chromium; it does not establish sustained 60 FPS on user hardware.

No audit PDF or self-assigned fidelity score is produced. Rights, footage, trophy imagery and missing original recordings prevent a full completion claim.

## Verified results in this instance

Production build passed. All 16 browser/accessibility tests passed (none skipped), all 6 data/API regression checks passed, and six production routes passed smoke checks without broken imagery or review-media leakage. The backend emits an existing Pydantic deprecation warning; its code was preserved. Final frame sampling measured median 16.7 ms, mean 17.1 ms, and 95th percentile 23.6 ms; 3 measured intervals exceeded 33.34 ms. See raw performance.json for the scope and limitations.
