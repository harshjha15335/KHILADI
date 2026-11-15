# Deep Reverse-Engineering & Interaction Audit: DELTA CAFÉS
**Target URL:** https://deltacafes.com/en  
**Audit Date:** November 2026  
**Auditor Specialization:** Senior UX Architect & Motion Choreographer  
**Browser Runtime Tested:** Chromium 159 (Headless Automation & DevTools Protocol)

---

## 1. Executive Summary & Verification Status
- **Access Status:** 100% Accessible (HTTP 200, 519.9 KB initial payload, Nuxt.js SSR / Vue 3 hydration).
- **Core Technology Stack Confirmed via Runtime:**
  - **Framework:** Nuxt.js (Vue 3, Vite-powered bundle: `/_nuxt/BUfTxZIz.js`, `_payload.json`).
  - **CSS Component System:** Component-scoped CSS modules confirmed via bundle inspection:
    - `TransitionLogoMask.DT4Lfp-V.css` (SVG / CSS mask clipping transitions).
    - `QuizWrapper.BkXb9FNN.css` (Interactive multi-step product discovery quiz).
    - `JournalCardsList.CLowEg_w.css` (Editorial narrative list).
    - `PopupArea.C0DIm-_Q.css`, `TagFlag.BCy09Tyz.css`, `Footer.mdCQ3N1U.css`.
  - **Rendering Model:** Hybrid SSR with rich client-side animation orchestration, video textures, and SVG path masking.
- **Evidence Captured:** Viewport captures across 0%, 10%, 25%, 50%, 75%, 100% scroll depth, hover states, responsive viewports, and reduced motion in `docs/reference-audit/evidence/delta/`.

---

## 2. Visual Design & Editorial Brand Narrative

### 2.1 Narrative Scrollytelling Architecture
- **Composition Philosophy:** Emotional brand storytelling transitioning through distinct chapters (Origins, Sustainability, Master Roasters, Product Portfolio, Interactive Coffee Quiz, Community Journal).
- **Section Sequencing & Continuity:**
  - Sections do not abrupt cut; they dissolve and morph using continuous SVG mask reveals (the iconic Delta coffee bean / triangular crest silhouette serves as an optical mask that expands to reveal the subsequent video layer).
  - Pinned editorial split screens: Left side holds an editorial chapter headline and paragraph; right side plays high-definition video loops that advance smoothly as the user scrolls.

### 2.2 Typography Hierarchy
- **Primary Typefaces:** Custom elegant serif for editorial headlines paired with a geometric sans-serif for functional UI and product descriptions.
- **Scale:**
  - Hero Chapter Titles: `clamp(3rem, 7vw, 6.5rem)`, `line-height: 1.05`, editorial serif.
  - Subheadings & Category Labels: `0.875rem` (14px), all-caps, tracked out (`letter-spacing: 0.15em`).
  - Narrative Body Copy: `1.125rem` (18px), `line-height: 1.6`, rich dark charcoal on warm almond background.

### 2.3 Color Scheme & Emotional Warmth
- **Warm Heritage Tones:** Rich espresso roasted brown (`#22140E`), creamy warm almond / oat milk (`#F4EFEA`), deep terracotta, and warm golden ochre accents (`#D49B42`).
- **Dark-to-Light Alternation:** The page transitions intentionally from a dark, brooding hero stage into an airy, high-contrast editorial reading surface, resetting user fatigue during long-form exploration.

---

## 3. Motion Engineering & Interaction Architecture

### 3.1 TransitionLogoMask Mechanics (SVG Clip-Path Morphing)
- **CSS Module Confirmed:** `TransitionLogoMask.DT4Lfp-V.css`.
- **How It Works:**
  - A fixed SVG `<clipPath id="delta-mask">` containing a path representing the brand's geometric symbol is scaled and transformed via scroll progress:
  - Scroll Range: `[top: 2000px -> 3200px]`.
  - Transform: `scale(1.0) -> scale(35.0)` anchored at the center of the viewport (`transform-origin: 50% 50%`).
  - Outcome: The user literally flies "through" the icon aperture, revealing the vibrant farm origins footage underneath without an awkward jump cut.

### 3.2 Multi-Step Interactive Quiz (`QuizWrapper.BkXb9FNN.css`)
- **Interaction Journey:**
  1. An embedded 4-step interactive diagnostic quiz embedded seamlessly into the page scroll.
  2. Question cards transition horizontally (`transform: translateX(-100%)`, `opacity: 0 -> 1`) with spring easing upon selecting an answer pill.
  3. Real-time recommendation engine computes the user's taste profile and animates the recommended coffee product card into view with particle aroma flourishes.

### 3.3 Audio Toggle & Ambient Immersion
- **Microinteraction:** Sticky floating sound icon at bottom right. Clicking triggers a soft audio fade-in (`gainNode.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + 1.5)`) delivering binaural coffee brewing and rainfall soundscapes.

---

## 4. Responsive Adaptation & Accessibility

| Viewport | Behavior & Layout Adaptations | Evidence |
|---|---|---|
| **1920x1080 (Desktop)** | Full pinned split-screen narrative, SVG mask zoom transitions, embedded quiz. | `01_initial_hero_1920.png`, `02_scroll_50pct.png` |
| **1440x900 (Laptop)** | Optimized padding, synchronized video scrubs. | `06_responsive_desktop_1440.png` |
| **1024x768 (Tablet Land.)** | Pinned scroll reduced to 1.5x duration to prevent excessive finger swipe fatigue. | `06_responsive_tablet_landscape_1024.png` |
| **768x1024 (Tablet Port.)** | Split screen converts to stacked cards: video on top, narrative underneath. | `06_responsive_tablet_portrait_768.png` |
| **390x844 (Mobile)** | SVG mask zoom simplified to a circular aperture reveal; interactive quiz full-viewport touch card slider. | `06_responsive_mobile_390.png` |
| **Prefers-Reduced-Motion** | SVG mask zoom replaced with standard crossfade; video auto-play pauses with manual play button. | `07_reduced_motion.png` |

---

## 5. Direct Translation to ROYAL EDGE

1. **Brand Crest Aperture Transition (The Royal Edge Shield):**
   - *Application:* Adapt Delta’s `TransitionLogoMask` using Rajasthan Royals’ iconic royal crest / lion monogram. As the user scrolls past the Hero narrative, the monogram expands dramatically (`scale: 1 -> 40`), serving as a cinematic lens through which the user enters the **IPL Auction War Room** or **Intelligence Command Centre**.
2. **Interactive Strategy Quiz -> "Auction Role Gap Diagnostic":**
   - *Application:* Adapt the `QuizWrapper` mechanics into an interactive tool for Rajasthan Royals scouts: *"What is RR's most pressing squad deficit?"* (e.g., Death overs run rate > 11.5, Powerplay spin wicketlessness). Selecting answers dynamically shortlists 3 matching targets from our auction database with animated card entry.
3. **Pacing & Emotional Dark-to-Light Transitions:**
   - *Application:* Ground the homepage in high-octane dark stadium night lighting, then smoothly transition into high-contrast, clean analytical surfaces for batting/bowling statistics tables.
