# GitHub Pages deployment

The workflow `.github/workflows/pages.yml` publishes **only**
`khiladi/frontend/dist`, never the repository, raw Data Pack or private media.
It builds from `migration/windows-and-pages` (or main when the workflow is merged)
and supports manual dispatch. GitHub Pages uses Actions, not a committed dist
folder. The project path is `/KHILADI/` and existing hash navigation is retained.

Pages cannot execute FastAPI. `scripts/export_pages_quiz.py` calls the unchanged
backend recommendation function for the nine query combinations exposed by the
homepage and saves the exact responses. The Pages build reads those responses;
it does not recompute metrics or introduce a replacement model. Local Windows
mode continues to call live FastAPI. Changing data or the existing model requires
rebuilding Pages so snapshots match. Stored rankings, comparison, player search,
squad planning and replay continue to use the existing aggregate exports.

`VITE_GITHUB_PAGES=true`, `VITE_BASE_PATH=/KHILADI/` and
`VITE_MEDIA_REVIEW=false` are CI-only settings. No secrets are needed.
The build audit rejects source CSVs, environment files, private photographs,
recordings and reports. The aggregate player JSON, sample replay and top-ten
exports already used by the UI are the explicitly allowed data artifacts.

No RR montage or protected portrait/archive images are published: the approved
media manifest is empty. Public production uses the existing fallbacks. Private
Cloud/Windows review imagery is not a cleared production asset.

The deployment environment must permit this branch. GitHub repository Pages must
use workflow builds. The actual deployed URL and run outcome are verified through
the GitHub API and a browser after deployment, rather than assumed from naming.

## Activation boundary in this session

The connected GitHub integration can push this repository but GitHub rejected
`POST /repos/harshjha15335/KHILADI/pages` with **403 Resource not accessible by
integration**. Pages was not previously enabled. The official configure-pages
Action documents that initial enablement requires an administrator token with
Pages write permission; the ordinary workflow GITHUB_TOKEN cannot enable it.
No token or browser security workaround is used.

The repository owner must open Settings > Pages and choose **GitHub Actions** as
the build source. If the github-pages environment restricts branches, allow
`migration/windows-and-pages`. Then rerun the branch's "Deploy KHILADI to GitHub
Pages" workflow in Actions. Until that succeeds and its URL is checked, the site
is prepared for Pages but **not confirmed live**.
