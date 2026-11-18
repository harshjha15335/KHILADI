# Feature-to-component matrix

| Reference / evidence | Starting → intermediate → final state | Trigger / reverse | Original implementation | Responsive behavior / verification |
|---|---|---|---|---|
| Delta 00–04 | Full-bleed hero, left headline, independent mark, right stories → chapter switch → ribbon | Click chapter; scroll forward/back | HomePage; independent symbol, coordinated copy/media, two stories and chapter thumbnails | Stories simplify on phone; inspect 6 viewports and continuous scroll |
| Delta 01–03 | Irregular archive → full-width journey with circular hotspots → portrait strip → editorial bridge → discovery | Scroll and hover/focus | HomePage; scrubbed photos, journey topics, canonical portrait strip | Touch buttons replace hover; readable flow/reduced-motion |
| CRL 05–06 | Spaced letters → compact → tipped 3D type → giant takeover → page | Full reload; Escape reverses responsibility to page | CrlPreloader; scoped GSAP sequence; symbol stays separate | Reduced-motion skips; five full reload tests |
| Extrafazant 04–05 | Mixed serif/bold headline → pointer-follow preview and character spacing | Pointer/focus; leave resets | KhiladiKineticText on non-home routes only | Pointer effect only fine/no-preference; no numeric splitting |
| Cyera 07–12 | Selected object → thin white strip → tall blank card → image → staged copy | Click/focus/Enter; close reverses sequence | PlayerProfileReveal; origin geometry, clipping plane, native focus trap | Tall stacked card; internal scroll; reduced-motion immediate |
| AUGE 14–16 | Translating staggered imagery; diamond → contextual image label | Pointer hover; leave resets | PlayerEditorialTrack, DiamondCursor, image-only parallax | Touch scroll track; offscreen pauses; no home warp |

OBSERVED: visible sequence/relative geometry in supplied recordings. INFERRED: CSS transform/GSAP implementation and easing choices. UNVERIFIED: reference source code, proprietary shaders and mobile behavior (no supplied mobile recordings). Blocked asset states must remain explicit.
