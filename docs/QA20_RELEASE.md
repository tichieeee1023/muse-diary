# QA20 — Final QA & Release

## Automated checks

- `npm.cmd run lint` — passed
- `npm.cmd run build` — passed (`tsc -b` and production Vite build)
- `git diff --check` — passed
- `vite preview` smoke check — `http://127.0.0.1:4173/` returned HTTP 200

## Mobile readiness audit

- The app shell keeps the game viewport between the 320px minimum body width and 430px maximum game width.
- Responsive rules cover compact 359/360px layouts and 420/430px layouts, with the bottom navigation fixed inside the 430px game shell.
- Character cards are intentionally equal-height in each grid row, including undiscovered cards; this preserves a stable album grid.
- The character index header is compact: title and counter, discovery/completion/undiscovered record table, optional one-line NEW hint, then filters.

## Manual visual note

This workspace's installed headless Chrome could serve the app but failed before rasterizing screenshots because its GPU process could not start. A real-device pass at 320px, 390px, and 430px remains the recommended final visual check after deployment.

## Release artifacts

- Source package: `muse-diary-phase-6-source.zip`
- Production web package: `muse-diary-phase-6-web-build.zip`

Both archives are generated outside the Git worktree under `C:\Game\muse-diary-release` so GitHub keeps source history free of duplicated build artifacts.
