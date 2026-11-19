# KHILADI

**Cricket discovery, recorded pressure analytics and squad planning** — a light-first, editorial React/Vite experience backed by FastAPI and locally stored competition exports. The public website is an independent research interface, **not** an official Rajasthan Royals, BCCI or IPL product.

## Live application and source

- Application: https://khiladi-six.vercel.app (production URL; check the deployed SHA before assuming the latest branch is live).
- Repository: https://github.com/harshjha15335/KHILADI
- Static build: `khiladi/frontend`, Vite + React + TypeScript.
- Local API: `khiladi/backend`, FastAPI (port 8010).
- Site routes use hash navigation (`#home`, `#database`, etc.) so the static deployment can deep-link without server rewrite rules.

## Current pages

| Navigation label | Hash route | Purpose |
| --- | --- | --- |
| Home | `#home` | Cinematic gallery, player discovery, comparison entry, public evidence and role quiz |
| Players | `#database` | Searchable canonical player catalogue, role filters, evidence and full player cards |
| Rankings | `#rankings` | Public legacy shortlists and gated accepted research where authorized |
| Pressure | `#pressure-lab` | Recorded pressure replay and related metrics |
| Compare | `#comparison` | Side-by-side batting/bowling records |
| Squad | `#war-room` | Scenario squad builder and example purse |
| Data | `#data-explorer` | Public aggregate dataset exploration |
| Batting | `#batting-intel` | Batting intelligence views |
| Bowling | `#bowling-intel` | Bowling intelligence views |
| Overview | `#command-centre` | Research overview |
| Method | `#methodology` | Methodological caveats, pipeline and evidence provenance |

Player previews in the homepage rail, bento cards, catalogue and rankings open a single **Royal Player Dialog**. The interface preserves keyboard focus, supports Escape to dismiss, and keeps per-role evidence separate. Selecting an entry must never silently substitute another identity's image or statistics.

## Art direction and interactions

KHILADI uses warm ivory, royal blue, restrained garnet/pink, lavender and serif/condensed/interface typography. The approved coloured KHILADI logo remains centred in the fixed glass navigation.

- **Loading sequence:** particle typography assembles into the KHILA–symbol–DI lockup, then a geometric triangle-fold curtain reveals the page. There is no obsolete Replay introduction footer control.
- **Two navbar interactions:** five links left of the logo use a directional sheen/underline sweep; five right-side links use a contained concentric ripple/ring. The existing navbar geometry, route highlights and ThreeUI proximity controller remain intact.
- **Shared CTAs:** `IridescentActionButton` and `KhiladiAnimatedButton` provide the 3D glass rim, animated highlights, hover/focus states and garnet/sapphire/opal/graphite variants. Key public CTAs, bento navigation, catalogue comparison and player-detail actions are consistent. Small filter toggles and form controls intentionally retain accessible control semantics.
- **Removed clutter:** the redundant pink 2008 heritage photo section and blue journey/hotspots section were removed; “Beyond the Scorecard” is typographic, without photographic side panels. The extra public top-ten CTA, repeated catalogue explanation and replay button were also removed.
- **Motion safety:** prefers-reduced-motion disables ornamental GSAP/particle transitions. Mobile gallery controls, scroll and focus remain usable without WebGL.

The reference recordings used for design review were user supplied and are **not committed** as public media.

## Player portraits and fallback

KHILADI's **1,217 canonical player IDs** come exclusively from the original Rajasthan Royals hackathon competition mapping. Portrait sources are decoration only; they can never add a new player to the dataset.

Portrait resolution is implemented in `khiladi/frontend/src/utils/media.ts` and uses the following strict order:

1. The exact-ID **IPL official source registry**, `khiladi/frontend/src/components/player-cards/official-portraits.json`, where the URL renders a real face. Note: existing IPL/club assets are source-discovered; their public reproduction permission is not established by the URL alone.
2. A separately cleared **studio portrait** in `licensed-portraits.json` only when the exact player ID and name match, the license and identity are reviewed, the image is a stable direct image, and both `visual_style_approved: true` and `portrait_style: "studio_cutout" | "studio_portrait"` are recorded. **Dinesh Karthik (143)** and **Suryakumar Yadav (1699)** have correctly attributed Wikimedia outdoor/event photos, but those images are **excluded from display** because they do not match KHILADI's studio-portrait requirement. Only images actually displayed appear in Photo credits.
3. The user-approved neutral avatar `assets/players/neutral-avatar.webp` when neither source is available, when network requests fail, or when an official URL returns the generic silhouette.

