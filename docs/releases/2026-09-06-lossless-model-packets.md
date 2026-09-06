# Lossless garage model packets

## Candidate and rollback

Prepared candidate: `b51232a823e2442bb76e7c6e6c85bd84`, application source
`b72b5c1`. **Publication is pending the remaining browser release checks.**
The current live application is still `acce5c29994840cda346ff4e6119f2ea`,
deployment `45bb7eb3`. Its exact rollback is `output/baseline-acce.zip`
(67,250,890 bytes). Existing backups are preserved.

## What changed

Small consecutive model files share bounded, content-addressed Brotli packets.
The first three opening vehicles remain individual; opening and later-route
priority boundaries are preserved. Each packet stays within 128 KiB summed
original wire bytes and 1 MiB decoded bytes. The generated packets are actually
at most 257,220 decoded bytes; none expands the original transfer size.

The decoder validates contiguous entries, original GLB headers and every
SHA-256 before returning independent original ArrayBuffers. It does not parse,
resize, simplify, retexture or re-encode a model. All 410 pre-existing deployed
model/shop/font/social files are identical to the predecessor, totaling
67,356,286 bytes. All 145 GLB/Brotli twins pass exact decompression checks.

Twenty-one unique packet files add 1,486,594 bytes to the deployment, while
each device requests only its existing shelf. Garage transport requests fall
from 71 to 44 on the existing mobile shelf and to 50 on desktop. All original
individual assets remain deployed for fallback. With the three unchanged hero
files, observed mobile model requests fall from 74 to 47.

The existing two-slot request pool, canonical model URLs, serialized parsing,
renderer generation ownership, hero/proximity gate and seven-station warm-up
remain. A demanded model promotes the real packet job, not a derived promise.
One packet attempt has an eight-second limit; failure releases the slot before
the original individually bounded retry path starts. That fallback retains its
own 60-second transport budget, in addition to the packet attempt/queue wait.
Missing digest capability, stale manifests and custom request options use the
original path. Parsed or failed consumers release duplicate byte ownership.

No shader, light, effect, DPR tier, camera path, geometry, texture resolution,
layout, copy or SEO content was changed. Earlier rejected rendering experiments
remain disabled. This is a network-latency improvement, not a GPU optimization.

## Controlled full-page comparison

Hardware Chrome on AMD Radeon 740M, 390 x 844 CSS, emulated mobile, cold cache,
old/new/new/old. Each run uses the same six-second entry scroll. Fast 4G is
1,012,500 bytes/s with 165 ms latency. Exact response capture is identical in
old/new runs; byte verification takes place after the measurement window.

| Measurement | Original mean | Candidate mean |
| --- | ---: | ---: |
| Fast 4G garage fully visible from navigation | 21.038 s | 18.764 s |
| Fast 4G hero ready | 4.468 s | 4.460 s |
| Fast 4G startup long-task total | 763.5 ms | 766.0 ms |
| Unthrottled garage fully visible | 16.536 s | 16.541 s |
| Unthrottled startup long-task total | 1,165 ms | 1,162 ms |

The latency-limited garage appears **2.273 seconds / 10.8% sooner**. Both
candidate runs beat both baselines. Unthrottled startup is effectively
unchanged (5.4 ms difference, against roughly 250 ms baseline spread). CLS
remains 0.006707 on Fast 4G and zero unthrottled. All 71 garage models have
the same verified SHA-256 in every run; all three hero resources are present.
These are controlled Chromium results, not live field or physical Apple data.

The first two diagnostic attempts could not retrieve streamed model bodies
through DevTools and are recorded as failures, not passes. The harness now
tees response bytes in the private test context only and verifies after timing.
No capture instrumentation is included in the application.

Evidence: `output/model-packet-comparison.json`,
`output/model-packet-release-fidelity.json`, and the `packets-abba-v3-*` /
`packets-local-*` folders under `output/playwright/garage-performance-2026-09-06/`.

## Verification recorded so far

- Decoder: 31 checks; coordinator: 16; real HTTP loader integration: 9.
- Generator contract proves deterministic packets, exact bytes, route order,
  version/hash changes and both size caps. Deployment contract verifies build
  order and rejects missing encoding, wrong MIME or missing immutable caching.
- Existing byte-prefetch, liveness, loader generation and ownership contracts,
  TypeScript and production static build pass.
- Both cold seven-station mobile/desktop tours pass; all seven desktop rail
  controls move to their stations. No missing models or horizontal overflow.
  Texture counts remain 131 mobile / 159 desktop. Both complete mobile tours
  with every packet forced to 404 or corruption pass using all 71 individually
  verified models (74 individual requests including the three hero files).
- Hero and garage SPA route remounts pass with fresh renderer ownership.
  Garage rotation 390 x 844 -> 844 x 390 -> 390 x 844 keeps one populated
  canvas and no sideways overflow. A private 1,061-frame hero viewport/touch
  probe records zero browser errors; it is not physical Safari certification.
- All 69 pages have unique titles/descriptions, correct production canonicals,
  crawler policies, social metadata and parseable structured data (327 blocks).
  5,324 local link/asset references resolve. All 40 entries in each feed resolve.
- Exact small `Made with ♥ by KR8TIV` footer credit appears in all 72 HTML
  documents, with only `KR8TIV` linked. Export and deployment mirror match.

## External limits

SeaOcean's audit remains behind its paid Pro requirement; no purchase or score
claim is made. SeaOcean 95+, rankings, separate Hostinger CDN activation,
Search Console/Bing ownership, physical Apple performance and actual email
inbox delivery remain unverified. No client lead, call, purchase, DNS/mail/SSL
change or user support-tab manipulation is part of this release.
