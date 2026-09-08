# Parked courtesy qualification — 2026-09-08

## Candidate1: HOLD, never deploy

Baseline live2703663354e549a59ad93ebf72bd2fdf, application98b788c plus evidence
aad4d98. Candidate44f44924db72432d9eef8ae85e3adf9d shortened the parked HDR
preflight to150ms on both tiers. All shaders, draws, assets, yield/ownership and
readiness checks were preserved; final full-size proof remained900ms.

Test-first: six RED undefined-versus150 ownership assertions, followed by all8
GREEN ownership cases. Warm queue, overlap, reflection-readiness, liveness and
progressive-reveal passed. TypeScript, build and scoped test lint passed. The
liveness contract's literal call assertion was updated intentionally and now
also guards the unchanged900ms finalizer. Independent review cleared only
qualification, not deployment.

Fidelity:449 original deployed media files,69,051,840bytes unchanged; all73HTML
page copy unchanged. No source model/texture/shader/effect/copy files modified.

Eight sequential fresh-browser hardware-AMD Chromium tours, ABBA per tier;
one baseline and one candidate export served through the same local server.
Each run passed7bays,71 exact garage resources,3hero arrivals,7office textures,
no page errors. No physical Apple, field-CWV or network-speed claim.

| Metric (mean of2 runs) | Desktop baseline → candidate | Phone baseline → candidate |
| --- | --- | --- |
| Opening reveal | 10953.4 →10425.3ms (−4.82%) | 10322.25 →9647.3ms (−6.54%) |
| Hero ready | 3867.4 →3847.65ms | 4062.2 →4006.8ms |
| Entry-frame p95 | 24.25 →27.75ms (+14.43%) | 13.9 →14ms (+0.72%) |
| Entry-frame p99 | 48.7 →52.1ms (+6.98%) | 24.4 →24.45ms (+0.20%) |
| Entry worst frame | 361.8 →546.15ms (+50.95%) | 122.1 →114.75ms (−6.02%) |

The unchanged3% gate FAILED on all three desktop frame-tail measures. Faster
opening does not excuse rougher scrolling. Candidate1 remains held. Its desktop
logs show the same expensive full-size composer proof(~520–562ms) now falling
earlier in the entry scroll; shortening the preflight does not remove that bill.
This is an evidence-backed scheduling lead, not a complete GL root-cause claim.

Evidence: output/courtesy-qualification.json, output/courtesy-export-fidelity.json,
output/playwright/garage-performance-2026-09-06/courtesy-20260908-* and the preserved
RED/build logs. Driver33178 is terminal HOLD; no lifecycle followups ran in it.

## Next bounded variant

Test150ms only for phoneTier; retain900ms for full desktop. Extend actual paced
ownership tests to both tiers and verify RED before changing production. Build
and qualify again before any source integration/deployment. The mobile result
above is not permission to skip a current-build desktop or lifecycle check.

## Candidate2: HOLD, never deploy

The tier-specific variant `phoneTier ? 150 : 900` built as private release
8cdb67ebf7f048ecbe93eb68ad23e5db. The full tier retained the original900ms;
the final full-size proof retained900ms on both tiers. Six expected RED
assertions preceded14 GREEN ownership cases. Liveness, progressive-reveal,
scoped test lint, TypeScript and the complete build passed. Independent review
found no other runtime change and approved controlled qualification only.
Fidelity again passed449 original media files and all73 pages' visible copy.

Driver73734 completed all8 sequential full tours, ABBA per profile, with the
same7bays/71exact garage resources/3hero arrivals/7office photos and no page
errors. It terminated with HOLD at the unchanged3% performance gate.

| Metric (mean of2 runs) | Desktop baseline → candidate | Phone baseline → candidate |
| --- | --- | --- |
| Opening reveal | 11408.9 →12388.4ms (+8.59%) | 19323.1 →25935.8ms (+34.22%) |
| Hero ready | 4382.1 →4668.85ms (+6.54%) | 12064.65 →4836.4ms (−59.91%) |
| Entry-frame p95 | 31.3 →38.65ms (+23.48%) | 13.9 →17.4ms (+25.18%) |
| Entry-frame p99 | 69.5 →90.35ms (+30.00%) | 31.75 →38.25ms (+20.47%) |
| Entry worst frame | 432.2 →271.45ms (−37.19%) | 59.1 →118.3ms (+100.17%) |

The run set varies substantially, including hero startup before this change
can execute and the unchanged full-tier path. That does not establish a cause
or license discarding adverse runs. Neither a repeatable improvement nor
smoothness non-regression was demonstrated. Candidate2 stays isolated; no
lifecycle followups, source integration or deployment were authorized by this
result. Both candidates are held, not improvements delivered to production.

Evidence: output/courtesy-phoneonly-20260908-qualification.json,
output/courtesy-phoneonly-20260908-export-fidelity.json,
output/phoneonly-courtesy-red.log and the eight
output/playwright/garage-performance-2026-09-06/courtesy-phoneonly-20260908-*
directories. The next bounded task is diagnostic attribution of the original
baseline's full-composer startup cost. Instrumented profiles are not A/B speed
measurements, and the original live/source release remains protected.
