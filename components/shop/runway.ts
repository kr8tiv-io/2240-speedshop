/* ─────────────────────────────────────────────────────────────────────────────
   THE RUNWAY — section-scoped scroll for the shop walk-through.

   The original shop owned its whole document: every scroll reader (camera rig,
   station reveals, cinema rail) computed y / (scrollHeight - innerHeight). In
   the combined page the walk-through owns only ITS stretch of the page — the
   `#walkthrough-runway` element rendered by `WalkthroughSections` — so all
   three readers now key off THIS module instead:

     progress = clamp((scrollY - runwayTop) / (runwayHeight - innerHeight))

   Plain module with zero dependencies on purpose: `StationReveal` is a ~1 KB
   client chunk that must not pull three.js into the page bundle, and the
   camera rig inside the canvas needs the identical numbers. One measurement,
   every consumer.
   ────────────────────────────────────────────────────────────────────────── */

export const RUNWAY_ID = "walkthrough-runway";

export type RunwayMetrics = {
  /** Document-space y of the runway's top edge. */
  top: number;
  /** Scrollable span of the runway: height - innerHeight, floored at 1. */
  span: number;
  /** Full height of the runway element. */
  height: number;
  /** False until the element has been found and measured at least once. */
  measured: boolean;
};

const metrics: RunwayMetrics = { top: 0, span: 1, height: 1, measured: false };

/** Viewport height used to derive `span`. On coarse/iOS this is frozen after
 *  the first settle so Safari chrome show/hide cannot shrink/grow the rail
 *  and jump every camera keyed off `runwayProgress`. Width flips (orientation)
 *  still take a fresh height. */
let viewH = 0;
let viewW = 0;
let viewLocked = false;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function isSoftPointer() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(pointer: coarse)").matches ||
    /iP(hone|ad|od)/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

/** Freeze the viewport height used for span. Call once after late layout
 *  (fonts/images) on the walk-through host. No-op on fine pointers. */
export function lockRunwayViewport() {
  if (!isSoftPointer()) return;
  if (!viewH) viewH = Math.max(window.innerHeight, 1);
  if (!viewW) viewW = window.innerWidth;
  viewLocked = true;
}

/** Height the rail treats as the viewport. Locked on soft devices. */
export function runwayViewHeight() {
  if (viewH) return viewH;
  if (typeof window === "undefined") return 1;
  return Math.max(window.innerHeight, 1);
}

/**
 * The iOS fix, kept verbatim from the original camera rig: on iOS Safari an
 * overflow-clipped <body> can end up as the actual scroll container, in which
 * case scrollY pins at 0 while body.scrollTop moves. Take the largest of the
 * three; the wrong ones read 0.
 */
export function runwayScrollY() {
  return Math.max(
    window.scrollY || 0,
    document.documentElement.scrollTop || 0,
    document.body.scrollTop || 0,
  );
}

/**
 * Re-measure the runway element. Called by consumers on resize / layout
 * change; cheap enough to call defensively. Returns the live metrics object
 * (shared — do not mutate it).
 */
export function measureRunway(): RunwayMetrics {
  const node = document.getElementById(RUNWAY_ID);
  if (!node) return metrics;
  const rect = node.getBoundingClientRect();
  const liveW = window.innerWidth;
  const liveH = Math.max(window.innerHeight, 1);
  const widthChanged = Math.abs(liveW - viewW) > 2;
  if (!viewH || !viewLocked || widthChanged) {
    viewH = liveH;
    viewW = liveW;
  }
  metrics.top = rect.top + runwayScrollY();
  metrics.height = Math.max(rect.height, 1);
  metrics.span = Math.max(metrics.height - viewH, 1);
  metrics.measured = true;
  return metrics;
}

/** Current metrics; measures lazily on first ask. */
export function runwayMetrics(): RunwayMetrics {
  if (!metrics.measured) measureRunway();
  return metrics;
}

/**
 * 0 → 1 progress through the runway. 0 while the runway is still below the
 * viewport, 1 once it has been walked — the camera parks at the doorway
 * before the section arrives and at the roll-up door after it leaves.
 */
export function runwayProgress() {
  const m = runwayMetrics();
  if (!m.measured) return 0;
  return clamp01((runwayScrollY() - m.top) / m.span);
}
