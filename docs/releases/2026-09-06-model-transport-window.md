# Exact-byte transport window: held after desktop regression

## Final decision for this experiment

**HOLD — no application deployment.** The twelve fresh connection-aware
ABBA runs completed, but the desktop mean exceeded the predeclared 3%
non-regression limit. The comparison's HOLD result is retained; it must not
be turned into PASS by choosing the earlier favorable unconditional run.

| Profile | c6d baseline | b326 candidate | Difference |
| --- | ---: | ---: | ---: |
| Mobile Fast 4G | 19.026 s | 18.436 s | 589.6 ms earlier |
| Desktop | 17.255 s | 18.192 s | 937.25 ms later (5.43%) |
| Mobile unthrottled | 16.514 s | 16.172 s | 342.5 ms earlier |

Entry p95 stayed 7.10 ms on both mobile profiles and changed 13.95 → 14.00 ms
on desktop. Mobile entry p99 worsened from 7.65 → 13.70 ms on 4G and
7.65 → 11.50 ms unthrottled; desktop p99 stayed 27.80 ms. Startup long-task
totals changed 696 → 636.5 ms, 2,420.5 → 2,601.5 ms and 1,188 → 1,120 ms.
Full timing rows, original model hashes, GPU/settings and non-overlap checks
are in `output/transport-aware-comparison.json` and the twelve
`transport-aware-{4g,desktop,local}-{old,new}-{1,2}` browser reports.

Both full seven-bay candidate tours and seven desktop station buttons passed.
All twelve runs verified all 71 original garage models, all three hero
resources and unchanged office texture settings. These successful fidelity
checks do not override the adverse desktop timing. The qualification driver
stopped at HOLD, so its subsequent Slow 4G, missing-API browser, remount,
rotation, curtain and focused-action stages **did not run on b326**.

The exact candidate export is archived as `output/held-network-aware-b326.zip`
(68,886,340 bytes; SHA-256
`596fb7b6b1207a6071b837fd5f830684b0f9c241cf57b09a341ba1e902b4aea5`).
Adjacent `.bak` snapshots preserve the candidate Loaders, modelRequest and
configuration regression test, alongside its prepared metadata. The first
unconditional trial archive is also retained.

All trial application changes were removed. Generated `out` and the dedicated
deployment checkout were restored to c6d from the existing exact rollback;
every one of 1,289 file hashes matched and the deployment checkout is clean.
Prepared metadata again names the actual live c6d release. The source checkpoint
keeps diagnostic tools, evidence and a two/four-slot pool behavior test only;
it does not alter the deployed models, copy, effects or application behavior.

A fresh live check passed 69 pages and 45 assets, exact release bytes,
SEO/crawler metadata, TLS and all four redirect routes. The quote endpoint
correctly rejected GET with 405; no real lead was sent. Focused live footer/
quote checks are recorded separately and must not be called candidate tests.

The three fresh live interaction cases passed with zero browser errors:
guides → Start your quote → form → back, desktop footer after the loaded
garage, and emulated-phone footer after the loaded garage. KR8TIV resolved
to `https://kr8tiv.io/` and Contact to the canonical contact page. No real
POST, call or email occurred. Evidence:
`output/playwright/live-transport-held-actions/results.json`.

Restored static checks passed 69 unique metadata sets, 327 schema blocks,
72 exact footer credits, 145 lossless model/Brotli twins, all 410 original
media files and 1,289 byte-identical mirrored files. This is not a SeaOcean
score, field Core Web Vitals, physical Apple validation, or ranking guarantee.

