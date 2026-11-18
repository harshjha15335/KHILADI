> **Final delivery update —18 November2026:** Production resumed and the complete reel is now available. Read [film/FINAL_DELIVERY.md](film/FINAL_DELIVERY.md) for the MP4, editable sources, checksums and rebuild instructions. The pause/status text below is the preserved historical checkpoint.

# CODEX HANDOFF — KHILADI animated research film

Prepared 2026-11-17 from the available conversation, local sources, logs, media, and target repository history. **PRODUCTION IS PAUSED at the user's explicit request.** This handoff and Git push are authorized; rendering, voice regeneration, and film assembly are not resumed. The full reel is NOT finished.

## Repository and exact checkpoint

- Repository: https://github.com/harshjha15335/KHILADI
- Delivery branch: `codex/khiladi-cloud-handoff`.
- Existing website/main baseline: `523d77e07fccfacf40af8dc4ebd10d109c60f431`.
- Exact film implementation/assets snapshot commit: **`2db511bf922824ad3590bd8a700e9e4715b96fdb`**.
- This handoff is committed in a subsequent documentation commit on the same branch. The snapshot SHA deliberately identifies the complete preserved implementation; a file cannot contain its own Git commit SHA. Run `git rev-parse HEAD` for the final documentation delivery commit, and `git log -2 --oneline` to see both.
- No website code changes, merge to main, deployment, or publication of private source media are requested by this handoff. Existing Pages workflow does not deploy this new branch.

Original Windows production workspace: `C:/Users/ranja/Documents/Codex/2026-11-16/master-character-style-lock-khiladi-animated`. It inherited an unrelated home-directory Git repository (`C:/Users/ranja`, ASTFLOW, main `589e712fd7e4ed7a00e7a548ff060ef7256e22ec`). **Never stage/push from that directory.** A clean isolated clone of the requested KHILADI repository was used at `work/khiladi-handoff-repo`. Production payload is isolated under `film/` to preserve the existing website.

## First actions in Codex Cloud — no rendering

Select this repository and branch in Cloud, or:

```sh
git clone --branch codex/khiladi-cloud-handoff https://github.com/harshjha15335/KHILADI.git
cd KHILADI
git status --short
git rev-parse HEAD
git show --no-patch 2db511bf922824ad3590bd8a700e9e4715b96fdb
cat AGENTS.md
cat film/AGENTS.md
python3 film/scripts/verify_snapshot.py
python3 film/scripts/rebase_paths.py --dry-run
python3 film/scripts/cloud_preflight.py
```

Remain paused until explicitly asked to resume. Read this document, `film/work/handoff-audit.md`, `film/docs/METHODOLOGY_FOR_FILM.md`, and `film/outputs/khiladi-story-and-scene-report.md` before changing production. Do not render the character from scratch or redo completed narration/plates. Asset hashes apply to the original migrated snapshot, BEFORE intentional Linux path changes.

Cloud environment setup (dependency installation only, no render): `bash film/scripts/cloud_setup.sh` creates `film/.venv` using `film/requirements-cloud.txt`. Alternatively create that venv manually and pip-install its requirements. Use the resulting Python for Pillow media verification. Run `film/.venv/bin/python film/scripts/verify_snapshot.py --media` after FFmpeg/ffprobe are available. Inspect the setup script before execution; package access depends on the selected Cloud environment's network configuration.

Official current environment guidance: https://learn.chatgpt.com/docs/environments/cloud-environments . Cloud supplies a separate workspace; local Windows files and tools do not automatically exist there. Hardware/GPU, graphics support and network access must be inspected, not assumed. No Linux render was tested in this handoff.

## User intent and implementation history

The film follows an ordinary cricket fan: imaginary IPL selections in the back of a school notebook, later the Rajasthan Royals SupeRR Selector hackathon, then research into pre-ball pressure, contextual expectation, shrinkage, uncertainty, failed validation, and the final qualified shortlist. The user supplied a detailed completed methodology; it is the numerical authority for the film. This is an original cricket story/narration/settings using the reference's visual language.

Visual authority is the supplied Brawn GP reel and screenshot: oversized rounded dimensional head, compact white bean torso, extremely thin black limbs, heavy outlines, irregular scribbled expressions, warm dimensional environments, quick puppet timing. Keep one consistent rig/base geometry across angles and scenes. Do not revert to generic educational/cartoon aesthetics, perfect symmetrical eyes or floating lecture boards.

Chronology and decisions:

1. Early school/classroom design drifted into a generic mascot; the user specifically rejected scary ring eyes, stiff brows, cute educational expressions, long legs and collar details. A softer crescent-eye iteration also missed the reference.
2. V2 five-expression generated image was judged about 75–80% similar by the user: useful direction, NOT final approval and NOT an actual rig.
3. V3 rebuilt the usable Blender character with rough curves, dimensional grain/shading, true 43-degree three-quarter perspective, dark flat cap, plain white bean and compact limbs. Head approximately 1.66 x 1.58, torso 1.02 x 1.04, visible legs 0.64; torso/head height about .658 and legs/head about .405. Retained source is `film/outputs/khiladi-master-v3.blend`.
4. V3 produced the native 1080x1920, 30fps, 240-frame/8-second silent movement test. Appearance was provisionally accepted; the user's review criticized static acting. Static sheets are not proof of motion quality.
5. V4 requested active reading/page tracking, snap realization at 2–3s, full-body frustration 3–5s, rhythmic exaggerated laugh 5–7s, recovery/pause 7–8s. It reuses V3 geometry. `v4_debug.blend` is an intermediate, not an approved V4 master. The standalone fixed-camera bounds test failed; no completed V4 movie exists.
6. User explicitly said proceed with full-film production and leave the standalone tests. Do NOT impose another standalone V4 approval gate. Use normal integrated shot review once production is explicitly resumed.
7. Full-film pipeline uses V3 look plus V4 acting, six reusable transparent motion cycles, perspective Blender environment plates and FFmpeg layering/editorial pushes. Seven editable environment scenes and 21 native plates completed before pause; reading cycle has 43/48 corrected frames. No final film exported.
8. User asked for exact scene construction/narration/reference matching, then explicitly paused production. The scene report is preserved verbatim below. No rendering occurred during this handoff.

