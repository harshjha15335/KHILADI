# ROYAL EDGE: Page Experience Architecture & Interaction Map

This document maps all 14 designated pages across the three architectural experience layers, establishing their layout structure, motion density, data models, and transition handoffs.

---

## 1. Architectural Experience Layer Allocation

```
┌────────────────────────────────────────────────────────────────────────┐
│                        LAYER 1: CINEMATIC HOOK                         │
│  • Page 1: Cinematic Homepage & SupeRR Selector Intro                  │
│  • Pinned hero, WebGL top performers, SplitText kinetic headlines      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Barba/Framer Motion Route Transition
┌───────────────────────────────────▼────────────────────────────────────┐
│                  LAYER 2: PROFESSIONAL ANALYTICS WORKSPACE             │
│  • Page 2: Intelligence Command Centre (Executive Summary & KPIs)      │
│  • Page 3: Player Database (250+ Scored Players, CRL-Style Table/Grid) │
│  • Page 4: Player Intelligence Profiles (Deep Radar & Delivery Splits) │
│  • Page 5: Batting Pressure Intelligence (Death Overs & Collapse Rates)│
│  • Page 6: Bowling Pressure Intelligence (Defending Sub-10 RRR)        │
│  • Page 8: Player Comparison Studio (Head-to-Head Radar & Scenarios)   │
│  • Page 9: Performance Forecast Studio (Pressure-Adjusted Monte Carlo) │
│  • Page 10: Rajasthan Royals Auction War Room (Purse, Slots, RTM)      │
│  • Page 11: Squad Optimiser (Xi Balance, Death Overs Resource Deficit) │
│  • Page 13: Final Top 20 Official Rankings (SupeRR Selector Core)      │
│  • Page 14: Methodology, Equations & Data Integrity Audit             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Instant Deep-Link Exploration
┌───────────────────────────────────▼────────────────────────────────────┐
│               LAYER 3: INTERACTIVE DATA STORYTELLING                   │
│  • Page 7: Pressure Lab (Ball-by-Ball Timeline & Match Replay)         │
│  • Page 12: Model Validation Lab (Backtesting & Feature Importance)    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Detailed Page-by-Page Specifications

### Page 1: Cinematic Homepage
- **Layer:** Layer 1 (Cinematic Hook).
- **Core Elements:**
  - Hero with GSAP SplitText kinetic headline: *"WHO RISES WHEN THE PRESSURE PEAKS?"*
  - Floating Live Auction Telemetry Ticker (RR Purse: ₹120.0 Cr, Slots: 25, RTMs: 4).
  - AUGE-inspired 3D curved carousel highlighting Top 5 Pressure Performers with shared-element expansion.
  - Delta-inspired Royal Lion Crest aperture zoom transitioning into Command Centre.
- **Motion Level:** High (GSAP, Lenis, Framer Motion, subtle Three.js).

### Page 2: Intelligence Command Centre
- **Layer:** Layer 2 (Professional Workspace).
- **Core Elements:**
  - Executive KPI cards: Total Players Scored (482), High-Pressure Deliveries (38,410), RR Target Fit Index.
  - Global Search Bar (`Cmd+K`) with instant player autocomplete.
  - Quick-action shortcuts to Batting, Bowling, and Auction War Room.
- **Motion Level:** Low (Instant, <150ms transitions, zero scroll hijacking).

### Page 3: Player Database (Archival Index)
- **Layer:** Layer 2 (Professional Workspace).
- **Core Elements:**
  - CRL-inspired dense table/grid layout switcher.
  - Columns: Rank, Player, Role, PII Score, Dot Ball %, Base Price, RR Fit Tier.
  - Live cursor-tracking hovering player snapshot preview.
  - Instant multi-variable filter chips (Overseas, Indian Uncapped, Death Overs, Anchor).
- **Motion Level:** Low (FLIP row animations, instant filter response).

### Page 4: Player Intelligence Profiles
- **Layer:** Layer 2 (Professional Workspace).
- **Core Elements:**
  - Expandable header with player headshot, biometric & role metadata.
  - Dual Radar Charts: Normal Match State vs. Extreme Pressure State.
  - Ball-by-ball heatmaps (Pitch map & Wagon wheel) filtered by high leverage.
- **Motion Level:** Medium (Radar chart line draw on mount, tab crossfades).

### Page 7: Pressure Lab & Match Replay Stage
- **Layer:** Layer 3 (Data Storytelling).
- **Core Elements:**
  - Interactive match selector (e.g. *RR vs GT, IPL 2022 Final*, *MI vs CSK 2019 Final*).
  - Ball-by-ball horizontal scrubber with color-coded leverage dots (Green -> Amber -> Red).
  - Real-time win probability area chart scrubbing dynamically with the playback head.
  - Cyera-inspired shockwave pulse on major wicket events.
- **Motion Level:** High (Synchronized timeline scrubbing, SVG waveform morphing).

### Page 10: Rajasthan Royals Auction War Room
- **Layer:** Layer 2 (Professional Workspace).
- **Core Elements:**
  - Live budget allocation dashboard (Purse Tracker: ₹120 Cr with animated decrement gauge).
  - Squad slot matrix (Overseas: 8 max, Batsmen: 6, All-rounders: 5, Bowlers: 8).
  - RTM Strategy Evaluator (Simulates retain vs. auction bid outcomes).
  - One-click export of Rajasthan Royals Auction Dossier (PDF/CSV).
- **Motion Level:** Low (Tactical, instant recalculation, strict numerical clarity).

### Page 13: Official Top 20 Pressure Rankings
- **Layer:** Layer 2 (Professional Workspace) — **Core Deliverable**.
- **Core Elements:**
  - Top 10 Batting Pressure Performers & Top 10 Bowling Pressure Performers.
  - Verified Pressure Impact Index (PII), Statistical Significance ($p < 0.01$), Sample Delivery Count.
  - Expandable evidence drawer for each ranked player showing the exact math and match evidence.
- **Motion Level:** Low (Pristine editorial authority, printable/exportable view).
