import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const shop = await readFile(new URL("../components/shop/ShopWorld.tsx", import.meta.url), "utf8");
const gate = await readFile(
  new URL("../components/shop/WalkthroughWorld.tsx", import.meta.url),
  "utf8",
);
const webglCapability = await readFile(
  new URL("../lib/webgl-capability.ts", import.meta.url),
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
  !/manager\.onProgress\s*=/.test(shop),
  "ShopWorld must not wrap or replace the global loading callback owned by the hero runtime.",
);
assert.ok(
  /reportBootProgress\(0\.06\)/.test(shop),
  "The garage meter must start without borrowing unrelated global request counts.",
);
assert.ok(
  /function reportOpeningModelParsed/.test(loaders) && /reportOpeningModelParsed\(url\)/.test(loaders),
  "Only successful shop parse completions may advance opening model progress.",
);
assert.ok(
  !/manager\.onProgress = \(\) => \{\}/.test(shop),
  "ShopWorld cleanup may not replace the shared callback with a no-op.",
);
assert.ok(
  /supportsWebGL2\(\)/.test(gate) && /canvas\.getContext\("webgl2"[^)]*\)/.test(webglCapability),
  "The capability gate must require WebGL2.",
);
assert.ok(
  !/canvas\.getContext\("webgl"\)/.test(gate) && !/canvas\.getContext\("webgl"\)/.test(webglCapability),
  "Three r185 cannot use a WebGL1 fallback.",
);
assert.ok(
  /static getDerivedStateFromError/.test(boundary) && /data-webgl-fallback/.test(boundary),
  "Canvas render failures need a decorative, non-destructive error boundary.",
);
assert.ok(
  /class ModelBoundary extends Component/.test(loaders) &&
    /<ModelBoundary url=\{props\.url\}>[\s\S]*<PlacedModel \{\.\.\.props\} \/>[\s\S]*<\/ModelBoundary>/.test(loaders),
  "A failed individual prop must disappear without unmounting the rest of its garage bay.",
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
  /const REVEAL_WARM_KEYS = \[\.\.\.WARM_KEYS\]/.test(loaders) &&
    /const REVEAL_PENDING = new Set<string>\(REVEAL_WARM_KEYS\)/.test(loaders),
  "The final photographic dissolve must wait for the verified complete garage route.",
);
assert.ok(
  /REVEAL_PENDING\.delete\(key\)/.test(loaders) &&
    /finalizedWorld === worldFinalizer[\s\S]*REVEAL_PENDING\.size === 0[\s\S]*markWorldReady\(\)/.test(loaders),
  "The doorway may dissolve only after the shell proof and all seven station first-uses exist.",
);
assert.ok(
  /if \(PENDING\.size === 0\) restoreComposerOvens\(\)/.test(loaders),
  "The full-tour warm tracker must retain the cheap composer oven until every later bay is first-used.",
);
assert.ok(
  /const WARM_KEYS = \[[\s\S]{0,180}STATION_COUNT[\s\S]{0,180}"5-gallery"/.test(loaders),
  "Complete-route readiness must include every numbered bay and the gallery.",
);
assert.ok(
  /const OVEN_START_BATCH = phoneTier \? 12 : 1/.test(pacedWarm) &&
    /let size = OVEN_START_BATCH/.test(pacedWarm),
  "The private 24px oven must amortize WebKit mobile overhead without giving full desktop an oversized first batch.",
);
assert.ok(
  /const OPENING = 1/.test(loaders) &&
    /openGate\(station \+ 2\)/.test(loaders) &&
    !/setInterval\([\s\S]*openGate/.test(loaders),
  "Only station zero may open immediately; each compiled bay must pace the next owner without a timer flood.",
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
  /if \(station > 0\) await waitForWarmKey\(String\(station - 1\), 30000\)/.test(loaders),
  "Later compiled bays may preload, but exact first-use must advance in camera order.",
);
assert.ok(
  /const UNIT_BOX_GEOMETRY = new THREE\.BoxGeometry\(1, 1, 1\)/.test(shop) &&
    /const UNIT_PLANE_GEOMETRY = new THREE\.PlaneGeometry\(1, 1\)/.test(shop),
  "The garage shell must share canonical primitive buffers instead of uploading duplicate boxes and planes.",
);
assert.ok(
  (shop.match(/object=\{UNIT_BOX_GEOMETRY\}/g) ?? []).length >= 8 &&
    (shop.match(/object=\{UNIT_PLANE_GEOMETRY\}/g) ?? []).length >= 8,
  "The repeated shell, light, door and yard primitives must consume the shared unit buffers.",
);
assert.ok(
  /material\?\.isShaderMaterial \? material\.uuid : ""/.test(loaders),
  "Shared geometry warm keys must keep distinct custom shader sources distinct.",
);
assert.ok(
  /let changed = false;[\s\S]*if \(changed\) material\.needsUpdate = true;/.test(loaders) &&
    /const unified = new Set<THREE\.MeshStandardMaterial>\(\)/.test(loaders),
  "Material unification must be idempotent and deduplicate shared clone materials per traversal.",
);
assert.ok(
  /async function waitForReaderQuiet\(patience = 900\)/.test(loaders) &&
    /performance\.now\(\) < deadline/.test(loaders),
  "Reader-quiet courtesy waits must be bounded so continuous scroll cannot strand the garage photograph.",
);
assert.ok(
  /maxDistanceSquared: number/.test(loaders) &&
    /distanceToSquared\(eye\) < item\.maxDistanceSquared/.test(loaders),
  "Phone detail culling must use the mathematically identical squared-distance test.",
);
assert.ok(
  /const UPLOADED_TEXTURES = new WeakMap<THREE\.WebGLRenderer, WeakSet<THREE\.Texture>>/.test(loaders) &&
    /gl\.initTexture\(texture\)/.test(loaders) &&
    /await nextUploadFrame\(\)/.test(loaders),
  "Model textures must upload one paced frame at a time before their first visible draw.",
);
assert.ok(
  /await warmTextures\(gl, node, isStale\);[\s\S]*await warmUp\(gl, node, camera, scene, isStale\)/.test(loaders),
  "Texture upload must finish before shader compile and geometry first-use.",
);
assert.ok(
  /function firstUseKey[\s\S]*const rawDefines/.test(loaders) &&
    !/function firstUseKey[\s\S]*texture\?\.uuid[\s\S]*const rawDefines/.test(loaders),
  "Texture identity must not multiply geometry/program representatives once uploads are owned separately.",
);
assert.ok(
  /warmSubtree\(gl, node, camera, scene, stale\)\.then\(\(\) => \{[\s\S]*openGate\(station \+ 2\);[\s\S]*void finish\(\);/.test(loaders),
  "A compiled bay must release download credit before its serialized first-use so later copy panels do not outrun their models.",
);
assert.ok(
  /let finalizedWorld: \(\(\) => Promise<void>\) \| null = null/.test(loaders) &&
    /finalizedWorld === worldFinalizer/.test(loaders) &&
    /finalizedWorld = finalizer/.test(loaders),
  "The full-composer readiness proof must run once per mounted WebGL world, not after every bay.",
);
assert.ok(
  /releaseOvenScene\(\);[\s\S]*await new Promise<void>\(\(resolve\) => window\.requestAnimationFrame\(\(\) => resolve\(\)\)\);[\s\S]*if \(!parkedNow\(\)\) break;[\s\S]*isolateOvenScene\(\)/.test(pacedWarm),
  "A private oven must restore the live scene before every browser frame and abort if the shop activates.",
);
console.log("loader ownership contract: PASS");
