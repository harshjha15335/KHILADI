# Local migration preservation audit

Initial checkout: clean `main` at `955dca9`. Dedicated migration branch:
`migration/windows-and-pages`. The Phase 2 commit remains in its ancestry.

A CRC-verified private archive preserves **478** files with path, original tracking
state, byte count and SHA256 in `private-file-inventory.json`, supplied separately.
It includes every private runtime media dependency, the original competition pack
and ignored review/recording work. Regenerable node_modules, dist, Python caches,
virtual environments and scratch traces are excluded. Nothing was removed from
the working disk. **292** previously tracked private/raw/generated binary files
are removed from the new branch tip and ignored; previous Git history remains.

Runtime files retained in Git: frontend source/configuration/lockfile and own
favicon; backend source/pinned requirements; processed player/ranking/replay
exports; asset/provenance/permission manifests; launcher and dependency setup;
blank optional `.env.example`; tests; Pages workflow and static quiz exporter.
Only existing model outputs are generated for Pages, using the original backend
function. No raw data rows, metrics, ranking values or model logic are altered.

Ignored files needed for private visual review: the three inherited portrait/
cutout directories (root, backend assets and frontend public), seven local review
archive images, and source-photo review material. They are not needed for a clean
public fallback-mode app. Source integrity/rebuilding additionally needs the
private original Data Pack. Completed QA evidence and reports are preserved in
the private backup but are not runtime dependencies.

There were no untracked source edits initially and no required secret variables.
`.env` and local process logs are ignored. Never publish the private backup.
Existing raw/private files in earlier public history are a pre-existing condition;
this migration does not rewrite public history. The Pages artifact is checked
independently and excludes those files regardless of checkout contents.
