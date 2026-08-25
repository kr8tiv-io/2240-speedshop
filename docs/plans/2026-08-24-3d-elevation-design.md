# 2240 Speed Shop — 3D Elevation Design

**Status:** Approved by the August 24 direction to preserve the existing cinematic quality, elevate the 3D work, improve mobile/Apple behavior, accelerate loading and motion, and replace weak sales copy.

## North star

The experience remains the same unmistakable site: dark After Hours film, three hero cars, the lattice running through the bodywork, a seven-station shop walk-through, then the real service/build/review content. The elevation is called **Midnight Garage, precision-tuned**: richer material response, more intentional light, cleaner choreography, and dramatically less invisible work.

The memorable moment remains the vehicle resolving through the quantized grid. Nothing in this pass may turn that signature into a generic dissolve or reduce mobile to a poster/image substitute.

## Hard constraints

- Keep the Challenger, hood-up coupe, late-1960s Charger, shop world, grid ghost, scan sheet, bloom, grade, grain, and scroll-controlled film.
- Preserve the existing Meshopt hero geometry, selective Blender bevel/normal work, mobile model coverage, fixed-DPR policy, shader warming, and explicit Brotli model delivery.
- Do not restore KTX2 without a new cross-GPU proof; the prior transcoder path reproduced a Radeon renderer crash.
- Do not register or deploy the 22 unfinished article remnants. They are source-only quarantine until citations and rendered content pass a separate audit.
- Never deploy a partial Hostinger archive. The established full-export Git webhook path is the production path.

## Approaches considered

### 1. Fidelity-preserving systems elevation — chosen

Retain the art direction and choreography, then remove work that cannot contribute a visible pixel. Improve the vehicle materials, lights, scan/grid energy, camera settling, and copy after the runtime is stable. This has the best quality-to-risk ratio and gives measurable speed gains without an aesthetic downgrade.

### 2. Rebuild the hero and walkthrough

A clean rewrite could simplify the renderer, but it risks losing years of tuned camera keys, warm-up behavior, framing guarantees, asset handling, and the signature grid. It is not justified while the current design is already close.

### 3. Aggressive device-tier downgrade

Dropping models, postprocessing, or effects on phones would improve synthetic scores quickly, but it violates the brief and makes the most personal device receive the least convincing experience. Rejected. Mobile will receive authored composition and scheduling, not fewer ideas.

## Experience design

### Opening and load

The HTML title and copy arrive immediately. Before mounting WebGL, a small capability profile resolves reduced-motion, viewport class, touch input, and WebGL2. Motion-enabled visitors then receive the correct renderer tier on the first commit; the page no longer allocates desktop compositor resources briefly on a phone. Reduced-motion and unsupported-WebGL visitors receive the complete readable page and a deliberately art-directed still treatment.

The hero preloader reports hero readiness only. The shop's later loading manager cannot overwrite or freeze the hero progress channel. The third GL-image canvas stays unmounted until its first registered image nears the viewport, preventing offscreen editorial textures and another WebGL context from competing with the opening film.

### 3D and shader elevation

- Keep the vehicle geometry unchanged unless a screenshot proves a specific silhouette or highlight failure.
- Tune the existing physical materials selectively: controlled clearcoat response, paint/body roughness separation, metal/chrome energy conservation, glass transmission/opacity balance, and wheel/rubber contrast.
- Strengthen the tungsten-key/cool-rim hierarchy so body curvature reads sooner without lifting the black floor or flattening the night mood.
- Preserve the quantized grid construction. Refine scan-edge falloff and emissive energy only inside the current reveal envelope.
- Stop submitting ghost primitives and particle vertices once their shader envelope is mathematically zero. Scene warming may temporarily force them visible, but live rendering may not.
- Keep fixed DPR and the current post stack. Quality must not pulse during a session.

### Motion and framing

Camera fitting remains analytical and ratchet-free. Every act must keep the whole car inside the live frustum at 320, 375, 390, and 430 CSS pixels and at desktop. Scroll transitions continue through Lenis. Mobile uses the same effects, with authored key positions and safe text plates that respect the notch/home-indicator areas.

