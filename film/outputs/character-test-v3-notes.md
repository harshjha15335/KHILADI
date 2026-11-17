# Khiladi character validation — v3 candidate

This is a character approval test. The full Khiladi film remains on hold until the animated test is reviewed.

## Deliverables

- `character-validation-v3.png`: five actual Blender renders of one model—neutral front, 43-degree three-quarter, comedic anger, confusion and wide laughter.
- `character-motion-test-v3.mp4`: silent, eight-second portrait rig test; native 1080 × 1920 at 30 fps.
- `khiladi-master-v3.blend`: reusable rig and the complete 240-frame test timeline.
- `build_character_v3.py`: procedural Blender construction and animation source.

## Timing

| Time | Action |
| --- | --- |
| 0–2 seconds | Neutral, looking down toward the held notebook |
| 2–3 seconds | Sudden realization and widened eyes |
| 3–5 seconds | Frustrated reaction, animated brows and arm gestures |
| 5–7 seconds | Wide laughter, jaw pulses and head bobs |
| 7–8 seconds | Return to neutral, then a short pause |

## Reference and construction

The Brawn screenshot and original reel guide the ink contours, simplified dimensional forms and puppet timing. The v2 candidate supplies the retained dark hair cap, plain white torso and compact silhouette. No classroom or film scene is part of this test.

The three-quarter panel rotates the actual rig by 43 degrees. Facial strokes follow the rounded head surface. Subtle permanent contour variation, varied stroke widths, asymmetrical expressions and mild material roughness replace the previous polished, symmetrical face.

Head, body, hair and limb geometry remain fixed. Facial visibility, brow controls and mouth shape keys animate intentionally. The nominal torso-to-head height ratio is 0.658; visible legs-to-head height is 0.405.

## Verification

`character-v3-audit.json` records the fixed base geometry and skeleton. `rig-motion-audit-v3.json` checks all 240 timeline frames for stationary feet and a stable notebook-to-hand attachment, and verifies outward head normals and an expanded contour shell. `motion-technical-audit-v3.json` records the finished video checks after encoding.

The timing contact sheet supports inspection at individual moments. Technical checks do not establish visual similarity or master-character approval; the complete animation must be reviewed against the reference reel.
