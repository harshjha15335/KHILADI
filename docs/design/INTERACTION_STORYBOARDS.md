# ROYAL EDGE: Step-by-Step Interaction Storyboards

This document maps the exact chronological visual and interaction choreography across three critical flows: the **Cinematic Homepage**, the **Player Database & Profile Drawer**, and the **Pressure Lab Delivery Scrubber**.

---

## Storyboard 1: Homepage Cinematic Entrance to Command Centre

| Step | User Action | System Motion & Visual Response | Timing / Curve | Accessibility Fallback |
|---|---|---|---|---|
| **01. Zero State** | User lands on `/` | Page background is deep obsidian `#07080B`. Subtle stadium floodlight glow begins radial breathing animation. Header is fixed at top (`opacity: 0`). | Initial mount | Immediate static render |
| **02. Header Entrance** | Automated | Header fades in; Rajasthan Royals SupeRR Selector badge slides down (`y: -20px -> 0px`). Live ticker shows RR purse `₹120.0 Cr`. | `0.6s`, `power2.out` | Instant visibility |
| **03. Kinetic Headline Reveal** | Automated (0.3s delay) | GSAP `SplitText` activates: words *"PRESSURE INTELLIGENCE"* rise from masked parent containers (`y: 110% -> 0%`). Secondary line *"FOR THE RAJASTHAN ROYALS"* follows with 0.15s stagger. | `0.85s`, `power3.out` | Bypassed; plain text rendered |
| **04. Top Performers Carousel** | Automated (0.8s delay) | AUGE-inspired 3D curved cards deck slides up from bottom (`y: 60px -> 0px`, `opacity: 0 -> 1`). 5 cards visible (Sanju Samson, Jasprit Bumrah, Rinku Singh, Rashid Khan, Heinrich Klaasen). | `0.95s`, `cubic-bezier(0.16, 1, 0.3, 1)` | Flat grid cards |
| **05. Card Hover & Drag** | User hovers card / drags carousel | Card scales up (`scale: 1.04`), liquid shader ripples across player photo, and pressure index glows in neon gold (`#E2B755`). | `0.3s`, `standard` | CSS border color change |
| **06. First Scroll (Aperture)** | User scrolls down | Lenis smooth scroll engages. As hero recedes, the Royal Lion Crest SVG mask expands (`scale: 1.0 -> 35.0`). The user travels through the portal into the methodology teaser. | Scrubbed scroll (`1200px`) | Standard linear scroll fade |
| **07. Primary CTA Click** | User clicks *"Enter Command Centre"* | Magnetic pill button depresses (`scale: 0.96`). Fullscreen dark transition curtain sweeps upward (`y: 100% -> 0%`). Route switches to `/command-centre`. Curtain exits upward. | `0.45s` exit + `0.45s` enter | Instant route change |

---

## Storyboard 2: Player Database Search & Profile Inspection (Layer 2)

| Step | User Action | System Motion & Visual Response | Timing / Curve | Accessibility Fallback |
|---|---|---|---|---|
| **01. Database View** | User navigates to `/database` | Table renders 250+ players sorted by PII rank. Columns strictly aligned on monospaced grid. Hairline dividers in `rgba(255,255,255,0.08)`. | < 300ms mount | Standard table |
| **02. Filter Tag Click** | User clicks *"[Role: Death Bowler]"* | All non-death-bowler rows collapse height to 0 and fade out. Bowlers like Bumrah, Arshdeep, and Sandeep Sharma slide smoothly upward into ranks 1, 2, 3 via FLIP. | `0.35s`, `standard` | Instant row re-render |
| **03. Row Hover** | User moves cursor over Sandeep Sharma | Row background illuminates (`#1E2235`). A CRL-style floating preview card appears near pointer (`lerp: 0.15`), displaying Sandeep's radar chart and death overs dot % (44.2%). | `0.2s` fade-in, continuous follow | Tooltip disabled; focus state outline |
| **04. Row Click** | User clicks Sandeep Sharma row | A right-hand drawer slides out (`x: 100% -> 0%`) covering 45% of viewport width. Full Player Intelligence Profile mounts with dual radar comparison and IPL auction fit score. | `0.4s`, `power3.out` | Immediate drawer appearance |
| **05. Drawer Close** | User presses `Escape` or clicks backdrop | Drawer glides back off-screen (`x: 0% -> 100%`). Focus returns automatically to the clicked table row. | `0.3s`, `exit` | Immediate unmount |

---

## Storyboard 3: Pressure Lab Match Replay & Timeline Scrub (Layer 3)

| Step | User Action | System Motion & Visual Response | Timing / Curve | Accessibility Fallback |
|---|---|---|---|---|
| **01. Match Loaded** | User selects *RR vs GT, Over 16-20* | Pressure Arena canvas mounts. Win probability curve initializes at 38% for RR. Delivery timeline displays 30 dots with leverage colors (Green/Yellow/Red). | `0.5s` mount | Accessible static table |
| **02. Timeline Drag** | User scrubs delivery slider to Ball 18.3 | Playback head moves smoothly. Real-time telemetry readouts update at 60fps: Required Run Rate `12.4`, Leverage Index `3.82`, Bowler: Prasidh Krishna, Batter: Hardik Pandya. | < 16ms per frame | Standard slider input |
| **03. Critical Event (Wicket)** | User reaches Ball 18.5 (Wicket falls) | Cyera-inspired radial shockwave ripples across the chart canvas. Win probability drops precipitously from 34% to 11% with animated area fill transition. | `0.65s`, exponential decay | Text alert: "Wicket: Win Prob -23%" |
| **04. Expected vs Actual Delta** | User hovers wicket marker | Contextual callout card expands showing model validation breakdown: *Expected Boundary Prob: 18%, Actual Outcome: Caught at Long-on. Pressure Delta: +4.2 PII*. | `0.25s`, `standard` | Standard expandable panel |
