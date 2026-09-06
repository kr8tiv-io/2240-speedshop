# Park the fully hidden film, preserve every visible frame

## Candidate and rollback

Live export: `c6d06296f0614628a3f609a8e8cabb59`, application source `5bb0044`,
pushed to both source remotes. Deployment `8f982d65` is published and verified.
Its exact prior-release rollback is `output/baseline-b512.zip`
(68,765,717 bytes), release `b51232a823e2442bb76e7c6e6c85bd84` / `d02c8e73`.
The new export is archived as `output/verified-curtain-c6d.zip` (68,887,460 B).
The exact committed deployment, including its immutable overlap manifests,
is `output/baseline-c6d.zip` (68,792,612 B), expanded as `output/baseline-c6d`.
All 1,289 files were SHA-256 checked against deployment `8f982d65`. Use this
as the next optimization baseline; retain the prior b512 rollback as well.

The only application change is in `HomeCinema.tsx`: a separate curtain state
parks the existing hero renderer **after** the original 450 ms outgoing fade
completes, and wakes it at the start of the original 550 ms incoming fade.
The broad IntersectionObserver margin remains a separate proximity condition.
The context, models, camera choreography, DPR, shader programs, effects and
copy are unchanged. This does not remount the canvas or change its resolution.

## Root cause and regression evidence

The film's proximity observer deliberately covers a large corridor around
both runways. The GSAP curtain independently sets the fixed host to opacity
zero and `visibility:hidden`. CSS hiding did not park Fiber's `always` loop:
the original full post chain continued running until the observer left its
larger margin, including while the visitor waited at the garage doorway.

`scripts/hero-curtain-parking-check.mjs` reproduced the problem on the exact
production artifact. In each 600 ms fully hidden sample, Three's render-frame
counter advanced by 1,008 / 1,056 submissions on mobile and 1,320 / 1,870 on
desktop (opening / finale). These are renderer submissions, not display FPS.

The same test on the candidate records **zero** submissions in all four hidden
samples. All ten visible/return/interrupted-fade samples continue rendering.
The original scene identity, single canvas, exact buffer dimensions and DPR
survive every transition; neither profile develops horizontal overflow.
No browser exceptions. Reports: `output/playwright/hero-curtain-{red,green}`.

The test uses real hardware-backed Chrome with 390 × 844 mobile emulation and
1440 × 900 desktop. It is not physical iPhone/Safari certification. It proves
elimination of invisible work, not a specific whole-site speed percentage.

## Separate image-preload experiment: rejected

Before this fix, a separate candidate moved the seven original office textures
to the hero-ready approach gate, sharing the existing ordered drei cache.
It started no GPU work and preserved all image files/settings. Its new browser
assertion failed on the baseline and passed on the trial, proving that the
downloads genuinely began before Canvas creation.

Cold Fast 4G ABBA runs nevertheless measured full reveal at 18.968 s baseline
versus 19.146 s candidate (178 ms later). Photo transfer started 5.310 s earlier
and finished 5.016 s earlier, but this did not speed up the complete scene.
Normal entry p95 stayed 7.05 ms; startup long tasks were 834 vs 852.5 ms.
All 71 garage hashes, three hero resources, original photo settings and
transport counts matched. Do not interpret earlier individual requests as
earlier complete readiness.

The trial `179f413119314b1a8c1103f3367a1681` was **not deployed**. All its app
changes were removed before the curtain build. Backup:
`output/held-premount-photos-179f.zip` (68,887,680 bytes), with separate prepared
metadata. `scripts/garage-photo-prefetch-comparison.mjs` intentionally records
HOLD and exits 1; do not weaken this result or retry the same change unchanged.

## Release checks

Production build, TypeScript, scoped ESLint, hero runtime/ownership,
mobile-containment, loader generation/ownership/liveness, model prefetch,
office preload cache and shop image version contracts passed.

Static candidate audit passed 69 unique title/description/canonical pages,
327 structured-data blocks, 5,324 resolving local references, all 40 entries
in each feed, and the exact small footer credit in all 72 HTML documents.
All 410 original media files (67,356,286 bytes), 145 GLB/Brotli twins and 21
packet files remain byte-identical. The export and deployment mirror match.

Twelve cold ABBA startup runs retain all original resources/settings:

| Profile | Baseline reveal | Candidate reveal | Entry p95, old → new |
| --- | ---: | ---: | ---: |
| Desktop | 17.552 s | 16.863 s | 13.95 → 14.00 ms |
| Mobile, unthrottled | 16.530 s | 16.396 s | 7.10 → 7.10 ms |
| Mobile, Fast 4G | 18.658 s | 18.961 s | 7.05 → 7.10 ms |

Desktop's two candidate reveals are both earlier than both baselines (mean
689 ms / 3.93% earlier). Mobile is mixed: unthrottled runs overlap; Fast 4G
is **303 ms / 1.63% later**, despite lower startup long-task totals (786 →
660 ms). Do not describe this as a mobile loading improvement. Desktop entry
p99 is 24.35 → 31.20 ms; normal p95 cadence is retained, but there is no basis
for promising all tail frames are faster. `garage-curtain-comparison.mjs`
asserts fidelity/behavior and reports these timings; it does not turn them
into a blanket performance PASS. Eliminating invisible continuous work is
the primary verified outcome of this narrowly scoped fix.

Both complete seven-station tours pass. All seven desktop rail buttons reach
their original stations. The mobile camera passes the engine and reaches
every later bay, with no missing scene or sideways overflow.

Fresh SPA remounts passed for both hero and garage. The remounted hero retains
117 owned materials and frames Act III at edge 0.924. Garage rotation keeps
one populated scene with a correctly resized real drawing buffer and camera
aspect at 390 × 844 → 844 × 390 → 390 × 844, with no overflow.

The enhanced curtain test also records live renderer submissions throughout
the original outgoing fades, before parking; all 14 cases pass.

Full prepared-site action audit: **127 passed, zero failed, zero browser errors
or unexpected mutations**. Covers all 69 route CTAs, shared desktop/mobile
footer destinations, menu, service selection, fragments/back navigation,
and KR8TIV/Contact after the garage loads. Four intercepted form responses
exercise failure/retry/success/reset without sending real client leads.
Report: `output/playwright/curtain-site-actions/results.json`.

The exact Hostinger release marker appeared before the cache purge; the
authorized purge was accepted. Queryless post-purge verification passed all
69 live pages and 45 assets with exact local hashes, production canonicals,
crawlable metadata and footer credit. All 21 packets retain correct MIME,
Brotli encoding, exact decoded bytes and immutable year-long cache headers.
Trusted HTTPS and apex/www/legacy-path permanent redirects pass. The quote
endpoint returns the intended GET 405; no real lead was sent. Evidence:
`output/published-release-check.json`.

The live full mobile tour passes all seven bays, all 71 original model hashes,
three hero resources and unchanged packet counts. Its single-run reveal was
17.025 s; this is not a controlled before/after production speed claim.
All 14 live curtain cases pass, including original outgoing animations, zero
fully hidden render submissions, unchanged context/buffer and interrupted
return transitions. Three focused live actions also pass: cold quote fragment
→ Guides → quote/back, plus KR8TIV and Contact after the populated garage on
both desktop and mobile. No browser errors, unexpected mutations or real leads.
Reports: `curtain-live-phone390`, `curtain-live-parking` and
`curtain-live-footer-actions` under the corresponding Playwright output roots.

All browser verification processes finished and closed their owned contexts.
The continuous optimization goal remains active. Mobile cold-start scheduling
is still a priority, not solved
by this limited invisible-rendering fix. Do not repeat rejected photo/early-GPU
trials unchanged, or remove visual quality to chase a timing number.

## Next bounded investigation

Use the now-proven curtain-completion boundary to investigate the previously
measured initial Canvas sizing starvation. A possible policy is to retain the
current scroll courtesy while the hero is visibly animating, but allow the
fixed garage to obtain its first size immediately once the outgoing film is
fully hidden. This is a hypothesis, not implemented or verified here. It could
recover part of the remaining scroll-stop delay without restarting the rejected
unrestricted two-renderer overlap. Keep existing idle-reader prewarming,
hero-failure/deep-link behavior, lifecycle ownership and orientation handling.

First record the actual curtain-completion, initial measurement and warm-work
timestamps on the current release. Test one scheduling policy against this
checkpoint; retain adverse mobile/desktop/tail-frame results. Do not introduce
another quality tier, re-encode textures, alter the camera, or assume an earlier
request/renderer necessarily gives a sooner complete seven-bay reveal.

SeaOcean 95+, rankings, separate CDN activation, Search Console/Bing ownership,
physical Apple validation and actual inbox delivery remain unverified.
No purchase, real lead/call, DNS/mail/SSL change or support-tab interaction.