Initial suggestions in attached documents (Scenario/Remotion/Grease Pencil etc.) are not evidence those systems were implemented. Actual face details use Blender curves/meshes, not a completed Grease Pencil system. No Runway speech/media model was available in the observed free configuration; do not purchase or retry paid services without authorization. Current narration is original TTS, not a clone of the reference narrator.

## What is preserved, completed and incomplete

- `film/outputs/khiladi-master-v3.blend`: retained appearance and original 8s timeline. `character-validation-v2.png` is an image-only candidate; `character-validation-v3.png` is actual Blender states. `character-motion-test-v3.mp4` and `motion-timing-contact-v3.png` retain review context.
- `film/work/animate_character_v4.py`, `v4_debug.blend`: stronger acting intermediate; standalone bounds failure remains documented.
- `film/work/reel_actors.py`: corrected film actor renderer. Foot correction exists HERE, not in the standalone V4 path. `film/outputs/khiladi-character-production.blend` is corrected reading setup.
- `film/work/reel_sets.py`, `film/outputs/khiladi-environments.blend`: perspective classroom/analyst/stadium/war-room construction and seven saved scene setups, three cameras each.
- `film/work/reel/plates/`: exactly 21 fully decoded RGB1080x1920 plates, scenes01–07, three cuts each. These are backgrounds, not finished shots. Scene06 framing still requires correction.
- `film/work/reel/actors_raw_corrected/reading/`: exactly contiguous frame_0001.png–frame_0043.png, fully decoded RGBA1308x2324. Needs48; no other corrected loops completed. Total six loops require264frames: reading48,thinking48,discovery36,frustration48,laugh48,neutral36.
- `film/work/story.json`: exact16scenes/narration. `timing.json`:6290frames,209.666667seconds,30fps. Scenes03–15 research/validation/shortlist occupy177.1333seconds (84.5%).
- `film/work/narration/`:16existingMP3s and16JSONL word-boundary files. Voice en-IN-PrabhatNeural, rate+9%,pitch+2Hz. Preserve them and timing; do not rerun network TTS to repair paths. No phoneme-perfect lip-sync is required; character reacts to narrator.
- `film/work/captions/`:16ASS files. Typography and final burn-in need review, not assumed complete.
- `film/work/reel/plates.json`:48planned cut entries, only21exist. `actors.json` is STALE and points at obsolete actors_raw; must not feed final compositor.
- `film/data/accepted_primary_rankings.csv`:20supplied primary rankings, exposure, bootstrap rates and format mix; unknown CIs/IDs are not invented. `film/docs/METHODOLOGY_FOR_FILM.md` preserves essential research definitions and limitations.
- `film/ASSET_MANIFEST.json`:SHA256/size inventory of182payload files. Old rejected builds, obsolete render caches, Windows venv/installers, source competition datasets and redundant .blend1 files are intentionally omitted.

## Reference media and privacy boundary

The repository is public. Root AGENTS.md prohibits publicly shipping unlicensed derived images/re-edited broadcast clips and restricted competition data. Original reference video/screenshot/contact sheets and the three pasted source reviews were packaged separately as **KHILADI_CLOUD_PRIVATE_REFERENCES.zip**, available only in the original local `outputs/` directory. `film/private-reference-manifest.json` records original source archive paths, sizes and SHA256. Privately attach this ZIP to the Cloud task if reference review is needed; extract at repository root to ignored `film/private/`. Do not commit it. Missing private references blocks a fresh authoritative shot-by-shot reference audit, not reading/reusing the approved character asset.

Source original video: `C:/Users/ranja/Downloads/Recording 2026-11-16 202305.mp4`; original screenshot: `C:/Users/ranja/AppData/Local/Temp/codex-clipboard-e80ae52e-4e2d-42ae-b8d9-6a0da5bab39c.png`. These absolute paths are historical provenance, not Cloud paths. User review texts are preserved privately. No private six-file competition pack was copied or published.

## Technical decisions and portability

Observed Windows runtime: Python3.12.10, Blender5.3.0 hash02f0899d78e3, Pillow13.0.0,edge-tts7.3.1,aiohttp3.14.5,numpy2.5.5; FFmpeg9.0.2 Gyan full build. Cloud equivalents are unverified. Blender scripts require Blender's own Python/bpy; never pip-install bpy as a replacement in the ordinary venv.

Official Linux Blender5.3 download URL responded HTTP200 during handoff: https://download.blender.org/release/Blender5.3/blender-5.3.0-linux-x64.tar.xz (~407MB). Download only if needed, verify against the official release checksum before execution, and inspect graphics availability. No Linux binary was downloaded here. EEVEE requires suitable headless graphics/EGL/OpenGL; software/hardware support is an open environment dependency. Original IrisXe1GB render throughput was about4–7s/frame for the V3 test (~20m40s total); do not promise Cloud performance.

