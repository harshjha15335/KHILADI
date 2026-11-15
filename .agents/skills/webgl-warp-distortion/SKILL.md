---
name: webgl-warp-distortion
description: Use for selective AUGE-style hover displacement/ripple effects on non-homepage player imagery, while preserving fast readable analytics and graceful fallbacks.
---

# Webgl Warp Distortion

## Workflow
Inspect recorded visual target, decide whether CSS/SVG or WebGL is justified; prefer least complex faithful rendering. If WebGL needed, isolate a small canvas per region or shared renderer, budget DPR, texture sizes, GPU memory, RAF usage and cleanup. Animate image UV displacement/ripple with original shaders, never warp critical labels, numbers, or inputs. Offscreen and reduced-motion states render unwarped static images. Verify homepage route never mounts this effect.
## Exit gate
No canvas context leaks, full-screen distortion, degraded interaction responsiveness, or broken charts.
