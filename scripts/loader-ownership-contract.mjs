import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const shop = await readFile(new URL("../components/shop/ShopWorld.tsx", import.meta.url), "utf8");
const gate = await readFile(
  new URL("../components/shop/WalkthroughWorld.tsx", import.meta.url),
  "utf8",
);
const heroRuntime = await readFile(
  new URL("../components/home/HeroRuntime.tsx", import.meta.url),
  "utf8",
);
const heroScene = await readFile(
  new URL("../components/home/HeroScene.tsx", import.meta.url),
  "utf8",
);
const boundary = await readFile(
  new URL("../components/gl/WebGLBoundary.tsx", import.meta.url),
  "utf8",
).catch(() => "");
const contextGuard = await readFile(
  new URL("../components/gl/WebGLContextGuard.tsx", import.meta.url),
  "utf8",
).catch(() => "");
const loaders = await readFile(
  new URL("../components/shop/Loaders.tsx", import.meta.url),
  "utf8",
);
const pacedWarm = loaders.slice(
  loaders.indexOf("async function pacedWarm"),
  loaders.indexOf("export function StationBundle"),
);

assert.ok(
  /const previousOnProgress = manager\.onProgress/.test(shop),
  "ShopWorld must preserve the progress callback already owned by the hero runtime.",
);
assert.ok(
  /previousOnProgress\?\.call\(manager, url, loaded, total\)/.test(shop),
  "ShopWorld must forward every global loading event to the previous owner.",
);
assert.ok(
  /if \(manager\.onProgress === onProgress\) manager\.onProgress = previousOnProgress/.test(shop),
  "ShopWorld must restore the exact prior callback without clobbering a newer owner.",
);
assert.ok(
  !/manager\.onProgress = \(\) => \{\}/.test(shop),
  "ShopWorld cleanup may not replace the shared callback with a no-op.",
);
assert.ok(
  /canvas\.getContext\("webgl2"[^)]*\)/.test(gate),
  "The capability gate must require WebGL2.",
);
assert.ok(
  !/canvas\.getContext\("webgl"\)/.test(gate),
  "Three r185 cannot use a WebGL1 fallback.",
);
assert.ok(
  /static getDerivedStateFromError/.test(boundary) && /data-webgl-fallback/.test(boundary),
  "Canvas render failures need a decorative, non-destructive error boundary.",
);
assert.ok(
  /webglcontextlost/.test(contextGuard) && /event\.preventDefault\(\)/.test(contextGuard),
  "A context-loss event must be handled explicitly before the browser destroys the surface.",
);
assert.ok(
  /<WebGLBoundary onFailure={onRuntimeFailure}>/.test(heroRuntime),
  "Hero runtime failures must publish a failed boot and reveal the fallback.",
);
assert.ok(
  /<WebGLContextGuard \/>/.test(heroScene),
  "The hero canvas must report asynchronous context loss to its boundary.",
);
assert.ok(
  /<WebGLBoundary onFailure={markWorldSkipped}>/.test(gate),
  "The shop canvas must fail into its existing graded veil.",
);
assert.ok(
  /<WebGLContextGuard \/>/.test(shop),
  "The shop canvas must report asynchronous context loss to its boundary.",
);
assert.ok(
  pacedWarm.includes("try {") && pacedWarm.includes("} finally {") && pacedWarm.includes("restore();"),
  "Every paced warm exit must restore the visibility state it received.",
);
assert.ok(
  !/VisibilityWatchdog|watchdog showed/.test(loaders + shop),
  "A timer may not reveal objects while the paced warm still owns visibility.",
);
console.log("loader ownership contract: PASS");
