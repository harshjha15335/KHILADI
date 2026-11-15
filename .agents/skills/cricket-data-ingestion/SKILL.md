---
name: cricket-data-ingestion
description: Use to audit the user-supplied SupeRR Selector data pack and build reproducible validated IPL/T20I canonical tables and delivery metrics without altering raw source files.
---

# Cricket Data Ingestion

## Workflow
Unzip the pack privately. Validate six CSVs and PDF, ID joins, field semantics, match chronology, delivery extras, over-ball numbering, wicket types, super overs, revised targets, unknown winners, non-playing XI members and bowling speed anomalies. Distinguish recorded delivery events from legal balls, bowler wickets from run-outs and retired-out, and genuine nulls from zeros. Keep raw and cleaned versions side by side, immutable source and row-level change log. Create Postgres schema and analytics Parquet where appropriate, private by default.
## Exit gate
Manual innings reconciliation tests, duplicate checks, and data-quality findings are reproducible. No public release of raw competition pack.
