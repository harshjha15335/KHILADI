---
name: web-a11y-and-performance
description: Use to enforce WCAG-accessible reading, reduced motion, keyboard interactions, video accessibility, target sizes, LCP/CLS/INP and GPU/CPU resource budgets.
---

# Web A11Y And Performance

## Workflow
Audit color contrast programmatically (especially muted text on dark surfaces). Ensure headings and numbers readable, proper roles, alt texts, captions/transcripts when appropriate, keyboard target sizes and focus order. Implement prefers-reduced-motion with meaning preserved, not simply hide interactive content. Monitor Core Web Vitals, filmstrip, network payload, memory and idle RAF loops. Asset lazy loading and offscreen pause. Test slow connection and low-powered devices. Never claim 60fps from 30fps screen recording.
## Exit gate
No contrast regressions, stuck loading, inaccessible quiz or warped readable labels; documented performance baseline on target devices.
