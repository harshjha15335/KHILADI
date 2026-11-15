---
name: cyera-player-reveal
description: Use to implement Cyera-inspired layered player profile card expansion/popover with original motion, focus management and only whitelisted player data.
---

# Cyera Player Reveal

## Workflow
Study the specific card-opening animation from the uploaded Cyera recording. Implement trigger -> scene dim -> expanding/entering card -> staggered player content -> stable interactive view -> reversible close. Motion `layoutId` or GSAP morph is optional; validate bounding-box handoff and overflow. Use semantic dialog where modal; trap focus, Esc close, focus restoration, keyboard alternatives and route deep links. Profile title/data based on a validated player ID.
## Exit gate
No fabricated pressure scores; drawer works from cards, list rows, search and other supported routes, including back/forward and reduced-motion.
