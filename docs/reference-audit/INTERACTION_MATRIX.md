# Comprehensive Interaction Inventory & Component Matrix

This matrix documents the component interactions audited across the references, with their verified default, hover, click, scroll, and keyboard behaviors, and their recommended implementation for **ROYAL EDGE**.

---

## 1. Interaction Inventory Matrix

| Component Element | Reference Origin | Default State | Hover State | Click / Activate | Scroll Behavior | Keyboard / a11y | Mobile / Touch | Relevance to ROYAL EDGE | Classification |
|---|---|---|---|---|---|---|---|---|---|
| **Global Fixed Header** | Extrafazant | Semi-transparent dark bar (`backdrop-filter: blur(12px)`) | Links underline via slide-in line | Route transition trigger via Barba.js | Collapses from `80px` to `64px` on scroll | Full `Tab` focus ring (`outline: 2px solid #D4FF00`) | Converts to floating bottom/top pill hamburger | Global navigation across all 14 platform pages | **Essential** |
| **Magnetic CTA Button** | Extrafazant | Pill shape, solid background, crisp label | Displaces toward cursor (`±12px`); glow border expands | Scales down (`scale: 0.96`); ripple expansion | Fixed in viewport or scrolls with hero | Activates on `Enter` / `Space` | Touch tap triggers immediate active scale | Primary CTAs (*Launch Command Centre*, *Bid in Auction*) | **Essential** |
| **Monospaced Index Table Row** | CRL | Clean tabular row, hairline divider | Row background changes (`rgba(255,255,255,0.04)`); floating image card appears | Opens Player Intelligence Profile drawer | Uninhibited native scroll; virtualized windowing | `ArrowUp` / `ArrowDown` row traversal | Tap opens bottom sheet preview | Core component for Player Database & Top 20 Rankings | **Essential** |
| **Live Cursor Preview Card** | CRL | Hidden (`opacity: 0`, `display: none`) | Follows pointer with `lerp: 0.15`; displays thumbnail & stats | Closes preview and navigates to target | Unaffected by scroll | Hidden for keyboard navigation | Disabled on touch (replaced by long-press or tap) | Instant scouting snapshot for auction targets | **Supporting** |
| **3D Volumetric Canvas** | Cyera | Dark cosmic particle field; ambient drift | Particles part under cursor with radial repulsion | Shifts camera focus target to clicked cluster | Camera travels along 3D spline curve | `Tab` focuses accessible HTML text alternative | Throttled particle count; drag-to-orbit | Pressure Lab Match Replay & Win Probability Arena | **Supporting** |
| **Inertial Carousel Plane** | AUGE XP | Curved 3D plane in infinite horizontal reel | Liquid displacement shader ripples on image surface | Selected plane zooms to full screen (`100vw x 100vh`) | Mouse wheel drives carousel velocity | Left/Right arrow keys advance active card | Horizontal swipe with momentum decay | Top 10 Pressure Performers hero showcase | **Supporting** |
| **SVG Aperture Mask Portal** | Delta Cafés | Centered monogram logo mask (`scale: 1.0`) | Soft ambient glow pulsation | N/A | Mask scales exponentially (`scale: 35.0`) on scroll | Reduced-motion bypasses to standard fade | Zoom duration shortened for touch scroll | Royal Crest transition from Hero to War Room | **Decorative** |
| **Diagnostic Quiz Wrapper** | Delta Cafés | Step 1 card visible, progress bar at 25% | Option pill border turns gold; shadow elevation | Slides to next question with horizontal spring | Pinned until quiz completion or skipped | Full radio button arrow key accessibility | Full-width touch radio cards | "RR Squad Gap Diagnostic" shortlist wizard | **Supporting** |
| **Delivery-by-Delivery Timeline Scrub** | Original (Synthesized) | Horizontal bar with ball dots colored by pressure | Dot expands, showing bowler, batter, leverage index | Jumps playback head to specific delivery | Wheel zooms timeline time-window | `[` and `]` step backward/forward one ball | Touch drag scrubber with haptic tick | Pressure Lab ball-by-ball match analytics | **Essential** |

---

## 2. Interaction Classification Summary

- **Essential (Must be flawlessly implemented):**
  - High-performance, virtualized data tables (CRL model).
  - Rapid search and filter mechanics with zero input latency.
  - Responsive navigation headers and persistent Command Centre breadcrumbs.
  - Delivery-by-delivery pressure timeline scrubber with instant statistical updates.
- **Supporting (Enhances engagement without slowing analysts):**
  - Magnetic CTA buttons with spring physics.
  - Cursor-tracking player scouting previews.
  - WebGL particle wave in the Pressure Lab.
  - Diagnostic quiz tool for auction shortlisting.
- **Decorative (Restricted strictly to Layer 1 Homepage):**
  - SVG Logo Aperture Zoom (`TransitionLogoMask`).
  - WebGL liquid surface ripple shaders (AUGE model).
  - Infinite curved carousel on hero.
  - All decorative effects **must be completely absent** from Layer 2 (Professional Analytics Workspace) to guarantee maximum analyst productivity.