- Engine is `BLENDER_EEVEE`; `BLENDER_EEVEE_NEXT` failed with installed5.3. Do not silently switch to Workbench, which changes style and inverted-hull appearance.
- Initial head mesh winding was inward. Fix uses outward quad order and normal update before hull expansion; reversed backface-culled outline hulls, not a camera-facing illustration hack. V3 audit reports outward normals, expanded hull and stable attachments.
- Scribble eye corners use VECTOR handles where AUTO rounded the expression; varied curve radius/shape retain imperfection. Hidden upper-leg curves extend +.10Z into body to avoid hip gaps without changing rest bone lengths.
- V4 disables inherited scale on head/arms, animates body squash .945–1.04, root/IK/head/brows/jaw. Its original foot countertransform omitted V3 rest translations, collapsing feet toward origin. Film actor script restores V3 rest foot world matrices, detaches feet and clears their animation; sampled shin ends near x±.265,y-.02,z.1274. Old actors_raw must NEVER be reused.
- Bounds scans first hit a Blender collection slicing issue, then unreliable curve evaluated bounding boxes; control/handle bounds and conservative head AABB still failed the standalone fixed65mm camera even at Y-12. The debug save precedes successful audit/master-save assertions. Production actor uses its own50mm camera Y-11.4. No claim of a passed standalone V4 audit.
- Environment accumulation uses staging.blend then replacement because overwriting an appended active library failed. Preserve that workaround.
- Windows Segoe Print path is optional in reel_sets; Linux falls back to Bfont, changing lettering. ASS asks for Arial. Provide licensed portable fonts or approved substitutes; review wrapping/style. Do not copy proprietary Windows font binaries publicly.
- Rebase timing/manifests with `python film/scripts/rebase_paths.py --apply` ONLY after baseline verification; it backs up metadata. Dry run identifies16timing+48plate+2actor paths. It does not fix stale actor entries or build the missing merged layout. Inspect .blend external resources separately.
- `verify_film.py` and any finalize scripts with literal `NUL` need `os.devnull`/portable null output on Linux. Inspect paths and case. Windows installers/venv cannot migrate.
- Required FFmpeg capabilities:libx264,AAC,qtrle/ARGB,subtitles/libass,zoompan,overlay,loudnorm. `cloud_preflight.py` checks tools/capabilities without rendering; no selected Cloud machine has passed a render smoke check yet.

## Resume sequence, blockers and completion criteria

Only after an explicit user instruction to resume production:

1. Verify snapshot, install/check toolchain, restore private references for comparison, rebase paths, choose licensed fonts, make null-device paths portable. Check EEVEE on actual Cloud environment with a minimal targeted diagnostic before committing to full rendering; do not replace approved style if graphics fails.
2. Repair cache validation: current actor skips by count/existence without decode/config checks; plates skip existence and lack source fingerprints. Require contiguous decoded images and matching settings. Invalidate changed shots explicitly. Do not throw away unchanged approved caches.
3. Widen scene06 balance close-up to keep both pans visible; match blue desk notebook to gray held notebook. Add full top-ten report pages for both roles from supplied CSV (current physical cards onlytop3). Saved unrendered scenes11–13 already fix first-innings Brier values,750RESAMPLES,D10/D20/D25.
4. Complete scenes08–16 plates and all six corrected actor loops. Review motion/foot grounding and reference likeness in integrated shots; no mandatory separate V4 approval test. First43reading frames remain reusable only if configuration unchanged.
5. Implement missing consistent RGBA crops over all frames in each loop with stable foot anchor and full motion bounds. Build NEW `film/work/reel/layout.json` with scenes plus loops mapping(directory,frame_count,width,height), actor placements fitted to actor_box. Neither current JSON is ready for compositor.
6. Adapt compositor away from obsolete default `work/layers/layout.json` and hardcoded `work/layer_clips`. Use new `work/reel/clip_cache` and configuration-aware invalidation. Add grounded soft contact shadows and prop foreground occlusion; current cuts have null foreground/empty graphics. Metadata/code changes currently can reuse stale clips.
7. Review existing captions against narration, font fallback, face/prop overlap, wrapping and highlighted words. Preserve voice/timing unless deliberately revising narration. Compose at native1080x1920,30fps; existing intended settings H264CRF17,yuv420p,AAC192k48k,faststart,voice normalize about-16LUFS/-1.5dBpeak. Final total6290frames≈209.667s; verify actual streams and sync.
8. Audit EVERY CUT against original reel for silhouette, consistent facial geometry, perspective, expressive timing, smooth intentional puppet snaps, grounding, camera language and captions. Existing verify_film samples only16scene midpoints and cannot establish full visual quality. Decode full final file and inspect transitions/audio. Deliver editable final blend/layout, finalMP4 and QA results. Do not claim final completion from render exit code alone.

Future commands (NOT authorized while paused; repair prerequisites above first):

```sh
cd film
REEL_SCENES=08_adjust,09_shrink,10_delta,11_holdout,12_uncertainty,13_sensitivity,14_shortlist,15_replay,16_end blender -b --python work/reel_sets.py
REEL_POSES=reading,thinking,discovery,frustration,laugh,neutral blender -b --python work/reel_actors.py
.venv/bin/python work/assemble_film.py --captions-only
# The following layout is REQUIRED BUT NOT IMPLEMENTED yet:
.venv/bin/python work/composite_layers.py --metadata work/reel/layout.json
.venv/bin/python work/verify_film.py
```

