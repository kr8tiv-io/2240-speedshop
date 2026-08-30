import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const [loaders, walkthrough, boot, shopWorld] = await Promise.all([
  readFile(new URL("components/shop/Loaders.tsx", root), "utf8"),
  readFile(new URL("components/shop/WalkthroughWorld.tsx", root), "utf8"),
  readFile(new URL("components/shop/boot.ts", root), "utf8"),
  readFile(new URL("components/shop/ShopWorld.tsx", root), "utf8"),
]);

assert.match(
  loaders,
  /const OPENING = 1;/,
  "Only the first bay may own the critical opening model lane.",
);
assert.doesNotMatch(
  loaders,
  /setInterval\([\s\S]{0,320}openGate/,
  "A timer must not unlock unrelated bays regardless of camera or warm state.",
);
assert.match(
  loaders,
  /export function beginLoaderStream\(\)[\s\S]{0,700}unlocked = OPENING[\s\S]{0,700}PENDING\.clear\(\)[\s\S]{0,700}WARMED\.clear\(\)/,
  "Every WebGL context needs fresh stream and GPU-readiness state.",
);
assert.match(
  boot,
  /export function beginWorldBoot\(\)[\s\S]{0,500}state\.warm = false[\s\S]{0,300}state\.ready = false/,
  "A new garage mount must not inherit ready flags from an old renderer.",
);
assert.match(
  shopWorld,
  /beginLoaderStream\(\)/,
  "ShopWorld must begin a fresh loader stream before its new Canvas mounts.",
);

assert.match(
  loaders,
  /const REVEAL_WARM_KEYS = \[\.\.\.WARM_KEYS\]/,
  "The doorway must hold its elegant veil until the complete seven-stop route is warm.",
);

const warmScene = loaders.slice(loaders.indexOf("export function WarmScene"));
assert.match(
  warmScene,
  /markShellWarm\(\)[\s\S]{0,240}reportWarm\("shell"\)/,
  "WarmScene must publish a verified shell before reporting the reveal key.",
);
assert.match(
  loaders,
  /finalizedWorld === worldFinalizer[\s\S]{0,180}REVEAL_PENDING\.size === 0[\s\S]{0,500}await finalizer\(\)[\s\S]{0,500}markWorldReady\(\)/,
  "The doorway dissolve must submit the complete route through the proved composer.",
);
assert.match(
  loaders,
  /SHELL_FINALIZER_ATTEMPTS = 3[\s\S]*for \(let attempt = 1; attempt <= SHELL_FINALIZER_ATTEMPTS; attempt\+\+\)[\s\S]{0,700}await finalizer\(\)[\s\S]{0,500}reportWarm\("shell"\)[\s\S]{0,700}SHELL_FINALIZER_RETRY_DELAY_MS \* attempt/,
  "A transient bootstrap composer failure must retry before the doorway can remain parked.",
);
assert.match(
  walkthrough,
  /const preloadShopWorld = \(\)/,
  "The split garage runtime needs a cached proximity preload.",
);
assert.match(
  walkthrough,
  /shopWorldModule = null/,
  "A transient garage chunk failure must clear the cached rejected promise.",
);
assert.match(
  walkthrough,
  /preloadOpeningGarage/,
  "The exact opening models should warm their bytes before the doorway.",
);
const idleLoaderSource = loaders.slice(
  loaders.indexOf("class IdleGLTFLoader extends GLTFLoader"),
  loaders.indexOf("const MESHOPT_WORKER_COUNT"),
);
assert.match(loaders, /const MODEL_BYTE_CACHE = new Map<string, Promise<ArrayBuffer>>\(\)/);
assert.match(loaders, /function fetchModelBytes/);
assert.match(
  idleLoaderSource,
  /fetchModelBytes\(url/,
  "Opening and mounted loads must consume the same lossless byte cache.",
);
assert.match(
  loaders,
  /const PREFETCH_CONCURRENCY = 2;[\s\S]*for \(const url of urls\)[\s\S]{0,300}prefetchModelBytes\(url\)/,
  "Opening bytes must preload with bounded concurrency.",
);
assert.doesNotMatch(
  loaders,
  /useLoader\.preload\(IdleGLTFLoader/,
  "Opening preload must not eagerly parse GLBs on the visible film's main thread.",
);
assert.match(
  walkthrough,
  /void preloadShopWorld\(\)/,
  "The split runtime must begin downloading before the doorway.",
);
assert.match(
  walkthrough,
  /POST_HERO_PRELOAD_TIMEOUT_MS/,
  "A verified hero frame needs a bounded background shop preload.",
);
assert.match(
  walkthrough,
  /POST_HERO_PRELOAD_TIMEOUT_MS[\s\S]{0,2200}preloadOpeningGarage/,
  "Verified hero readiness must start the exact route bytes, not only its JavaScript chunk.",
);
assert.doesNotMatch(
  walkthrough,
  /MOUNT_DEADLINE_MS|PROXIMITY_MOUNT_TIMEOUT_MS|mountWorld\(true\)/,
  "No timer may force the second WebGL compiler into an active scroll.",
);
assert.match(
  walkthrough,
  /if \(!run \|\| warmLatched \|\| !heroSettled\) return/,
  "The garage must not create its renderer before the opening film settles.",
);
assert.match(
  walkthrough,
  /if \(!warmNear\) return;[\s\S]{0,300}preloadShopWorld\(\)/,
  "The parked garage must mount in the lead corridor without waiting for scroll stillness.",
);
assert.doesNotMatch(
  walkthrough,
  /shop-showroom-neon-|wt-world-boot-photo|<picture>/,
  "The garage handoff must not show the old showroom photograph.",
);
assert.match(
  walkthrough,
  /data-shop-stage=\{worldReady \? "world" : worldWarm \? "shell" : "poster"\}/,
  "Production diagnostics must expose poster, verified-shell, and full-world stages.",
);
assert.match(
  walkthrough,
  /<ShopWorld[\s\S]{0,220}revealed=\{worldReady\}/,
  "The 3D canvas must remain hidden until complete-route readiness.",
);
assert.match(
  walkthrough,
  /active=\{active && worldReady && uiOverlay === null\}/,
  "The hidden Canvas must stay parked in its cheap oven until the route is ready.",
);
assert.match(
  walkthrough,
  /worldReady \? "opacity-0" : "opacity-100"/,
  "The elegant boot light must not become translucent over a partial garage.",
);
assert.match(
  walkthrough,
  /const warmLeadPx = Math\.ceil\(Math\.max\(window\.innerHeight, 1\) \* 7\)/,
  "Apple/mobile approach lead must be measured in viewport height, not IntersectionObserver width percentages.",
);

console.log("garage progressive reveal contract: PASS");
