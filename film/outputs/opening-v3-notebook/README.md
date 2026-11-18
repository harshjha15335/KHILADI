# Silent notebook cutaways — corrected opening

Only the opening notebook actions are rendered. These clips contain **no narration, captions or sound**; timing remains flexible for final synchronization against the approved Michael refinement. No later scene, website shot or final film is rendered here.

## Hand and page continuity

- Anatomical **RIGHT** hand writes. In C3 over-shoulder/macro, that hand enters screen-right and the left hand anchors screen-left.
- In C1 frontal reverse, the right writing hand must appear screen-left. Use the same notebook textures rotated 180°, not mirrored.
- To the pupil, notebook text is upright, its top/far edge points toward teacher/board at the room front. Maths is the LEFT page and cricket is the RIGHT page. C1 therefore sees cricket on its screen-left.
- The cricket pages are clearly an **imaginary schoolboy XI**, not the final evidence-based rankings or a current roster claim. No restricted delivery rows or private competition data appear.

## Clips and suggested functions

- `C_maths_hesitation.mp4` — 1.4 s. A tiny unfinished pencil mark, brief hesitation, lift. The blank exercise remains unsolved.
- `D_page_turn_reveal.mp4` — 1.0 s. A hinged leaf flips from the right onto the left, revealing `MY IPL XI`. The gripping hand uses the same projected leaf geometry; the pencil is resting on the desk.
- `E_cross_out_selection.mp4` — 1.8 s. X over the existing selection, with a lifted reposition between strokes; then underline the pre-existing alternative note. No wipe-in is claimed as letter-by-letter writing.
- `G_sparse_maths.mp4` — 0.7 s. Sparse maths page and a small withdrawing-pencil beat.
- `H_dense_cricket.mp4` — 0.8 s. Dense cricket notes, field sketch and a captain mark circled by the pencil.
- `J_notebook_close.mp4` — 0.9 s. The right half folds over the left into a closed notebook. It stops before any college/laptop shot, allowing the assembler to create the next match cut deliberately.

All are 1080×1920 at 30 fps, H.264/yuv420p, silent. `NOTEBOOK_METADATA.json` records frame counts and adaptation constraints. `NOTEBOOK_*` PNGs are exact 1200×900 shareable textures for hero-shot continuity. A final assembler may hold the first/last pose briefly but should not time-stretch the hand and the page independently.

## Construction and limits

The source is editable at `film/work/opening-v3-notebook/render_notebook.py`. The original classroom foreground supplies the warm wood colour/texture, with an authored macro book and retained Kalam handwriting font. V2 source files and original character geometry are unchanged.

The book and leaf use perspective composites with a curved-strip page deformation, not a physically simulated paper mesh. The hand is an articulated thin-limb graphic in the established style, not a full 3D hand rig. X strokes, underline and captain ring share the exact projected paths used by the pencil tip; sheet grip follows the moving leaf point. Grounding/texture should still be reviewed at playback speed in the final edit. No claim of full audio/visual review or final opening approval is made.

Leave the lower safe area available for captions; final caption timing and foley belong to the assembly stage. The same source of light and same side of the room's action axis should continue through the hero and macro shots.