Use `REEL_FORCE=1` only for intentionally invalidated plate renders. `REEL_KEEP_METADATA=1` preserves metadata during selected/draft runs; final merged layout must remain separate. Do not run legacy render_film/render_layers or rebuild V1/V2 as shortcuts.

## Verification and limitations of this handoff

Performed now: SHA256 verification of182payloadfiles; full Pillow decoding of21plates and43corrected actor frames with expected modes/dimensions; ffprobe counted V3 test240frames,1080x1920,30fps; Python compileall passed for copied scripts; rebase dry run passed without mutation. Full V3 video decoding had also passed the prior retained technical audit. These checks do not establish final-film or Linux graphics quality.

Historical V3 audits:11bones, fixed geometry, outward head normals, expanded hull, planted feet and notebook-relative drift≈2.2e-7 across240frames. StandaloneV4 bounds failed. Corrected film actor shin positions only sampled, not a full completed motion audit. No final-film export/test exists. No renders or production edits executed for this handoff.

Existing website tests are historical only: docs/PHASE2_HANDOFF.md records29browser tests,6backend/data checks and production build. They were NOT rerun here because website code is untouched. The user's research claim of41replay checks/22CSV outputs/20rankings is distinct from website and character tests; analytical pipeline was not independently run here.

## Existing website context — preserve separately

This repository already contains a React19/Vite6.1/TypeScript5.7 frontend with GSAP/Playwright and FastAPI backend. Review root AGENTS.md, docs/CODEX_TAKEOVER.md, docs/PHASE2_HANDOFF.md, docs/CODEX_REFERENCE_MAP.md, docs/handoff/MASTER_ENGINEERING_DIRECTIVE.md, FULL_PROJECT_TAKEOVER.md, LOCAL_WINDOWS_SETUP.md, LOCAL_WINDOWS.md and docs/GITHUB_PAGES.md when touching the app. Recent main history:523d77e logo;6c8f8df Windows/Pages setup;955dca9 phase2 motion/pressure labels;7710aa2 briefs/handoff;f7e2dbc frontend rebuild.

Root rules require immutable canonical player IDs from private mapping, official IPL portrait provenance/rights, no fabricated statistics or roster imports, restricted-data protection and no paid services/deployment without authorization. Existing website uses an older heuristic pressure threshold1.8; do NOT confuse it with the later user-supplied D20 method/rankings for the film. Website integration is deferred.

Website-only commands if later separately requested:

```sh
python3 -m venv .venv
.venv/bin/pip install -r khiladi/backend/requirements.txt
.venv/bin/python -m uvicorn main:app --app-dir khiladi/backend --host 127.0.0.1 --port 8010
# separate terminal
cd khiladi/frontend
npm ci
npm run dev -- --host 0.0.0.0
npm test
npm run build
# repository root
python scripts/test_takeover.py
```

## Exact current storyboard and narration

The following is the preserved current report. It describes the intended finished film, not proof that its shots are complete.

# KHILADI — Current story, narration and production plan

**Status: production paused at the user’s request. No rendering or film assembly is continuing.**

This document records the current storyboard and already-generated narration, not a finished or approved full film. Planned duration: **3:29.67**, 16 story scenes and approximately 48 editorial cuts. Scenes 3–15 occupy **2:57.13 (84.5%)** and cover research, validation and the shortlist.

The story follows a cricket fan from imaginary IPL team selection in a school notebook to evidence-based player evaluation after the Rajasthan Royals hackathon. The dramatic progression is curiosity → messy data → a pressure definition → fair expectations → small-sample corrections → failed or uncertain validation → a qualified shortlist. The ending asks what the evidence supports, rather than claiming a proven future clutch predictor.

The protagonist retains the provisionally approved V3 appearance. V4 work changes acting and rig behaviour, not hair, clothes, head design or facial drawing style. The character reacts to the narrator; precise speech lip-sync is not the goal.

## Scene-by-scene plan and exact current narration

### 01. Notebook — 0:00.00–0:10.13

**Build and acting:** A mischievous cricket fan in a layered school classroom: desks, classmates made from the same base model, window light and scattered books. The notebook close-up contains school sums beside a handwritten IPL XI. The hero looks down, tracks the page, adjusts the notebook and gives a suspicious sideways glance.

**Camera/reference approach:** Wide classroom → actual notebook close-up → character reaction. This follows the reference’s environmental setup, prop cutaway and quick personality beat, without an oversized lesson board.

**Exact narration:**

> In school, the back of my notebook had an IPL team. The front had mathematics. The team got considerably more attention.

### 02. Hackathon — 0:10.13–0:21.70

**Build and acting:** Jump forward to a dense analyst workspace. The school notebook now sits among a laptop, research papers, coffee and a Rajasthan Royals SupeRR Selector entry/lanyard card. The hero snaps from casual interest to surprise and determination.

**Camera/reference approach:** Match the notebook across the time jump; cut to the hackathon card and back to a recoil/realization. The setting changes while the character design stays fixed.

**Exact narration:**

> Years later, the Rajasthan Royals hackathon brought that notebook back. This time, I wanted evidence. Who actually performs when the game gets difficult?

### 03. Clean — 0:21.70–0:35.77

**Build and acting:** Physical sorting trays and match-event cards labeled 200,999 raw and 194,509 eligible. Coloured cards stand for extras, dismissals and exclusions; no restricted raw delivery rows are reproduced. The hero reacts to the mess, then inspects the sorted evidence.

