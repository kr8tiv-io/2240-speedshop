# Lossless Garage Liveness Design

**Date:** 2026-08-30

## Objective

Make the complete seven-stop 3D garage ready before the visitor can overtake it, so the walkthrough never appears to stop at the engine. Improve first-entry latency and sustained smoothness without removing, substituting, downscaling, recompressing, or visually simplifying any model, texture, material, light, shader, postprocessing effect, animation, copy, or device-specific composition.

## Verified failure

The public symptom is not primarily a CDN-transfer problem. Hostinger is serving the lossless model twins through `hcdn`, Brotli, and immutable caching. The delay is created in the client scheduling and readiness pipeline:

1. Every distinct GLB parse currently waits for `untilIdle(1200, true)`. Continuous scrolling therefore adds as much as 1.2 seconds to every serialized parse. Eleven opening assets can accumulate 13.2 seconds of artificial delay; the 17 fresh assets after the engine can accumulate 20.4 seconds.
2. The camera intentionally clamps to the highest contiguous warmed station. When station 2 is the frontier, the formula clamps progress at approximately `0.4033`, which is precisely the engine composition. Document scroll continues while the visible camera appears frozen.
3. A station opens the next gate only from its successful warmup continuation. A rejected or never-settling request can leave the next gate closed permanently, even after the station failsafe marks the current station finished.
4. A new loader lifecycle resets the warm queue but not the module-global parse queue. Work from an abandoned Canvas can therefore delay a new Canvas after navigation or WebGL recreation.
5. Model bytes are prefetched on approach, but parsing starts only after the Canvas mounts. Canvas mounting also waits for 900 milliseconds of stillness, which is unlikely while the visitor scrolls toward the shop.

The camera clamp itself is correct. Removing it would exchange the visible pause for missing or popping models, which violates the quality constraint.

## Architecture

### 1. Two independent lossless lanes

The garage will use two explicitly separated lanes:

- **Transport lane:** after the hero is settled and the garage enters the approach window, begin fetching every exact model byte stream in tour order with bounded concurrency. This uses the current lossless `.glb.br` assets, current tier URL mapping, and Hostinger caching.
- **GPU lane:** mount the Canvas parked and hidden as soon as the approach module is ready. Parse serially, upload exact textures, compile current shaders, and warm the existing composer in a controlled order. Expensive GPU work remains paced; transport no longer waits for it.

This overlaps network time with the preceding page experience while preventing a transfer burst from competing with the opening hero.

### 2. Generation-scoped parse scheduler

Replace the promise-chain singleton with a small, independently tested scheduler. A loader generation owns its own serial queue and one bounded motion courtesy. Every model in that generation shares that courtesy; parsing still yields between jobs, but continuous scroll cannot add 1.2 seconds per model. Starting a new generation creates a new queue immediately, so stale work can finish safely without delaying the replacement Canvas.

The scheduler does not alter parser options or decoded content. `MeshoptDecoder.useWorkers(2)` moves supported meshopt decode work off the main thread while producing the same decoded buffers. Unsupported browsers retain the current decoder path.

### 3. Complete-route readiness handoff

The elegant garage veil remains visible while the parked Canvas prepares the route. World readiness will require the shell, all seven numbered stations, and the gallery. The reveal occurs only when the same scene the visitor will navigate is ready end to end. That makes the intentional camera frontier invisible during ordinary entry rather than weakening it.

The existing scene, camera keys, transitions, lighting, DPR, postprocessing, and station content remain unchanged.

### 4. Monotonic gate liveness

Every station gets one idempotent release function. Success, handled failure, and the bounded failsafe all release the following gate exactly once. Request attempts receive an explicit timeout and retry policy so a transport that never settles cannot suspend the station forever. Late callbacks are ignored safely.

The rule is monotonic: a lifecycle may advance or finish, but it may never re-close a gate or let stale work mutate the current generation.

### 5. Apple and mobile behavior

The same full-fidelity assets and approved mobile compositions remain in place. Bounded transfer concurrency, a two-worker maximum, serial parse admission, and the existing adaptive runtime budget prevent smaller Apple/mobile devices from being flooded. Feature detection preserves a safe single-thread decoder fallback where workers are unavailable.

## Entry sequence

1. Hero settles.
2. Garage approach observer loads the small world module and starts bounded, tour-ordered byte prefetch.
3. The parked Canvas mounts immediately after the approach condition; it does not wait for 900 milliseconds of scroll stillness.
4. The parse generation pays at most one bounded motion courtesy, then parses serially with cooperative yields.
5. Each station uploads and warms current materials, shaders, and effects; each completion advances the contiguous frontier.
6. The veil hands off only after the complete route is warm.
7. Scroll drives the unchanged cinematic camera through every stop without a mid-route engine hold.

## Quality invariants

- Model source files and their byte hashes remain unchanged.
- Existing desktop/mobile asset tiers remain unchanged.
- No texture-size, geometry, material, light, shadow, DPR, antialiasing, tone-mapping, bloom, vignette, grain, or animation reduction.
- No copy or visual-design changes in this repair.
- Camera-frontier protection remains enabled.
- Reduced-motion and WebGL fallback behavior remain available.

## Verification

Automated evidence must cover behavior rather than only source spelling:

- many queued models under sustained motion pay one bounded courtesy, not one per model;
- a new parse generation runs without waiting behind the abandoned generation;
- the station-2 frontier remains safely clamped near the engine;
- success, rejection, and timeout all release the next station gate;
- the reveal contract includes the complete seven-stop route;
- the Canvas mounts from approach readiness without a 900 ms stillness dependency;
- all existing garage, loader, ownership, model-pipeline, metal-finish, copy, mobile, blog, and build contracts stay green;
- a manifest/hash comparison proves no model or texture payload changed;
- the static export and live Hostinger release return correct CDN/cache/content-encoding headers.

Interactive visual validation in Chrome is required when the Codex Chrome bridge is available. Until then, automated frame and production checks may supplement it but must not be described as a human visual sign-off.

## Deployment and rollback

Commit the repair in small checkpoints on `codex/3d-elevation-2026-08-24`, push it to `kr8tiv-io/2240-speedshop`, export the exact verified build, and deploy that export through the existing Hostinger release repository. Preserve the existing pre-repair checkpoint tags and create a new post-verification tag. Rollback is a tag checkout plus redeployment; no destructive history rewrite is required.
