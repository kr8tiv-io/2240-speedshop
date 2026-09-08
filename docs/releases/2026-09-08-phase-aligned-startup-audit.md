# Phase-aligned startup and live audit — 2026-09-08

## Outcome

Diagnostics and first-party checks completed; no production changes or deployment.
Live remains `2703663354e549a59ad93ebf72bd2fdf`. Both courtesy experiments and
the post-geometry candidate remain HOLD under the unchanged performance gates.
The protected application is `98b788c`, source evidence `aad4d98`, deployment
`1da0063d`. All original models, textures, effects, cameras and copy remain intact.

The new evidence separates desktop first-use stalls from phone startup latency.
It does not support treating them as one download or framework problem.

## Completed full-tour diagnostics

The unchanged original tour ran with an additional private phase-clock observer.
Desktop driver 97781 and phone driver 70472 completed with exit 0: each visited
all seven bays, verified all 71 garage resources, all three hero assets and all
seven office photographs, with no page errors. Phone dimensions were 390×844,
touch enabled, device scale factor 3, on desktop AMD 740M hardware Chromium.
This is not physical iPhone/Safari coverage. Instrumentation is not a speed test.

Evidence below is relative to `output/playwright/garage-performance-2026-09-06/`:

- `baseline-27036633-phase-cpu-20260908/`
- `baseline-27036633-phone-phase-cpu-20260908/`

Each contains the raw CPU profile, full tour result, clock anchor and derived
`phase-cpu-attribution.json`. Private capture and analysis helpers are retained
at `output/startup-phase-diagnostic.mjs` and `output/analyze-phase-cpu.mjs`.
No original harness or production code was edited for this diagnostic.

### Timing attribution, not predicted savings

| Observation | Desktop | Phone profile |
| --- | --- | --- |
| Entry-scroll phase | 3485.4–9499.2 ms | 3653.7–9684.5 ms |
| Hero ready flag | 5893.1 ms | 4080.1 ms |
| Garage world ready flag | 11925.9 ms | 9661.1 ms |
| Tour's fully visible observation | 13356 ms | 10992.8 ms |
| Capability-probe sampled self time | 497.5 ms before entry | 108.6 ms before entry |
| Uniform discovery during entry | 261.4 ms sampled | 38.9 ms sampled |
| Uniform discovery while waiting at garage | 840.5 ms sampled | No attributed samples |

The flag and fully-visible observation are different events: the existing
doorway fade and observer cadence remain in place. Do not present the difference
as unnecessary loading or change its choreography to improve a reported number.

On desktop, a 535 ms pre-entry task contains 497.5 ms of capability-probe samples.
A 260 ms task during entry contains 215.7 ms of uniform discovery beneath the
hero's original composer warm-up. A 908 ms garage task contains 824.1 ms of
uniform discovery beneath the full-composer first-use frame. A separate 106 ms
entry task maps to existing creased-normal generation, including `toNonIndexed`;
an 89 ms task includes 48.5 ms sampled texture upload. Preserve normal smoothing
and exact image bytes: disabling either would change quality, not optimize it.

The phone diagnostic has no recorded entry/waiting long task above 100 ms, yet
the doorway is not fully visible until roughly 11 seconds. Its renderer is
created at 4611 ms; shell warm-up logs 2845 ms, including 1188 ms settle/compile
and 995 ms composer warm-up; opening station warm-up logs another 1260 ms.
These are nested wall-clock stages, not additive CPU costs or controlled gains.
Scheduling/serial dependencies require attention as well as desktop GPU stalls.

## Analyzer validity and limitations

CDP timeTicks were mapped through NavigationStart and bracketed against page
`performance.now()`. The desktop mapped time 13381.159 ms lies between its
13378.3/13394.7 ms reads; the phone bracket also passed. Intervals are clipped
to actual phase changes and long-task bounds; coverage assertions prevent gaps
or double counting. Idle, native `(program)`, GC and test-driver stacks remain
separate rather than being reassigned to application code.

The first strict analyzer rejected a -14 microsecond raw delta. The corrected
offline algorithm accumulates deltas and sorts paired timestamps/node IDs,
following the ordering used by [Chrome DevTools](https://raw.githubusercontent.com/ChromeDevTools/devtools-frontend/main/front_end/models/cpu_profile/CPUProfileDataModel.ts).
It preserves the raw profile, records the reorder, and has fixtures for overlap,
negative-delta ordering and stable ties. The phone profile similarly contains
one -12 microsecond delta. Unlike DevTools' display heuristics, this analysis
does not fill program gaps or extrapolate an average final interval.

CPU sampling can miss or over-weight individual operations. Profiler and test
observers add overhead; the waiting-phone phase includes 441.2 ms of test-driver
samples. Whole-startup leads from the previous report must not be interpreted
as entry-only costs or stable savings. Nothing here relaxes the ABBA gates.

## Fresh live SEO and internal-link verification

`output/continued-live-27036633-audit-20260908.json` is PASS:

- 70 canonical sitemap pages: HTTPS 200 and exact protected HTML bytes.
- 72 linked/discovery assets: HTTPS 200 and exact protected asset bytes.
- 397 JSON-LD blocks parse; unique titles/descriptions, one H1 and en-CA checked.
- 696 internal fragments resolve; all 70 pages are reachable within two links.
- Four redirect routes reach canonical HTTPS destinations with permanent redirects.
- Quote endpoint GET rejects with 405; no real enquiry was sent.
- Site-wide footer credit markup is present; fresh footer/quote source contracts pass.

Button activation is covered by the earlier 70-CTA/42-footer browser evidence;
this new crawl is not a repeat activation test. External reference refusals were
not repeated and remain unresolved. Edmonton's 176-character description retains
its existing possible-truncation warning; the user's copy is unchanged.
Private export continuity also passed 73 HTML pages and 406 JSON-LD blocks.
Three discovery files match exactly; llms-full differs only by CRLF checkout
line endings, not text. None of these are a SeaOcean score or ranking result.

The initial default-Node HTTPS check failed certificate verification. Diagnostic
inspection identified the locally installed Norton TLS inspection issuer, and
the same default-Node failure occurred for Google and SeaOcean. Re-running with
Node's Windows system CA store passed; normal curl also returned HTTPS 200.
Certificate validation stayed enabled. No trust store, antivirus, DNS or SSL
configuration was changed, and this is not an independent origin-chain audit.

[Google's AI-search guidance](https://developers.google.com/search/docs/appearance/ai-features)
prioritizes crawlable, useful text, internal links and accurate structured data;
it does not require special AI markup. Indexing, AI citations and rankings are
not guaranteed. The remote reader returned an older GoDaddy page snapshot while
the fresh live fetch matched the current release: cached reader content is not
evidence of a current deployment rollback. SeaOcean supplied no new score.

## Next architectural decision

After three unsuccessful release experiments, stop adjusting isolated grace
timers. Review startup ownership across the hero and shop, including readiness,
shared main-thread work and actual GPU first use. The preferred direction is a
coordinated preparation schedule that retains every effect and keeps input work
responsive. It must be specified and tested before another runtime patch.

Do not claim an Astro/language migration or CDN change would remove the measured
client-side GPU work. Keep the current static HTML/SEO infrastructure while
validating that hypothesis. Existing byte prefetch and park/wake mechanisms
already exist; merely adding another timeout or preload is not that refactor.

No fourth production fix was attempted in this pass. Preserve all failed
qualification reports and backups. No GPU diagnostic remains running.