**Camera/reference approach:** Busy workspace wide → tray/count close-up → frustrated-to-focused reaction. Data cleaning becomes a visual obstacle, like a practical problem in the reference garage.

**Exact narration:**

> First obstacle: two hundred thousand delivery events. Wides. No-balls. Run-outs. Rain. Before judging a player, I had to reconstruct the match correctly.

### 04. Preball — 0:35.77–0:49.90

**Build and acting:** A dimensional cricket stadium with pitch, wickets, seats and floodlights. A clearly illustrative pre-ball situation shows 28 needed from 12 and required rate 14. The ball remains separate from the pre-event state.

**Camera/reference approach:** Stadium establishing shot → pitch/pre-ball detail → skeptical hero reaction. The visual distinction is what was known before the ball versus what happened afterwards.

**Exact narration:**

> Then I froze time before every ball. Score. Wickets. Balls remaining. No peeking at the six that happened next. That would be cheating, with a spreadsheet.

### 05. Pressure — 0:49.90–1:05.00

**Build and acting:** Contrast a demanding but effectively lost chase—39 runs per over—with a consequential chase needing 2 off 1. These are scoreboard situations, not invented named player performances.

**Camera/reference approach:** Use scoreboard and pitch cutaways with an exaggerated reaction between them. This is a setup/reversal/punchline beat, rather than a slide defining pressure.

**Exact narration:**

> But difficult doesn't always mean consequential. Thirty-nine runs an over? Terrifying. Also, probably over. Two needed off one? Now the next ball can change everything.

### 06. Hybrid — 1:05.00–1:17.30

**Build and acting:** A physical balance with A and B pans, representing scoreboard difficulty and win-probability leverage. A small TOP 20% label belongs to the research prop. The narrative states percentile combination and selection within innings.

**Camera/reference approach:** Workroom → close-up of the balance → aha reaction. The reference’s idea/revelation beat becomes an original cricket-analysis prop.

**Exact narration:**

> So I combined scoreboard difficulty with win-probability leverage, using context-relative percentiles. The primary definition selected the top twenty percent within each innings.

### 07. Expected — 1:17.30–1:32.23

**Build and acting:** An actual-versus-expected comparison on the research desk and laptop. Runs, survival, runs prevented and credited wickets are kept conceptually distinct. Any example bar heights are explicitly illustrative.

**Camera/reference approach:** Close-up of the working comparison and return to the character questioning it. The comparison explains the logic without claiming the illustration is an actual player estimate.

**Exact narration:**

> Next question: better than what? I estimated expected runs and dismissal risk. Batters earned credit for extra runs and survival. Bowlers, for runs prevented and credited wickets.

### 08. Adjust — 1:32.23–1:45.17

**Build and acting:** Three physical assumption cards: 10, 15 and 20 runs per wicket. Fifteen is the primary declared assumption; the others represent sensitivity checks. Era/opposition research pages remain part of the working desk.

**Camera/reference approach:** Desk detail → assumption-card close-up → thoughtful reaction. Treat the model choice as a decision being examined, not a universal cricket fact.

**Exact narration:**

> I adjusted for scoring eras and opposition. Then combined runs and wickets with a declared assumption: fifteen runs per wicket. And checked ten and twenty too.

### 09. Shrink — 1:45.17–1:58.33

**Build and acting:** Unequal evidence stacks marked 25 and 400, with estimate markers and a common MEAN rail. This illustrates exposure and shrinkage; it does not depict two named players or exact fitted shrinkage values.

**Camera/reference approach:** Tall-versus-small stack contrast → mean/estimate detail → an overconfident reaction turning doubtful. The visual joke follows the voice’s “enormous confidence” line.

**Exact narration:**

> Then the small samples arrived, wearing enormous confidence. Twenty-five pressure events are not four hundred. Empirical Bayes pulled weakly supported estimates toward the average.

### 10. Delta — 1:58.33–2:11.13

**Build and acting:** Separate folders labelled QUALITY and DELTA, with research pages kept apart. The hero compares them, then reacts to the lack of repeatable bowling delta and the tiny batting gains.

**Camera/reference approach:** Two clearly separated physical objects replace a generic “clutch” meter. The reaction supplies the setback in the research story.

**Exact narration:**

> And performing well under pressure isn't the same as improving because of pressure. Bowling showed no validated repeatable pressure delta. The batting delta gains were tiny.

### 11. Holdout — 2:11.13–2:25.60

**Build and acting:** A held-out 2026 calendar and validation printout. The saved source includes first-innings WP Brier values 0.2559 versus 0.2524 for the baseline. The voice addresses batting’s absent positive forward signal and the unestablished bowling-economy advantage.

**Camera/reference approach:** Calendar/test evidence close-up → disappointed or skeptical whole-body reaction. This is a genuine challenge to the protagonist’s hypothesis, not a victory montage.

**Exact narration:**

> The unseen twenty-twenty-six season challenged my story. Batting quality showed no positive predictive relationship. Bowling looked promising, but an advantage over ordinary economy wasn't established.

### 12. Uncertainty — 2:25.60–2:40.67

**Build and acting:** Match cards and a research printout illustrating bootstrap rank uncertainty. The tray is labelled 750 RESAMPLES. The histogram is visibly marked ILLUSTRATIVE; no simulated individual-player interval is fabricated.

**Camera/reference approach:** Cards → illustrative rank-distribution close-up → cautious reaction. Make uncertainty tangible while keeping historical stability separate from future prediction.

