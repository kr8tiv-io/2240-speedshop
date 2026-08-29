# Garage Reveal, Loader, and Shop-Floor Design

## Objective

Restore the live 3D garage as an unmistakably present part of the walkthrough, shorten the perceived wait without lowering model, texture, shader, or post-processing quality, replace the faint opening mark with a concise automotive loader, and rebuild the shop-floor gallery as a consistent set of unique, directly linked Instagram posts.

## Evidence and root cause

Production serves the garage JavaScript chunk and all model shelves successfully. A clean Microsoft Edge run on the same machine reported WebGL2 support, mounted the lite-tier canvas, and reached every station without a page error. The failure is perceptual but real: the live canvas is deliberately held at zero opacity behind the doorway photograph until the shell, stations 0 and 1, and a final full-composer proof are warm. The measured transition to `data-shop-ready="world"` was approximately 25.4 seconds.

The console screenshot does not show a fatal site exception. `contentscript.js`, ObjectMultiplex, and Polkadot messages come from browser extensions; the Three.js Clock message is a nonfatal deprecation warning.

## Garage architecture

The garage keeps its existing Three.js/R3F scene, exact models, texture shelves, lighting, bloom, grain, vignette, desktop AO, depth of field, chromatic aberration, and colour grade.

The reveal becomes progressive and readiness-based:

1. Entering the existing prewarm corridor starts downloading the dynamically split garage runtime immediately, even if the reader is still moving.
2. The actual WebGL mount continues to respect the hero handoff and reader-idle safeguards.
3. A verified shell can begin the live camera/render loop without waiting for unrelated later geometry.
4. The photographic doorway remains partially present until station 0 is drawable, then completes its dissolve into the live scene.
5. The existing warm-station frontier prevents the camera from entering an unready bay, so no missing model or quality placeholder becomes visible.
6. A context loss or genuine render error retains the graded fallback and records an inspectable state.

This preserves quality while eliminating the all-or-nothing invisible hold.

## Opening loader

The loader is a zero-network-cost hybrid rather than a second 3D scene. It uses inline/vector geometry and CSS to show a high-contrast classic-car silhouette on a slow turntable/tach ring, with `LOADING` and the existing honest hero-boot percentage.

The loader appears in server-rendered markup immediately. It has a short minimum hold for visual continuity and a strict visual ceiling of about two seconds. If the hero's first verified 3D frame is not ready at that ceiling, the loader reveals the existing graded hero still and the live canvas crossfades over it when ready. The page is never held hostage merely for branding, and no duplicate WebGL context or loader model competes with the real scene.

The existing JavaScript, raw-DOM, and CSS escape paths remain, with timing updated to the shorter contract.

## Shop-floor gallery

The gallery contains ten visually unique posts. The duplicate brown-car crop and duplicate black-Camaro thumbnail are removed. Every remaining tile stores its Instagram post type and shortcode and links directly to the verified `/p/` or `/reel/` URL instead of the profile.

Cards use one square ratio with per-image focal positions. The layout is two columns on phones, three at the middle breakpoint, and five on desktop, yielding two complete desktop rows. Hover and keyboard focus add a restrained tungsten lift, slight scale, and reduced dark overlay. Motion-sensitive users receive the highlight without animation.

## Performance and infrastructure

The site remains a static Next.js export. Migrating to Astro would not reduce the dominant costs—model transfer, texture upload, shader translation, and composed WebGL first use—and would put the mature scroll/canvas choreography at risk. Infrastructure change remains available only if measurement identifies framework runtime as a material bottleneck.

No model reduction, texture downscaling, effect deletion, or lower-quality replacement is allowed. Improvements come from earlier network overlap, progressive visibility, bounded readiness gates, and removal of unnecessary blocking.

## Error handling and accessibility

- WebGL failure continues through the existing error boundary and graded fallback.
- Reduced-motion mode keeps readable static compositions and disables nonessential loader/gallery motion.
- Loader content is decorative and does not compete with the document's accessible heading structure.
- Gallery links retain visible focus treatment, descriptive alt text, and safe external-link attributes.

## Verification

Before implementation, automated contracts will reproduce the current failure:

- the garage remains fully hidden while a drawable shell exists;
- the current loader may hold for 14 seconds and renders its mark at six-percent opacity;
- gallery cards have mixed dimensions, duplicate subjects, and profile-only links.

After implementation, the same contracts must prove:

- progressive garage states cannot regress to a 25-second all-or-nothing hold;
- the camera never advances beyond the highest warm station;
- loader markup is lightweight, readable, and bounded by the new ceiling;
- ten gallery URLs and subjects are unique, direct, and cards share one ratio;
- build and all existing contracts pass;
- production visual runs are clean at desktop, 320, 375, 390, and 430-pixel phone widths, with special attention to Edge and Safari/iPhone-safe layout behaviour.

