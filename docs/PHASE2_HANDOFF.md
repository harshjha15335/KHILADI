# KHILADI Phase 2 - targeted refinements

Baseline: `7710aa2e104d9c7d6428dadf4e380fd9b6cad8da`.
A local checkpoint branch, `checkpoint/phase2-7710aa2`, preserves that baseline.
The current design, palette, routes and analytical backend are retained.

## Implemented

- Removed the sound toggle, Web Audio utility, sound-only hover listeners and all
  sound calls. Previously persisted opt-in cannot turn interface audio back on.
- Removed the parade's visible pause control and metadata. Names, portraits,
  canonical identities and profile actions remain. Keyboard focus pauses motion;
  reduced motion shows the static, horizontally scrollable band.
- Slowed the 27-player loop from 148.5 to 243 seconds (about 39% lower speed,
  measured at 25.78 CSS px/s at 1440px).
  Identical adjacent groups preserve the seam. Offscreen motion pauses.
- Removed session-once loader suppression. Each document load runs the existing
  sequence; internal route changes do not remount it. Escape and reduced motion
  still bypass it.
- Repaired the CTA fill: its inherited rounded rectangle and overscan cover the
  complete button instead of an ellipse leaving exposed edges. Text roll and
  arrows are retained, including rapid hover reversals.
- Added individually phased GSAP drift on inner player images, leaving reversible
  scroll entrances on outer figures. Movement uses small, differing translations
  and durations; no rings or uniform circular orbit. Offscreen loops pause and
  route changes clean them up. Reduced motion skips them.
- Kept the separate foreground RR crest and its existing scroll shrink, and fade
  it out by the editorial section so it cannot obstruct later content.
- Centralised the KHILADI wordmark in `KhiladiLogo.tsx`, retaining the current text
  until the user supplies the new approved product logo. No invented crest.
- Corrected bowling labels to pressure aggregates and the overall economy
  baseline. Pressure Lab now labels its heuristic honestly, uses the model's 1.8
  threshold and removes the invented win-probability swing. No values, source
  CSVs, ranking exports, API contracts or model calculations were changed.
- Kept the Windows launcher. Its guide now checks the origin repository before
  pulling, addressing the earlier ASTFLOW directory mix-up.

## Media and reference limits - not complete

1. **RR montage:** all three official Dailymotion embed URLs returned HTTP 403
   from this cloud environment; the first was also checked in Chromium. Download,
   edit and rehosting permissions are unestablished. The live hero still has the
   disclosed external-link fallback, not three playing scenes. No playback,
   crossfade, codec, poster, black-frame or responsive-crop pass is claimed.
   See `CRICKET_FOOTAGE_MANIFEST.md` and the source JSON records.
2. **2008 trophy photograph:** no usable licence for the required genuine image
   was established. The official Warne article and gallery were rechecked;
   Commons API research returned 403. The existing private-review Warne collage
   remains, explicitly identified as a fallback. Before/after captures document
   that limitation; they do not claim a completed trophy replacement.
3. **Three portraits:** Sam Curran, Dasun Shanaka and Emanjot Singh Chahal were
   checked on their current official IPL UUID profile URLs. Primary images
   rendered generic silhouettes in this browser. Keep the intentional initials,
   never another person's face. IPL terms require written BCCI authorization for
   reproduction/derivatives; source URLs are not reuse permission.
4. **Exact fidelity:** `Recording 2026-11-15 213650.mp4` was not supplied in this
   workspace. The existing 45-page report was used as baseline. Live Delta was
   inspected and sampled again: full-bleed video, independent foreground brand,
   product band, layered archival composition and motion. Product-band samples
   measured about 72 CSS px/s at 1440px. This implementation deliberately slows
   its existing band; exact parity and the unavailable recording are unverified.
5. **Windows:** tests ran in Cloud Chromium, not Windows Brave. No tunnel or
   Windows accessibility claim is made. Existing protected imagery remains
   private-review-only and excluded from production.

## Validation and evidence

Run from `khiladi/frontend`: `npm run build` and `npm test`.
From repository root: `python scripts/test_takeover.py`.
The Phase 2 browser tests cover five complete reloads despite an old session
flag; no intro on SPA navigation; absence of sound/pause UI; hover completion at
multiple widths; continuous player movement and cleanup; slower band and keyboard
profile access; terminology; six requested desktop/tablet/phone dimensions; CSV
exports; paused replay; and changed comparison selections. Existing accessibility,
search, quiz, profile, squad and data integrity tests remain.

Fresh recordings and screenshots live in `docs/qa/phase2/` and are supplied in a
separate private evidence ZIP. `capture_phase2.py` records the complete desktop
and mobile homepage without stitching; `capture_phase2_parade.py` records one
natural, unaccelerated band loop plus its boundary. Source metadata and measured
results are tracked; protected review screenshots/recordings are ignored by Git.

The initial reload test had an ambiguous menu selector; it was scoped to Main
navigation. Two test invocations later collided in Playwright's shared trace
folder. Final validation runs serially. These were harness failures, not claimed
passes. Final results: 29 browser tests passed (0 skipped/flaky), all 6 backend/data
checks passed, and the production build passed. The natural-loop recording
crossed iteration 1 to 2 over 253 seconds of measurement. See
`docs/qa/phase2/validation-summary.json` for counts and measurements.

Frame sampling in one headless cloud session: median 16.7 ms, p95 19.8 ms, no
interval over 33.34 ms and no observed long task during the sampled interval.
This is not a hardware-independent FPS guarantee. No video layout-stability
claim is made without permitted video. Browser capture reported no page errors.

## Transfer to Windows without changing an unrelated repository

The committed changes are supplied in `KHILADI-phase2.bundle`; no remote push or
public deployment is part of this handoff. Save it to Downloads, then use a new
folder rather than the previous ASTFLOW checkout:

```powershell
cd $HOME
git clone https://github.com/harshjha15335/KHILADI.git KHILADI-Phase2
cd KHILADI-Phase2
git fetch "$HOME\Downloads\KHILADI-phase2.bundle" HEAD:phase2-review
git switch phase2-review
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\start-khiladi.ps1
```

After the launcher's health checks pass on that PC, open
`http://127.0.0.1:3000` in Brave. The launcher installs dependencies and starts
FastAPI on 8010 and Vite on 3000; keep PowerShell open. See `LOCAL_WINDOWS.md` for
requirements, conflict checks and manual startup. Existing local work remains in
its original folder. Private review media, if separately supplied, must be
restored locally; public production assets are still gated on permission.