**Exact narration:**

> So I resampled whole matches, seven hundred and fifty times. Confidence intervals. Rank distributions. A top-ten bootstrap rate measures historical stability. It isn't a prophecy.

### 13. Sensitivity — 2:40.67–2:53.27

**Build and acting:** Tipping shortlist cards and alternative pressure-definition labels D10, D20 and D25. The visual metaphor represents sensitivity; the narration gives the supplied severe best-season-removal result.

**Camera/reference approach:** Working shortlist → assumption-card close-up → frustrated reaction to the moving answer. Exact alternative player orders will not be invented for the animation.

**Exact narration:**

> Change the pressure definition, and the shortlist changes. Remove a player's best season, and nine names leave each top ten. Those weren't details to hide.

### 14. Shortlist — 2:53.27–3:08.23

**Build and acting:** An auction/research table with accepted primary shortlist cards. Current props show Buttler, Abhishek, Pooran and Bumrah, Narine, Abrar. The intended finished report pages carry the accepted top-ten lists for both roles, with exposure, uncertainty and format context; those full pages still need to be added.

**Camera/reference approach:** War-room establishing shot → player/evidence close-up → measured reaction. This is a qualified shortlist, not a promise of future IPL or psychological clutch success.

**Exact narration:**

> The primary lists put Jos Buttler and Jasprit Bumrah first. But every name needs its exposure, uncertainty and format mix. T-twenty international evidence isn't automatically IPL evidence.

### 15. Replay — 3:08.23–3:18.83

**Build and acting:** A final Khiladi research report with 20/20 and 41 CHECKS, accompanied by verification ticks and reproducibility pages. The hero has a short relieved reaction, while the narration keeps statistical limitations intact.

**Camera/reference approach:** Report detail → verification cutaway → restrained celebration. A software replay passing does not erase weak predictive evidence.

**Exact narration:**

> Finally, the replay reproduced all twenty rankings and passed forty-one checks. The code repeated. The statistical limitations stayed.

### 16. End — 3:18.83–3:29.67

**Build and acting:** Return to the school-notebook motif, now beside the completed research report. End on a wry, reflective reaction and the Khiladi name/report. No invented website interface is included.

**Camera/reference approach:** Visual bookend to the opening. A short comedic settle lets the concluding question land rather than ending with a long product tour.

**Exact narration:**

> That notebook used to ask, who would I pick? Khiladi asks a better question. What does the evidence support... and how sure should I be?

## How the reference is being matched

| Reference characteristic | Khiladi implementation / check |
| --- | --- |
| Oversized dimensional head, compact white bean, ink outlines and thin limbs | Reuse the retained V3 mesh/material asset for the hero and base geometry for background students; no independently generated per-shot redesign. |
| Scribbled, asymmetrical facial reactions | Existing V3 curve drawings and mouth shapes, with controlled brow/eye/jaw animation. Keep angry/laughing shapes; avoid the rejected symmetrical crescent-eye mascot. |
| Energetic, slightly awkward puppet performance | Head pitch/yaw/roll, anticipation and overshoot, torso recoil, small temporary squash/stretch, shoulder reactions, knee flexion, page tracking and delayed arm settles. |
| Dimensional, layered locations | Perspective Blender environments, overlapping desks/props/classmates, warm directional lights, softer fill and grounded shadows; physical research props replace big explanatory boards. |
| Narrator-led setup, surprise and reaction | Continuous first-person narration; wide setup → prop/evidence close-up → character reaction. The 16 story sections are divided into approximately 48 cuts, rather than 16 long stationary shots. |
| Bold captions with selected yellow words | Timed short narration phrases, white bold text with a black outline and a yellow emphasized word; keep important props and faces outside the caption area. |
| Hybrid character/environment construction | Blender-built 3D environments and rig animation are rendered in layers and composited with editorial pushes. This is the actual production approach, not a claim that every finished shot is one continuously rendered 3D camera take. |

These are production rules and review criteria. They are not a numerical claim of perfect visual similarity. The final edit still needs shot-by-shot visual and motion review against the original reel.

## Scientific meaning retained

- Pressure is based on the pre-event state; the current ball outcome must not define its own pressure label.
- Difficulty and leverage are different. The primary hybrid selects the top 20% within innings; it does not force 20% of every phase to be pressure.
- Expected performance is contextual. Fifteen runs per wicket is a declared modelling assumption, tested against ten and twenty.
- Pressure quality and pressure delta remain separate. Bowling delta is not validated; batting delta gains are tiny.
- The 2026 batting result does not demonstrate positive predictive power. Bowling evidence is suggestive, with no established advantage over ordinary economy. First-innings WP weakness is also shown in the validation evidence.
- Bootstrap top-ten rates describe conditional historical ranking stability, not the probability of future IPL success. Resampling is by match, not by ball.
- Rankings depend on modelling choices and on influential matches/seasons. Pooled T20I evidence is not automatically IPL evidence.
- The stated data/results come from the methodology supplied in this chat. The raw six-file analytics pipeline is not being independently rerun as part of animation production.

## Current assets and remaining work

