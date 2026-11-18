# KHILADI / DELTA CAFÉS — visual acceptance contract

**Scope:** user-supplied ten-page visual audit, real Delta Cafés site, user-supplied button recording, and linked Khiladi/Vercel production.  
**Baseline main:** `e51538d6` (18 November 2026).  
**Working PR:** [#9](https://github.com/harshjha15335/KHILADI/pull/9).

## Direction that must not regress

Khiladi is a **light-first, photographic, editorial cricket experience**, not a generic neon dashboard. Use Delta Cafés' asymmetry, motion staging, alternating quiet/dense chapters and hierarchy without copying its brand assets or page content. Apple's influence means typography discipline, careful spacing, readable interactions, selective translucent glass and responsive precision—not an opaque glass card on every container.

Approved brand: royal blue, Rajasthan-pink, warm white, lavender and restrained gold. **The user's chosen batsman logo retains its original orientation and full blue/pink colour throughout header and loader.** No oversized triangle plaque, decorative box icons or yellow diamond cursor.

## Audited reference locations

| Delta reference | Khiladi counterpart |
|---|---|
| /en, introduction and product storytelling | #home cover, trophy expansion, player parade, history, discovery quiz |
| /en/products | #database and #rankings; photo-led player discovery with filters and factual rankings |
| /en/history and /en/journal | Heritage/photo timeline and match-story scenes |
| /en/coffee-cycle | #methodology evidence-flow diagram, #pressure-lab delivery sequence |
| /en/about | #command-centre editorial product narrative |
| /en/sustainability | Model safeguards, uncertainty and honest data limitations |
| /en/coffee-science-centre | #data-explorer methodology and interpretable data controls |
| /en/barista-academy | #war-room planning education and controls |

### Primary technical proof

The workflow `.github/workflows/delta-visual-audit.yml` captures the **actual rendered browser** at desktop 1440×900 and mobile 390×844, for all 11 Khiladi routes and all nine Delta routes. It additionally captures five live Vercel production routes as a baseline, four vertical scroll checkpoints per route, time-coded loader frames and original Typography Vortex hover/click/recovery frames. Artifacts are uploaded as `delta-khiladi-visual-comparison`.

The workflow fails on **preview** errors/overflow/broken images/missing content. A separate smoke workflow validates production build, actual player interaction, navigation, 390/768/1440/1920 viewport overflow, full-size player rail, true glass footer, colored logo and header, original vortex hover and click suction, semantic iridescent primary CTA and all nine saved quiz combinations.

Initial visual capture (commit 4f9967) confirms: 11 desktop + 11 mobile preview routes returned HTTP 200, had zero uncaught page errors and zero horizontal document overflow; published home photographs loaded, and the original ThreeUI Canvas was present on 9 analytics routes. Two old `documents.iplt20.com` headshots were ORB-blocked in the first iteration and have since been excluded by source policy. Later iterations add more documentary editorial images and portraits.

## Implemented experience foundations

1. **Opening** — continuous KHILA / coloured batsman / DI logo with the same orientation, on warm white; staged letter reveal and transition to homepage; optional replay; never on every internal route change.
2. **Navigation** — slim, milky translucent fixed top bar on desktop, centred logo and five links on either side; compact two-row mobile hierarchy with usable overflow rather than 10 microscopic labels.
3. **Photography** — real user-supplied trophy + five-photo montage; 2008 trophy centre; the collage expands the central photo and disperses the satellites as scroll progresses; no misleading identity or body crops.
4. **Player identities** — exact-name-matched official IPL source URLs when browser-reachable; never hotlink blocked `documents.iplt20.com` headshots; typographic identity fallback rather than repeated generic silhouette. A missing official photo never implies a missing player record.
5. **Data** — 1,217 public historical canonical player records and their stored batting/bowling aggregate metrics remain discoverable. Public legacy impact index must never masquerade as the accepted access-restricted D20 model; private values must never be invented.
6. **Typography Vortex** — original MIT licensed ThreeUI Canvas 2D renderer, `src/vendor/threeui`; original palette, rings, font and pointer interactions (hover dissolution and click suction). Only phrases change to available real cricket metrics, with no invented numerical outputs.
7. **Iridescent CTA** — independent semantic button/link adapting supplied selected button video: luminous blue/violet/pink glass, mouse-following optical reflection, sparkle, pressing, disabled/loading and focus/reduced-motion behaviour. Important actions keep their real functionality.
8. **Inner pages** — photography and editorial spotlights for discovery/rankings/batting/bowling/data/overview; match photo plus striker-bowler portraits for Pressure Lab; photographic comparison; method evidence flow diagram; readable tables and budget tools in foreground.
9. **Footer** — warm white/lavender glass, no trophy image wallpaper, no designer-process attribution, no extraneous decorative mini-logo.
10. **Accessibility** — no vortex pointer interception of controls, semantic buttons, keyboard focus, reduced-motion fallback, stable data layout, real loading/error states.

## Non-negotiable restrictions

- A publicly visible image is **not** an automatic redistribution licence. User-provided pictures remain user-provided; source-linked IPL headshots are not copied into the repo. Clear permissions before any commercial release.
- Do not claim the original Delta FPS/Bezier curves were reverse-engineered if they were only observed through screenshots.
- The source `src/vendor/threeui/LICENSE` is retained, original copyright intact; no bundled font binary redistribution in audit/report outputs.
- The accepted D20 scoring bundle is separate and protected. Do not leak it to static hosting or overwrite it with old pressure indices.
- Do not break functional analytics in pursuit of animations.

## Final review matrix

- [x] Initial user screenshot and PDF gap audit
- [x] 9 Delta pages / 11 Khiladi routes, desktop and mobile in real Chromium
- [x] Original MIT ThreeUI renderer integrated
- [x] Approved coloured mark and orientation
- [x] Iridescent glass action component
- [x] Public Vercel quiz snapshot fallback
- [x] Source-matched player portraits / photo-led sections
- [x] Pressure match photo theatre / methodology visual flow
- [x] Automated responsive, interaction, scroll and data checks
- [ ] Final working-branch screenshot screenshots and motion JSON evaluated after latest changes
- [ ] Final branch QA green with no preview gate failures
- [ ] Merge PR to main, verify both GitHub Pages and Vercel live deployment
- [ ] Last live deployment smoke check

This checklist is deliberately stored alongside the code so future agents have objective acceptance criteria and the user does not need to repeat the same design instructions.
