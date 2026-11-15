---
name: gsap-scroll-choreography
description: Use for kinetic hero typography, ScrollTrigger chapter transitions, Lenis smooth homepage scroll, logo aperture and Delta-like animated CTA behaviors.
---

# Gsap Scroll Choreography

## Workflow
Build reusable GSAP context-scoped timelines with `gsap.context()` and cleanup; avoid external slider animation conflicts. Scope Lenis to the cinematic landing only; use native scroll for analytics pages. Make scroll-tied transitions reversible where observed. Use timelines for multi-stage reveals; support rerender, route change, resizing and fonts-ready layout recalculation. Choose responsive/low-motion fallback for pinned and masked scenes. Avoid hardcoded path geometry from another logo. Ensure no motion plugin or proprietary reference site code is copied.
## Exit gate
Repeated navigation causes no duplicated listeners, stuck pinned sections or scroll traps.
