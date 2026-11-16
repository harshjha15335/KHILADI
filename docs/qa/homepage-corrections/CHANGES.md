# Targeted homepage corrections

Starting version: `reference-replication/local` at `5829093`, clean; the 46.16-second walkthrough comes from this version. Safe checkpoint: `checkpoint/homepage-corrections-5829093`. Corrections are on `fix/rr-homepage-cinematics`. The public Pages build is older (`523d77e`), so its code was not treated as the recorded implementation.

## Removed

- Hero player portrait cards, player chapter thumbnails, external RR video-link list and permanent media-permission/status copy.
- The 27-player horizontal catalogue directly after hero, its repeated group, tween, visibility observer and focus handlers.
- The entire “Different players. One shared feeling.” portrait strip and its scroll tween.
- The giant-logo “Know the player. Back the moment.” bridge and its entrance tween. No suitable cleared replacement action image was available, so the explicitly authorized removal was used.
- “Follow your curiosity” promotional portrait cards.
- Obsolete portrait/band/crest/logo CSS and unused hero RR-link constants.

## Preserved and corrected

- Existing editorial type, pink/blue theme, compact menu, full-fill button animation, heritage collage, “A Royal story. Still being written.” photographic composition, organic cutout discovery and real quiz.
- Loader assembly/depth/takeover choreography; colours now blue `#2450B8` / white, transitioning toward pink `#ED267B`.
- Exact approved silhouette asset and alpha/proportions. White is a reversible CSS rendering variant of the original source, not a newly drawn logo. No permanent lettering is added. Footer and loader use white; menu/non-home header use original artwork.
- Section-aware header: large centered white mark in hero, compact white navigation identity on blue editorial, hidden before heritage/journey/discovery/closing. Footer has its own deliberate white identity. No giant editorial logo remains.
- Existing scoped GSAP cleanup and refresh after layout/data changes. Removed animation targets no longer create triggers or loops.
- Native authorized-video integration with posters, crossfade and viewport/reduced-motion behavior; real sources remain empty. The moments section is conditional, not another placeholder band.
- Actual image-only SVG displacement on non-home media; see the explicit incomplete AUGE fidelity verdict.

## Main edited files

- `khiladi/frontend/src/pages/HomePage.tsx`: removals, preserved quiz/heritage/journey, conditional actual-film components and section brand attributes.
- `components/CrlPreloader.tsx`, `KhiladiLogo.tsx`, `KhiladiLogo.css`, `Navbar.tsx`, `Footer.tsx`: brand colour/contrast and lifecycle.
- `components/AugeWarpSurface.tsx`: two-axis local displacement and cleanup.
- `components/CinematicVideo.tsx`, `RoyalsMoments.tsx`: native playback and coherent footage sequence, gated on approved assets.
- `src/utils/media.ts`, `src/config/approved-media.json`: source/poster/permission validation, base-aware paths; no actual clip approval fabricated.
- `src/experience.css`, `src/reference.css`: remove dead section styles, preserve type/buttons and add focused brand/video styles.
- `scripts/prepare_approved_rr_media.py`, `scripts/check_pages_artifact.py`, `.gitignore`: explicit-rights media preparation and allowlisting approved media while excluding protected/raw data.
- Updated frontend tests remove superseded parade acceptance checks and add loader-colour, brand lifecycle, non-home X/Y warp and reset checks. Canonical 27-player integrity is still checked in backend tests.
- QA scripts and documents under `scripts/qa/` and this folder.

`KhiladiAnimatedButton.tsx`, backend model/calculations, canonical data and ranking outputs were inspected/preserved. No Windows migration or new paid service was introduced. GitHub Pages settings/workflow and `main` were not changed.
