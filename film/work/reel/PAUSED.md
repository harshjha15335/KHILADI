# Production paused by user

Do not resume rendering, assembly or production edits until the user asks to resume.

The user authorized full-film production, bypassing further standalone V4 tests, then explicitly paused production. The current full story, exact narration and scene plans are in `outputs/khiladi-story-and-scene-report.md`.

## Saved work

- 21 native environment plates: all three cuts for scenes 01–07, in `work/reel/plates`.
- Cumulative editable environments: `outputs/khiladi-environments.blend`.
- 43 valid corrected reading-action RGBA frames: `work/reel/actors_raw_corrected/reading`.
- Narration and word boundaries: `work/narration`; full timing `work/timing.json`; current narration duration209.6667seconds.
- Scene narration/story source: `work/story.json`.

## Resume cautions

- Use `work/reel_sets.py` for environments; source has corrected D10/D20/D25, 750 RESAMPLES, and the first-innings WP Brier printout. Scenes11–13 have not yet rendered, so corrected source will apply naturally.
- Scene06 balance close-up needs wider framing before final assembly.
- Desk notebook cover should match the retained gray held notebook for continuity.
- Do NOT use `work/reel/actors_raw`: those earlier frames have incorrect foot transforms inherited from the incomplete V4 test script. They are obsolete scratch assets.
- Correct film actor renderer is `work/reel_actors.py`, which writes `actors_raw_corrected` and restores the V3 foot world transforms while retaining V4 head/body/limb acting. V4 shin ends were verified near x±.265,y−.02,z.1274; retain matching planted foot geometry.
- `work/reel/actors.json` may still contain old completed loop entries pointing to `actors_raw`; do not assemble until all six loop entries point to `actors_raw_corrected` and each has the full expected count.
- Corrected actor renderer is resumable by existing frames; reading43/48 valid. Other corrected poses remain unrendered.
- Needed next pipeline stage: crop each rendered RGBA loop consistently and prepare a merged film layout using `plates.json` actor_box and cropped actor aspect/foot anchors. The old `composite_layers.py` can encode loops/composite scenes, but must use NEW reel clip-cache paths and new final metadata, not old rejected classroom layouts.
- Add full accepted top10 report pages (current cards show top3 perrole) and grounded soft actor contact shadows/foreground occlusion during compositing.
- Actual website is deferred; no substitute website footage.

All known Blender production PIDs were stopped and process exit verified. No full film MP4 has been assembled.
