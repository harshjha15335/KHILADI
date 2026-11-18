# Gate 2: private accepted D20 rankings

This implements versioned contracts and primary ranking integration only. The
homepage, media, legacy endpoints and analytical algorithms are unchanged. No
recovered research is added to public Git, frontend data or a deployment.

## Prepare the private serving bundle

Run with the existing backend Python environment from the repository root:

```bash
python scripts/prepare_private_d20.py \
  --step78-results /private/SupeRR_Steps7_8_Full_Results_Code/results \
  --step9-results /private/SupeRR_Step9_Final_Audit_and_Rankings/results \
  --canonical-csv "Data Pack/competition_team_player_mapping.csv" \
  --output /private/khiladi-d20/accepted-v1
```

Replace `/private/...` with your actual private paths. The output must be outside
the checkout. The importer checks pinned SHA-256 identities for the accepted
cohort, final selections and format export, plus the original canonical mapping.
It validates the full 157/154 role cohorts before importing the top tens. It does
not fit models or change scores. Existing output versions cannot be overwritten.

Full-precision values come from Step 7–8; Step 9 supplies tiers and format counts.
The latter's 12-significant-digit serialization is checked against its source.
Only the private normalized top20 and its integrity manifest are emitted.

## Configure and run

Set these **backend-only** process variables before starting FastAPI:

- `KHILADI_ANALYTICS_DIR`: the newly prepared bundle directory.
- `KHILADI_ANALYTICS_TOKEN`: a fresh random ASCII token of at least 32 characters,
  with no whitespace. Generate it locally with
  `python -c "import secrets; print(secrets.token_urlsafe(32))"`.

Never prefix the token with `VITE_`, commit it or paste it into a URL. Prefer a
private process/secret configuration. The existing Windows launcher also accepts
these two keys from the ignored root `.env` file and passes them to its children;
Vite does not expose these non-`VITE_` keys to the browser. On Windows use the
existing `start-khiladi.ps1` after preparing the private bundle. Native Windows
execution still requires Windows verification.

For manual startup, with the variables set in your terminal environment:

```bash
python -m uvicorn main:app --app-dir khiladi/backend --host 127.0.0.1 --port 8010
```

In another terminal:

```bash
cd khiladi/frontend
npm run dev -- --host 127.0.0.1 --port 3000
```

Open `http://127.0.0.1:3000/#rankings` **in the same machine/environment**.
Enter the token in the private access form. The page retains it only in memory;
navigation/reload clears it. Lock removes the results and credential. A
configured remote `VITE_API_BASE_URL` cannot receive the credential: this phase
supports the local proxy or a loopback backend only. These commands do not make
a cloud loopback address reachable from another computer.

Missing, invalid or tampered data produces an unavailable state. Authentication
is required for every ranking response. Production/static builds do not request
private rankings, and show the publication restriction instead. There is no
legacy fallback and no public D20 export. Existing public legacy files are not
reclassified as accepted results.

## API

- `GET /api/v2/readiness`: configuration status only, no research data; 200 ready
  or 503 unavailable. This is separate from legacy `/api/health`.
- `GET /api/v2/rankings/batting?scenario=primary`
- `GET /api/v2/rankings/bowling?scenario=primary`

Ranking requests require `Authorization: Bearer <token>` and return
`Cache-Control: private, no-store`. Optional `model` must match the loaded
immutable model ID. Unknown roles, query keys and non-primary scenarios are
rejected, not silently ignored. Missing credentials return 401; unconfigured
access or unavailable data returns 503. Error bodies do not contain source paths.

Contracts preserve role-specific units, exposure requirements, pooled format
scope, full-precision ordering, conditional 95% intervals, evidence tiers,
actual zero versus missing, artifact provenance, base seed42 and bootstrap
seed120. Metadata explicitly says full raw-to-final replay is incomplete.
Bowling delta's structural zero is retained without weight renormalization.

The existing profile reveal still uses legacy statistics; its link is labelled
accordingly. Broader profile migration and the approved visual boards belong to
later gates, not this change.

## Verification

Core contract/fail-closed tests run without research files:

```bash
python scripts/test_analytics_v2.py
```

Test environments also need `khiladi/backend/requirements-dev.txt` (the pinned
HTTP test client); it is not needed by the running application. This Cloud
environment already supplied the tested packages, so no installation was needed.

Enable the private golden tests by setting `KHILADI_TEST_STEP78` and
`KHILADI_TEST_STEP9` to the original results directories. Optionally set
`KHILADI_TEST_CANONICAL` to the canonical CSV location. These tests check all20
IDs/order and exact source values, CI/probability/tier/exposure/format fields,
the unrounded rank9/10 ordering, invalid bundles, authentication and unsupported
query handling. They never generate substitute analytical datasets.

Also run the existing integrity suite, frontend build, Pages artifact audit and
real-browser checks. Do not interpret these application tests as a fresh
Steps0–9 model replay. Gate3 visual approval and subsequent implementation gates
remain separate; no deployment is authorized by this phase.
