# KHILADI / Delta Cafés / Apple-inspired redesign audit

**Date:** 18 November 2026  
**Reference:** https://deltacafes.com/en plus user-provided recordings, screenshots and Apple-style implementation brief.  
**Scope:** public Khiladi frontend, 11 app routes, desktop 1440×900 and mobile 390×844.  
**Repository branch:** fix/delta-apple-visual-audit

## Defect inventory (confirmed in the deployed build before this correction)

| Area | Captured prior build | Corrective implementation |
|---|---|---|
| Primary navigation | Fixed bar near bottom of 900px viewport (top ~803px); far from Delta top bar | Moved to fixed top glass nav, centred Khiladi mark and five items each side |
| Hero imagery | 6 missing gallery JPEG URLs and illustrated fallback; no uploaded photographs | Committed five user-provided photos as optimized WebP; 2008 trophy celebration centre |
| Main hero palette | Loud full-bleed saturated pink despite prior light-first request | Warm white/lavender/light pink gradient with royal-blue editorial serif |
| Player photography | Public production hid official IPL map, mostly repeated generic illustrations | Exact-name-validated links to IPL player images with graceful fallbacks; no third-party file redistribution |
| Data surfaces | Public D20 gate generated technical empty cards and unavailable comparison grids | Public metrics visible in profile/card, public legacy leaderboard, canonical-record analytics and overview |
| Cards | Missing interactive homepage feature bento cards | Interactive photo-led discovery, compare, sample pressure and squad-planning bento sections |
| Motion | Existing scattered GSAP scroll triggers and a long typographic curtain | Staged left/logo/right intro, navigational entrance, pinned trophy portal, horizontally scrolled player parade, heritage reveal and inner page entrance animations |
| Footer | Large blue solid footer disconnected from reference | Contextual translucent photo-backed footer on every route, not a fixed bottom nav |

## Live screenshot coverage

GitHub Actions workflow `.github/workflows/delta-visual-audit.yml` runs Chromium and uploads full screenshot/metric artifacts.

- Delta homepage: desktop at 0%, 35%, 70%, 100%; mobile at 0% and 75%.
- Delta products, about, coffee-cycle and sustainability: desktop screenshots at multiple scroll depths.
- Khiladi homepage: desktop and mobile, equivalent positions.
- All 10 Khiladi inner routes: desktop 0% and 75%.
- Browser console exceptions, broken image references, total image counts, nav position, card counts, overflow are logged per route in `metrics.json`.
- Delta's Cookiebot overlay is declined or visually hidden *only in reference captures*, so underlying layout is measurable.

## Data contract and access truth

- Public data exists at `public/data/player_database.json` (canonical player identities with recorded batting/bowling sample aggregates).
- Public leaderboard files `top_10_batters.json` and `top_10_bowlers.json` each provide 10 inherited-heuristic entries.
- Public squad list `rr_squad_2026.json` has 27 identities; 69 RR-affiliated identities exist in the complete competition pack (these are different groups).
- Public quiz recommendations, sample replay, batting, bowling, comparison, and auction planning remain data-driven.
- **D20 is a separate research model, not a website error code.** Its accepted ratings, uncertainty intervals and protected serving bundle are not authorized for public release. The redesign never copies it to GitHub Pages, conflates it with older indices, or invents its values.
- Public player dialog front and back reveal recorded runs, wickets, pressure deliveries, economy/strike rate and **explicitly labelled legacy pressure impact index**.
- Private analytical tables and sort modes no longer mask the public comparisons and player pool when authorization is absent.

## IPL portraits

- Existing source map contains 60 official IPL player identities/URLs, with exact-name and player-ID validation.
- In the supplied 27-member squad list, 23 identities have a matching existing IPL source entry; 4 do not.
- Browser image probes independently verified that tested Jofra Archer, Yashasvi Jaiswal and Vaibhav Sooryavanshi public IPL image endpoints currently load at 1024×1024.
- Referenced external images can disappear, throttle or change without notice. Fallbacks remain essential.
- A publicly viewable image is **not automatically licensed for redistribution or commercial use**. This implementation links to remote source endpoints and does not copy IPL-owned portrait files into the repository. Review source rights before wider commercial promotion.
- Not all 1,217 canonical identities played in the IPL; do not invent IPL photos for those without an official match.

## Remaining acceptance caveats

- This is a functional adaptation of Delta's navigation/composition and Apple-like interactive principles, not a byte-for-byte clone or guarantee of identical motion frames.
- Browser screenshots must be reviewed manually as well as passing automated tests.
- Licensed use of image assets in the final submitted product is the publisher's responsibility.
- Private D20 figures require a separately authorized data-publication decision; public legacy data is displayed honestly in the meantime.
