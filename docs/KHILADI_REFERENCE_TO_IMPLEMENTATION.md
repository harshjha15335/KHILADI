# KHILADI — Reference-to-Implementation Architecture Mapping
**Evidence Source:** `KHILADI_Reference_Recordings_Windows_Fixed/` (16 Split MP4 Clips) & Reference Audits

---

## 1. Reference Site Choreography & Adaptation Matrix

| Reference Site | Reference Clip(s) | Observed Motion & Interaction Behavior | KHILADI Target Implementation | Scope Boundary |
| :--- | :--- | :--- | :--- | :--- |
| **Delta Cafés** | `Recording_153838_part_00.mp4` (~0–17s) | Full-viewport cinematic video, massive triangular brand mark anchor, upward-wiping double pill button with displacement. | Full-bleed multi-clip cricket montage, enormous sculptural Rajasthan Royals crest shield, `KhiladiAnimatedButton` with masked fill and tactile return. | **Homepage Hero only** |
| **Delta Cafés** | `Recording_153838_part_01.mp4` (~17–35s) | Endless horizontal product belt with large products sliding seamlessly across contrasting brand panels. | Infinite parade of authentic, large Rajasthan Royals player cutouts (240–320px figure height) alternating RR pink/navy/purple/cream panels. | **Homepage Section 2** |
| **Delta Cafés** | `Recording_153838_part_02.mp4` (~35–52s) | Layered photographic heritage collage: central archival hero photo surrounded by smaller angled historical photos that zoom and reveal color on hover. | 2008 Inaugural Championship trophy centerpiece surrounded by historical Shane Warne/RR victory photographs with monochrome-to-color hover expansion. | **Homepage Section 4** |
| **Delta Cafés** | `Recording_153838_part_03.mp4` (~52–70s) | Rotating coffee beans quiz: expansive off-white/cream canvas, central question, large 3D orbiting objects revolving smoothly at multiple depths. | Orbiting Player Cutouts Quiz: full-width cream/pale-pink canvas (`#F8F5F4` to `#FFE7F0`), central *"WHO IS YOUR PERFECT MATCH-WINNER?"*, 8–12 large transparent player cutouts revolving in layered elliptical paths. | **Homepage Section 5** |
| **AUGE Experience** | `Recording_153944_part_00` & `01`, `Recording_154049_part_00` | Off-white canvas, pale-lemon yellow diamond cursor follower with velocity physics, subtle opt-in audio chimes, non-homepage image hover warp. | Global `DiamondCursor` (zero React re-renders, compositor-only transform), persistent opt-in sound toggle, selective 3D hover warp on non-homepage visual cards. | **Cursor: Global. Warp: Non-home only.** |
| **Cyera** | `Recording_153838_part_07` to `part_12` (~110–209s) | Deep violet illustrated canvas, floating interactive cards, staged card expansion with parallax depth, smooth exit. | Staged player profile reveal modal: central glass card with depth, sequential biometrics entry, radar diagnostics, and smooth focus trap. | **Global Player Reveal** |
| **CRL** | `Recording_153838_part_06` (~98–110s) | Giant black-and-white typography, dramatic scale/zoom entrance on initial visit. | `CrlPreloader`: Full-screen KHILADI/खिलाड़ी kinetic typography scale and aperture entrance into the hero. | **Initial Mount Only** |
| **Extrafazant** | `Recording_153838_part_04` & `part_05` (~70–98s) | Large editorial sans, word/letter darkening and spatial separation on hover, animated progressive underlines. | `KhiladiKineticText`: Text hover separation and directional underline animations on research headings and navigation. | **Non-Homepage Pages Only** |

---

## 2. Hard Anti-Template Boundaries

1. **NO AUGE Warp on Homepage:** Warp distortion is strictly prohibited on `/`.
2. **NO Extrafazant Text Separation on Homepage:** Restricted to research and database interfaces.
3. **NO Monotonous Dark Canvas:** The homepage must breathe with alternating dark, vivid, and light editorial chapters.
4. **NO Generic SaaS Badge Soup:** Decorative chips like `"LIVE"`, `"VERIFIED"`, `"TACTICAL"` are removed.
