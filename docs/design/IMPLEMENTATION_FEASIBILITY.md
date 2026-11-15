# ROYAL EDGE: Engineering Feasibility & Technology Stack Analysis

This study evaluates the technical feasibility of the proposed design specification across the production frontend stack (React, TypeScript, Vite, Tailwind CSS, Framer Motion, GSAP, ECharts), assessing effort, performance, and risk mitigations.

---

## 1. Production Architecture Overview

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND CLIENT ARCHITECTURE                    │
├────────────────────────────────────────────────────────────────────────┤
│  • Framework: React 19 + TypeScript + Vite                             │
│  • Styling: Tailwind CSS v4 + Custom Design Tokens (CSS Variables)     │
│  • Motion Orchestration: Framer Motion / Motion (Components & Drawers) │
│  • Scroll Orchestration: GSAP 3.15 + ScrollTrigger (Hero & Scrolly)    │
│  • Smooth Scroll Virtualization: Lenis (Bounded to Hero & Editorial)   │
│  • Charting Engine: Apache ECharts 5 (Hardware-accelerated Canvas)     │
│  • 3D Simulation (Isolated): Three.js / React Three Fiber (Pressure)  │
│  • State Management: Zustand (Fast, non-re-rendering selector hooks)  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Feasibility & Effort Classification

| Proposed Feature / Interaction | Engineering Mechanism | Complexity / Effort | Fallback Strategy | Performance Risk |
|---|---|:---:|---|---|
| **Kinetic SplitText Hero Headlines** | GSAP `SplitText` with line `overflow:hidden` masks | **Low** | CSS `@keyframes slideUp` | Negligible (<1ms render) |
| **Magnetic CTA Pill Buttons** | Framer Motion pointer offset tracking + Spring | **Low** | CSS `:hover` transform | Negligible |
| **Archival Database Table (CRL style)** | React Table (`@tanstack/react-table`) + Virtualizer | **Moderate** | Standard HTML table without virtualizer | Low (<15MB heap) |
| **Cursor Hover Preview Card (CRL style)** | Absolute positioned container with `lerp` lerp interpolation | **Low** | Standard CSS hover tooltip | Low |
| **AUGE-Style Shared Card Expansion** | Framer Motion `<motion.div layoutId="...">` | **Moderate** | Standard route change with fade-in | Zero (DOM native) |
| **Delta-Style SVG Mask Zoom Portal** | CSS `clip-path: path(...)` driven by GSAP ScrollTrigger | **Moderate** | Full-width container crossfade | Low (Compositor accelerated) |
| **Cyera-Style 3D Match Wavefront** | Three.js Particle Mesh + Vertex Shader | **High** | 2D Canvas shockwave ripple in ECharts | Medium (GPU fill rate on mobile) |
| **Ball-by-Ball Timeline Scrubber** | Custom Range Slider bound to Zustand + ECharts `setOption` | **Moderate** | Stepped step-by-step playback buttons | Low (<16ms updates) |
| **Interactive Squad Optimiser (Xi)** | Client-side Linear Programming / Constraint Solver (JS) | **Moderate** | Pre-computed optimal squad templates | Low |

---

## 3. Risk Assessment & Engineering Mitigations

### 3.1 Risk 1: Memory Leaks in Scrollytelling & 3D Shaders
- **Hazard:** Continuously running WebGL animation loops or lingering GSAP ScrollTrigger instances during client-side route changes cause tab slowdowns and fan spin.
- **Mitigation:**
  - Wrap all GSAP animations in `gsap.context()` inside `useEffect` or `useLayoutEffect`, ensuring `ctx.revert()` executes synchronously on component unmount.
  - Three.js WebGL renderers must call `renderer.dispose()`, geometries must call `.dispose()`, and textures must be cleared from GPU memory.

### 3.2 Risk 2: Scroll Virtualization Conflicts with Native Dashboard Tables
- **Hazard:** Lenis smooth scrolling can interfere with table scrolling or sticky column headers inside dense analytical dashboards.
- **Mitigation:** Strictly scope Lenis to the **Cinematic Homepage** and **Methodology Report**. In the **Command Centre, Database, and Auction War Room**, Lenis is explicitly destroyed (`lenis.destroy()`), providing analysts with standard native browser scrolling and instant wheel response.

### 3.3 Risk 3: ECharts Performance During High-Frequency Scrubbing
- **Hazard:** Calling full chart re-renders on every `mousemove` during timeline scrubbing drops frame rate below 30fps.
- **Mitigation:** Use ECharts' targeted `chart.setOption({ series: [...] }, { lazyUpdate: true })` or isolate the scrubbing cursor to an SVG overlay layer sitting directly above a static cached canvas chart.
