# KHILADI desktop website checkpoint

Updated 18 November 2026 (India). The user requested an immediate code push and a remaining-work handoff. This is a review checkpoint, not a final release or deployment.

## Implemented

- Reusable Royal Player Card with reactive original Three.js foil, dimensional layers, hover, bounded drag/spring settling, flip, reset, keyboard controls, reduced-motion handling, static/WebGL failure fallback and GPU cleanup.
- Real statistics on the front only when the canonical ID, analytical role and accepted private D20 model match. Identity-only cards explicitly show unavailable evidence rather than a legacy score or invented zero.
- Lightweight card previews for all 1,217 canonical identities. Only a selected full card creates a rich renderer.
- Catalogue, selected rankings, comparison, inner-page player dialog and shortlist integration. Home retains its existing profile component and visual design.
- Official IPL source-reviewed portrait metadata for 58 canonical players. Photos are unmodified remote assets for private development review only; independent redistribution permission is not established. Production disables these portrait requests. Other identities use labelled fallbacks.
- Private D20 access shared in memory across inner routes, cleared on lock or return home. No credential persistence, URL tokens or private serving bundle in Git.
- Accepted comparison table and shared-axis conditional intervals, alongside clearly separated legacy recorded comparison.
- Working profile-to-comparison and profile-to-squad actions, canonical-ID carryover, profile role switching, native-dialog Escape/focus restoration and an in-dialog evidence link that does not accidentally navigate home.
- Desktop finishing changes: hypothetical planner budget/bids lifted into App state to survive route changes; explicit local save/load and JSON import/export with canonical-ID/schema/finite-value validation; these save user planning inputs only, never research or credentials.
- Accepted D20 methodology explained separately from inherited pressure heuristics. Legacy pages have clearer metric labels, error/retry states, and zero/missing display handling. Workspace navigation tiles are keyboard-operable buttons.

## Verification actually completed

- Latest TypeScript check passed: `cd khiladi/frontend && ./node_modules/.bin/tsc --noEmit --incremental false`.
- Latest backend/private goldens: 13 passed. Canonical/source integrity checks: 6 passed.
- Prototype browser suite: 12 passed before the latest desktop planner/error-state/comparison-evidence finishing edits. Includes all 20 accepted adapter records, actual portrait/failure fallback, tilt/flip/reset, keyboard, context loss, 20 renderer remounts, semantic evidence, access clearing and card-border containment.
- Integration browser suite: 7 passed before those latest finishing edits. Includes rendering all 1,217 lightweight identities, directory/profile/role/focus flows, comparison carryover, accepted rankings, squad/bid actions, unavailable records, private-access clearing and serious/critical accessibility checks.
- A prior production build and existing Pages artifact audit passed before the final integration/desktop finishing edits. A final build is still required.
- Before checkpoint, byte comparisons found no changes in 24 protected existing files covering backend code, HomePage, existing shared components and the established global styles.
- Earlier frozen-home/reference/browser checks passed; new final homepage screenshot comparison is still pending.
- `git diff --check` passed before checkpoint staging.

Do not describe the earlier browser/build results as checks executed after the latest finishing edits.

## Remaining, in priority order

1. Run final desktop end-to-end tests on the latest changes. Add/execute tests for planner route persistence, save/load/export/import, malformed plans, duplicate/unknown IDs, explicit zero versus missing bids, and the new accepted comparison table.
2. Re-run the desktop-relevant card/integration and frozen-home regression checks. The user explicitly said to leave mobile layouts; no further mobile-layout work is requested.
3. Run the final production build and publication artifact audit, then remove only generated build metadata changes. Verify the private prototype entry, private data, credentials and unapproved media are absent from the public artifact.
4. Refresh desktop screenshots and actual interaction recordings after the final shared-component/photo/containment changes. Earlier screenshots/videos exist in the cloud output folders, but are not a substitute for final captures.
5. Review portrait fallbacks and long names on the finished desktop surfaces. Verified official portrait coverage is 58 of 1,217, not all identities; no wrong-person or fabricated-photo substitution is allowed.
6. Prepare a reviewed Vercel deployment configuration and public data policy. Audit inherited legacy exports before publishing a new host; do not publish original competition data, private D20 bundles or unapproved media.
7. Connect Vercel and deploy only when the user resumes hosting. The user selected Vercel, then explicitly deferred sign-in/hosting until the website is finished. The device-login flow was cancelled. No deployment URL exists from this work.

## Known limitations

- Full raw-to-final analytical replay remains blocked by missing original pipeline/event artifacts. This card work does not change that scientific status.
- Private serving scope remains ten batting and ten bowling records. Do not imply accepted ratings exist for every catalogue identity.
- No production authentication service for private research is configured. Public/static mode does not serve private D20 results.
- ThreeUI's public source was inspected and WebGL initialized, but its complete rendered reference scene stalled in cloud Chromium. No exact visual parity or reference timing claim is justified.
- Measured earlier cloud software-renderer p95 frame interval was approximately 33.4ms, above the proposed 20ms goal; 60 FPS is not verified. Initial first-frame measurements also exceeded the proposed 500ms desktop target. Re-measure the final build without concurrent browser jobs.
- Some original official portrait assets are approximately 1MB, above the initial selected-portrait transfer budget. Source-provided optimized preview URLs are used where verified; final transfer review remains.
- No Windows Brave or physical-device performance certification is claimed.

## Resume locally in the cloud

```bash
cd /workspace/KHILADI/khiladi/frontend
npm ci
npm run dev -- --host 127.0.0.1 --port 3000
```

Start the FastAPI service in a separate terminal following `docs/GATE2_PRIVATE_D20.md`, with the private serving directory and backend-only credential supplied through private configuration. Do not commit either.

Product entry: `http://127.0.0.1:3000/` in a browser sharing the cloud server's network.
Isolated development prototype: `/royal-card-prototype.html`.
These are loopback addresses, not externally hosted URLs.

New browser tests:

- `khiladi/frontend/tests/royal-card.spec.ts`
- `khiladi/frontend/tests/royal-cards-integration.spec.ts`

Set `KHILADI_TEST_TOKEN_FILE` to a private token file to enable the authenticated tests. Point Playwright reporting/output outside public/reviewed source paths; do not publish trace files containing protected response bodies.

Private evidence remains outside Git under `/workspace/output/khiladi-stage-b` and `/workspace/output/khiladi-stage-c`. Those outputs may contain private aggregates and source-review imagery and must not be pushed publicly.

## Push and deployment boundaries

Push this checkpoint to `feat/private-d20-contracts`, without force. Do not merge to main, rewrite history, trigger a release or deploy as part of this handoff. Hosting is deferred. The assistant cannot read the user's remaining account-usage percentage and must not claim to monitor a 5% threshold.
