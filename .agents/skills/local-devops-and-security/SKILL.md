---
name: local-devops-and-security
description: Use to set up reproducible local development, secret handling, dependency versions, CI workflows, and prevent accidental public exposure or paid deployment.
---

# Local Devops And Security

## Workflow
Detect installed Node/Python/FFmpeg and actual project state before installing anything. Separate frontend/backend environment variables, provide `.env.example` without secrets; add private pack/raw files and artifacts to `.gitignore`. Use Docker optionally for local Postgres; provide local start scripts, seed/import commands, checks, integrity CI. Security review player asset sources, external requests, API rate limiting and resource cleanup. Never deploy or provision billable resources without explicit user approval.
## Exit gate
Fresh local clone starts via documented steps, tests pass and restricted data stays out of public Git history.
