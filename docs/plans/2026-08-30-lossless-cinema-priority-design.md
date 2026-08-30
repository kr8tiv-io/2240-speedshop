# Lossless Cinema Priority Design

## Objective

Make the 2240 Speed Shop experience begin sooner and remain smoother on desktop, Android, and Apple mobile devices without removing, reducing, replacing, or visually degrading any model, texture, shader, post-processing effect, copy, or animation.

The existing static Next.js export remains the production architecture. The current site already delivers good public Core Web Vitals and uses Hostinger CDN for immutable assets; the remaining delay is primarily an orchestration problem inside the browser, not a reason to rebuild the entire application in Astro.

## Performance strategy

### 1. Lossless, viewport-matched opening artwork

The opening poster currently downloads a full portrait JPEG even though `object-cover` only exposes a predictable desktop or mobile slice. Generate two JPEG crops from the same master using lossless MCU-aligned `jpegtran` cropping:

- desktop: `1920x1200+0+680`
- mobile: `1184x2560+368+0`

Both crop rectangles align to JPEG block boundaries, so the compressed image data is copied rather than re-encoded. A `<picture>` element selects the correct crop by viewport and keeps the original master as a fallback. This changes transfer size and decode work, not the visible pixels.

The generation script is deterministic and verifies output dimensions. The source master remains in the repository.

### 2. Navigation prefetch by user intent

Automatic viewport prefetch currently competes with the deferred Three.js runtime, models, and shader compilation during the most important seconds of the first visit. Introduce an `IntentLink` wrapper that disables automatic prefetch and asks Next.js to prefetch only after pointer hover, keyboard focus, or touch intent.

Use it for the persistent navigation and opening calls to action. Links retain native navigation, accessibility, and the existing blog behavior.

### 3. Segmented, act-prioritized 3D warmup

The hero currently compiles every act and warms the full post-processing composer in one large operation. Preserve all three acts, their exact materials, models, shaders, lights, and effects, but warm them in discrete passes:

1. opening act plus shared scene resources;
2. yield to the browser;
3. engine act into an off-screen target;
4. yield again;
5. remaining act into the same off-screen path.

The full composer is warmed once for the opening act; subsequent geometry/material uploads render off-screen. Visibility and render targets are restored after every pass. The elegant poster/loading treatment remains visible until all required opening work is safe, so no intermediate frame can flash to the screen. This converts one long warmup burst into schedulable work while keeping transition quality intact.

### 4. Cache-purge-safe CDN experiment

Hostinger CDN is already active and immutable assets are cache hits. HTML is deliberately revalidated. Add an optional deployment cache-purge helper that calls Hostinger's documented cache-clear endpoint only when deployment credentials are supplied through environment variables. No token is committed or printed.

Do not introduce long-lived HTML caching blindly. A conservative shared-cache directive may be tested only with a working deploy purge and live header verification; otherwise the existing revalidation policy remains. Content-addressed JS, CSS, fonts, images, and models continue to receive long immutable cache lifetimes.

### 5. Compression experiments stay behind proof

Meshopt, Draco, and KTX2 are not automatically improvements for this experience: they add decoders, device-specific texture paths, and possible startup contention. Benchmark them separately against current Brotli-compressed GLBs with Apple fallbacks and screenshot differences. Ship only if byte, decode-time, memory, and visual comparisons are all positive. This pass does not alter the current production models.

## Quality and safety invariants

- No model, texture, shader, light, effect, animation beat, or copy is removed or simplified.
- No lower-resolution visual is substituted for a higher-resolution one.
- Mobile and Apple receive the complete experience, with responsive composition rather than a reduced scene.
- The garage walkthrough, blog navigation, shop-floor social cards, and loader remain regression-tested.
- Generated assets are derived reproducibly from committed masters.
- Every production change is verified with the static export, contract tests, browser screenshots, and public performance measurements.
- A source checkpoint exists before the change; implementation commits and the deployed export are pushed to `kr8tiv-io/2240-speedshop` and the Hostinger deployment repository respectively.

## Non-goals

- No Astro migration in this pass. Astro islands would not remove the WebGL runtime or its shader/model work and would add migration risk to an already good static foundation.
- No copy revision in this pass, per the latest direction to keep the text as-is.
- No visual redesign, model reduction, effect removal, or quality-tier downgrade.
- No permanent HTML cache policy without a verified purge path.

## Success criteria

- Opening poster uses the exact visible source pixels with fewer transferred bytes and less decode work.
- Route payloads do not compete with the 3D runtime until the visitor signals navigation intent.
- Hero warmup is segmented by act and yields between expensive passes.
- The garage walkthrough appears and transitions correctly on desktop and representative Apple/mobile sizes.
- Blog cards navigate, social cards remain unique and linked, and the console contains no new application errors.
- Export build and all existing regression suites pass.
- Public LCP/CLS/INP remain good or improve, with no visual regression.