- Complete: the current 16-scene voice track, approximately 3:29.67, with word timing and caption text.
- Complete: retained V3 character asset, stronger V4 acting controls and the environment construction scripts.
- Rendered before the pause: 21 native environment PNGs, covering all three cuts of scenes 1–7. These are plates, not 21 finished film shots.
- Partially rendered: 43 corrected reading-action character frames. All production processes have been stopped.
- Remaining: other environment plates, remaining character-motion layers, prop continuity/framing fixes, final compositing, caption burn-in, narration/audio finishing and complete-film QA.
- Known framing item: widen scene 6’s balance close-up so both A/B pans remain inside frame. Match the desk notebook’s cover/appearance to the held notebook during compositing/continuity work.
- Saved source accuracy fixes for unrendered scenes 11–13: first-innings WP validation printout, 750 RESAMPLES, and D10/D20/D25.
- The full top-ten report pages still need to be added; current player-card props show only the top three in each role. The narrator names the two primary leaders, not all twenty players.
- Actual website footage remains deferred. When supplied and reinstated, the intended insertion is 3–5 seconds near the end; the current cut contains no fake website screen.

The full reel has **not** been assembled/exported yet. Production will remain paused until the user asks to resume.


## Detailed migration audit

# Cloud migration audit — 2026-11-17

Production remains PAUSED (`work/reel/PAUSED.md`). This audit only read source/logs/metadata and decoded existing PNGs. No Blender execution, rendering, film assembly, production edits, Git operations, or secret inspection occurred. The commands below are future resume instructions, not authorization to execute them.

## Verified local checkpoint

- `work/story.json`: 16 scenes. `work/timing.json`: 6,290 frames / 209.666667 seconds at 30 fps. There are 16 MP3s, 16 JSONL word-boundary files and 16 ASS caption files. Their existence/count was checked; audio contents and caption timing were not revalidated.
- All 21 `work/reel/plates/*.png` fully decode as RGB 1080×1920, covering scenes 01–07. These are environment plates, not completed film shots.
- All 43 corrected reading PNGs fully decode as RGBA 1308×2324. Reading requires 48 frames; five remain. Other corrected poses are unrendered. Expected loop counts: reading 48, thinking 48, discovery 36, frustration 48, laugh 48, neutral 36 (`work/reel_actors.py:8`).
- Exact retained appearance source: `outputs/khiladi-master-v3.blend`; acting intermediate: `work/v4_debug.blend`. Also retain `outputs/khiladi-character-production.blend`, `outputs/khiladi-environments.blend`, V3 validation previews/audits, and original reference assets. Do not rebuild an approximation of the hero or treat a debug artifact as a completed V4 approval.
- Existing V3 audit JSONs report fixed geometry, 11 bones, planted feet, stable notebook attachment, and a decoded 240-frame 8-second motion test. Those are historical V3 checks, not tests of corrected V4 loops or the final film. No `outputs/khiladi-master-v4.blend`, V4 rig audit, or final film is present.

## Required integration before any full film

1. Complete/revalidate six corrected actor loops. `work/reel/actors.json` currently has only reading/thinking and both still point to obsolete `actors_raw`. The incomplete reading render has not updated its manifest entry (`reel_actors.py:53–54`). Never consume `actors_raw`.
2. Implement one consistent RGBA crop across every frame of each loop, preserving motion bounds and foot anchors; save cropped assets separately. No reel crop/integration stage exists. Use `plates.json` `actor_box` to fit the cropped aspect ratio (`reel_sets.py:381–383`). Current dimensions alone do not produce the intended on-screen character size.
3. Build NEW merged reel layout metadata. `plates.json` has scenes only; `actors.json` uses `raw_directory`. `composite_layers.py:31–39` requires a `loops` mapping with `directory`, `frame_count`, and dimensions. Neither current manifest is directly usable as compositor input. Its default points to old `work/layers/layout.json` (`:27`), and its hardcoded cache points to old `work/layer_clips` (`:31`). Both must change for the new reel.
4. Add grounded contact shadows and meaningful foreground occlusion. Current reel cuts specify `foreground: null` and empty graphics (`reel_sets.py:383`); compositor supports supplied foreground/graphics but generates no contact shadow (`composite_layers.py:60–70`).
5. Fix scene 06 close-up framing (both balance pans), and desk-notebook/held gray notebook continuity. Source still uses the narrow special close-up (`reel_sets.py:367`). Existing plate cache will otherwise hide framing edits.
6. Render remaining scene 08–16 plates only after approved fixes. Saved source already contains D10/D20/D25, 750 RESAMPLES and first-innings WP 0.2559 vs 0.2524; scenes 11–13 have not rendered. Add the accepted full top-ten report pages for both roles with exposure, uncertainty and format context; current physical shortlist shows three names per role. Do not invent the missing results. Actual website footage remains deferred.
7. Generate/review captions, assemble new reel, then run full film QA and inspect every cut for style, crop, foot grounding, continuity, evidence legibility and caption/prop overlap. The current verifier samples only one frame per scene, so it cannot establish those qualities (`verify_film.py:14–18`).

## Cache and corruption hazards

