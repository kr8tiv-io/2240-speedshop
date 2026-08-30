import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const loadersPath = path.join(root, "components", "shop", "Loaders.tsx");
const walkthroughPath = path.join(root, "components", "shop", "WalkthroughWorld.tsx");
const shopWorldPath = path.join(root, "components", "shop", "ShopWorld.tsx");
const schedulerPath = path.join(root, "components", "shop", "parseScheduler.ts");

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
contract(
  /const releaseNextGate = \(\) => [\s\S]{0,250}openGate\(station \+ 2\)/.test(loaders) &&
    /warmSubtree[\s\S]{0,1500}releaseNextGate\(\)[\s\S]{0,500}catch[\s\S]{0,500}releaseNextGate\(\)[\s\S]{0,500}setTimeout\([^,]*releaseNextGate/.test(loaders),
  "success, rejection, and failsafe all release the next station gate",
);
contract(
  /MODEL_REQUEST_TIMEOUT_MS/.test(loaders) &&
    /loadAttempt[\s\S]{0,900}setTimeout[\s\S]{0,900}settled/.test(loaders),
  "model requests have a bounded timeout with guarded late callbacks",
);
contract(
  /const warmStation = highestContiguousWarmStation\(\)[\s\S]{0,220}\(warmStation \+ 0\.42\) \/ SEGMENTS[\s\S]{0,140}Math\.min\(desired\.current, warmLimit\)/.test(shopWorld),
  "camera retains the no-pop-in warm frontier clamp",
);
}

await exerciseScheduler();

if (failures.length > 0) {
  console.error("garage liveness contract: FAIL");
  for (const failure of failures) console.error(` - ${failure}`);
  process.exitCode = 1;
} else {
  console.log("garage liveness contract: PASS");
}