The live audit found full-black handoffs around desktop scroll positions 6800–7200 and 17600–18000 and near 4500 on the 320px WebKit pass. Those are continuity defects, not an invitation to remove the film. Preserve the act cuts, but overlap the outgoing/incoming ambient or practical light so a deliberate dark transition never becomes an empty viewport.

The production tuning object (`window.__film`) becomes opt-in through a query/dev flag so it cannot allocate arrays and repeat projection work every frame for normal visitors.

### Apple/mobile resilience

- Require WebGL2 because Three r185 no longer supports WebGL1.
- Add a renderer error boundary and context-loss fallback.
- Pair `100vh` fallbacks before `100svh`, include safe-area padding, and retain sticky runway geometry on older Safari.
- Support both modern `MediaQueryList.addEventListener` and legacy `addListener` APIs.
- Make the mobile menu an opaque modal layer above every canvas, lock the document and Lenis while it is open, isolate/park the covered renderers, and provide 44–48px touch targets. The current transparent 320px menu collides with the live film and is a release blocker.
- Validate with Playwright WebKit/iPhone profiles in addition to Chromium widths; a physical Safari pass remains the final gold standard when a device is available.

## Performance architecture

The largest gains come from scheduling and discovery order, not lower fidelity:

1. Resolve the device profile before mounting the hero runtime.
2. Dynamically load Three/R3F/postprocessing behind the lightweight DOM shell.
3. Give hero and shop independent loading/progress ownership.
4. Content-address the hero shelf so refined models cannot remain stale for a year.
5. Gate invisible ghost, points, diagnostic, and editorial-canvas work.
6. Replace the oversized 200% blended procedural grain surface with a small tiled/rasterized treatment that is visually matched in Safari.
7. Audit the exported request graph and remove only assets proven unreachable.

### Budgets

- Production build and static export must succeed.
- No horizontal overflow at 320/375/390/430/1440 widths.
- Whole-car normalized edge must remain inside the verification threshold at every film beat.
- No new console, page, WebGL, hydration, or context-loss errors.
- No film/shop main-thread stall above 250 ms in the scripted scroll audit; target no more than three >100 ms warm-up gaps, matching or improving the current best run.
- Reduce initial home JavaScript Brotli transfer from the measured ~668 KiB; target at least 20% without removing effects.
- Remove the ~622 KiB offscreen GL-image contention from hero boot.
- Hero asset URLs must change when any hero model byte changes.

## Copy direction

Voice: confident shop foreman. Specific, accountable, mechanically literate, and plainspoken. Avoid vague worth language, generic luxury claims, and repeated “one roof” phrasing.

Recommended replacements:

- Act III headline: **“Bring us the car you refuse to give up on.”**
- Act III support: **“Barn find, stalled project, or the one you kept too long to hand to the wrong shop. Terry reads every build request himself. Send the photos; get a straight answer.”**
- Walk-through station: **“One build. One shop. One name on the line.”**
- Services proof: **“Metal, powertrain, paint, trim, and final tuning stay with one team. The person who takes the car in is accountable for the car that leaves.”**
- Primary CTA where context allows: **“Show us the car”** rather than a generic “Get started.”

Copy changes happen after the visual/performance pass, as requested, and keep SEO facts such as Edmonton, services, owner, and address in server-rendered HTML.

## Verification and deployment

Verification runs against a clean production build and the static export, not only the dev server. The film sweep captures every act and shop station at desktop and phone widths, tests real horizontal scrolling, copy/nav overlap, car bounds, preloader handoff, and console errors. WebKit gets an additional iPhone-profile pass, reduced-motion gets a no-WebGL boot check, and model URLs/headers are inspected in the export.

Deployment mirrors the complete verified `out/` into `C:\tmp\2240deploy\daylight`, commits the static result, pushes `main`, waits for Hostinger's webhook, and then reruns the live visual/performance sweep. Direct `hosting_deployStaticWebsite` is reserved for a verified full-site recovery package because it replaces the whole document root.
