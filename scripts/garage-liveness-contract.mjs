import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const loadersPath = path.join(root, "components", "shop", "Loaders.tsx");
const walkthroughPath = path.join(root, "components", "shop", "WalkthroughWorld.tsx");
const shopWorldPath = path.join(root, "components", "shop", "ShopWorld.tsx");
const schedulerPath = path.join(root, "components", "shop", "parseScheduler.ts");
const stationLivenessPath = path.join(root, "components", "shop", "stationLiveness.ts");
const modelRequestPath = path.join(root, "components", "shop", "modelRequest.ts");

const loaders = fs.readFileSync(loadersPath, "utf8");
const walkthrough = fs.readFileSync(walkthroughPath, "utf8");
const shopWorld = fs.readFileSync(shopWorldPath, "utf8");
const failures = [];
const schedulerOnly = process.argv.includes("--scheduler");

function keysBetween(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  if (start < 0 || end < 0) return [];
  return [...source.slice(start, end).matchAll(/\bM\.([A-Za-z0-9_]+)/g)].map((match) => match[1]);
}

function modelLibraryKeys() {
  const start = loaders.indexOf("export const M = {");
  const end = loaders.indexOf("} as const;", start);
  if (start < 0 || end < 0) return [];
  return [...loaders.slice(start, end).matchAll(/^\s{2}([A-Za-z0-9_]+):/gm)].map((match) => match[1]);
}

function contract(condition, message) {
  if (!condition) failures.push(message);
}

async function settlesWithin(promise, milliseconds, message) {
  let timer;
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(message)), milliseconds);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

async function exerciseScheduler() {
  if (!fs.existsSync(schedulerPath)) {
    failures.push("generation-scoped parse scheduler exists");
    return;
  }

  const { createParseScheduler } = await import(
    `${pathToFileURL(schedulerPath).href}?contract=${Date.now()}`
  );
  contract(typeof createParseScheduler === "function", "parse scheduler exports createParseScheduler");
  if (typeof createParseScheduler !== "function") return;

  let releaseCourtesy;
  let courtesyCalls = 0;
  let yields = 0;
  const courtesy = new Promise((resolve) => {
    releaseCourtesy = resolve;
  });
  const scheduler = createParseScheduler({
    waitForCourtesy: () => {
      courtesyCalls += 1;
      return courtesy;
    },
    yieldControl: async () => {
      yields += 1;
    },
  });
  scheduler.beginGeneration();
  contract(
    typeof scheduler.captureGeneration === "function",
    "parse scheduler exposes a generation owner for pre-fetch capture",
  );
  if (typeof scheduler.captureGeneration !== "function") return;
  const owner = scheduler.captureGeneration();
  const order = [];
  const jobs = Array.from({ length: 17 }, (_, index) =>
    scheduler.enqueue(owner, async () => {
      order.push(index);
      return index;
    }),
  );
  await Promise.resolve();
  assert.equal(courtesyCalls, 1, "17 queued parses must share one motion courtesy");
  releaseCourtesy();
  assert.deepEqual(await Promise.all(jobs), Array.from({ length: 17 }, (_, index) => index));
  assert.deepEqual(order, Array.from({ length: 17 }, (_, index) => index));
  assert.equal(yields, 17, "each serial parse must hand control back after completion");

  const rejectionSafe = createParseScheduler({
    waitForCourtesy: async () => undefined,
    yieldControl: async () => undefined,
  });
  rejectionSafe.beginGeneration();
  const rejectionOwner = rejectionSafe.captureGeneration();
  await assert.rejects(rejectionSafe.enqueue(rejectionOwner, async () => {
    throw new Error("expected parse failure");
  }));
  assert.equal(await rejectionSafe.enqueue(rejectionOwner, async () => "recovered"), "recovered");

  let releaseOld;
  const oldWork = new Promise((resolve) => {
    releaseOld = resolve;
  });
  let generationCourtesies = 0;
  const isolated = createParseScheduler({
    waitForCourtesy: async () => {
      generationCourtesies += 1;
    },
    yieldControl: async () => undefined,
  });
  isolated.beginGeneration();
  const abandonedOwner = isolated.captureGeneration();
  isolated.beginGeneration();
  const freshOwner = isolated.captureGeneration();
  // A transport owned by the abandoned Canvas resolves late, after the fresh
  // generation exists. It must still enter only its captured private queue.
  const abandoned = isolated.enqueue(abandonedOwner, () => oldWork);
  const fresh = isolated.enqueue(freshOwner, async () => "fresh");
  assert.equal(
    await settlesWithin(fresh, 100, "new generation waited behind abandoned parse work"),
    "fresh",
  );
  assert.equal(generationCourtesies, 2, "each live generation owns one courtesy");
  releaseOld("old");
  await abandoned;
}

