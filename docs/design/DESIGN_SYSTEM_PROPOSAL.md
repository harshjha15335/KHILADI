# ROYAL EDGE: Design System Specification & Token Architecture

**Design System Name:** **AURA (Analytical Unified Royal Architecture)**  
**Version:** 1.0.0 (Phase 0 Specification)  
**Target Platform:** React 19, TypeScript, Tailwind CSS, Framer Motion, GSAP, ECharts

---

## 1. Color Token Architecture

The color system blends the high-prestige identity of the Rajasthan Royals with dark-mode quantitative terminal clarity.

### 1.1 Foundation Neutrals (The Obsidian Stadium Spectrum)
```css
:root {
  --color-surface-bg: #07080B;           /* Deep stadium obsidian void */
  --color-surface-card: #0E1017;         /* Elevated card background */
  --color-surface-elevated: #151824;     /* Modal, drawer & floating preview */
  --color-surface-hover: #1E2235;        /* Interactive row hover tint */
  
  --color-border-subtle: rgba(255, 255, 255, 0.08); /* Hairline table dividers */
  --color-border-medium: rgba(255, 255, 255, 0.16); /* Card perimeter borders */
  --color-border-active: rgba(255, 255, 255, 0.32); /* Focus & selected states */
  
  --color-text-primary: #F8F9FA;         /* 100% white crisp primary text (Contrast 18:1) */
  --color-text-secondary: #9DA3B4;       /* 60% slate grey metadata (Contrast 6.8:1) */
  --color-text-muted: #5D6375;           /* 40% subtle labels (Contrast 4.6:1) */
}
```

### 1.2 Signature Brand Accents (Rajasthan Royals Heritage Modernized)
```css
:root {
  /* Rajasthan Pink — Used for high-voltage moments & active highlights */
  --color-brand-pink: #E81274;
  --color-brand-pink-glow: rgba(232, 18, 116, 0.25);
  
  /* Royal Navy / Midnight Cobalt — Primary structural accent */
  --color-brand-navy: #0F172A;
  --color-brand-navy-accent: #2563EB;
  
  /* Burnished Gold — Reserved for Tier 1 Pressure Winners & Auction Top Targets */
  --color-brand-gold: #E2B755;
  --color-brand-gold-glow: rgba(226, 183, 85, 0.3);
  
  /* Neon Volt / Electric Lime (Extrafazant inspired) — Used for live real-time pulse */
  --color-accent-volt: #D4FF00;
}
```

### 1.3 Statistical & Pressure Semantics
```css
:root {
  --color-pressure-extreme: #EF4444;    /* Crimson Red: Leverage Index > 3.0 */
  --color-pressure-high: #F59E0B;       /* Amber Gold: Leverage Index 1.8 - 3.0 */
  --color-pressure-medium: #3B82F6;     /* Cobalt Blue: Leverage Index 1.0 - 1.8 */
  --color-pressure-low: #10B981;        /* Emerald Green: Low leverage / garbage time */
  
  --color-metric-win: #10B981;          /* Win probability delta positive */
  --color-metric-loss: #EF4444;         /* Win probability delta negative */
}
```

---

## 2. Typography Token Scale

Inspired by CRL's monospaced archival discipline paired with Extrafazant's bold display presence.

- **Primary Display Font:** `Space Grotesk`, `-apple-system`, `sans-serif` (Cinematic headlines, section titles).
- **Primary Body Font:** `Inter`, `sans-serif` (Analytical tables, descriptive text, UI controls).
- **Quantitative & Telemetry Font:** `JetBrains Mono`, `ui-monospace`, `monospace` (Match stats, ball indicators, auction prices).

```css
:root {
  --font-display: "Space Grotesk", sans-serif;
  --font-body: "Inter", sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  /* Typography Scale */
  --text-hero: clamp(3.25rem, 7.5vw, 6.75rem); /* Line height: 0.95; tracking: -0.04em */
  --text-h1: clamp(2.25rem, 4.5vw, 4.0rem);     /* Line height: 1.05; tracking: -0.03em */
  --text-h2: clamp(1.75rem, 3.0vw, 2.75rem);     /* Line height: 1.15; tracking: -0.02em */
  --text-h3: 1.5rem;                             /* 24px, Line height: 1.25 */
  --text-body-lg: 1.125rem;                      /* 18px, Line height: 1.5 */
  --text-body: 1.0rem;                           /* 16px, Line height: 1.5 */
  --text-body-sm: 0.875rem;                      /* 14px, Line height: 1.45 */
  --text-caption: 0.75rem;                       /* 12px, Line height: 1.4; tracking: 0.05em */
  --text-mono-data: 0.8125rem;                   /* 13px, Line height: 1.35; tabular nums */
}
```

---

## 3. Spatial & Grid Architecture

- **Baseline Spacing Unit:** `4px` with strict `8px` increments (`8px`, `16px`, `24px`, `32px`, `48px`, `64px`, `96px`, `128px`).
- **Container Max-Widths:**
  - `container-hero`: `1600px` (Expanded cinematic stage).
  - `container-workspace`: `1440px` (Optimal reading and 12-column table width).
  - `container-editorial`: `840px` (Methodology paper and narrative text).
- **Border Radius Hierarchy:**
  - `--radius-sm`: `4px` (Tags, table row highlights, monospaced badges).
  - `--radius-md`: `8px` (Buttons, input fields, dropdown menus).
  - `--radius-lg`: `16px` (Player cards, chart containers, modal windows).
  - `--radius-full`: `9999px` (Pill CTAs, floating status chips).

---

## 4. Elevation, Blur & Surface Treatment

```css
:root {
  --shadow-card: 0 4px 20px -2px rgba(0, 0, 0, 0.5);
  --shadow-floating: 0 12px 32px -4px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255, 255, 255, 0.1);
  --shadow-neon-pink: 0 0 24px -2px rgba(232, 18, 116, 0.4);
  --shadow-neon-gold: 0 0 24px -2px rgba(226, 183, 85, 0.35);
  
  --backdrop-blur-nav: blur(16px);
  --backdrop-blur-card: blur(8px);
}
```
