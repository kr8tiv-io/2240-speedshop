# Lossless Model Packets Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reduce garage network round trips without changing one decoded model byte, visual setting, frame callback, or readiness condition.

**Architecture:** Keep the existing static Next export and renderer. Small consecutive model files may share bounded, content-addressed Brotli packets; the loader extracts the exact original ArrayBuffers before its existing serialized parse queue. Individual GLB/Brotli files remain available as independently bounded fallbacks, using the same two-slot request pool.

**Tech Stack:** Next 16.2.12 static export, React 19, Three r185, TypeScript, Node Brotli, existing Puppeteer/CDP harnesses, Hostinger static deployment.

---

## Current checkpoint and scope

This is a transport implementation plan, **not a shipped feature**. The user's
standing authorization covers implementation and deployment after verification;
continue locally without creating another user task. Use the existing dedicated
`codex/3d-elevation-2026-08-24` checkout and preserve unrelated untracked files.

Live app: `acce5c29994840cda346ff4e6119f2ea`; deployment `45bb7eb3`;
application source `ec8ce57`. Exact current rollback: `output/baseline-acce.zip`.
Read `docs/releases/2026-09-06-rendering-transport-investigation.md` first.

The private transport prototype is `scripts/garage-transport-probe.mjs`. Its
mobile ABBA test lowered 71 requests to 43 and mean network time from 9.989 s
to 7.820 s, while verifying all 71 SHA-256 hashes in the browser. It excludes
hero, photographs, parsing, GPU warm-up and production CDN behavior. Do not
promise a 21.7% whole-page improvement. Integration must establish that itself.

The three rendering experiments failed strict HDR equivalence and must not be
enabled in the application. This plan does not change sorting, shaders, lights,
MSAA, geometry, textures, camera choreography, copy, SEO, or mobile tiers.

## Task 1: Specify and prove the packet format

**Files:**

- Create `components/shop/modelPackets.ts` for a pure decoder and types.
- Create `scripts/model-packets-contract.mjs` for real-binary regression tests.
- Use the original files under `public/models-opt/` and `public/models-mobile/`.

1. Write tests before implementation. A packet descriptor contains an expected
   decoded byte length plus ordered entries `{ name, offset, length, sha256 }`.
   Test two adjacent original GLBs, their exact byte equality after extraction,
   independent ArrayBuffer ownership, and no mutation of the input packet.
2. Test rejection of negative/fractional/out-of-range lengths and offsets,
   truncated payloads, duplicate names, overlapping entries, wrong total length,
   malformed GLB headers, and a changed byte. Missing browser digest capability
   must select individual-file fallback, not trust unchecked data.
3. Run `node scripts/model-packets-contract.mjs`; require an assertion failure
   for missing decoder behavior, not an import/syntax failure.
4. Implement only validated extraction and SHA-256 verification. The GLB header
   must retain magic `0x46546c67`, version 2, and its original declared length.
   Do not parse geometry, decode textures, re-encode models or alter alignment.
5. Re-run the contract and `npx tsc --noEmit`. Commit the exact test/module paths
   with scoped hooks disabled, never blanket-add the source checkout.

## Task 2: Deterministic build-time packets

**Files:**

- Create `scripts/build-model-packets.mjs`.
- Generate `components/shop/modelPackets.generated.json` and hashed packet
  assets under `public/model-packets/` (generated writes belong in this script).
- Extend `scripts/model-packets-contract.mjs`.

1. Test that both shelves cover the same 71 names from the actual route catalog;
   the existing AST extraction in the diagnostic is a reference, not a second
   manually maintained catalog. Preserve original first-use order.
2. Test that the first three opening vehicles retain individual requests.
   Individual files over either size budget must remain individual. Other
   consecutive files may group only while summed original Brotli sizes stay
   at or below 128 KiB and decoded bytes at or below 1 MiB. A single-file group
   remains individual. Avoid combining across an opening-priority boundary.
3. Require failure before implementing grouping. Then concatenate originals and
   Brotli-compress at build time. Test every extracted byte against every source
   file, determinism on repeated builds, and content-hash changes when any
   source byte changes. A packet larger than its individual transfers should
   remain individual.
4. Record actual output bytes and largest decoded allocation. Do not delete
   original models or Brotli twins. Never recursively prune an unvalidated path.
5. Run the contract and generator twice; compare manifests and SHA-256 hashes.
   Commit only the generator, contracts, manifest and generated packet assets.

## Task 3: Shared transport ownership and fallback

**Files:**

- Extend `components/shop/modelPackets.ts` with the packet coordinator.
- Extend `scripts/model-packets-contract.mjs` with real coordinator tests.
- Reuse `components/shop/modelRequest.ts` unchanged unless a tested extension
  is genuinely necessary.