async function exerciseStationLiveness() {
  if (!fs.existsSync(stationLivenessPath)) {
    failures.push("idempotent station release helper exists");
    return;
  }
  const { createStationRelease } = await import(
    `${pathToFileURL(stationLivenessPath).href}?contract=${Date.now()}`
  );
  let stale = false;
  let releases = 0;
  const release = createStationRelease({
    isStale: () => stale,
    release: () => {
      releases += 1;
    },
  });
  assert.equal(release(), true);
  assert.equal(release(), false);
  assert.equal(releases, 1, "success, rejection, and timeout callbacks may release a gate only once");

  stale = true;
  let staleReleases = 0;
  const staleRelease = createStationRelease({
    isStale: () => stale,
    release: () => {
      staleReleases += 1;
    },
  });
  assert.equal(staleRelease(), false);
  assert.equal(staleReleases, 0, "an abandoned Canvas cannot release gates in the new generation");
}

function createFakeClock() {
  let nextId = 0;
  const callbacks = new Map();
  return {
    clock: {
      set(callback) {
        const id = ++nextId;
        callbacks.set(id, callback);
        return id;
      },
      clear(id) {
        callbacks.delete(id);
      },
    },
    activeIds: () => [...callbacks.keys()],
    fire(id) {
      const callback = callbacks.get(id);
      callbacks.delete(id);
      callback?.();
    },
  };
}

async function exerciseModelRequestLiveness() {
  if (!fs.existsSync(modelRequestPath)) {
    failures.push("bounded exact-byte request helper exists");
    return;
  }
  const { loadModelRequestAttempt } = await import(
    `${pathToFileURL(modelRequestPath).href}?contract=${Date.now()}`
  );

  const successClock = createFakeClock();
  let successCallbacks;
  const exact = new ArrayBuffer(8);
  const success = loadModelRequestAttempt({
    target: "exact.glb.br",
    start: (callbacks) => {
      successCallbacks = callbacks;
    },
    abort: () => undefined,
    idleTimeoutMs: 8_000,
    hardTimeoutMs: 45_000,
    clock: successClock.clock,
  });
  successCallbacks.onLoad(exact);
  assert.strictEqual(await success, exact, "successful transport must return the exact ArrayBuffer object");
  assert.equal(successClock.activeIds().length, 0, "successful transport clears every timer");

  const timeoutClock = createFakeClock();
  let timeoutCallbacks;
  let aborts = 0;
  const timed = loadModelRequestAttempt({
    target: "hung.glb.br",
    start: (callbacks) => {
      timeoutCallbacks = callbacks;
    },
    abort: () => {
      aborts += 1;
    },
    idleTimeoutMs: 8_000,
    hardTimeoutMs: 45_000,
    clock: timeoutClock.clock,
  });
  const [idleTimer] = timeoutClock.activeIds();
  timeoutClock.fire(idleTimer);
  await assert.rejects(timed, (error) => error?.name === "ModelRequestTimeoutError");
  assert.equal(aborts, 1, "a hung request is aborted exactly once");
  timeoutCallbacks.onLoad(new ArrayBuffer(2));
  assert.equal(aborts, 1, "late callbacks after timeout are ignored");

  const progressClock = createFakeClock();
  let progressCallbacks;
  let forwarded = 0;
  void loadModelRequestAttempt({
    target: "moving.glb.br",
    start: (callbacks) => {
      progressCallbacks = callbacks;
    },
    abort: () => undefined,
    onProgress: () => {
      forwarded += 1;
    },
    idleTimeoutMs: 8_000,
    hardTimeoutMs: 45_000,
    clock: progressClock.clock,
  });
  const firstIdle = progressClock.activeIds()[0];
  progressCallbacks.onProgress({ loaded: 1, total: 2 });
  assert.equal(forwarded, 1);
  assert.ok(!progressClock.activeIds().includes(firstIdle), "network progress resets the inactivity timer");
}

