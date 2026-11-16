# Motion specifications

All reference timings are estimates from sampled recordings, not source-confirmed values. Source samples are 30 fps, overview sampling 0.5 s (±0.25 s). Implementation durations below are deliberate tunings.

| Effect | Reference observation | Implementation target / layers | Easing / cleanup |
|---|---|---|---|
| CRL | part06 0–1.5 glyph exposure; 1.5–2 assembly; 2.2–2.8 tip; 3–3.5 takeover | 0–0.85 rise, 0.85–1.55 assembly, 1.55–2.05 tip, 2.05–3.1 takeover, 2.65–3.45 reveal. Grey curtain above page; symbol separate | power3/expo inferred; scoped GSAP, body lock restored on skip/unmount |
| Cyera | part11 ~8.8 strip, 9 tall white, 9.4 image, 9.7 text | Origin-to-center 0.3s; strip-to-tall clip 0.5s; image 0.35s; copy 0.35s stagger. Target 420px wide, max 90dvh; image above text | power3.inOut inferred; exact reverse, native dialog focus/scroll restoration |
| Delta | Archive enters individually; discovery different sizes/depth; reverse scroll observed | Scrubbed archive 0.45s lag, journey parallax; 243s seamless parade loop; 3.8–6.4s staggered discovery drift | sine drift, power2 entrances; offscreen/reduced-motion pauses; contexts revert |
| Extrafazant | Small rotated pointer-follow image; mixed serif and bold | Preview ≤120×150px, pointer local position; spacing/underline 0.35s | CSS ease-out inferred; no loop/RAF when idle |
| AUGE | Staggered image-track translation; small yellow pointer label; no proven noise shader | Smooth track translating one duplicated group; image-only XY/skew; 14px yellow diamond and context label | linear track / CSS pointer smoothing; no numerical distortion; touch/reduced fallback |

Layer order: page < media/content < independent brand/header < intro or native dialog top layer < cursor inside current dialog. No WebGL claim is made; the observed image translation is reproduced with transforms.
