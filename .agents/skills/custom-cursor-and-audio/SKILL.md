---
name: custom-cursor-and-audio
description: Use for AUGE-inspired pale-gold diamond cursor across all pages, pointer velocity effects and optional click sound design with user-controlled mute.
---

# Custom Cursor And Audio

## Workflow
Implement pointer-events:none cursor overlay; RAF-smooth pointer following, hover/click mode state, velocity response, viewport clamping and text avoidance. Disable on coarse pointer and reduced motion. For interface sound use original/licensed Web Audio samples or synthesized UI clicks, initialize only after user gesture, default muted, persistent visible toggle, cooldown and voice concurrency limiting. Sound should confirm discrete actions, not flood during scroll or tooltips. Avoid claim that AUGE uses a specific voice asset unless verified.
## Exit gate
No stolen sound files; no missing clicks or pointer traps; touch users retain native cursor behavior; audio never autoplays without permission.
