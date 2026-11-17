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