Avoid guessed image matches, name-only joins, random cricket photographs, or swapping a player with a similar-looking person. Official IPL, RR, BCCI and ICC **profile pages are research sources**, not automatically permission to redistribute official portraits. The two OpenAI inline image previews in the source pack are *not* stable downloadable source-image URLs.

### Importing the KHILADI source-pack ZIP

A safe importer is included in `scripts/import_portrait_source_pack.py` (Python standard library only). The importer does **not** bulk-publish the images in the ZIP. It reads metadata and accepts only reviewed identity+license entries matching the original RR dataset:

```powershell
py scripts/import_portrait_source_pack.py "C:\\Downloads\\KHILADI_Player_Portrait_Source_Pack.zip"
py scripts/import_portrait_source_pack.py "C:\\Downloads\\KHILADI_Player_Portrait_Source_Pack.zip" --write
```

The first command prints an audit with reasons for rejected rows, including photos that are not reviewed studio cutouts; the second writes only identity-, license-, and visual-style-approved CC metadata to the licensed registry. The official source links found in that ZIP remain pending until usable image endpoints and reuse rights are verified. After adding each candidate, confirm the rendered player visually, verify exact ID and name, and check license attribution before merging.

**Source and rights priorities:** IPL/Rajasthan Royals official profiles and transparent studio cutouts first (when permission is secured); then BCCI/ICC official pages for research and permission requests; then individually vetted CC-licensed Commons photographs; finally the neutral silhouette. No scraped third-party photos or unapproved collector output should be committed to the public site.

## Public versus private analytics

The public interface shows the existing historical competition exports and inherited legacy pressure index. Accepted **D20** research is a separate gated model with its own event definition, exposure criteria, uncertainty intervals and provenance. Do not present the legacy score as an accepted D20 rating, forecast or official auction decision. See the in-product Method page for exact definitions.

## Local development

### Windows (recommended)

Install Node.js 24 LTS, Python 3.11+, Git and Brave, then from a **local checkout**:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\start-khiladi.ps1
```

It checks ports 3000/8010, installs dependencies, verifies the local health endpoints and opens Brave. Use `-SkipInstall` on later runs or `-CheckOnly` to inspect a running local stack. See [LOCAL_WINDOWS.md](LOCAL_WINDOWS.md) and [LOCAL_WINDOWS_SETUP.md](LOCAL_WINDOWS_SETUP.md).

### Frontend development only

```sh
cd khiladi/frontend
npm ci --include=dev
npm run dev -- --host 127.0.0.1 --port 3000
```

Frontend URL: http://127.0.0.1:3000. For live API features also start the backend, documented in `LOCAL_WINDOWS.md`. The Vite proxy targets FastAPI on 8010. Public Pages builds use pre-exported examples when a backend is unavailable.

### Validation

```sh
cd khiladi/frontend
npm ci --include=dev
npm run build
npx playwright install chromium
npx playwright test tests/glass-dock-scroll.spec.ts tests/delta-production.spec.ts tests/royal-editorial.spec.ts
```

The editorial GitHub Actions workflow runs build and Chromium smoke tests, captures responsive screenshots and uploads short-lived QA artifacts. Verify checks and production UI before merging or publishing. Builds can depend on the static export step described in [docs/GITHUB_PAGES.md](docs/GITHUB_PAGES.md).

## Deployment

Vercel is linked to `harshjha15335/KHILADI` with `main` as the production branch; the public address is `https://khiladi-six.vercel.app`. Preview builds are **not production**. When Vercel Hobby deployment quota/rate limits are reached, merging a PR is not evidence of a successful live release. Check the actual deployment `READY` state, linked commit and production aliases before claiming success. Do not change account billing settings automatically.

GitHub Pages has a separate static workflow and artifact audit. Consult [docs/GITHUB_PAGES.md](docs/GITHUB_PAGES.md) for its required configuration and limitations.

## Additional documentation

- [Local Windows guide](LOCAL_WINDOWS.md)
- [Pages deployment guide](docs/GITHUB_PAGES.md)
- [Original engineering directive](docs/handoff/MASTER_ENGINEERING_DIRECTIVE.md)
- [Implementation and validation notes](docs/CODEX_TAKEOVER.md)
- [Reference map](docs/CODEX_REFERENCE_MAP.md)

**Design maintenance rule:** keep the coloured logo, fixed dual-sided dock, accessible player dialog, exact-ID portrait sourcing, 3D glass CTAs and light-first editorial theme. Test 375/390/768/1280/1440/1920 px before a production release.
