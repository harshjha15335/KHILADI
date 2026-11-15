# Consolidated Motion Design & Animation Catalogue

This catalogue documents every significant confirmed animation pattern observed across the 5 reference sites, organized into a reusable taxonomy with implementation blueprints for **ROYAL EDGE**.

---

## Taxonomy A: Page-Level Motion

### A.1 Barba / SPA Curtain Wipe Transition
- **Observed In:** EXTRAF AZANT (`@barba/core 2.10.3`)
- **Trigger:** Internal route change (e.g., clicking navigation link).
- **Visual Description:** As the current page fades out with a slight vertical rise (`y: -30px`), a high-contrast dark overlay curtain wipes up from the bottom of the viewport (`scaleY: 0 -> 1`), covers the screen, the route switches instantly, and the curtain wipes off upward (`transformOrigin: top`, `scaleY: 1 -> 0`) revealing the new page.
- **Timing & Easing:** Outgoing: `0.45s`, `power2.in`; Curtain reveal: `0.5s`, `power3.out`.
- **ROYAL EDGE Application:** Global page transitions between Homepage, Command Centre, and Pressure Lab.
- **Implementation Strategy:**
  ```tsx
  // Framer Motion / Motion implementation
  <AnimatePresence mode="wait">
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.35, ease: [0.7, 0, 0.84, 0] } }}
    >
      {children}
    </motion.div>
  </AnimatePresence>
  ```

### A.2 Fullscreen WebGL Shared-Element Zoom
- **Observed In:** AUGE XP
- **Trigger:** Clicking a project thumbnail plane in the WebGL carousel.
- **Visual Description:** The selected 3D plane detaches from the scroll loop, its aspect ratio morphs to `100vw x 100vh`, while non-selected planes drop opacity and scale down.
- **Timing & Easing:** `0.85s`, `cubic-bezier(0.85, 0, 0.15, 1)`.
- **ROYAL EDGE Application:** Clicking a player card in the "Top 10 Pressure Performers" hero carousel expands seamlessly into their full **Player Intelligence Profile**.

---

## Taxonomy B: Section-Level Motion

### B.1 SVG Logo Aperture Mask Zoom (`TransitionLogoMask`)
- **Observed In:** DELTA CAFÉS (`TransitionLogoMask.DT4Lfp-V.css`)
- **Trigger:** Continuous scroll progress through section anchor.
- **Visual Description:** An SVG silhouette of the brand monogram scales from `scale(1.0)` up to `scale(35.0)` centered on the screen, creating an optical portal through which the underlying section video/content is entered.
- **Timing & Easing:** Scrubbed via ScrollTrigger (`scrub: 1`, duration `1200px` scroll distance).
- **ROYAL EDGE Application:** The Rajasthan Royals Royal Lion Crest expands as the user scrolls from the Homepage hero into the Auction Strategy War Room.

### B.2 Dual-Column Asymmetrical Parallax Cascade
- **Observed In:** EXTRAF AZANT
- **Trigger:** Continuous page scroll.
- **Visual Description:** Left column remains sticky with fixed narrative typography; right column scrolls project cards at `1.35x` normal speed with alternating vertical offsets.
- **ROYAL EDGE Application:** Batting vs. Bowling tactical showcases in the Methodology chapter.

---

## Taxonomy C: Component-Level Motion

### C.1 Magnetic Pill CTA with Spring Physics
- **Observed In:** EXTRAF AZANT
- **Trigger:** Mouse hover & move within `40px` radius of button.
- **Visual Description:** The button translates toward the cursor (`±12px` X, `±8px` Y). On mouse leave, the button snaps back with spring oscillations.
- **Timing & Easing:** Hover follow: interpolated `0.1s`; Leave spring: `0.7s`, `elastic.out(1, 0.3)`.
- **ROYAL EDGE Application:** Primary action buttons (*"Launch Command Centre"*, *"Shortlist for Auction"*, *"Download Pressure Dossier"*).

### C.2 FlIP Table-Row Filtering & Reordering
- **Observed In:** CRL (`main.js`)
- **Trigger:** Selecting a filter tag (e.g., *Death Overs Specialist*, *Anchor*, *Powerplay Wicket-taker*).
- **Visual Description:** Non-matching rows animate height to 0 and fade out; remaining rows glide smoothly into their new consolidated positions without jumping.
- **Timing & Easing:** `0.35s`, `cubic-bezier(0.16, 1, 0.3, 1)`.
- **ROYAL EDGE Application:** Filtering the 250+ player auction database by price band, role, or leverage tier.

---

## Taxonomy D: Typography Motion

### D.1 GSAP SplitText Kinetic Character & Word Stagger
- **Observed In:** EXTRAF AZANT (`SplitText.min.js`)
- **Trigger:** Viewport entry / ScrollTrigger intersection.
- **Visual Description:** Headline is split into individual characters and lines. Each line is masked with `overflow: hidden`. Characters rise from `translateY(110%)` to `0%` with a staggered delay of `0.015s` per character.
- **Timing & Easing:** `0.85s`, `power3.out`.
- **ROYAL EDGE Application:** Cinematic headlines on Homepage and Pressure Lab entry points.

### D.2 Monospaced Telemetry Scramble / Counter Roll
- **Observed In:** CYERA & CRL
- **Trigger:** Number entering view or data update.
- **Visual Description:** Numeric metrics (e.g., Win Probability `42.8%`, Pressure Impact Index `8.94`) roll rapidly through random digits before locking onto the final verified statistic.
- **Timing & Easing:** `1.2s`, `power2.out`, 60 updates/sec.
- **ROYAL EDGE Application:** Live win probability indicators, auction purse counter, and player pressure indexes.

---

## Taxonomy E: Data Visualisation & Pressure Dynamics Motion

### E.1 Dynamic Pressure Wavefront Shockwave
- **Observed In:** CYERA (Particle radial displacement shader)
- **Trigger:** Match event (e.g., Wicket falling or 6 hit in final over).
- **Visual Description:** A concentric glowing pulse propagates outward across the match timeline; data points oscillate and shift colors according to the delta in expected outcome.
- **Timing & Easing:** `0.75s`, exponential decay wave.
- **ROYAL EDGE Application:** Visualizing critical turning points in IPL match replays inside the **Pressure Lab**.

### E.2 ECharts Win-Probability Stream Morph
- **Observed In:** Synthesized for ROYAL EDGE from CRL data density + Cyera atmospheric curve.
- **Trigger:** Scrubbing the delivery-by-delivery slider in Pressure Lab.
- **Visual Description:** The win probability curve smoothly draws across the canvas (`stroke-dashoffset` animation), with high-leverage balls highlighted with golden pulsating markers.
- **Timing & Easing:** Continuous real-time scrubbing (<16ms frame render).
