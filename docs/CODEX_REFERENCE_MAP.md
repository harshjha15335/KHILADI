# Reference observations and implementation map

These are fresh observations from live references, not endorsements of earlier audit reports. Reference captures are private review evidence, never application assets.

| Reference | Observed evidence | KHILADI implementation | Remaining difference |
|---|---|---|---|
| Delta, 1440 × 900 | `delta-clean-0.png`: full-height film, lower-left serif title, three scene controls, logo centred in persistent top navigation | `HomePage`, `Navbar`, persistent crest, scene controls | On-page footage requires rights. Local opening crest scale is adapted to the user's request for a dominant mark; exact original-recording parity is unavailable. |
| Delta product band | `delta-clean-650.png`: short, saturated horizontal product panels immediately below hero | Compact names-only parade, two identical groups, linear loop, pause control and focus pause | Player proportions differ from coffee packs; four inherited portraits were fake graphics; Yashasvi now uses an official transparent original in private review, while three portraits remain unavailable and use initials. |
| Delta history | `delta-clean-1100.png`, `delta-clean-1500.png`: centred condensed editorial title, dispersed overlapping photographs, small contextual captions | Blue editorial scene and scroll-responsive photographic composition with grayscale/colour focus and hover states | Requested 2008 trophy-lift photo is still missing. Current private review photographs are an accurately labelled Warne archive, not falsely dated 2008 images. |
| Delta quiz | `delta-clean-5600.png`, `delta-clean-6800.png`: scroll-dependent scattered product field, no constant planetary rotation | Reversible ScrollTrigger entry of transparent player figures around central question, no orbit paths; working API quiz | Positions and timing are adapted from live observations; no supplied recording exists for frame-accurate comparison. |
| Delta CTA | Live pill text and separate arrow cap; hover interaction inspected with browser | Upward fill, paired text roll, diagonal arrow replacement, reversible CSS hover/focus | 550 ms easing is an implementation choice; exact reference curve is not claimed. |
| CRL | `crl-stage-0..13.png`: separated glyphs, filling interiors, convergence/rotation, huge zoom followed by underlying page | Original seven-glyph KHILADI timeline, staggered rise, convergence/rotation, extreme zoom and curtain reveal, session once/Escape/reduced motion | Original CRL stencil glyphs and their internal fill are not copied. This is an adaptation, not a verified exact match. |
| AUGE | `auge-hover-*.png`, reference video: diamond cursor and pointer-sensitive surfaces | Single demand-driven cursor, optional original synthesized sounds, SVG displacement restricted to non-home images | SVG displacement is not claimed to match the original shader; sound character is original. |
| Cyera | `cyera-initial.png`, `cyera-software-gpu.png`: “Your browser is not supported”, including a WebGL2-enabled retry | Accessible native dialog with layered sheet, transform entrance, staggered content and reversed close | Exact Cyera entry/exit geometry cannot be verified. |
| Extrafazant | `extrafazant-initial.png`, live heading/link inspection | Selected analytical headings use staggered per-character transforms; directional underline on research links | Exact original-recording timing is not available. |

## Motion implementation values

- Intro: glyph rise 0.75 s with 0.09 s stagger; convergence 0.65 s; scale-to-16 zoom 1.15 s; curtain 0.8 s, overlapping; total about 3 s.
- Hero crest: fixed within cinematic route, scrubs from its large opening position to a small top-centre mark; mobile layout adapts position and scale. Unmounting the homepage removes it.
- Parade: 27 players, duplicate group inaccessible to assistive technology; 148.5-second cycle, approximately 42 px/s on desktop. Pause preserves timeline position. Offscreen motion pauses. Reduced-motion uses a manually scrollable list.
- Editorial: reversible vertical translation without reducing text contrast.
- Photos: reversible scroll entrance, alternating ±3° final rotation, grayscale removed by hover or keyboard focus.
- Quiz: coordinated entrance from outside the final layout, individual stagger, 0.5-second scrub smoothing; settles without continual revolution. Reverse scrolling unwinds it.
- Profile: 0.55 s sheet entrance; 0.35 s content entrance with 0.065 s stagger; reverse close at 1.6× speed. Native dialog provides focus containment; prior focus is restored.

## Acceptance status

Functional and accessibility evidence is separate from visual fidelity. The browser suite cannot establish visual equivalence. A real side-by-side comparison is supplied for review, with known differences above. No exact-fidelity PASS is awarded while original recordings, Cyera reference access and required media remain unavailable.
