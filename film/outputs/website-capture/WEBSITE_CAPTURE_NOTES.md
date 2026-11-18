# Real Khiladi website insertion — four seconds

## Delivered clip

`KHILADI_WEBSITE_INSERT_4S.mp4` is a **real browser capture of the existing Khiladi frontend**, not a generated or composited website mock-up. It is silent, so the film's Michael narration/music can continue over it. Use it for **four seconds near the end**, after the report payoff; it is not a website tour.

The clip shows the site's own Khiladi logo animation, curtain transition and responsive homepage hero. No navigation or forms were used. Nothing is represented as a validated predictive result.

## Provenance

- Source repository: the existing `khiladi/frontend` in `/workspace/KHILADI-film`.
- Source URL: `http://127.0.0.1:3317/`, title `KHILADI | Cricket Intelligence`.
- An unchanged source snapshot was run in `film/work/website-capture/site-snapshot` to keep all task writes inside the capture workspace. Important source hashes match the repository exactly (`SOURCE_HASHES.json`).
- Existing installed dependencies were reused through a local symlink. Vite dev server was started with `VITE_GITHUB_PAGES=true` and `VITE_MEDIA_REVIEW=false`, the repository's documented public-safe static/fallback mode. No source/config file, deployment, account, dataset or model was changed.
- Chromium rendered the actual mobile layout at CSS390×693, device scale factor3. Screenshots are1170×2079. Browser virtual clock was advanced1/30s per frame so120 actual DOM frames capture the application's own motion from virtual0.3–4.3s. No DOM or CSS was rewritten for the shot.
- The actual captured screenshots were scaled to1080×1920 and encoded as H.264,30fps,yuv420p,limited-range,faststart. This is browser frame capture with controlled timing, not a screen filmed at native30fps wall time.

## Verified capture flow

The capture story is: homepage load → existing static aggregate-data requests → brand/hero render.

- Homepage and brand asset returned200.
- `/data/player_database.json` and `/data/rr_squad_2026.json` returned200.
- One initial squad request was aborted during development-mode effect cleanup and a subsequent request returned200. No page JavaScript errors were recorded. This is reported rather than hidden.
- Body scroll width390 equals viewport390: no horizontal overflow in this state.
- The preloader completed, and the actual hero text rendered.
- `videoElements=0`: no protected match video was running.
- No unrelated app features, backend calculations, player selection, rankings or forms were tested. A successful homepage capture is not a full website QA pass.

## Media and interpretation limits

- The repository's approved media manifest is empty; this capture uses the documented graphic fallback and own Khiladi brand logo. No Brawn GP reference frames/audio, original competition CSVs, protected player portraits or broadcast match footage are in the delivered clip.
- External Google Fonts CSS/font requests were part of the existing page's rendering; no font binaries are republished here.
- The preserved website has legacy marketing copy and its older application/model context. This four-second branding insert does **not** assert that the newly accepted film methodology or rankings have been implemented on the site.
- This is an artifact for the user's private review/final film assembly, not a public deployment or a general rights clearance of the entire application.

## Reproduction

From repository root after the unchanged snapshot is prepared:

```
VITE_GITHUB_PAGES=true VITE_MEDIA_REVIEW=false /workspace/KHILADI/khiladi/frontend/node_modules/.bin/vite --host127.0.0.1 --port3317 --strictPort
node film/work/website-capture/capture-frames.cjs
```

The capture script and run logs are in `film/work/website-capture`. `CAPTURE_METADATA.json` and `FFPROBE.json` contain the actual final stream measurements and source hash. A standard Playwright recording was also checked, but its small-viewport letterboxing was not used in the final clip.
