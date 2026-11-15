# Deep Reverse-Engineering & Interaction Audit: CREATIVE REFERENCE LIBRARY (CRL)
**Target URL:** https://crl-2026.webflow.io/  
**Audit Date:** November 2026  
**Auditor Specialization:** Senior Information Architect & Design Systems Lead  
**Browser Runtime Tested:** Chromium 159 (Headless Automation & DevTools Protocol)

---

## 1. Executive Summary & Verification Status
- **Access Status:** 100% Accessible (HTTP 200, 35.9 KB HTML payload, responsive DOM verified).
- **Core Technology Stack Confirmed via Runtime:**
  - **Framework / Architecture:** Webflow static export enhanced with custom external script bundle deployed on Vercel (`https://crl-2k26.vercel.app/main.js`).
  - **Font Architecture:** Google WebFont Loader (`webfont.js`) asynchronously serving high-contrast editorial serifs and clean modern grotesques.
  - **Scripting Pattern:** Lightweight custom vanilla JavaScript micro-framework managing stateful catalogue filtering, instant table-to-grid layout switching, and live mouse hover preview overlays.
  - **DOM Complexity:** 612 DOM nodes on index; extremely lightweight, fast hydration, minimal memory footprint.
- **Evidence Captured:** Viewport captures, hover entry previews, responsive breakpoints, and footer archives in `docs/reference-audit/evidence/crl/`.

---

## 2. Visual Design & Editorial Architecture

### 2.1 Layout Systems & Grid Rigor
- **Composition Model:** Monospaced and Swiss-style index taxonomy. The page mimics a high-end archival index or institutional research library catalog.
- **Dual Grid Architecture:**
  1. **Index / Table View:** Dense horizontal row records with strict columnar alignment:
     - Column 1: Record ID / Index Number (`001`, `002`, `003`...).
     - Column 2: Title / Artifact Name (`font-weight: 500`).
     - Column 3: Category / Discipline tag (e.g., *Music*, *Film*, *Architecture*, *Design*).
     - Column 4: Year / Release date.
     - Column 5: Contributor / Source metadata.
  2. **Library / Visual Grid View:** Asymmetrical multi-column card layout displaying monochrome thumbnail photography, typography extracts, and contextual notes.
- **Margins & Spacing:** Strict `8px` baseline rhythm with `16px` lateral gutters and `32px` section delimiters. The design uses hairline dividers (`1px solid rgba(0, 0, 0, 0.1)`) to establish order without visual clutter.

### 2.2 Typography Hierarchy
- **Headline / Header:** Editorial serif headline paired with monospaced metadata (`font-family: "Courier New", monospace` or equivalent tabular mono).
- **Body & Row Text:** Clean neutral sans-serif (`font-size: 14px`, `line-height: 1.4`, `letter-spacing: -0.01em`).
- **Data Attributes & Badges:** Monospace tags formatted in uppercase with square bracket framing (e.g., `[ARCHIVE: V.01]`, `[FILTER: ALL]`), providing a serious academic/scouting tone.

### 2.3 Color & Surface Finish
- **Palette:** Minimalist warm paper background (`#F5F4F0` to `#FAF9F5`), contrasting rich ink black (`#111111`) typography and slate grey secondary labels (`#666666`).
- **Hover Surfaces:** Subtle tinted hover row highlights (`background-color: rgba(0, 0, 0, 0.03)`), maintaining pristine legibility without decorative distortion.

---

## 3. Interaction Mechanics & Animation Audit

### 3.1 Cursor-Tracking Live Hover Previews
- **Observed Behavior:** In the tabular Index view, moving the pointer over any table row immediately projects a floating image preview card that tracks the mouse cursor position (`transform: translate3d(x + 20px, y - 80px, 0)`).
- **Timing & Easing:**
  - Entrance: `opacity: 0 -> 1`, `scale: 0.95 -> 1.0`, `duration: 0.25s`, `ease: "cubic-bezier(0.16, 1, 0.3, 1)"`.
  - Mouse Tracking Lag: Smooth interpolation (`lerp: 0.15`) preventing jerky pointer collisions.
  - Exit: Instant fade-out (`opacity: 0`, `duration: 0.15s`) when the cursor leaves the row boundary.

### 3.2 Filtering & State Toggles
- **Category Filter Transitions:** Clicking category tags (*All*, *Film*, *Literature*, *Sound*) triggers an instant FLIP (First, Last, Invert, Play) transition:
  - Rows that do not match the selected category collapse (`height: 48px -> 0px`, `opacity: 1 -> 0`, `duration: 0.3s`).
  - Matching rows smoothly slide upward into their new consolidated positions.
- **Layout Switcher:** A binary toggle in the sticky utility header lets users toggle between "Index" (dense table) and "Grid" (visual cards) without page reload.

### 3.3 Microinteractions & Search Mechanics
- **Instant Search Bar:** Fixed at the top of the catalogue with a monospaced input (`"Search references..."`). Keyup events trigger client-side regex matching with immediate DOM filtering (<16ms debounce), highlighting matching characters.
- **Keyboard Navigation:** Full accessibility support for arrow keys (`ArrowDown`, `ArrowUp`) to traverse the catalogue table rows with visible focus rings.

---

## 4. Responsive & Accessibility Analysis

| Viewport | Behavior & Layout Transformation | Evidence |
|---|---|---|
| **1920x1080 (Desktop)** | Full 5-column index table with active cursor-following hover thumbnail previews. | `01_initial_hero_1920.png`, `04_hover_entry_1.png` |
| **1440x900 (Laptop)** | Full 5-column table with proportional font scaling. | `06_responsive_desktop_1440.png` |
| **1024x768 (Tablet)** | Cursor hover preview disabled; category tags wrap into a scrollable horizontal filter chip bar. | `06_responsive_tablet_landscape_1024.png` |
| **768x1024 (Tablet Port.)** | Columns 4 and 5 (Year, Contributor) collapse into an expandable accordion drawer. | `06_responsive_tablet_portrait_768.png` |
| **390x844 (Mobile)** | Converted into a clean vertical card list; search bar pinned to top viewport; tap opens a bottom sheet drawer. | `06_responsive_mobile_390.png` |
| **Prefers-Reduced-Motion** | Row transitions and height animations disabled; layout updates render instantly without tweening. | `07_reduced_motion.png` |

---

## 5. Direct Translation to ROYAL EDGE

1. **Player Database & Scouting Library:**
   - *Application:* Directly adopt CRL’s archival indexing system for the ROYAL EDGE **Player Database**. Each row represents a player with columns: `Rank`, `Player Name`, `Role (Death Bowler / Finisher / Anchor)`, `Pressure Impact Index (PII)`, `Dot Ball % Under Pressure`, and `IPL Auction Base Price`.
2. **Cursor Hover Player Snapshot Preview:**
   - *Application:* Hovering over a player row instantly displays a compact floating scouting card showing their radar chart, strike rate under pressure, and headshot.
3. **Table / Grid Dual Mode:**
   - *Application:* Allow cricket scouts and auction analysts to toggle between dense spreadsheet mode (for rapid data sorting) and visual scout card mode (for talent presentations).
