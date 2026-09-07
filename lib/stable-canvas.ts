/**
 * R3F Canvas resize options that ignore iOS Safari chrome.
 *
 * `scroll: true` (react-use-measure default in some R3F versions) remeasures
 * the wrapping div on every scroll. On iPhone that fires as the URL bar
 * shows/hides, the drawing buffer changes height, PerspectiveCamera.aspect
 * jumps, and parked cars look like they are shaking.
 */
export const STABLE_CANVAS_RESIZE = {
  scroll: false,
  debounce: { scroll: Infinity, resize: 80 },
} as const;

/**
 * CSS size for the R3F Canvas root. Must live on `<Canvas>` itself, not only a
 * wrapping div: iOS Safari still recomputes svh/lvh on wrappers when the URL
 * bar moves (three.js discourse 87435). Pair with top/left/right positioning —
 * never `inset-0` / `bottom: 0`, which re-derives height from a parent that
 * can still jump.
 */
export const STABLE_CANVAS_FRAME_STYLE = {
  minHeight: "100svh",
  height: "100lvh",
} as const;

/** Keep projection aspect locked against height-only (URL-bar) resizes. */
export function aspectIgnoringChrome(
  camera: { aspect: number; updateProjectionMatrix: () => void },
  cssWidth: number,
  lock: { width: number; aspect: number },
): number {
  if (!lock.width || Math.abs(cssWidth - lock.width) > 2) {
    lock.width = cssWidth;
    lock.aspect = camera.aspect;
    return lock.aspect;
  }
  if (Math.abs(camera.aspect - lock.aspect) > 1e-4) {
    camera.aspect = lock.aspect;
    camera.updateProjectionMatrix();
  }
  return lock.aspect;
}