- Actor renderer skips an entire loop solely by PNG count (`reel_actors.py:15–16`) and skips each existing filename without decoding or checking configuration (`:39–40`). A partial/corrupt PNG or stale camera/rig settings can survive indefinitely. Before later resume, decode all PNGs, require exactly contiguous names 1..N and RGBA/dimensions, and invalidate/rebuild affected caches after source/settings changes. The 43 current corrected frames passed full image decoding in this audit.
- Plate resume uses existence/size plus saved scene name (`reel_sets.py:395–399`); inner per-cut skip checks only existence. It has no script/settings fingerprint. `REEL_FORCE=1` is required when intentionally replacing cached corrected shots. A partially rendered scene can otherwise mix old PNGs and new editable scene source.
- `reel_sets.py:388` regenerates native `plates.json` on every run, including draft/selected runs, unless `REEL_KEEP_METADATA=1`. Keep final merged layout separate; do not overwrite it through this metadata function.
- `composite_layers.py:19–24` reuses output based only on dependencies' mtimes and output frame count; metadata edits (actor placement/size), code/filter settings and changed loop encoding settings are absent from dependencies. Same-name old clips can be falsely reused. Use a fresh reel cache with explicit source/config invalidation. Loop input count validation at `:36–37` does not prove contiguous names or decodability.
- `narrate.py:13` treats the existence of MP3+JSONL as valid narration, with no narration/voice/settings hash or decode verification. Preserve current audio and timing; regenerating from the cloud service may change timing or sound. Do not rerun to repair paths.
- Environment accumulation previously failed with "Cannot overwrite used library" (`work/reel-sets-native.log:19–26`). Current workaround saves a staging blend then replaces final (`reel_sets.py:408–415`); preserve this logic. Process interruption can leave staging/backup files; never promote one solely because it exists.

## V4 failure and foot correction boundary

- `animate_character_v4.py` draft failed at the all-frame bounds scan with `RuntimeError: Acting bounds could not fit the fixed camera` (`work/v4-draft.log:2–6`; source `:219–222`). Assertions/audit write and master save are later (`:224–239`), so they did not pass in that run. Inspect mode saves `v4_debug.blend` and exits before these checks (`:185–196`). Do not claim completed standalone V4 verification.
- Foot correction exists in `reel_actors.py:10–11,23–24`: load V3 rest foot world matrices, detach V4 feet, restore matrices while keeping acting. Do not switch back to running the failed standalone V4 script as the film actor pipeline. `work/reel-leg-audit.log` records shin ends near x ±0.265, y −0.02, z 0.1274 at sampled frames (small frame-65 variation); it is not a full corrected-foot render audit.

## Windows → Linux requirements

- Observed runtime: Blender **5.3.0**, hash `02f0899d78e3`, built 2026-11-10 (logs); external Python **3.12.10**; Pillow **13.0.0**; edge-tts **7.3.1**; aiohttp **3.14.5**; numpy **2.5.5**. Package versions were queried from the existing venv, not inferred from latest releases. No portable production dependency lock was found. Recreate a Linux venv; Windows `work/venv` and MSI are not portable. Blender scripts use Blender's bundled Python/modules; do not pip-install bpy into the ordinary venv.
- Observed FFmpeg/ffprobe: **9.0.2** Gyan Windows full build. Linux build must provide libx264, AAC, qtrle/ARGB PNG encoding path, subtitles/libass, zoompan, loudnorm and overlay. Check capabilities before rendering, rather than assuming an OS package has them.
- Keep engine identifier **`BLENDER_EEVEE`** (`reel_sets.py:345`, `reel_actors.py:29`). Historical `BLENDER_EEVEE_NEXT` failed against this runtime (`work/blender-preview.log:5`). Test the selected Linux Blender version/API separately before production; the audit did not run Linux Blender.
- `reel_sets.py:59–60` optionally loads `C:/Windows/Fonts/segoepr.ttf` (Segoe Print). Linux silently falls back to a different Blender font. ASS requests Arial (`assemble_film.py:140`, existing captions). Supply licensed portable equivalents or explicitly approved substitutes and visually recheck wrapping, handwriting and emphasis. Do not copy protected system fonts without authorization.
- `timing.json`, reel manifests, old layers metadata and concat lists contain absolute Windows paths. Rebase/recreate derived paths to the Linux checkout; `Path('C:\\...')` will not resolve correctly there. Source script ROOT resolution already uses `__file__`, so retain the production directory hierarchy. Also inspect/remap any external font/media references in blend files on Linux; no native dependency inspection was run in this audit.
- `verify_film.py:10` uses literal `NUL`; change to `os.devnull` or `-` on Linux. The explicit null muxer may accept the string as an output URL, but it is not a portable OS null-device path.
- Preserve paths/case exactly. Do not reuse Windows venv scripts or Windows MSI/download script (`download_blender.py:2`). Cloud runtime hardware/OpenGL/EGL compatibility remains untested; do not promise headless rendering works until a permitted smoke test succeeds.

## Future commands (only after an explicit production resume)

Run from the production package root containing `work/` and `outputs/`; first repair portable paths, cache validation/invalidation, merged layout and fonts. Do not run all old scripts indiscriminately.

```sh
# Render selected remaining environments; IDs are exact story IDs.
REEL_SCENES=08_adjust,09_shrink,10_delta,11_holdout,12_uncertainty,13_sensitivity,14_shortlist,15_replay,16_end blender -b --python work/reel_sets.py
# Corrected loop renderer resumes existing files; validate them first.
REEL_POSES=reading,thinking,discovery,frustration,laugh,neutral blender -b --python work/reel_actors.py
# Captions only; audio/timing already exist.
python work/assemble_film.py --captions-only
# Only after compositor is adapted to a new cache and real merged layout.
python work/composite_layers.py --metadata work/reel/layout.json
# Only after film exists and verifier null-device portability is fixed.
python work/verify_film.py
```

`work/reel/layout.json` in this example is an UNIMPLEMENTED required integration artifact, not an existing ready-to-run configuration. `narrate.py` is optional cloud TTS generation, not a resume prerequisite. Do not run `render_film.py`, `render_layers.py`, old V1/V2 builders or old compositing layouts as substitutes for the retained V3/V4 reel pipeline.
