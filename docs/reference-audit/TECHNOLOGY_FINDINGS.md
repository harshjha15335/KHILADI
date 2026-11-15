# Technical Detection & Engineering Audit Findings

This document summarizes confirmed technology stacks, runtime library detections, rendering bottlenecks, and architecture choices derived from automated inspection of all five reference sites.

---

## 1. Empirical Technology Stack Detection Summary

| Website | Framework / CMS | Animation Engine | Plugins & Utilities | 3D / WebGL Status | Scroll Virtualizer | Page Transition Model |
|---|---|---|---|---|---|---|
| **Extrafazant** | Webflow Enterprise | **GSAP 3.15.0** | `CustomEase`, `SplitText`, `DrawSVGPlugin`, TooltipX | None (Pure DOM/SVG) | **Lenis** | **@barba/core 2.10.3** (PJAX) |
| **CRL** | Webflow + Vercel | Vanilla JS Micro-framework | WebFont Loader | None (Pure DOM/CSS) | Native Smooth Scroll | Client-side FLIP State Toggle |
| **Cyera** | Custom JS App | Custom RAF Loop | Web Audio API, GTM | **WebGL 1.0/2.0** (Three.js/Custom Shaders) | Virtualized Spline Controller | Scene Step Morphing |
| **AUGE XP** | **Next.js (Turbopack)** | Custom RAF WebGL Loop | React 19, PP Neue Montreal | **WebGL Canvas (100vw x 100vh)** | Velocity Accumulator | Next.js App Router + Shared WebGL Plane |
| **Delta Cafés**| **Nuxt.js (Vue 3/Vite)**| Vue Transitions + CSS Modules | Scoped CSS, Web Audio API | None (SVG Path Masking & Video) | Native ScrollTrigger | Nuxt Page Transitions (`_payload.json`) |

---

## 2. In-Depth Technical Analysis

### 2.1 GSAP + Lenis + Barba.js (The Extrafazant Model)
- **Why it Excels:** Delivers high visual luxury with rock-solid DOM stability. The page never crashes the GPU or throws out-of-memory errors on older hardware. GSAP's `SplitText` splits typography into masked DOM nodes without disturbing search engine indexing or accessibility when structured properly.
- **Limitations:** Large initial JavaScript bundle if all plugins are loaded synchronously.
- **Application to ROYAL EDGE:** We will implement GSAP + ScrollTrigger specifically for the **Homepage and Section Transitions**, paired with modern React component lifecycles.

### 2.2 Vanilla JS + FLIP Archival Indexing (The CRL Model)
- **Why it Excels:** Near-zero JavaScript overhead (<36 KB total page size!). Instant DOM rendering in under 400ms. Perfect for high-density tabular data sorting and filtering.
- **Limitations:** Lacks cinematic depth when used alone.
- **Application to ROYAL EDGE:** We will model the **Player Database, Top 20 Rankings, and Squad Optimiser** directly on this ultra-fast, zero-jank philosophy.

### 2.3 WebGL Particle & Camera Spline Engineering (The Cyera Model)
- **Why it Excels:** Unrivaled spatial drama. Allows complex non-linear data sets (e.g. multi-dimensional leverage curves) to be experienced as an environment rather than a flat chart.
- **Limitations:** GPU draw call overhead, high mobile thermal dissipation, requires fallback for low-power devices.
- **Application to ROYAL EDGE:** Restricted specifically to the **Pressure Lab Match Replay** and **Win Probability Arena**, built using **Three.js / React Three Fiber** with a strict particle budget (maximum 20,000 vertices).

### 2.4 Next.js WebGL Displacement & Shared-Plane Morphing (The AUGE Model)
- **Why it Excels:** Eliminates the jarring boundary between marketing showcase and project details. The project card literally unfolds into the project page.
- **Limitations:** Requires tight synchronization between WebGL canvas coordinates and DOM bounding boxes.
- **Application to ROYAL EDGE:** Player cards on the homepage will morph smoothly into the **Player Intelligence Profile** using Framer Motion / Motion layout animations (`layoutId="player-card-[id]"`), avoiding WebGL synchronization fragility while achieving identical visual continuity.

### 2.5 Nuxt SVG Path Masking (The Delta Model)
- **Why it Excels:** Uses standard vector paths `<clipPath>` animated via CSS transforms or ScrollTrigger. Hardware-accelerated by the browser's compositor thread without taxing the main JavaScript thread.
- **Application to ROYAL EDGE:** The Rajasthan Royals Royal Shield crest mask transition will be built using CSS `clip-path: path(...)` driven by ScrollTrigger progress.
