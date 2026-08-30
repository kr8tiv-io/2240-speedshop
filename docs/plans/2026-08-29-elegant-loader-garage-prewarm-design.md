# Elegant Loader and Garage Prewarm Design

## Objective

Replace the illustrated-car loader with a restrained, premium opening plate; remove the old showroom photograph from the garage transition; ensure the real 3D shop begins warming early enough that ordinary and continuous scrolling do not arrive at an unstarted world; and enlarge the shop's supporting typography without reducing any model, texture, shader, lighting, post-processing, or animation quality.

## Evidence and root cause

The garage assets are valid and the live world renders correctly once it is warm. The apparent failure comes from two deliberate gates in `WalkthroughWorld`:

1. The split shop module begins downloading only when the runway enters a five-viewport corridor.
2. The WebGL world mounts only after the hero is settled and the reader has stopped scrolling for 900 ms.

A smooth continuous scroll can therefore reach the garage before the world has mounted. During that gap, `shop-showroom-neon-*.webp` is rendered over the canvas as a photographic boot plate. It looks like a static replacement for the garage rather than a transitional safety layer.

The current opening loader is technically inexpensive but aesthetically wrong for the brand. Its inline illustrated car, wheels, and turntable ring read as playful UI rather than the precise, expensive, after-hours workshop language used by the rest of the site.

## Approved visual direction

The opening becomes a near-black instrument plate. It contains the existing 2240 wordmark, a small `EDMONTON / AFTER HOURS` identifier, a thin tungsten ignition line, an honest loading percentage, and the phrase `OPENING THE SHOP`. Motion is limited to a controlled light sweep, a fine progress rule, and a subtle typographic reveal. There is no car illustration, spinner, photograph, 3D loader, or additional network asset.

The temporary garage background becomes a photo-free architectural light field: bay black, a narrow overhead tungsten pool, a low cool spill, faint perspective rules, and a barely visible lift-door seam. It must read as the same room before the lights come up, not as separate artwork. It dissolves into the verified 3D canvas through opacity only.

## Loading architecture

The hero and garage remain separate WebGL runtimes so they do not compete for a context during the critical first paint.

- The opening plate retains a short bounded visual ceiling and reveals the server-rendered hero composition quickly.
- After the hero reaches its first verified frame, the split garage module is requested during an idle callback even when the runway is still far away.
- The garage mounts and begins its existing sliced shell/station warm-up when either the runway enters an expanded lead corridor or a post-hero idle deadline expires.
- Active drawing remains proximity-gated. A garage warming offscreen keeps its public frame loop parked except for the existing explicit compile/upload slices.
- The 900 ms reader-still safeguard remains a preference, not a hard prerequisite: an idle deadline may start the warm-up even during continuous scrolling so the reader cannot outrun it.
- Existing station-frontier logic continues to prevent the camera from entering an unready bay.
- The old showroom photograph and both associated requests are removed from the walkthrough handoff.

This overlaps download and compilation with time the visitor spends in the hero while preserving all final visual assets and effects.

## Shop typography

Only the walkthrough typography changes. On phones, station body copy increases from 15 px to a fluid 17–18 px range, eyebrow and metadata copy rise to at least 12 px, travel copy rises to 16 px, and service/spec lists rise to 12–13 px. Line height stays generous and tracking is reduced slightly where uppercase text would otherwise become sparse. Desktop body copy receives a smaller lift to 17–18 px. Contrast moves from muted steel toward a more readable steel/bone mix while the direct background plates remain restrained.

Headlines, camera framing, station alignment, runway length, and animation timing remain unchanged unless the larger copy produces a measured collision on a tested viewport.

## Performance and quality constraints

- Do not simplify geometry, reduce texture resolution, delete shader passes, remove lights, change the authored camera rail, or lower the established final render tier.
- Continue using the static Next.js export and Brotli transport twins. The dominant cost is GPU/model work, not the framework runtime.
- The new loader adds no network request and uses transform/opacity animation only.
- Garage background warming must not regress first mobile interaction or hero LCP.
- Reduced-motion visitors receive the same legible static plate and photo-free dark bay without decorative movement.

## Failure handling

WebGL capability failures and reduced-motion mode retain the existing readable graded fallback. A failed garage runtime stays on the abstract architectural light field instead of displaying a stale photograph or a blank white/black frame. The boot diagnostic channel continues to expose `poster`, `shell`, and `world` stages for release probes.

## Verification

Automated contracts and real-browser probes will verify:

- no loader car markup or loader-car CSS remains;
- the loader has no image, model, or WebGL dependency;
- the old showroom boot photograph is absent from markup and receives zero requests;
- the split shop module begins preloading after the hero's verified frame;
- continuous scrolling no longer makes 900 ms of stillness a mandatory mount gate;
- the garage reaches a drawable shell before its doorway on representative desktop and throttled phone profiles;
- final desktop/mobile model visibility and effect quality remain intact;
- shop eyebrow, body, travel, and list copy meet the new size and contrast floor without overflow;
- desktop, 320, 375, 390, 430, and 768-pixel layouts remain clean, with Apple safe-area and reduced-motion checks;
- public LCP, INP, and CLS remain inside the established release budgets and the production console remains error-free.

