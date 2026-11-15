---
name: orbiting-player-quiz
description: Build the Delta-inspired orbiting cricket-player quiz using only whitelisted players, IPL-official-sourced transparent cutouts, and a no-photo-background design.
---
# Orbiting Player Quiz — Transparent Player Cutouts

1. Use `player-whitelist-integrity` to form every selectable and recommended player ID.
2. Portraits must originate from `iplt20.com` official player pages; preserve player-ID-to-source evidence in portrait manifest.
3. In the quiz's orbit **do not display any photo backgrounds**. This means no rectangular background baked into player photos, photo cards/tiles or photographic background images behind the orbit. Render isolated players as transparent RGBA PNG or WebP where lawful to create and use. Use `object-fit: contain` and a transparent artboard; verify alpha channel and inspect edges/halos at multiple background colours.
4. If official IPL images do not come with transparency and derivative background removal is not authorised, use non-photographic abstract silhouettes / name-only orbits. Do not fetch a different site's transparent cutout and do not secretly remove an image's background contrary to rights.
5. Build the orbit with GSAP/CSS/SVG transforms first. Responsive and reduced-motion fallback uses static grid of player silhouettes/portraits with no background photo blocks.
6. Quiz should include role, match phase, expected impact vs reliability, and contextual pressure questions tied to model-supported data. Keep back/forward, keyboard and touch controls. Never preselect fame-based recommendations.
7. Provide evidence: full-motion desktop capture, mobile capture, alpha-channel check, all IDs whitelist pass, six-or-more portrait-source audit (if images are available), empty state, sound muted by default.
## Exit gate
No non-whitelisted player. No photo backgrounds in orbit. No non-IPL portrait source. Quiz results reflect actual model data.