if (!schedulerOnly) {
contract(
  /from ["']\.\/parseScheduler["']/.test(loaders),
  "Loaders uses the generation-scoped parse scheduler",
);
contract(
  !/function queueParse[\s\S]{0,700}await untilIdle\(1200, true\)/.test(loaders),
  "model parsing does not wait 1.2 seconds for every model",
);
contract(
  /beginLoaderStream\(\)[\s\S]{0,500}beginParseGeneration\(\)/.test(loaders),
  "new Canvas lifecycle begins an isolated parse generation",
);
contract(
  /const parseOwner = parseScheduler\.captureGeneration\(\)[\s\S]{0,500}fetchModelBytes\(url, options\)/.test(loaders) &&
    /queueParse\(\s*parseOwner,/.test(loaders),
  "each loader captures parse ownership before its byte request can settle late",
);
contract(
  /typeof MeshoptDecoder\.useWorkers !== ["']function["'][\s\S]{0,180}MeshoptDecoder\.useWorkers\(2\)/.test(loaders),
  "meshopt decoding uses at most two workers behind feature detection",
);
contract(
  /const REVEAL_WARM_KEYS = (?:\[\.\.\.WARM_KEYS\]|WARM_KEYS)/.test(loaders),
  "garage reveal waits for the complete warm route",
);
const libraryKeys = modelLibraryKeys();
const openingKeys = keysBetween(loaders, "const OPENING_MODELS", "const OPENING_PRELOAD_COUNT");
const routeKeys = keysBetween(loaders, "const ROUTE_MODEL_GROUPS", "const ROUTE_PREFETCH_MODELS");
const manifestKeys = [...openingKeys, ...routeKeys];
contract(
  /const ROUTE_MODEL_GROUPS = \[\s*OPENING_MODELS,/.test(loaders) &&
    /const ROUTE_PREFETCH_MODELS = \[\.\.\.new Set\(ROUTE_MODEL_GROUPS\.flat\(\)\)\]/.test(loaders) &&
    libraryKeys.length === 71 &&
    manifestKeys.length === libraryKeys.length &&
    new Set(manifestKeys).size === manifestKeys.length &&
    libraryKeys.every((key) => manifestKeys.includes(key)),
  "lossless byte prefetch covers all 71 models once, in opening-first tour order",
);
contract(
  /const PREFETCH_CONCURRENCY = 2/.test(loaders) &&
    /ROUTE_PREFETCH_MODELS\.map\(\(url\) => tierUrl\(url, lite\)\)/.test(loaders),
  "full-route transport remains bounded to two exact tier-matched requests",
);
contract(
  /const mountWorld = \(\) => \{[\s\S]{0,300}if \(!warmNear\) return;[\s\S]{0,300}preloadShopWorld/.test(walkthrough) &&
    !/mountWorld[\s\S]{0,500}stillFor\(\) >= 900/.test(walkthrough),
  "parked Canvas mounts on approach without a 900 ms stillness prerequisite",
);
const warmStationSource = loaders.slice(
  loaders.indexOf("function WarmStation"),
  loaders.indexOf("export function WarmScene"),
);
contract(
  /const releaseNextGate = createStationRelease\([\s\S]{0,220}openGate\(station \+ 2\)/.test(warmStationSource) &&
    (warmStationSource.match(/releaseNextGate\(\)/g) ?? []).length >= 3 &&
    /catch\(\(error\) => \{[\s\S]{0,260}releaseNextGate\(\)/.test(warmStationSource) &&
    /setTimeout\(\(\) => \{[\s\S]{0,120}releaseNextGate\(\)/.test(warmStationSource),
  "success, rejection, and failsafe all release the next station gate",
);
contract(
  /MODEL_REQUEST_TIMEOUT_MS = 8_000/.test(loaders) &&
    /MODEL_REQUEST_HARD_TIMEOUT_MS = 45_000/.test(loaders) &&
    /loadModelRequestAttempt/.test(loaders) &&
    /file\.abort\(\)/.test(loaders) &&
    /return retry\(url, 2\)/.test(loaders),
  "model requests have bounded inactivity/hard timeouts, abort, and exact fallback retries",
);
contract(
  /const warmStation = highestContiguousWarmStation\(\)[\s\S]{0,220}\(warmStation \+ 0\.42\) \/ SEGMENTS[\s\S]{0,140}Math\.min\(desired\.current, warmLimit\)/.test(shopWorld),
  "camera retains the no-pop-in warm frontier clamp",
);
}

await exerciseScheduler();
if (!schedulerOnly) {
  await exerciseStationLiveness();
  await exerciseModelRequestLiveness();
}

if (failures.length > 0) {
  console.error("garage liveness contract: FAIL");
  for (const failure of failures) console.error(` - ${failure}`);
  process.exitCode = 1;
} else {
  console.log("garage liveness contract: PASS");
}
