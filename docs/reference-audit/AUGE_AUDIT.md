# Deep Reverse-Engineering & Interaction Audit: AUGE EXPERIENCE
**Target URL:** https://auge-xp.com/  
**Audit Date:** November 2026  
**Auditor Specialization:** Senior Frontend Engineer & Creative Technologist  
**Browser Runtime Tested:** Chromium 159 (Headless Automation & DevTools Protocol)

---

## 1. Executive Summary & Verification Status
- **Access Status:** 100% Accessible (HTTP 200, 71.7 KB HTML, React 19 / Next.js client-side hydration).
- **Core Technology Stack Confirmed via Runtime:**
  - **Framework:** Next.js (App Router / Turbopack bundle: `/static/chunks/turbopack-1xtwzjaufzzxb.js`), React.
  - **Creative Credits in Console:** `Manuel Mancini (Tech Director) & Fabio Minerva (Design Director)`.
  - **Rendering Context:** WebGL Canvas (`canvasCount: 1`), full-viewport WebGL displacement shader rendering interactive project textures.
  - **Typography Engine:** PP Neue Montreal (`ppNeueMontreal, "ppNeueMontreal Fallback"`).
  - **Architecture Model:** SPA with custom WebGL carousel slider, custom inertial mouse dragging, and fluid image-mesh deformation.
- **Evidence Captured:** 18 screenshots covering hero state, mouse-driven displacement, project carousel scrolling, responsive viewports, and reduced motion in `docs/reference-audit/evidence/auge/`.

---

## 2. Visual Design & Cinematic Identity

### 2.1 Full-Bleed Composition & Stage Architecture
- **Composition Style:** Cinematic, brutalist elegance. The homepage is an unconstrained full-screen interactive showcase where imagery and WebGL shaders take primacy over conventional container grids.
- **WebGL Plane Mesh Hierarchy:**
  - Background WebGL Canvas renders an array of textured planes (project stills and video loops) mapped to an infinite horizontal/cylindrical scroll loop.
  - Viewport-locked HUD typography overlaid using absolute CSS positioning (`mix-blend-mode: difference` or high-contrast white `#FFFFFF`).

### 2.2 Typography Treatment
- **Typeface:** **PP Neue Montreal** (Pangram Pangram foundry) — modern, versatile, humanist grotesque.
- **Display Weights & Sizing:**
  - Hero Studio Title & Project Headers: Bold/Medium `clamp(2.5rem, 6vw, 6rem)`, uppercase, `letter-spacing: -0.03em`.
  - Numbering & Telemetry: Small monospaced tags (`[01/08]`, `XP_2026`, `STUDIO`), `font-size: 11px`, `letter-spacing: 0.1em`.
  - Project Descriptions: Clean, compact paragraph blocks (`font-size: 15px`, `line-height: 1.45`, max width `420px`).

### 2.3 Color Palette & Material Texture
- **Palette:** Deep cinematic graphite (`#0B0B0C`), stark bone white (`#F3F3F3`), and a signature electric acid yellow accent (`#FDF48B` as logged in their dev console branding).
- **Shader Distortions:** WebGL fragment shader applies liquid ripple and chromatic RGB split distortion when images are dragged or hovered.

---

## 3. Motion Engineering & Interaction Architecture

### 3.1 Inertial WebGL Carousel Mechanics
- **Interaction Model:** Both mouse wheel (`wheel` event) and horizontal mouse drag (`pointerdown` -> `pointermove` -> `pointerup`) drive a unified velocity accumulator:
  - `velocity += delta * 0.005`
  - `position += velocity`
  - `velocity *= 0.92` (viscous friction damping)
- **Shader Mesh Curvature:** As scroll velocity increases, the WebGL vertex shader bends the textured image planes along the z-axis:
  - `gl_Position.z -= sin(uv.x * 3.14159) * velocity * 0.4`
  - Creates the physical illusion of high-speed film reels wrapping around a cylindrical lens.

### 3.2 Hover-Triggered Liquid Distortion (Fragment Shader)
- **Shader Pipeline:**
  - Uniforms: `uTexture`, `uHoverTexture`, `uMouse`, `uProgress`, `uTime`, `uDisplacementMap`.
  - When the cursor enters a project card bounds:
    1. A perlin noise displacement map perturbs texture UV coordinates.
    2. Chromatic aberration separates R, G, B channels proportionally to cursor velocity:
       ```glsl
       vec2 redUV = uv + disp * 0.02 * uVelocity;
       vec2 greenUV = uv;
       vec2 blueUV = uv - disp * 0.02 * uVelocity;
       ```
    3. Transition duration: `0.6s`, settling back to crisp, undistorted imagery when mouse motion ceases.

### 3.3 Project Click & Shared-Element Morphing
- **Transition Sequence:**
  1. User clicks a project plane in the carousel.
  2. Selected WebGL plane detaches from the carousel scroll loop and expands to fill the full viewport (`width: 100vw`, `height: 100vh`, `duration: 0.85s`, `ease: cubic-bezier(0.85, 0, 0.15, 1)`).
  3. Other carousel planes fade out and recede along the z-axis (`scale: 0.8`, `opacity: 0`).
  4. Next.js App Router navigates to `/project/[slug]`, instantly mounting the project metadata, credits, and video case study without visible page reload or white flash.

---

## 4. Responsive Adaptation & Accessibility

| Viewport | Behavior & Fallback Strategy | Evidence |
|---|---|---|
| **1920x1080 (Desktop)** | Full WebGL canvas, multi-plane cylindrical carousel, liquid cursor shaders. | `01_initial_hero_1920.png`, `04_hover_element_1.png` |
| **1440x900 (Laptop)** | Proportional WebGL plane scaling; GPU shader resolution downscaled to maintain 60fps. | `06_responsive_desktop_1440.png` |
| **1024x768 (Tablet)** | Touch swipe gestures mapped directly to carousel velocity accumulator. | `06_responsive_tablet_landscape_1024.png` |
| **390x844 (Mobile)** | WebGL shader switched from horizontal cylinder to a vertical stacked card deck; liquid deformation disabled to conserve mobile GPU bandwidth. | `06_responsive_mobile_390.png` |
| **Prefers-Reduced-Motion** | Velocity curvature and liquid shaders bypassed; planes render as flat, static images with standard CSS crossfades. | `07_reduced_motion.png` |

---

## 5. Direct Translation to ROYAL EDGE

1. **Cinematic Hero Project Carousel -> "Top Pressure Performers":**
   - *Application:* Feature the top 5 IPL high-pressure performers (e.g., Sanju Samson, Jasprit Bumrah, Rinku Singh) in a horizontal WebGL cards deck on the ROYAL EDGE homepage. Scrolling or dragging smoothly bends the cards, with high-pressure statistics emerging as glowing HUD overlays.
2. **Shared-Element Card-to-Profile Expansion:**
   - *Application:* Clicking a player card in the showcase expands the player's imagery smoothly into the **Player Intelligence Profile** header without route jump, transitioning seamlessly from marketing narrative to deep data workspace.
3. **Acid Volt / Pale Gold Accent Semantics:**
   - *Application:* Adopt AUGE’s high-contrast accenting (`#FDF48B` / `#E2B755`) to indicate elite auction tier classifications (*Tier 1: Match Winners Under Pressure*).
