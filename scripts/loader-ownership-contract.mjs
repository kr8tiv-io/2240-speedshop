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
assert.ok(
  /subscribeHeroBoot/.test(gate) && /getHeroBootSnapshot/.test(gate),
  "The shop warm-up must coordinate with the hero's real readiness store.",
);
assert.ok(
  !/setTimeout\(\(\) => setMounted\(true\), 3500\)/.test(gate),
  "The shop may not start on a fixed clock while the opening film is still compiling.",
);
assert.ok(
  /const REVEAL_WARM_KEYS = \["shell"\]/.test(loaders) &&
    /const REVEAL_PENDING = new Set<string>\(REVEAL_WARM_KEYS\)/.test(loaders),
  "The photographic doorway must wait for the verified 3D building, not every bay object's first draw.",
);
assert.ok(
  /REVEAL_PENDING\.delete\(key\)/.test(loaders) &&
    /if \(REVEAL_PENDING\.size === 0\) void finalizeWorld\(\)/.test(loaders),
  "Building readiness must trigger the verified composed-frame finalizer while bays continue paced first-use.",
);
assert.ok(
  /if \(PENDING\.size === 0\) restoreComposerOvens\(\)/.test(loaders),
  "The full-tour warm tracker must retain the cheap composer oven until every later bay is first-used.",
);
assert.ok(
  !/finalizingWorld \|\| PENDING\.size !== 0 \|\| !worldFinalizer/.test(loaders),
  "Full-tour readiness may not hold the already-warm 3D entrance behind a static photograph.",
);
assert.ok(
  /const OVEN_START_BATCH = phoneTier \? 12 : 1/.test(pacedWarm) &&
    /let size = OVEN_START_BATCH/.test(pacedWarm),
  "The private 24px oven must amortize WebKit mobile overhead without giving full desktop an oversized first batch.",
);
assert.ok(
  /if \(!s\.ready \|\| streaming\) return/.test(loaders) &&
    /openGate\(unlocked \+ 1\);[\s\S]*}, 2500\)/.test(loaders),
  "After reveal, start one next-bay owner immediately and pace the rest to prevent a parse stampede.",
);
assert.ok(
  /export function highestContiguousWarmStation\(\)/.test(loaders) &&
    /highestContiguousWarmStation/.test(shop),
  "The camera rail must consume the contiguous per-station readiness frontier.",
);
assert.ok(
  /const desired = useRef\(0\)/.test(shop) &&
    /target\.current = Math\.min\(desired\.current, warmLimit\)/.test(shop),
  "A cold fast-scroll must hold on the last complete bay, then release through the existing camera damping.",
);
assert.ok(
  /if \(node\.visible !== show\) node\.visible = show;[\s\S]*if \(show === drawn\.current\) return/.test(loaders),
  "A re-suspended bay group must reconcile its real Three visibility before trusting the cached drawn flag.",
);
assert.ok(
  /if \(station === 1\) await waitForWarmKey\("0"\)/.test(loaders),
  "The second opening bay may not win the private first-use queue ahead of the doorway subject.",
);
console.log("loader ownership contract: PASS");
