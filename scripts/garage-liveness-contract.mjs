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
  const order = [];
  const jobs = Array.from({ length: 17 }, (_, index) =>
    scheduler.enqueue(async () => {
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
  await assert.rejects(rejectionSafe.enqueue(async () => {
    throw new Error("expected parse failure");
  }));
  assert.equal(await rejectionSafe.enqueue(async () => "recovered"), "recovered");

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
  const abandoned = isolated.enqueue(() => oldWork);
  await Promise.resolve();
  await Promise.resolve();
  isolated.beginGeneration();
  const fresh = isolated.enqueue(async () => "fresh");
  assert.equal(
    await settlesWithin(fresh, 100, "new generation waited behind abandoned parse work"),
    "fresh",
  );
  assert.equal(generationCourtesies, 2, "each live generation owns one courtesy");
  releaseOld("old");
  await abandoned;
}

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
  /MeshoptDecoder\.useWorkers\?\.\(2\)|typeof MeshoptDecoder\.useWorkers === ["']function["'][\s\S]{0,120}MeshoptDecoder\.useWorkers\(2\)/.test(loaders),
  "meshopt decoding uses at most two workers behind feature detection",
);
contract(
  /const REVEAL_WARM_KEYS = (?:\[\.\.\.WARM_KEYS\]|WARM_KEYS)/.test(loaders),
  "garage reveal waits for the complete warm route",
);
contract(
  /const ROUTE_PREFETCH_MODELS = [\s\S]{0,1000}new Set/.test(loaders) &&
    /OPENING_MODELS[\s\S]{0,500}Object\.values\(M\)/.test(loaders),
  "lossless byte prefetch covers every current model with opening priority and deduplication",
);
contract(
  /const mountWorld = \(\) => \{[\s\S]{0,400}if \(warmNear\) \{[\s\S]{0,300}preloadShopWorld/.test(walkthrough) &&
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

await exerciseScheduler();

if (failures.length > 0) {
  console.error("garage liveness contract: FAIL");
  for (const failure of failures) console.error(` - ${failure}`);
  process.exitCode = 1;
} else {
  console.log("garage liveness contract: PASS");
}

