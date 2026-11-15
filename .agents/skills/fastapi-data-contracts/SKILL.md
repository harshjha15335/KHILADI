---
name: fastapi-data-contracts
description: Use for secure, paginated, typed backend APIs serving player data, rankings, filters, quizzes, pressure timeline, profiles and exports.
---

# Fastapi Data Contracts

## Workflow
Implement Pydantic request/response schemas and SQLAlchemy migrations. Stable `player_id` key always maps to source mapping CSV; reject unknown identifiers. Separate `raw`, `clean`, `derived`, and `hypothetical` stores. Query filtering validated on server; protect restricted pack and bulk record export; no open raw delivery dumps. Provide pagination/search/cache strategy, CORS restrictions and API error states. Document routes and explicit data lineage for scores.
## Exit gate
OpenAPI contracts pass tests; no direct restricted data leaked in frontend public bundle.