Next bounded investigation: isolate the measured mobile/lite transport benefit
from full-tier desktop admission. Do not select a rendering tier from network
quality or remove any asset. If adjusting queue capacity, preserve the same
pool/cache/promise ownership through route changes and rotation, and prove
that reducing capacity does not drop jobs or overlap old/new decoder owners.
Re-run controlled desktop and mobile timing plus lifecycle/action gates before
shipping. Alternatively profile the desktop office/gallery first-use stall
(the candidate's station-five compile/first-use interval grew); moving its
photo requests earlier alone was already tried and held in a separate trial.

## Historical investigation notes

## Revised connection-aware candidate — in progress

Current unpublished export is `b326d2d633b348879dce30661588d930`.
Unconditional four-slot trial `11a99110a52340aabb94fce7a170f958` was **not
deployed**. Its exact export and metadata are archived as
`output/held-unconditional-four-11a.zip` and the adjacent prepared JSON;
archive SHA-256 `c9faa6c669b5f8fca476724cb03123c5108ce2dd3a5ff81b900e869aaea32854`.

The additional Slow 3G runs exposed retry pressure: four slots allowed more
models to arrive but delayed the tool-cart bay through two timed-out attempts.
Both baseline and trial were still advancing when Puppeteer's 180-second
protocol command limit interrupted observation. Neither run proved full
readiness or permanent failure, and neither is a passing speed measurement.

The revised application changes only HTTP admission at module initialization:
four slots when `effectiveType` is `4g`, `saveData` is false, estimated downlink
is finite and at least 1.5 Mbps, and RTT is finite within 0–300 ms. Otherwise
it retains the shipped two-slot behavior. Missing or partial API data, including
Safari's lack of this API, is conservative. It is a startup snapshot, not a
claim of continuously measured bandwidth. No asset, parse lane, decoder,
shader, reveal gate, timer or camera setting changes with connection hints.
See [MDN's Network Information reference](https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation)
for the API's limited availability and estimated values.

The real application configuration first failed the weak-network regression
with `4 !== 2`. Its helper, server-rendering/unknown-browser path, malformed
hints, boundary conditions and actual shared request pool now pass. Existing
real HTTP integration (9), packet-store (16), liveness, prefetch, progressive
reveal and loader-generation contracts passed. The HTTP seam test was updated
to supply the newly imported real helper, not a replacement transport.

The revised build/TypeScript and prepared SEO/media/footer checks passed.
The extended Slow 3G diagnostic now permits 420 seconds for world readiness
and 480 seconds for the protocol command; normal test limits and all production
timeouts are unchanged. Explicitly aborted capture bodies are recorded and
cannot supply model coverage; successful responses must still hash-match all
71 originals. Fresh connection-aware browser checks remain in progress.

The first extended run (`transport-aware-slow3g`) reached full visibility at
274.119 s but **failed** its transport assertion before the hash stage. The
saved browser hints were `4g`, 1.7 Mbps, 100 ms despite 50 KB/s throttling; it
therefore exercised four slots, not the intended two. A minimal browser
reproduction confirmed native connection hints reset on cross-document
navigation while transfer throttling persists. The harness now reapplies
Chrome's native `Network.overrideNetworkState` after navigation, before model
prefetch, rather than assuming the throttling API supplies matching hints.
See the [Chrome DevTools Network protocol](https://chromedevtools.github.io/devtools-protocol/tot/Network/).

That run also demonstrated that Resource Timing can close an aborted request
after its replacement starts (a 0.6 ms overlap). Slot observation now records
fetch/body completion and the real request AbortSignal; raw resource timings
are retained separately. The exact pool contract still independently proves
the hard concurrency bound. This is test measurement repair, not a raised
limit or weakened coverage requirement. The replacement run is named
`transport-aware-slow3g-native`; do not overwrite or relabel the failed report.

The corrected native-hint Slow 3G run **passed** on b326: actual 2g hints,
0.4 Mbps / 2,000 ms RTT, two peak admitted transfers, full visibility at
279.279 s, every original garage model (71) and hero resource (3) accounted
for, no browser errors. Three explicitly aborted attempts were recorded; the
successful replacements provided all exact hashes. This is a severe-link
liveness/fidelity check, not a claim that a 4½-minute cold load is fast or
that it improves on an equivalently completed baseline. The baseline's
earlier observation ended too soon to make that comparison.

Fresh model-pipeline, mobile containment, retained home copy, hero-runtime and
route-veil contracts also passed. The normal-profile ABBA series and route/
rotation/curtain/action qualification are running sequentially, with no
overlapping WebGL test browsers. Only after those gates will publication be
considered. Live queryless marker, robots, sitemap and HTTPS www redirect still
resolve to the unchanged c6d release.

The following evidence describes **the earlier unconditional trial**, not
fresh measurements of the revised candidate.

## Archived unconditional trial

Candidate export: `11a99110a52340aabb94fce7a170f958`. **Not yet deployed.**
Live baseline: `c6d06296f0614628a3f609a8e8cabb59`, deployment `8f982d65`.
Exact rollback: `output/baseline-c6d.zip` / expanded `output/baseline-c6d`,
1,289 verified files. The previous held .tsx source snapshot was renamed
`.tsx.bak` byte-for-byte after TypeScript correctly refused to compile it as
application source. The replacement candidate build and type check passed.

## Evidence that changed the next action

`QA_WAIT_PROFILE=1` captures original timers in the private test browser,
preserving callbacks, arguments, delays and cancellation. This is diagnostic
instrumentation, not a production change or a speed benchmark. Its stack capture
adds overhead; overlapping timer totals must not be called CPU execution time.

The c6d mobile Fast 4G trace recorded renderer creation 11.508 s, last original
model byte completion 16.593 s and all-world readiness 17.394 s. Nine 70 ms
subtree-settle waits totalled 678.9 ms. The 60 ms timers overlapped for a union
139.5 ms. Pending shader polls overlapped too: 4,488.8 summed ms occupied only
2,455.6 ms of union wall time. This does not prove those waits could safely be
removed; reducing a settle timer alone cannot recover the entire delay.

The remaining exact model transfers were therefore worth testing separately
from CPU/GPU admission. All 71 byte promises already preload in tour order.
The sole executable application change is `PREFETCH_CONCURRENCY = 2` → `4`.
It changes HTTP admission only: no extra decoder workers, parallel parses,
early renderers, shortened readiness checks or altered model/shader work.
The existing shared promise cache, demanded-model priority, bounded retries
and original fallback path remain intact. No asset has been re-encoded.

Production negotiated `h2` with a trusted Node TLS/HTTP2 connection. This is
not proof of a separately activated CDN. Multiplexing and resource timing are
covered in [Chrome's Modern HTTP guide](https://developer.chrome.com/docs/performance/insights/modern-http)
and [MDN's Resource Timing reference](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming).
The local controlled benchmark uses its existing HTTP/1.1 static server; live
verification is still necessary and local timings are not production claims.

## Red/green and fidelity

The actual browser concurrency check failed on c6d with `2 !== 4`
(`transport-four-red`). The configured-pool contract independently failed
with the same expected mismatch before the constant changed.

On the candidate, the real request pool test proves four simultaneous slots,
demand promotion without another request, slot release on rejection and exact
ArrayBuffer identity. Existing packet store (16), real HTTP integration (9),
model prefetch, loader generation, garage liveness and progressive-reveal
contracts passed. The generic two-slot pool tests remain; only the application
configuration assertions were updated to require exactly four, not unbounded
or arbitrary concurrency. Model parsing remains globally serial.

All twelve browser runs observed the expected peak (two baseline, four trial),
verified all 71 original garage model hashes, three hero resources, unchanged
office texture settings and exact transport coverage. All 410 original media
files / 67,356,286 bytes and all 21 packet files remain byte-identical.

## Twelve-run cold ABBA comparison

Real hardware-backed Chrome, Radeon 740M. Mobile is device emulation, not a
physical Apple/Safari test. No timer/CPU instrumentation was enabled. The
comparison checks start/finish timestamps to prohibit overlapping GPU runs.

| Profile | Baseline reveal | Candidate reveal | Entry p95, old → new |
| --- | ---: | ---: | ---: |
| Mobile Fast 4G | 18.785 s | 18.412 s | 7.10 → 7.10 ms |
| Desktop | 16.959 s | 16.613 s | 14.00 → 13.90 ms |
| Mobile unthrottled | 16.186 s | 16.281 s | 7.10 → 7.10 ms |

Both Fast 4G and desktop candidate samples precede both matching baseline
samples. Fast 4G's full reveal is 373.2 ms earlier (about 2%); final model bytes
arrive 3.280 s earlier, but that is **not** a 3.280 s full-scene gain. Desktop
reveals 345.8 ms earlier. Unthrottled mobile is 95.45 ms later (0.59%). Do not
claim every profile became faster or that all remaining delay is solved.

Entry p99 changes: mobile 4G 10.5 → 11.5 ms; desktop 31.2 → 24.35 ms;
mobile local 9.15 → 7.75 ms. Startup long-task totals increased slightly:
659.5 → 680.5, 2,232.5 → 2,327, and 1,086.5 → 1,111 ms respectively.
These are small lab samples, not field Core Web Vitals or population estimates.

Predeclared experiment gates required nonoverlapping earlier 4G reveals,
other means within 3% of baseline, and entry p95 within 0.5 ms; all passed.
`scripts/garage-transport-window-comparison.mjs` writes the complete observations
to `output/garage-transport-window-comparison.json` rather than hiding adverse
tails. Passing this comparison alone does not approve production deployment.

Both full seven-bay tours passed, including every bay after the engine. All
seven desktop rail controls passed. Original engine-room mobile and metalwork
desktop screenshots were visually inspected; copy and scene composition were
retained. All figures/screenshots are under `transport-*` in the performance
output directory, not replacements for physical-device testing.

## Additional checks and remaining gate

Build/TypeScript passed. Prepared SEO/media checks passed 69 unique titles,
descriptions and canonicals, 327 schema blocks, 5,324 resolving local references,
40 items per feed, exact 72 footer credits and 145 lossless model/Brotli twins.
All source export files match the dedicated deployment mirror.

Slow-connection, lifecycle, focused action and post-deploy checks are still
pending at this checkpoint. Do not claim the candidate live or all-network
safe before those results are recorded. The goal remains active; no new
production write, real lead/call, DNS/mail/SSL mutation or purchase has occurred.
SeaOcean 95+, rankings, separate CDN activation, search ownership, physical
Apple validation and actual inbox delivery remain unverified.
