# Foreground-aware Canvas sizing: measured, held, restored

## Decision and exact checkpoint

The application trial `f7534e21687245c6aece4be677173dcb` was **not deployed**.
It repaired the initial Canvas measurement delay, but did not consistently
improve complete garage loading on mobile. Live remains `c6d06296f0614628a3f609a8e8cabb59`,
application source `5bb0044`, deployment `8f982d655c9fb0a19dbf709099782246aa0feb67`.

The 19-line `ShopWorld.tsx` experiment was removed. Both generated `out` and
the dedicated deployment checkout were restored from `output/baseline-c6d`:
all **1,289 files** SHA-256 matched, and deployment Git is clean. The exact
baseline archive `output/baseline-c6d.zip` (68,792,612 bytes) remains available.

Rejected export: `output/held-curtain-measure-f753.zip` (68,887,311 bytes).
Its original preparation metadata and exact candidate source are preserved in
`output/held-curtain-measure-release-prepared.json` and
`output/held-curtain-measure-ShopWorld.tsx.bak`. These are investigation artifacts,
not a release to publish. The restore scripts in `output` validate exact markers,
deployment HEAD and target boundaries before touching generated files.

## Root cause and red/green test

Installed Fiber uses `react-use-measure` with `scroll:true`, scroll debounce
50 ms, resize debounce zero. Its initial ResizeObserver uses that same scroll
debouncer. While scroll events continue, the fixed canvas can have no measured
size and therefore no renderer despite satisfying the hero/proximity gates.

The trial retained the default behavior while the film was visible. A one-node
MutationObserver watched GSAP's inline curtain state, then latched independent
fixed-canvas measurement only after visibility became hidden and opacity zero.
It did not alter the fade, the existing idle-reader path or any model/rendering
setting. No per-frame layout reads were added.

`QA_EXPECT_CURTAIN_MOUNT=1` reproduces the specific delay in a real browser:

- Baseline: renderer 602.7 ms after the fully hidden curtain; expected assertion
  failed. Actual hero readiness and physical seven-viewport proximity were
  already satisfied. Report `handoff-measure-red`.
- Trial: renderer 58.5 ms after the hidden curtain; assertion and resource
  fidelity passed. Report `handoff-measure-green`.

The test records real hero readiness, not merely canvas existence. The new
curtain observer uses inline styles rather than forced computed-style/layout
reads during the measured fade.

## Controlled loading comparison

Eight cold runs used real Radeon 740M-backed Chrome, sequential ABBA for each
profile, with original media, texture dimensions/settings and GPU parameters
asserted equal. Mobile is Chromium emulation, not a physical iPhone.

| Profile | Live baseline | Trial | Entry p95, old → new | Entry p99, old → new |
| --- | ---: | ---: | ---: | ---: |
| Mobile Fast 4G | 18.903 s | 19.092 s | 7.10 → 7.10 ms | 11.80 → 13.90 ms |
| Desktop | 16.909 s | 16.432 s | 13.95 → 14.00 ms | 26.95 → 27.75 ms |

Mobile was **188.6 ms later**, with overlapping samples. Desktop was 476.55 ms
earlier, but startup long tasks increased 2,157.5 → 2,529 ms and observed CLS
0.0876 → 0.0972. Mobile long tasks decreased 713.5 → 605.5 ms; CLS was unchanged.
These are a small controlled lab sample, not population statistics or field
Core Web Vitals. Do not describe the candidate as uniformly faster/smoother.

All eight runs verified the 71 original garage model hashes, three hero
resources, original office texture settings and unchanged transport coverage.
`scripts/garage-handoff-comparison.mjs` records **HOLD / exit 1** by design.
Do not weaken the gate or treat its expected nonzero exit as an unresolved
script failure. Reports are under
`output/playwright/garage-performance-2026-09-06/handoff2-*`.

An initial series is retained as diagnostics only: `handoff-4g-old-2` and
`handoff-desktop-old-1` accidentally overlapped for four seconds. All eight
timing cases were rerun sequentially under `handoff2-*`. The comparison checks
recorded start/finish times to reject overlap; no initial-series timings enter
the release decision.

## Verification and scope

Candidate production build/TypeScript and original loader/cache/liveness
contracts passed. The two changed QA scripts pass syntax and scoped ESLint.
`ShopWorld.tsx` has pre-existing nine ESLint errors and three warnings; comparing
baseline and candidate diagnostics found no new ones. Do not claim it is lint-clean.

After restoring the verified release, fresh prepared checks passed 69 unique
titles/descriptions/canonicals, 72 stamped HTML files, 327 schema blocks,
145 lossless GLB/Brotli twins and 1,289 mirrored files. All 410 original media
files (67,356,286 bytes) and 21 packets / 73 extracted occurrences remain exact.

Fresh production verification passed all 69 pages and 45 assets with exact
release/bytes, metadata/crawler access, trusted HTTPS, apex/www and legacy-path
301 redirects. The quote endpoint returned the intended GET 405. No real lead,
call, purge, deployment, DNS/mail/SSL change or support-tab action was made.
The previous release's full 127-action, seven-bay, curtain, remount and actual
drawing-buffer rotation evidence remains recorded in `2026-09-06-curtain-parking.md`;
those suites were not rerun or relabelled as new results in this held experiment.

## Next investigation: preparation critical path, not another early-mount tweak

Unrestricted Canvas initialization, independent early-photo transfer and now
curtain-aware initialization have each failed to give a reliable mobile win.
Stop moving the same gates earlier. Re-examine the preparation dependency chain
before implementing another scheduling change.

The current loader already prefetches all 71 exact model byte promises in tour
order with a shared two-request transport pool; it is not opening-only fetching.
Do not add a duplicate fetch/cache path. Downloads, serial parse, texture upload,
shader readiness and exact first-use are distinct costs. Wall time reported by
an async warm routine is not necessarily main-thread or GPU execution time.

Instrument these boundaries on the restored release to identify which serial
wait is actually on the mobile critical path. In particular, measure the existing
70 ms subtree-settle checks, per-bay parse courtesies, one-texture-per-frame upload
and exact first-use queue separately before proposing changes. An earlier shell
is not success if the complete tour appears later. Keep all seven readiness keys
plus the gallery, current camera, full original fade and generation ownership;
do not solve the doorway wait by showing unfinished bays or reinstating the
camera frontier stall reported by the user.

The goal remains active. SeaOcean 95+, rankings, separate CDN activation, search
ownership, physical Apple validation and actual inbox delivery remain unverified.
