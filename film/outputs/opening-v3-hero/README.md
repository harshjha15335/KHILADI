# Opening V3 silent hero shots

Completed clips: A seated writing (1.4 s), B wider reverse classroom context (0.9 s), F teacher-directed glance and concealment (1.6 s), I restrained wry recovery (1.0 s). All are 1080×1920, 30 fps, H.264/yuv420p, silent. They are source shots for assembly, not a finished narrated opening.

The classroom is the corrected reverse view: camera near the front board, looking toward the rear storage. Teacher and board remain offscreen near/behind the camera. F looks camera-left/front, not toward the deleted rear teacher. B is a wider reverse context view, **not** a new teacher-board angle.

Physical writing-hand continuity is RIGHT-handed: pencil screen-left in C1 frontal, screen-right in C3 notebook OTS. The shared notebook texture is rotated 180° for C1 so its text faces the pupil, not the frontal audience. It is never mirrored. Cricket therefore appears screen-left in C1, opposite the upright pupil-view macro. Exact textures come from `outputs/opening-v3-notebook`.

A uses a visible underline stroke with pencil-tip coordinates projected from the same notebook source coordinates. Arm segments connect to the shoulder and grip, and reaching forearms pass in front of the torso rather than disappearing behind it. F freezes, glances near/front-left, parks/releases the pencil, then drives the open maths spread over the cricket book. The cover reach is bounded to the nearby desk, not an offscreen rubber-arm target. I uses the retained neutral/crooked-mouth geometry and a small head/body settle rather than the rejected V2 broad laugh.

**Prop-state cut rule:** F ends covered by the maths spread; I starts with cricket already exposed. Place the H dense-cricket insert before I. Do not cut directly from F's covered endpoint to I without the intervening reveal/cutaway logic.

`HERO_METADATA.json` records frame counts, local action anchors, source hashes, teacher/front direction and caption clearance. Main notebook extends to approximately y=1712 in the final tight shots; the proposed caption box starts at y=1730. Keep any outline/shadow within that safe box, and review final burned-in captions against actual composite frames. B has more clearance.

Editable sources:

- `film/work/opening-v3-hero/render_hero_poses.py`: loads the retained V4 rig (same V3 mesh/material identity), clears old acting and renders three new head/torso key poses. It does not rebuild or overwrite the approved master.
- `film/work/opening-v3-hero/render_silent_hero.py`: articulated 2.5D shot compositor and exact clip durations. It reuses V2 writing sprites, new front-left/wry sprites, corrected classroom background and shared notebook textures. Output replacements are atomic.
- `film/work/opening-v3-hero/finalize_hero_delivery.py`: stream checks, full decode, encoded contact sheet, hashes and metadata.
- `khiladi-opening-v3-hero.blend`: retained native geometry/rig snapshot at the final pose, not the assembled video timeline.

The background extras remain mostly still. Seated lower anatomy is occluded by the desk. Paper/hand movement is 2.5D articulation, not a physical paper simulation. These source clips contain no voice, captions or foley. No private Brawn audio/footage or analytical source rows enter them. No V2 originals, approved V3 master, voice tracks, website or public deployment were changed.
