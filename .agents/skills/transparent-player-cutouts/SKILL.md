---
name: transparent-player-cutouts
description: Use to create and QA transparent-background player cutouts solely from authorised IPL official portraits for the Delta-style orbiting quiz; no rectangular photo backgrounds.
---
# Transparent Player Cutout Art Direction

## Visual goal
Orbiting cricket players must appear as isolated human figures/heads floating around the question. No image/card background, stadium scene, stock backdrop or opaque portrait rectangle.

## Asset workflow
1. Require a verified IPL official player portrait, matched to a whitelisted player_id, with permission to edit and render derivative cutouts.
2. If the portrait already has alpha transparency, inspect directly. If licensed for modification and opaque, segment subject with a foreground matte using a legally permitted local image-processing approach; do not alter facial identity or clothing logos. Preserve the original immutable file and document derivative step.
3. Export optimised RGBA WebP or PNG; check nonopaque alpha beyond bounding silhouette. Detect edge halos and colour fringing on pink, navy and white test surfaces; crop without clipping bats, hair or shoulders.
4. Keep sizing consistent by silhouette bbox rather than source canvas size. Use `object-fit: contain`, no `background-image` and no CSS photo tiles.
5. On performance-constrained devices, use fewer cutouts or static layout, never flattened background-photo rectangles.
6. When derivative modification permission is unavailable, use a name-based or abstract silhouette fallback, and mark the real cutout as blocked.

## Tests
Check alpha extrema, bounding-box occupancy, edge artefacts, correct player identity, licence status, allowed_player_id, mobile overflow, rendering over 3 brand colours.

## Exit gate
No photo backgrounds, no third-party portraits, no unlicensed modifications, no images of incorrect players.
