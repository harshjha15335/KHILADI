# KHILADI — Current UI & Performance Failures Audit
**Date:** 2026-11-15 | **Status:** Actionable Code-Level Root Cause Findings

---

## 1. Executive Failure Summary

The initial KHILADI implementation devolved into a conventional dark analytics dashboard template rather than the cinematic, photographic editorial experience specified by the user.

| Issue Area | Code Location | Observed Defect | Severity | Root Cause |
| :--- | :--- | :--- | :---: | :--- |
| **Squad Band Placeholders** | `khiladi/data/rr_squad_2026.json`, `HomePage.tsx:236` | Marquee renders empty shield placeholders for all 27 squad members | **CRITICAL** | `rr_squad_2026.json` was generated with `cutout_url: null` for all entries. The local downloaded PNG cutouts were never mapped to the squad dataset. |
| **Cursor Lag & Jitter** | `DiamondCursor.tsx:41-46` | Stuttering cursor, delayed tracking, cursor duplication | **HIGH** | `mouseover` listener dispatches `setIsHovered` on every DOM node transition, forcing React root state updates during mouse movement. |
| **SaaS Dashboard Template Hero** | `HomePage.tsx:100-165` | Tiny crest, cluttered KPI cards row, metrics equations in subtitle | **HIGH** | Defaulting to SaaS metrics grid instead of full-bleed cricket footage with an enormous central Rajasthan Royals crest. |
| **Missing Trophy Photo Collage** | `HomePage.tsx:320-375` | 2008 Championship is an ordinary statistics card with 3 metric tiles | **HIGH** | Failed to implement Delta-style layered archival photographic composition with monochrome-to-color hover reveals. |
| **Orbiting Quiz Scale & Palette** | `HomePage.tsx:400-470` | Dark `#080C1F` backdrop, small cutouts crammed around a central text box | **HIGH** | Did not create the full-screen airy/cream Delta composition; cutouts were constrained to small CSS transform radii. |
| **Monotonous Dark Rhythm** | All sections in `HomePage.tsx` | Wall-to-wall `#080C1F` / `#050714` background with neon pink glows | **HIGH** | Complete lack of alternating light/dark chapter cadence (dark hero -> vivid band -> airy manifesto -> layered museum -> light cream quiz -> dark CTA). |
| **Cluttered Navbar** | `Navbar.tsx:24-40` | 10 dense links + live auction ticker across the top bar | **MEDIUM** | Cluttered header rather than minimal 4-link editorial navigation (`Explore`, `Players`, `Pressure Lab`, `Rankings` + `Menu`). |

---

## 2. Code-Level Evidence

### Failure 1: The Missing Squad Portraits (`rr_squad_2026.json`)
```python
# Diagnostics check on khiladi/data/rr_squad_2026.json:
Total RR squad players: 27
With cutout/portrait: 0
Without: 27 -> ['Ravindra Jadeja', 'Adam Milne', 'Sandeep Sharma', ...]
```
Because `cutout_url` was `None`, line 236 of `HomePage.tsx`:
```tsx
{player.cutout_url || player.portrait_url ? (
  <img src={player.cutout_url || player.portrait_url} ... />
) : (
  <Shield className="w-10 h-10 opacity-30 text-[#E81274]" />
)}
```
always fell through to the `<Shield />` icon, displaying a marquee of empty cards.

### Failure 2: Cursor Stutter via React State in Pointer Events
```tsx
// DiamondCursor.tsx
const checkHoverTarget = (e: MouseEvent) => {
  const target = e.target as HTMLElement | null;
  if (!target) return;
  const isInteractive = target.closest('a, button, ...');
  setIsHovered(!!isInteractive); // <-- Triggers React re-render on every hover transition!
};
```
Furthermore, `document.body.classList.add('custom-cursor-active')` applies `cursor: none !important;` to all elements. When React drops frames under animation load, the pointer freezes on screen.

### Failure 3: Missing Delta Photographic Storytelling
The 2008 Championship section completely discarded photographic storytelling in favor of metric cards:
```tsx
// Current HomePage.tsx line 355
<div>
  <div className="text-base font-bold font-mono text-white">143.4</div>
  <div className="text-[10px] uppercase font-mono text-white/40">Championship SR</div>
</div>
```
Delta's reference uses a large archival photograph surrounded by overlapping historical images that zoom and reveal color on hover.

---

## 3. Required Rebuild Action Plan
1. **Fix Squad Dataset & Asset Pipeline:** Map all 27 Rajasthan Royals players to authentic, high-resolution transparent cutouts with explicit fallback state.
2. **Re-engineer Global Diamond Cursor:** Use a single persistent DOM element, zero React re-renders on mousemove, direct hardware transforms, and smooth compositor lerp.
3. **Rebuild Homepage Rhythm:**
   - Dark cinematic hero with enormous central RR crest and multi-clip cricket montage.
   - Vivid horizontal parade of large, authentic human player figures.
   - Clean, light editorial manifesto (*"FIND THE PLAYER BUILT FOR YOUR MOMENT."*).
   - Layered 2008 photographic trophy museum with archival image collage.
   - Expansive, airy cream/pale-pink orbiting quiz with large background-free figures revolving around the question.
   - Restrained editorial CTA and footer.
4. **Streamline Navigation:** 4 clean links (`Explore`, `Players`, `Pressure Lab`, `Rankings`) with a slide-out Menu drawer.
5. **Redesign Analytical Pages:** Professional, restrained research presentation without decorative badge soup.
