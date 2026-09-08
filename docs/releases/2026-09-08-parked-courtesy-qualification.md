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
