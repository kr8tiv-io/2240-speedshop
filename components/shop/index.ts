/* ─────────────────────────────────────────────────────────────────────────────
   THE SHOP WALK-THROUGH — public surface.

   Usage in the combined homepage (two pieces, one contract):

     import { WalkthroughWorld, WalkthroughSections } from "@/components/shop";

     <WalkthroughSections />   server component — renders #walkthrough-runway,
                               ~1100vh of station copy. Place it between the
                               film's Act II runway and the Act III finale
                               (e.g. as HomeCinema's `walkthrough` slot).
     <WalkthroughWorld />      client component — the fixed z-[5] canvas host.
                               Mount it ONCE anywhere on the page; it finds
                               the runway by id, warms within ~2 viewports,
                               draws within ~1, and fades over ~40vh at the
                               runway edges. No props.

   Everything else in this directory is internal to the world.
   ────────────────────────────────────────────────────────────────────────── */

export { WalkthroughWorld } from "./WalkthroughWorld";
export { WalkthroughSections } from "./WalkthroughSections";
export { RUNWAY_ID } from "./runway";
