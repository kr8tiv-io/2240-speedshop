let cachedWebGL2Support: boolean | undefined;

/**
 * Three r185 requires WebGL2. Capability checks create a real browser context,
 * and Safari keeps detached contexts alive long enough for them to count
 * against its small per-page budget. Probe once, remember the answer, and
 * explicitly relinquish the disposable context before a real canvas mounts.
 */
export function supportsWebGL2() {
  if (cachedWebGL2Support !== undefined) return cachedWebGL2Support;
  if (typeof document === "undefined") return false;

  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2");
    cachedWebGL2Support = Boolean(context);
    context?.getExtension("WEBGL_lose_context")?.loseContext();
    canvas.width = 1;
    canvas.height = 1;
  } catch {
    cachedWebGL2Support = false;
  }

  return cachedWebGL2Support;
}
