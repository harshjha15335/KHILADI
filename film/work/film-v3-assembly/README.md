# Full-reel visual assembly V3

The user explicitly resumed continued reel production and selected the revised Michael voice. This folder owns visuals only. No narration, model results or character geometry is generated here.

## Inputs

- `../full-film-v3/timing.json`: injectable scene durations; current full story is16scenes /5992frames /199.733333seconds. Legacy209.67-second timing is supported only as a provisional preview source.
- Native wide/context plate `{scene}_1.png` for scenes02–15. No unused cut2/cut3 render is required. Macro investigation views use the approved warm wood material, animated physical papers/cards/evidence and source-qualified labels.
- Retained V3/V4 upper-body PNGs from `../opening_v2/puppet`. Separate articulated arms and evidence props preserve the exact head/torso geometry/material rendering. Seated lower anatomy is occluded; this is not a full foot/rig motion validation.
- Corrected reverse classroom background from `../geography-review`: room front/teacher are near camera; rear wall is cupboards rather than the erroneously placed chalkboard. No scene mirroring.
- Opening hero A/F/I and notebook C/D/E/G/H/J clips from the other agents. `assemble_opening.py` deliberately retimes whole silent clips (not individual hands/props) to the approved Michael phrasing and360-frame opening. Retiming duplicates/drops some frames without inventing new raster limb motion.
- `inserts.json`: source-qualified300-frame report reveal in scene14, frames60–359; actual website capture120frames in scene15, frames184–303. The website is exactly4seconds and is not evidence the film's newer methodology is implemented by the older app.

## Commands

From repository root, assemble the opening once hero source clips are validated:

```
python3 film/work/film-v3-assembly/assemble_opening.py --hero-a A.mp4 --hero-f F.mp4 --hero-i I.mp4
```

Then native visual render/concat:

```
python3 film/work/film-v3-assembly/composite_film.py --timing film/work/full-film-v3/timing.json --width 1080 --opening film/outputs/film-v3-assembly/KHILADI_OPENING_V3_SILENT.mp4
```

`--scene` accepts comma-separated IDs for resumable renders. `--stills --allow-provisional` is for explicitly labeled preflight frames only; it is not final coverage. Final render must omit `--allow-provisional`.

Cache keys include source/config/timing and the used asset signatures. Scene files are written via `.rendering.mp4` and inserted files via `.inserting.mp4`, then atomically renamed. `.complete.json` marks completed scenes. Full concatenation must have all16scenes and5992frames; master QA remains with root.

Root owns approved audio, caption ASS generation, loudness/mix and final master QA. Optional `--audio`/`--captions` are provided but are not used to synthesize or modify narration.

## Fidelity and review limits

This is a hybrid2.5D documentary assembly with actual retained puppet rendering and original physical evidence animation. It is not a claim of fully simulated3D hand/paper contact, continuous3D camera motion, animated16-student crowds, or an exact copy of the Brawn reference. Source private reference video/audio is never read or bundled by this compositor. Scientific illustrations are labeled; no new player IDs, confidence intervals, alternate ranking orders or predictive claims are invented.
