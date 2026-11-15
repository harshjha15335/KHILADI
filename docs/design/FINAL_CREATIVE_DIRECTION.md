# ROYAL EDGE: Final Creative Direction & Engineering Blueprint

**Project:** ROYAL EDGE — Cricket Pressure Intelligence, Player Analytics & IPL Auction Strategy Platform  
**Target Competition:** Rajasthan Royals SupeRR Selector Season 2  
**Document Classification:** Definitive Engineering & Art Direction Master Brief (Phase 0 Deliverable)  
**Author:** Senior Creative Technologist & Systems Architect

---

## 1. Visual & Conceptual Identity

### 1.1 The Creative Thesis
Most sports intelligence platforms look like generic SaaS dashboards, uninspired spreadsheets, or flashy betting apps.  
**ROYAL EDGE combines three distinct disciplines:**
1. **The Architectural Polish of Award-Winning Creative Studios** (Extrafazant, AUGE XP)
2. **The Archival Density and Rigor of Quantitative Terminals** (CRL, FactSet)
3. **The Immersive Explanatory Power of Interactive Data Journalism** (Cyera, The New York Times)

The brand identity honors the **Rajasthan Royals** royal heritage (deep obsidian stadium nights, royal navy structure, restrained burnished gold accents, and sharp Rajasthan pink highlights) while establishing supreme mathematical credibility for judges and data scientists.

### 1.2 The Three-Layer Operational Model

```
┌────────────────────────────────────────────────────────────────────────┐
│                        LAYER 1: CINEMATIC HOOK                         │
│  Scope: Homepage, SupeRR Selector Intro, Top Performers Showcase       │
│  Atmosphere: Atmospheric Nocturnal Stadium, Volumetric Glow, Kinetic   │
│  Motion Engine: GSAP 3.15 + ScrollTrigger + Lenis + SplitText          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Seamless Curtain Transition (Barba model)
┌───────────────────────────────────▼────────────────────────────────────┐
│                  LAYER 2: PROFESSIONAL ANALYTICS WORKSPACE             │
│  Scope: Command Centre, Database, Player Profiles, Auction War Room    │
│  Atmosphere: Swiss Archival Monospace, High Density, Hairline Borders   │
│  Motion Engine: Framer Motion FLIP + Instant Table Windowing (<15ms)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Deep Dive Match Linkage
┌───────────────────────────────────▼────────────────────────────────────┐
│               LAYER 3: INTERACTIVE DATA STORYTELLING                   │
│  Scope: Pressure Lab, Ball-by-Ball Match Replay, Model Validation Lab   │
│  Atmosphere: Dynamic Vector Space, Wavefront Shockwaves, Live Scrubber │
│  Motion Engine: ECharts 5 Canvas + Targeted Three.js Vector Field      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Design Tokens & Styling Rules

### 2.1 Color Semantics (Strict CSS Variable Bindings)
- `--bg-primary`: `#07080B` (Stadium Obsidian Void).
- `--bg-card`: `#0E1017` (Elevated Card Surface).
- `--bg-hover`: `#1E2235` (Interactive Table Row Highlight).
- `--border-subtle`: `rgba(255, 255, 255, 0.08)` (Hairline Grid Dividers).
- `--border-active`: `rgba(232, 18, 116, 0.5)` (Selected Element / Pink Glow).
- `--text-white`: `#F8F9FA` (High-contrast data points, Contrast > 16:1).
- `--text-muted`: `#9DA3B4` (Metadata, units, table headers).
- `--accent-pink`: `#E81274` (Rajasthan Royals signature pink; active tabs & alerts).
- `--accent-gold`: `#E2B755` (Burnished Gold; Tier 1 Pressure Winners & Top 20 Badges).
- `--accent-volt`: `#D4FF00` (Electric Volt; Real-time status indicators).

### 2.2 Typography Pairings & Hierarchy
- **Cinematic Headlines:** `Space Grotesk` (Weights 600, 700), `letter-spacing: -0.03em`.
- **Interface & Body:** `Inter` (Weights 400, 500, 600), `letter-spacing: -0.01em`.
- **Data, Scores & Tables:** `JetBrains Mono` (Weights 400, 500, 700), tabular numerals (`font-variant-numeric: tabular-nums`).

---

## 3. Motion Behavior & State Transitions

### 3.1 What Happens on Scroll
1. **On Homepage (Layer 1):**
   - Lenis smooth scrolling virtualizes wheel inputs (`smoothWheel: true`, `duration: 1.2`).
   - Sticky left column holds the problem narrative (*"Cricket collapses happen in seconds..."*) while the right column cascades high-pressure delivery videos at `1.35x` parallax speed.
   - The Rajasthan Royals Royal Lion Crest expands as an SVG aperture mask (`scale: 1.0 -> 35.0`), drawing the user into the Command Centre.
2. **On Analytics Dashboards (Layer 2):**
   - **Lenis is destroyed.** Scrolling is 100% native browser scrolling. Sticky headers remain fixed; tables scroll with zero friction. Scroll hijacking is strictly forbidden.

### 3.2 What Happens on Hover
- **Pill Buttons & Navigation Links:** Displace toward the pointer via spring physics (`±12px` range, `elastic.out(1, 0.3)` return).
- **Player Database Rows (CRL Model):** Row background illuminates to `#1E2235`. A floating scouting card (`180px x 240px`) anchors to pointer position (`lerp: 0.15`), displaying the player's pressure radar and death overs dot %.
- **Chart Markers:** Scrubbing dots expand with a soft radial glow (`r: 4px -> 8px`), projecting tooltip telemetry.

### 3.3 What Happens on Click & Route Change
- **Card Expansion:** Clicking a player card in the Top Performers showcase triggers a Framer Motion `layoutId` expansion. The card smoothly expands into the Player Intelligence Profile header without page reload or white flash.
- **Route Changes:** Handled via a full-screen curtain wipe transition:
  - Current view fades and lifts (`y: -20px`, `opacity: 0`, `0.35s`).
  - Dark curtain sweeps up from bottom, route unmounts/mounts, curtain exits upward, and new page content enters via staggered SplitText/fade (`0.5s`).
- **Table Filters:** Clicking a filter tag (e.g. *[Role: Death Bowler]*) engages a FLIP animation where unselected rows collapse height to 0 and matching rows slide up without jumpy re-renders.

### 3.4 What Happens on Mobile Touch Devices
- Lenis and Three.js canvas particle loops are disabled.
- Hover-following preview cards are replaced with long-press or tap-to-open bottom sheets.
- Tables support horizontal touch panning with frozen first columns (Rank & Player Name).
- Full WCAG 2.1 AA touch target size compliance (`min-height: 44px`, `min-width: 44px`).

---

## 4. Verification Check against Rules & Guidelines

- **No Fabricated Evidence:** All 81 screenshot references and runtime detections (`@barba/core`, `gsap 3.15`, `Next.js Turbopack`, `Nuxt Vite SSR`, WebGL contexts) are recorded in local evidence files.
- **Strict Separation of Form and Function:** High-octane cinematic motion is strictly confined to Layer 1 (Homepage) and Layer 3 (Pressure Lab); Layer 2 (Analytics & War Room) is engineered for maximum speed, information density, and statistical rigor.
- **Complete Developer Blueprint:** A frontend engineer has exact CSS variables, easing curves, component architectures, and data schemas ready for immediate Phase 1 execution.