1. Test that all packet consumers share one in-flight request, at most two
   transports run globally, and a demanded model promotes its **packet job**
   ahead of speculative jobs. Passing a derived per-model promise to the
   current `createRequestPool.demand` does not work: it owns the root job.
2. Test failure recovery: 404, aborted response, timeout, wrong encoding,
   hash failure, truncated packet and missing manifest entry. Every case must
   reach the existing exact individual-file path within a bounded budget.
   Release the failed packet's transport slot before enqueuing fallbacks;
   nesting a pool request inside an occupied pool request can deadlock.
3. Test that failures do not permanently poison later visits; header/path/
   credentials differences cannot share an inappropriate cache entry. Use the
   individual path for nondefault custom request options unless equivalence
   is explicitly covered.
4. Test memory ownership: one temporary decoded packet, independent original
   model buffers, no indefinitely retained duplicate packet buffer, no second
   requests for still-unparsed prefetched models. Keep lifecycle cancellation
   and retired renderer behavior in the existing parse generation mechanism.
5. After RED, implement the coordinator using the existing two-slot pool and
   bounded request helper. Run its contract plus `model-byte-prefetch-contract`,
   `garage-liveness-contract`, `loader-generation-contract`, and
   `loader-ownership-contract`. Commit only tested transport changes.

## Task 4: Wire the static build and existing loader

**Files:**

- Modify `components/shop/Loaders.tsx` only at the exact-byte transport seam.
- Modify `scripts/deploy-combined.ps1` to generate packets before Next build.
- Modify `public/.htaccess` and `scripts/serve-export.mjs` for packet MIME,
  Brotli encoding and immutable hash-based caching.
- Modify `scripts/published-release-check.mjs` to verify new critical assets.

1. Write an integration contract proving unchanged canonical model URLs,
   `MODEL_BYTE_CACHE` sharing/release, three.js LoadingManager item balance,
   model recovery and parse serialization. Keep the hero/proximity gate,
   warm-up frontiers, all seven route readiness keys and first-use ordering.
2. Require RED, then consult the packet manifest before scheduling eligible
   individual transport. No packet work starts earlier than existing prefetch.
   Do not change model materials, clones or `useLoader` resource identity.
3. Add explicit `application/octet-stream` and `Content-Encoding: br` rules
   for hashed `.bin.br` packets. Existing `.br` defaults are GLB-specific and
   must not be assumed suitable. Keep all redirect, SEO, PHP, DNS/mail rules.
4. Test direct packet URLs, content hash, base-path handling, expiry headers,
   and browser decompression. Keep individual assets accessible for fallback.
5. Run all affected contracts, TypeScript, and the production build via
   `pwsh -NoProfile -File scripts/deploy-combined.ps1 -Repo C:/tmp/2240deploy/daylight -PrepareOnly`.
   Do not run its normal global-config/token-in-URL push path.

## Task 5: End-to-end comparison and release gate

**Files:**

- Extend `scripts/garage-performance-check.mjs` to count packet transports
  separately from verified model resources; do not weaken 71-model coverage.
- Add `docs/releases/2026-09-06-lossless-model-packets.md` with actual evidence.

1. Serve the exact `baseline-acce` separately from the prepared candidate.
   Run old/new/new/old startup measurements using the same Fast 4G settings,
   mobile viewport, cold cache and hardware browser. Then repeat unthrottled.
2. Require full cold seven-station tours on mobile and desktop, no new console
   errors, original model/texture bytes, dimensions and texture settings,
   unchanged hero timing within variance, bounded long tasks and no overflow.
   Stop if packet hashing/slicing or simultaneous arrivals harm the hero.
3. Force packet 404/corruption in the private browser and prove individual-file
   fallback completes the entire tour. Test hot revisit, route remount,
   portrait/landscape changes, footer KR8TIV/Contact and quote fragment actions.
4. Verify all 69 pages, links, footer, metadata and structured data. Run the
   original 145 GLB/Brotli equality checks, plus all packet hash checks.
5. Only if the full-page measurements improve without regression: checkpoint
   and push source to both remotes, commit/push the dedicated deployment mirror
   using `git -c core.hooksPath=NUL`. Observe the exact live release marker
   before the authorized cache purge. Verify live pages, packet headers/bytes,
   mobile tour, links and fallback-capable individual assets again.
6. Update launch status and existing heartbeat with measured scope and exact
   release IDs. Do not claim physical Apple verification, CDN activation,
   SeaOcean 95+, rankings or real inbox delivery without separate evidence.

## Rollback

Keep the `acce` archive and deployment commit `45bb7eb3` available. An experiment
that fails verification stays local; it does not justify publishing a reduced
quality variant. Any new release must have its own exact archived predecessor.
