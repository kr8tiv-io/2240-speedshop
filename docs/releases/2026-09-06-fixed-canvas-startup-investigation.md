# Garage initialization: measured cause, rejected unrestricted trial

## Production status

**Investigation checkpoint, not a new application release.** Production remains
`b51232a823e2442bb76e7c6e6c85bd84`, deployment `d02c8e73`, application source
`b72b5c1`. The trial was not pushed to the deployment repository and no cache
purge, DNS, mail or SSL change was made. Its one application change was removed.
Both generated local export and deployment checkout were restored to 1,286
SHA-256-verified files from the exact current deployment archive; deployment
Git status is clean. The active continuous optimization goal is not complete.

Rollback/checkpoint: `output/baseline-b512.zip`, 68,765,717 bytes, marker-verified.
Rejected trial: `output/held-fixed-canvas-cc1b.zip`, marker
`cc1b38a961904fe8bb2265aa9b3f6142`. Its prepared-release metadata is retained as
`output/held-fixed-canvas-release-prepared.json`. Do not deploy that trial.

## Root cause: first size measurement waits for scroll-stop

The seven-viewport IntersectionObserver gate works. In a cold 390 × 844 run it
fired at 3.739 s, and the original hero reported scene-ready at 3.953 s, but the
garage renderer was not created until 9.493 s, after the continuous scroll ended.

The installed Fiber 9.7.0 `Canvas` calls `react-use-measure` 2.1.7 with
`scroll: true` and a 50 ms scroll debounce. That hook uses the **same debounced
handler** for its initial ResizeObserver measurement and document scrolling.
Every scroll event resets the initial measurement timer. Fiber cannot configure
its renderer until the measured width and height become positive. The garage
is fixed-positioned, so document scrolling does not actually change its bounds.

This was traced in the installed library source, not inferred just from timing.
The hook's [upstream source](https://github.com/pmndrs/react-use-measure/blob/master/src/index.ts)
also documents its measurement/listener implementation. Installed versions are
the authority for this site's behavior.

An opt-in real-browser regression assertion was added to
`scripts/garage-performance-check.mjs` (`QA_EXPECT_EARLY_MOUNT=1`). It failed on
the production baseline at **5,440 ms after its gates**, then passed with the
single private trial property:

```tsx
resize={{ scroll: false, debounce: { scroll: 0, resize: 0 } }}
```

The trial kept ResizeObserver/orientation handling, all source models, textures,
shaders, effects, DPR, camera choreography, readiness gates and copy unchanged.
It solved initialization starvation, but exposed the separate GPU scheduling
problem described below. The property is **not** in the application now.

## Controlled measurements and rejection

Chrome with hardware AMD Radeon 740M; fresh browser contexts, cold cache,
six-second continuous entry scroll, old/new/new/old in each group. Fast 4G is
1,012,500 bytes/s with 165 ms latency. These are controlled local measurements,
not physical Apple or production field metrics.

| Profile | Baseline full reveal | Trial full reveal | Decision |
| --- | ---: | ---: | --- |
| Mobile, unthrottled | 17.062 s | 14.002 s | 3.061 s / 17.94% earlier |
| Mobile, Fast 4G | 18.766 s | 18.963 s | 0.197 s / 1.05% slower; no speed win |
| Desktop, unthrottled | 17.300 s | 15.689 s | Earlier, but opening scroll regressed |

Desktop entry-scroll p95 frame interval worsened from **14.0 to 20.8 ms** and
p99 from **27.8 to 38.3 ms**. Mobile normal p95 cadence stayed near 7.1 ms, but
its p99 also rose (7.65 → 17.4 ms unthrottled; 8.25 → 20.8 ms on Fast 4G).
The faster reveal does not justify calling the trial smoother or shipping it.

Early creation overlaps garage preparation with the visible hero. On Fast 4G,
office photos now transfer at roughly 6.7–11.3 s instead of 11.6–16.0 s; the
final model responses arrive about 0.3 s later. That suggests changed bandwidth
competition, but does not yet prove which scheduling policy will be better.
Do not reduce photo dimensions, textures, models or effects to hide this cost.

`scripts/garage-fixed-canvas-comparison.mjs` records **HOLD** and exits 1 for
the two failing gates (Fast 4G improvement and desktop scroll cadence). It
retains both favorable and unfavorable data. This is expected rejection, not
a green test or a reason to weaken the criteria. Full details are in
`output/garage-fixed-canvas-comparison.json` and the twelve `fixed-local-*`,
`fixed-4g-*` and `fixed-desktop-*` browser reports.

Every successful timing run verified all 71 original garage SHA-256 hashes,
all three hero resource deliveries, unchanged model shelf/transport counts,
and all seven office photo dimensions and texture settings. Static candidate
verification also found all 410 original media files unchanged, 145 identical
GLB/Brotli twins, 21 exact packets, 69 metadata pages, 327 schema blocks,
5,324 resolving local references and exact footer credits. These checks did
not override the performance rejection. Full candidate tours were not run.

## Other diagnostic evidence

The private GL instrumentation now separates `COMPLETION_STATUS_KHR` polling
from uniform discovery without changing any driver return values. Several
materials share a program, producing thousands of redundant pending checks,
but measured driver-query time was only milliseconds. This is not the main
multi-second delay and no polling rewrite was shipped.

Reports `packets-khr-readiness-profile`, `packets-mount-gate-profile` and
`fixed-desktop-cpu-held` retain original shader sources and CPU traces. In the
latter, isolate the hero-active interval before attributing whole-profile CPU
totals to the garage. Browser processes/contexts are closed after each run.

## Next bounded investigation

1. Analyze the held desktop trace during the early garage/visible-hero overlap.
   Distinguish asynchronous program submission, indivisible CPU parse work,
   texture uploads and full-composer first-use. Do not assume all are harmless
   just because the garage canvas is hidden.
2. Prototype an explicit foreground-aware preparation budget. The fixed canvas
   can measure correctly without granting its entire warm-up chain permission
   to compete with the hero. Preserve all seven readiness keys, exact programs,
   first-use verification, generation cancellation and bounded liveness.
3. Separately test bandwidth scheduling for the seven original office images
   and two-slot model queue. Do not blindly postpone photos to station five
   again or replace the shared texture cache/LoadingManager semantics.
4. Require failing behavioral tests, repeated mobile/desktop/network comparisons,
   full seven-station tours, remounts, real buffer/camera resizing on rotation,
   footer/CTA checks and fidelity proofs before another release.

The enhanced remount check now verifies the actual drawing buffer, renderer
size, camera aspect and same scene identity across portrait/landscape changes,
not just the presence of a canvas element. It passed on the restored production
artifact at 390 × 844 → 844 × 390 → 390 × 844, after an actual SPA remount.
Fresh published checks passed all 69 pages and 45 assets, exact marker/bytes,
trusted HTTPS and apex/www/legacy redirects, with zero errors. No release was
published and no cache purge was requested. Physical Apple, SeaOcean 95+,
rankings, separate CDN activation, search ownership and real inbox delivery
remain unverified. No purchase or real client lead was submitted.
