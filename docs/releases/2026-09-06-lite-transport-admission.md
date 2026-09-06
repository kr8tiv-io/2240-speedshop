# Lite-world transport admission — release qualification

Baseline: live c6d / deployment 8f982d65, source checkpoint b09deca. The
previous network-only four-slot candidate b326 is archived, not deployed.
Its twelve-run comparison improved mobile 4G by 589.6 ms but delayed desktop
by 937.25 ms, failing the non-regression gate. This follow-up does not change
the goal or the gate: the complete high-fidelity desktop/mobile site remains
the target, and other loading/rendering bottlenecks remain in scope.

## Hypothesis and boundaries

Use four transports only for the existing **lite** world on a browser-reported
healthy connection. Full worlds stay at two on every connection. Unknown,
partial or slow network hints also stay at two. Rendering tier is an input
to transport policy, never its output. No model, texture, decoder, shader,
effect, DPR, camera, copy, parse gate or world-ready condition changes.

The existing request pool gains a capacity setter. It retains its queue,
promise identities, demand priority, retries and expiration timers. Narrowing
does not cancel already-started bytes; admissions resume only when active work
falls below the new bound. There is no replacement pool and no extra decoder
lane. The existing immutable world verdict remains unchanged through rotation.

Tracing route ownership found that a pending module import could still call
prefetch after its effect was disposed. Each of the three existing schedule
sites now passes a live effect guard, so an old route cannot reconfigure the
new route's admission. The import promise itself remains shared and usable.

## Tests before implementation

New resize and policy contracts failed on missing functionality; the actual
deferred route helper failed with a dispatched `lite` prefetch after disposal.
After implementation, the same tests passed. Capacity expansion/narrowing,
invalid limits, same-promise demand promotion, failed response slot release,
queued expiry and promoted-job expiry exemption are verified against the real
pool. Existing nine-case real HTTP packet integration, sixteen-case store,
loader generation, liveness, prefetch and progressive-reveal contracts pass.

## Release gates

Build/type and scoped lint; original-byte fidelity and prepared SEO/links;
fresh cold ABBA desktop/mobile/4G timing with actual two-slot full and four-slot
healthy-lite observation; weak/missing network API; rotation and route-remount
ownership; complete seven-bay tours; curtain/fade and live quote/footer actions.
The existing performance acceptance limits stay unchanged. Old b326 results
are not proof for the new candidate. No publication or score/ranking claim is
authorized by a unit-test pass alone. Keep the exact c6d rollback throughout.

## Prepared candidate and controlled results

Prepared export: `cf744f55f22b43ec955394ea0df4fd6d` at 10:22:37 UTC.
The prepare-only script completed its guarded build/export path; no deployment
was triggered. A separate fresh `tsc --noEmit`, scoped ESLint (zero warnings),
contract reruns and `git diff --check` passed at 10:33 UTC. One verification
command used a nonexistent integration-test filename and stopped; the corrected
`model-packet-integration-contract.mjs` ran all nine checks successfully.

Twelve sequential cold Chromium runs on the same Radeon 740M used old/new/new/old
ordering for each profile. Browser caches were disabled; all original model
hashes and office texture settings matched. Phone profiles are emulation, not
physical Apple measurements. The timer includes the six-second approach scroll
and original full-world reveal fade, not just download or time at the doorway.

| Profile | Live baseline mean | Candidate mean | Difference |
| --- | ---: | ---: | ---: |
| Phone, Fast 4G | 18.862 s | 18.349 s | -0.514 s / -2.7% |
| Full desktop, local | 17.031 s | 16.952 s | -0.079 s |
| Phone, local | 16.317 s | 16.244 s | -0.073 s |

All original acceptance gates passed. Both new 4G results were earlier than
both baseline results; desktop and local means stayed within 3%, and entry
p95 stayed unchanged (7.1 ms phone, 14 ms desktop). Actual admission was four
only on the healthy lite profiles, two on full desktop. This is a small mobile
loading improvement, not evidence that the whole experience is universally fast.

Preserve adverse/noisy measurements too: desktop entry p99 rose from 20.9 to
24.35 ms and observed CLS from 0.08115 to 0.09096; local phone entry p99 rose
from 8.05 to 9 ms and startup long-task total from 1,063 to 1,150.5 ms. Mobile
4G p99 fell from 10.5 to 9.45 ms and startup long-task total from 644.5 to
614.5 ms. Desktop's 79 ms reveal difference is not a meaningful speed claim.
The 4G model bytes finished about 3.66 seconds sooner, but final reveal only
improved 0.514 seconds: parsing, GPU first-use and warm-up remain bottlenecks.

Reports: `output/transport-lite-comparison.json` (PASS) and twelve
`transport-lite-{4g,desktop,local}-{old-1,new-1,new-2,old-2}` directories under
`output/playwright/garage-performance-2026-09-06`. Old b326 HOLD reports remain
unchanged. Full candidate desktop and phone tours reached all seven stations;
all seven desktop rail buttons moved the camera to their corresponding bay.
Desktop engine and phone dyno screenshots were visually inspected.

## Fidelity, technical SEO and compatibility

Prepared checks pass: 69 canonical public pages with unique titles/descriptions,
327 parsed JSON-LD blocks, 5,324 local href/src references with no missing targets,
69-item sitemap, crawler/AI discovery routes and three 40-item feeds. All 72 HTML
documents contain the exact small credit with only KR8TIV linked. Current export
files match 1,278 paths in the deployment mirror; its extra immutable generation
is intentionally retained. All 145 GLB/Brotli twins, 21 model packets and 410
original media files (67,356,286 bytes) retain exact original bytes.

Slow 4G native hints (3g / 1.3 Mbps / 500 ms) retained two transfers and loaded
all 71 garage and three hero resources, with full reveal at 76.457 seconds.
That is recovery/liveness evidence, **not** a satisfactory slow-link speed or
a controlled improvement. Missing Network Information API also retained two
and completed the full seven-bay tour. Rotation 390x844 → 844x390 → 390x844 kept
the same populated scene, resized real drawing buffer/camera and no horizontal
overflow; route return constructed a fresh single populated renderer. Full
curtain/fade checks passed. Three focused prepared action cases passed with zero
browser errors: Guides → quote form → Back, desktop and phone KR8TIV/Contact
links after the loaded garage. The KR8TIV link opened its actual requested tab.
An additional healthy-lite four-slot corrupted-packet browser run passed exact
71+3 model recovery without browser errors. Evidence is
`transport-lite-corrupt-recovery/results.json` in the performance directory.
Publication and final live checks are still pending.

The SEO and Core Web Vitals checklists were used as release checks, not grounds
for rewriting approved copy or claiming rankings. SeaOcean 95+, field Core Web
Vitals, search-console ownership, separate CDN activation, actual inbox delivery
and physical Safari/iPhone performance remain unverified. No DNS/mail/SSL change,
purchase, real client lead, call or email was made. Continuous goal stays active.
