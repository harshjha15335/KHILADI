---
name: cinematic-video-pipeline
description: Source/prepare a multi-clip cricket montage from any team or era with priority on RR; implement lawful embedding or licensed edited videos, optimized playback, transitions and fallbacks.
---
# Cinematic Video Pipeline

1. Video subject is flexible: any cricket match, team, player or stadium clip may contribute, but aim for RR-focused footage and avoid false labels.
2. Independently locate footage and keep a source/rights/permissions log. Rights to *watch* a clip do not include rights to download, edit, rehost, loop or bundle it. Confirm licence; otherwise use permitted embeds or original/licensed footage.
3. For eligible local assets, use FFmpeg/ffprobe for crop, colour, encoded bitrate/resolution, MP4/WebM, poster-frame extraction, volume policy, edit decision list and crossfade/shape-mask timings.
4. Layout: Delta-inspired hero with layered montage, centered authorised RR crest or independent brand mark, navy/purple overlays and readable headline.
5. For each clip track `clip_id`, source, footage context, player IDs if identified (must be whitelist for selectable cards), licence, type, crop, trim, poster and replacement fallback. Do not imply unrelated match footage is RR.
6. Animate transitions without black flashes; test desktop/mobile autoplay, pause/reduced motion, data saver, failed network, and play controls where appropriate.
## Exit gate
Multi-clip hero works without huge blocking payload; no unlicensed ripped material shipped; if no video licence exists, clearly report that blocker and use a compliant alternative.
