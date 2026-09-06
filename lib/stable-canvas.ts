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
