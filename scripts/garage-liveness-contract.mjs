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
const meshoptDecoderPath = path.join(root, "components", "shop", "meshoptWorkerDecoder.ts");

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

  const {
    createParseScheduler,
    ParseGenerationCancelledError,
    runWithTimeoutFallback,
  } = await import(
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
    scheduler.enqueue(owner, "fab", async () => {
      order.push(index);
      return index;
    }),
  );
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(courtesyCalls, 1, "17 queued parses must share one motion courtesy");
  releaseCourtesy();
  assert.deepEqual(await Promise.all(jobs), Array.from({ length: 17 }, (_, index) => index));
  assert.deepEqual(order, Array.from({ length: 17 }, (_, index) => index));
  assert.equal(yields, 17, "each serial parse must hand control back after completion");
  assert.equal(await scheduler.enqueue(owner, "office", async () => "next bay"), "next bay");
  assert.equal(courtesyCalls, 2, "a later bay earns a fresh courtesy without delaying every model");

  let releaseHead;
  let headCourtesyCalls = 0;
  const headScheduler = createParseScheduler({
    waitForCourtesy: async () => {
      headCourtesyCalls += 1;
    },
    yieldControl: async () => undefined,
  });
  headScheduler.beginGeneration();
  const headOwner = headScheduler.captureGeneration();
  const held = headScheduler.enqueue(
    headOwner,
    "doorway",
    () => new Promise((resolve) => {
      releaseHead = resolve;
    }),
  );
  const downstream = headScheduler.enqueue(headOwner, "engine", async () => "engine");
  for (let turn = 0; turn < 6 && !releaseHead; turn++) await Promise.resolve();
  assert.equal(headCourtesyCalls, 1, "downstream bay courtesy must not expire in the queue");
  releaseHead();
  await held;
  assert.equal(await downstream, "engine");
  assert.equal(headCourtesyCalls, 2, "a bay earns its courtesy only when it reaches the parse head");

  const rejectionSafe = createParseScheduler({
    waitForCourtesy: async () => undefined,
    yieldControl: async () => undefined,
  });
  rejectionSafe.beginGeneration();
  const rejectionOwner = rejectionSafe.captureGeneration();
  await assert.rejects(rejectionSafe.enqueue(rejectionOwner, "engine", async () => {
    throw new Error("expected parse failure");
  }));
  assert.equal(
    await rejectionSafe.enqueue(rejectionOwner, "engine", async () => "recovered"),
    "recovered",
  );

  let releaseOld;
  const oldWork = new Promise((resolve) => {
    releaseOld = resolve;
  });
  let generationCourtesies = 0;
  let activeParses = 0;
  let peakParses = 0;
  const isolated = createParseScheduler({
    waitForCourtesy: async () => {
      generationCourtesies += 1;
    },
    yieldControl: async () => undefined,
    cancelActive: () => releaseOld?.("cancelled"),
  });
  isolated.beginGeneration();
  const abandonedOwner = isolated.captureGeneration();
  const abandoned = isolated.enqueue(abandonedOwner, "doorway", async () => {
    activeParses += 1;
    peakParses = Math.max(peakParses, activeParses);
    try {
      return await oldWork;
    } finally {
      activeParses -= 1;
    }
  });
  const abandonedSettled = abandoned.then(
    () => "resolved",
    (error) => error?.name,
  );
  for (let turn = 0; turn < 6 && activeParses === 0; turn++) await Promise.resolve();
  assert.equal(activeParses, 1, "old Canvas owns the global parse lane before remount");
  isolated.beginGeneration();
  const freshOwner = isolated.captureGeneration();
  const fresh = isolated.enqueue(freshOwner, "doorway", async () => {
    activeParses += 1;
    peakParses = Math.max(peakParses, activeParses);
    activeParses -= 1;
    return "fresh";
  });
  assert.equal(
    await settlesWithin(fresh, 100, "new generation waited behind abandoned parse work"),
    "fresh",
  );
  assert.equal(generationCourtesies, 2, "each live generation owns one courtesy");
  assert.equal(await abandonedSettled, "ParseGenerationCancelledError");
  assert.equal(peakParses, 1, "old and replacement Canvas parses never overlap");

  let rejectWorkerParse;
  let hiddenLocalFallbacks = 0;
  const workerParse = new Promise((_, reject) => {
    rejectWorkerParse = reject;
  });
  const teardown = createParseScheduler({
    waitForCourtesy: async () => undefined,
    yieldControl: async () => undefined,
    cancelActive: () => rejectWorkerParse?.(new Error("worker pool closed")),
  });
  teardown.beginGeneration();
  const rendererOwner = teardown.captureGeneration();
  let teardownParseStarted = false;
  const teardownParse = teardown.enqueue(rendererOwner, "doorway", async (executionOwner) => {
    teardownParseStarted = true;
    try {
      return await workerParse;
    } catch {
      if (!executionOwner.active) throw new ParseGenerationCancelledError();
      hiddenLocalFallbacks += 1;
      return "hidden-local-fallback";
    }
  });
  for (let turn = 0; turn < 6 && !teardownParseStarted; turn++) await Promise.resolve();
  assert.equal(teardownParseStarted, true);
  assert.equal(teardown.endGeneration(rendererOwner), true);
  await assert.rejects(
    teardownParse,
    (error) => error?.name === "ParseGenerationCancelledError",
  );
  assert.equal(hiddenLocalFallbacks, 0, "route teardown cannot launch a hidden local parse");
  await assert.rejects(
    teardown.enqueue(rendererOwner, "engine", async () => {
      hiddenLocalFallbacks += 1;
      return "should-not-run";
    }),
    (error) => error?.name === "ParseGenerationCancelledError",
  );
  assert.equal(hiddenLocalFallbacks, 0, "teardown drains queued model bytes without parsing");

  let resumedOwner = null;
  const awaitingRevisit = teardown.waitForActiveGeneration().then((activeOwner) => {
    resumedOwner = activeOwner;
    return activeOwner;
  });
  await Promise.resolve();
  assert.equal(resumedOwner, null, "route-away resources wait without a live parse owner");
  teardown.beginGeneration();
  const replacementOwner = await awaitingRevisit;
  assert.equal(replacementOwner.active, true);
  assert.equal(
    teardown.endGeneration(rendererOwner),
    false,
    "late old-renderer cleanup cannot cancel its replacement Canvas",
  );
  assert.equal(replacementOwner.active, true);
  let staleTierParses = 0;
  await assert.rejects(
    teardown.enqueue(rendererOwner, "old-full-tier", async () => {
      staleTierParses += 1;
      return "wrong-tier";
    }),
    (error) => error?.name === "ParseGenerationCancelledError",
  );
  assert.equal(
    staleTierParses,
    0,
    "a stale owner cannot migrate queued full-tier work into a lite replacement",
  );

  contract(
    typeof runWithTimeoutFallback === "function",
    "parse scheduler exports a bounded fallback primitive",
  );
  if (typeof runWithTimeoutFallback === "function") {
    const fallbackClock = createFakeClock();
    let fallbackRuns = 0;
    let fallbackSwitches = 0;
    const hung = new Promise(() => undefined);
    const recovered = runWithTimeoutFallback({
      runPrimary: () => hung,
      runFallback: async () => {
        fallbackRuns += 1;
        return "single-thread";
      },
      beforeFallback: () => {
        fallbackSwitches += 1;
      },
      timeoutMs: 15_000,
      clock: fallbackClock.clock,
    });
    fallbackClock.fire(fallbackClock.activeIds()[0]);
    assert.equal(await recovered, "single-thread");
    assert.equal(fallbackRuns, 1);
    assert.equal(fallbackSwitches, 1);

    assert.equal(
      await runWithTimeoutFallback({
        runPrimary: async () => {
          throw new Error("worker decode failed");
        },
        runFallback: async () => "retry-exact-bytes",
        beforeFallback: () => undefined,
        timeoutMs: 15_000,
        clock: createFakeClock().clock,
      }),
      "retry-exact-bytes",
    );

    const doubleHangClock = createFakeClock();
    const doubleHang = runWithTimeoutFallback({
      runPrimary: () => new Promise(() => undefined),
      runFallback: () => new Promise(() => undefined),
      beforeFallback: () => undefined,
      timeoutMs: 15_000,
      fallbackTimeoutMs: 30_000,
      clock: doubleHangClock.clock,
    });
    doubleHangClock.fire(doubleHangClock.activeIds()[0]);
    for (let turn = 0; turn < 6 && doubleHangClock.activeIds().length === 0; turn++) {
      await Promise.resolve();
    }
    assert.equal(doubleHangClock.activeIds().length, 1, "fallback owns an independent deadline");
    doubleHangClock.fire(doubleHangClock.activeIds()[0]);
    await assert.rejects(doubleHang, (error) => error?.name === "OperationTimeoutError");
  }

}

async function exerciseMeshoptWorkerCancellation() {
  if (!fs.existsSync(meshoptDecoderPath)) {
    failures.push("cancellable Meshopt worker controller exists");
    return;
  }
  const { createMeshoptWorkerDecoder } = await import(
    `${pathToFileURL(meshoptDecoderPath).href}?contract=${Date.now()}`
  );
  contract(
    typeof createMeshoptWorkerDecoder === "function",
    "Meshopt worker controller is constructible",
  );
  if (typeof createMeshoptWorkerDecoder !== "function") return;

  const workers = [];
  const createWorker = () => {
    const worker = {
      onmessage: null,
      onerror: null,
      messages: [],
      terminated: false,
      postMessage(message) {
        this.messages.push(message);
      },
      terminate() {
        this.terminated = true;
      },
    };
    workers.push(worker);
    return worker;
  };
  const controller = createMeshoptWorkerDecoder({ count: 2, createWorker });
  const first = controller.decoder.decodeGltfBufferAsync(
    4,
    3,
    new Uint8Array([1, 2, 3]),
    "ATTRIBUTES",
  );
  const second = controller.decoder.decodeGltfBufferAsync(
    3,
    2,
    new Uint8Array([4, 5, 6]),
    "TRIANGLES",
  );
  assert.equal(controller.pendingCount(), 2);
  controller.cancel(new Error("superseded Canvas"));
  await assert.rejects(first, /superseded Canvas/);
  await assert.rejects(second, /superseded Canvas/);
  assert.equal(controller.pendingCount(), 0);
  assert.ok(workers.every((worker) => worker.terminated), "cancellation terminates the full pool");
  await assert.rejects(
    controller.decoder.decodeGltfBufferAsync(1, 1, new Uint8Array([1]), "INDICES"),
    /closed/,
  );

  const successWorkers = [];
  const successful = createMeshoptWorkerDecoder({
    count: 1,
    createWorker: () => {
      const worker = createWorker();
      successWorkers.push(worker);
      return worker;
    },
  });
  const decoded = successful.decoder.decodeGltfBufferAsync(
    2,
    2,
    new Uint8Array([7, 8]),
    "ATTRIBUTES",
  );
  const request = successWorkers[0].messages[0];
  const exact = new Uint8Array([9, 10, 11, 12]);
  successWorkers[0].onmessage({ data: { id: request.id, ok: true, value: exact } });
  assert.strictEqual(await decoded, exact);
  assert.equal(successful.pendingCount(), 0);
  successful.cancel();

  const fallbackClock = createFakeClock();
  const fallbackWorkers = [];
  const localCalls = [];
  let fallbackNotices = 0;
  const fallback = createMeshoptWorkerDecoder({
    count: 2,
    decodeTimeoutMs: 15_000,
    clock: fallbackClock.clock,
    createWorker: () => {
      const worker = createWorker();
      fallbackWorkers.push(worker);
      return worker;
    },
    decodeLocal: async (count, size, source, mode) => {
      localCalls.push({ count, size, source: [...source], mode });
      return new Uint8Array(count * size).fill(source[0]);
    },
    onFallback: () => {
      fallbackNotices += 1;
    },
  });
  const timedFirst = fallback.decoder.decodeGltfBufferAsync(
    2,
    2,
    new Uint8Array([11, 12]),
    "ATTRIBUTES",
  );
  const timedSecond = fallback.decoder.decodeGltfBufferAsync(
    3,
    1,
    new Uint8Array([21, 22]),
    "TRIANGLES",
  );
  assert.equal(fallbackClock.activeIds().length, 2, "each worker decode owns a deadline");
  const timedFirstRequest = fallbackWorkers[0].messages[0];
  fallbackClock.fire(fallbackClock.activeIds()[0]);
  fallbackWorkers[0].onmessage({
    data: {
      id: timedFirstRequest.id,
      ok: true,
      value: new Uint8Array([99, 99, 99, 99]),
    },
  });
  assert.deepEqual([...await timedFirst], [11, 11, 11, 11]);
  assert.deepEqual([...await timedSecond], [21, 21, 21]);
  assert.equal(fallbackNotices, 1, "one timeout switches the whole parser exactly once");
  assert.equal(localCalls.length, 2, "outstanding requests continue locally in the same parser");
  assert.equal(fallback.pendingCount(), 0);
  assert.equal(fallbackClock.activeIds().length, 0, "fallback clears every worker deadline");
  assert.ok(
    fallbackWorkers.every((worker) => worker.terminated),
    "in-parser fallback terminates the full worker pool",
  );
  const workerMessages = fallbackWorkers.reduce(
    (total, worker) => total + worker.messages.length,
    0,
  );
  assert.deepEqual(
    [...await fallback.decoder.decodeGltfBufferAsync(
      2,
      1,
      new Uint8Array([31]),
      "INDICES",
    )],
    [31, 31],
  );
  assert.equal(
    fallbackWorkers.reduce((total, worker) => total + worker.messages.length, 0),
    workerMessages,
    "future requests stay local without restarting the dead pool",
  );
  fallback.cancel();

  const localCancelClock = createFakeClock();
  let releaseLocalReady;
  let cancelledLocalDecodes = 0;
  const localCancellation = createMeshoptWorkerDecoder({
    count: 1,
    clock: localCancelClock.clock,
    createWorker,
    localReady: new Promise((resolve) => {
      releaseLocalReady = resolve;
    }),
    decodeLocal: () => {
      cancelledLocalDecodes += 1;
      return new Uint8Array([41, 41]);
    },
  });
  const locallyRecovering = localCancellation.decoder.decodeGltfBufferAsync(
    2,
    1,
    new Uint8Array([41]),
    "ATTRIBUTES",
  );
  localCancelClock.fire(localCancelClock.activeIds()[0]);
  await Promise.resolve();
  const localCancellationAssertion = assert.rejects(
    locallyRecovering,
    /replacement Canvas owns the route/,
  );
  localCancellation.cancel(new Error("replacement Canvas owns the route"));
  await localCancellationAssertion;
  releaseLocalReady?.();
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(
    cancelledLocalDecodes,
    0,
    "cancelled local readiness cannot wake old-Canvas decode work",
  );
  assert.equal(
    localCancellation.pendingCount(),
    0,
    "generation cancellation also releases an in-parser local recovery",
  );
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
  const { createRequestPool, loadModelRequestAttempt, runModelResourceAttempts } = await import(
    `${pathToFileURL(modelRequestPath).href}?contract=${Date.now()}`
  );

  contract(typeof createRequestPool === "function", "model transport exports a bounded request pool");
  if (typeof createRequestPool === "function") {
    let active = 0;
    let peak = 0;
    let started = 0;
    const releases = [];
    const pool = createRequestPool(2);
    const jobs = Array.from({ length: 8 }, (_, index) =>
      pool.run(
        () =>
          new Promise((resolve) => {
            started += 1;
            active += 1;
            peak = Math.max(peak, active);
            releases.push(() => {
              active -= 1;
              resolve(index);
            });
          }),
      ),
    );
    await Promise.resolve();
    await Promise.resolve();
    assert.equal(started, 2, "only two model transports may start together");
    while (releases.length > 0) {
      releases.shift()();
      await Promise.resolve();
      await Promise.resolve();
    }
    assert.deepEqual(await Promise.all(jobs), Array.from({ length: 8 }, (_, index) => index));
    assert.equal(peak, 2, "mounted loaders cannot burst beyond the prefetch transport limit");

    const priorityPool = createRequestPool(1);
    const priorityOrder = [];
    let releaseHead;
    const head = priorityPool.run(
      () => new Promise((resolve) => {
        priorityOrder.push("head");
        releaseHead = resolve;
      }),
    );
    const speculative = priorityPool.run(async () => {
      priorityOrder.push("speculative");
      return "speculative";
    });
    const foreground = priorityPool.run(async () => {
      priorityOrder.push("foreground");
      return "foreground";
    });
    assert.equal(
      priorityPool.demand(foreground),
      true,
      "a mounted consumer must be able to promote its shared queued promise",
    );
    releaseHead("head");
    await head;
    assert.equal(await foreground, "foreground");
    assert.equal(await speculative, "speculative");
    assert.deepEqual(priorityOrder, ["head", "foreground", "speculative"]);

    const queueClock = createFakeClock();
    const expiringPool = createRequestPool(1, queueClock.clock);
    let releaseExpiringHead;
    const expiringHead = expiringPool.run(
      () => new Promise((resolve) => {
        releaseExpiringHead = resolve;
      }),
    );
    let expiredStarted = false;
    const expired = expiringPool.run(async () => {
      expiredStarted = true;
      return "expired";
    }, { queueTimeoutMs: 45_000 });
    const expiredAssertion = assert.rejects(
      expired,
      (error) => error?.name === "ModelRequestQueueTimeoutError",
    );
    queueClock.fire(queueClock.activeIds()[0]);
    await expiredAssertion;
    assert.equal(expiredStarted, false, "expired speculation must never consume a transport slot");
    const survivor = expiringPool.run(async () => "survivor", { demanded: true });
    releaseExpiringHead("head");
    await expiringHead;
    assert.equal(await survivor, "survivor", "queue drain continues after speculative expiry");
  }

  contract(
    typeof runModelResourceAttempts === "function",
    "model resources keep transient failures inside one Suspense result",
  );
  if (typeof runModelResourceAttempts === "function") {
    const retryClock = createFakeClock();
    let resourceRuns = 0;
    const recoveredResource = runModelResourceAttempts({
      attempts: 2,
      retryDelayMs: 600,
      run: async () => {
        resourceRuns += 1;
        if (resourceRuns === 1) throw new Error("transient edge miss");
        return "exact-model";
      },
      clock: retryClock.clock,
    });
    for (let turn = 0; turn < 6 && retryClock.activeIds().length === 0; turn++) {
      await Promise.resolve();
    }
    assert.equal(retryClock.activeIds().length, 1, "resource recovery waits on bounded backoff");
    retryClock.fire(retryClock.activeIds()[0]);
    assert.equal(await recoveredResource, "exact-model");
    assert.equal(resourceRuns, 2, "one transient resource failure gets exactly one internal retry");
  }

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
  /cancelActive: resetMeshoptParseGeneration/.test(loaders) &&
    /beginLoaderStream\(\)[\s\S]{0,500}beginParseGeneration\(\)/.test(loaders),
  "new Canvas lifecycle cancels the old worker before inheriting the global parse lane",
);
contract(
  /await parseScheduler\.waitForActiveGeneration\(\)/.test(loaders) &&
    /const data = await byteRequest;[\s\S]{0,180}const parseOwner = parseScheduler\.captureGeneration\(\)/.test(loaders) &&
    /if \(!parseOwner\.active \|\| !ACTIVE_MODEL_DEMANDS\.has\(url\)\) continue/.test(loaders) &&
    /queueParse\(\s*parseOwner,\s*url,/.test(loaders) &&
    /error instanceof ParseGenerationCancelledError\) continue/.test(loaders) &&
    !/ownerGeneration/.test(loaders),
  "late shared bytes release while parked and rejoin a live generation without poisoning cache",
);
contract(
  /RENDERER_PARSE_OWNERS = new WeakMap/.test(loaders) &&
    /if \(!RENDERER_PARSE_OWNERS\.has\(gl\)\)[\s\S]{0,120}RENDERER_PARSE_OWNERS\.set\(gl, parseScheduler\.captureGeneration\(\)\)/.test(loaders) &&
    /const parseOwner = RENDERER_PARSE_OWNERS\.get\(gl\)/.test(loaders) &&
    /endParseGeneration\(parseOwner\)/.test(loaders),
  "immutable renderer ownership prevents late old cleanup from cancelling its successor",
);
contract(
  /let managerActive = false/.test(loaders) &&
    /const startManagerItem = \(\)/.test(loaders) &&
    /const endManagerItem = \(\)/.test(loaders) &&
    /while \(!parseScheduler\.captureGeneration\(\)\.active\)[\s\S]{0,180}endManagerItem\(\);[\s\S]{0,180}await parseScheduler\.waitForActiveGeneration\(\)/.test(loaders) &&
    /await waitForLiveModelDemand\(\);[\s\S]{0,180}const byteRequest = fetchModelBytes/.test(loaders),
  "parked loader promises close global manager progress and reopen only on a live Canvas",
);
contract(
  /resetModelDemands\(\);[\s\S]{0,420}beginParseGeneration\(\)/.test(loaders) &&
    /if \(!owner\?\.active \|\| owner !== parseScheduler\.captureGeneration\(\)\) return/.test(loaders) &&
    /if \(!ACTIVE_MODEL_DEMANDS\.has\(url\)\)[\s\S]{0,180}await waitForModelDemand\(url\)/.test(loaders) &&
    /const data = await byteRequest;[\s\S]{0,180}if \(!parseOwner\.active \|\| !ACTIVE_MODEL_DEMANDS\.has\(url\)\) continue/.test(loaders) &&
    /noteModelDemand\(resource, RENDERER_PARSE_OWNERS\.get\(gl\)\);[\s\S]{0,120}useLoader\(IdleGLTFLoader, resource/.test(loaders),
  "parked resources resume only when the new renderer demands the same exact tier URL",
);
contract(
  /return \(\) => \{[\s\S]{0,180}if \(worldFinalizer === finalizer\) setWorldFinalizer\(null\);[\s\S]{0,120}if \(finalizedWorld === finalizer\) finalizedWorld = null;[\s\S]{0,260}revealFinalizing = null;/.test(loaders),
  "WarmScene unmount releases finalizer closures that retain the disposed renderer",
);
contract(
  /createMeshoptWorkerDecoder/.test(loaders) &&
    /MESHOPT_WORKER_COUNT = 2/.test(loaders) &&
    /MODEL_PARSE_TIMEOUT_MS = 15_000/.test(loaders) &&
    /decodeTimeoutMs: MODEL_PARSE_TIMEOUT_MS/.test(loaders) &&
    /onFallback: \(\) => \{[\s\S]{0,420}meshoptWorkersEnabled = false;[\s\S]{0,160}meshoptWorkerFallbackLatched = true;/.test(loaders) &&
    /return await parseOnce\(MeshoptDecoder\)/.test(loaders) &&
    !/configureMeshoptWorkerCount/.test(loaders),
  "meshopt uses two cancellable workers with an in-parser exact local fallback",
);
contract(
  /function parseCourtesyKey\(url: string\)/.test(loaders) &&
    /ROUTE_PARSE_BAY_BY_NAME/.test(loaders),
  "parse courtesy is scoped once per route bay rather than once per model or Canvas",
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
    /createRequestPool\(PREFETCH_CONCURRENCY\)/.test(loaders) &&
    /ROUTE_PREFETCH_MODELS\.map\(\(url\) => tierUrl\(url, lite\)\)/.test(loaders) &&
    /for \(const url of urls\)[\s\S]{0,220}prefetchModelBytes\(url\)/.test(loaders),
  "all route promises register synchronously behind a two-request transport pool",
);
contract(
  /const mountWorld = \(\) => \{[\s\S]{0,300}if \(!warmNear\) return;[\s\S]{0,300}preloadShopWorld/.test(walkthrough) &&
    !/mountWorld[\s\S]{0,500}stillFor\(\) >= 900/.test(walkthrough),
  "parked Canvas mounts on approach without a 900 ms stillness prerequisite",
);
contract(
  /POST_HERO_PRELOAD_TIMEOUT_MS[\s\S]{0,2200}preloadOpeningGarage/.test(walkthrough),
  "verified hero readiness starts exact route bytes before garage proximity",
);
contract(
  /const warmLeadPx = Math\.ceil\(Math\.max\(window\.innerHeight, 1\) \* 7\)/.test(walkthrough) &&
    /rootMargin: `\$\{warmLeadPx\}px 0px \$\{warmLeadPx\}px 0px`/.test(walkthrough) &&
    /window\.addEventListener\("resize", refreshViewportLeads\)/.test(walkthrough) &&
    !/visualViewport\?\.addEventListener\("resize", refreshViewportLeads\)/.test(walkthrough) &&
    /lockRunwayViewport\(\)/.test(walkthrough),
  "garage mount lead stays seven viewport heights through orientation, without iOS chrome remesure",
);
contract(
  /const drawLeadPx = Math\.ceil\(Math\.max\(window\.innerHeight, 1\) \* 1\.7\)/.test(walkthrough) &&
    /rootMargin: `\$\{drawLeadPx\}px 0px \$\{drawLeadPx\}px 0px`/.test(walkthrough) &&
    /window\.addEventListener\("resize", refreshViewportLeads\)/.test(walkthrough),
  "garage draw loop wakes before the 1.5-viewport handoff on portrait phones",
);
contract(
  /const verdictRef = useRef<Verdict>\("idle"\)/.test(walkthrough) &&
    /if \(verdictRef\.current !== "idle"\) return/.test(walkthrough) &&
    /verdictRef\.current = next/.test(walkthrough),
  "garage performance tier is latched once so orientation cannot invalidate a live Canvas",
);
contract(
  /resize=\{STABLE_CANVAS_RESIZE\}/.test(shopWorld) &&
    /lockRunwayViewport\(\)/.test(shopWorld),
  "shop canvas ignores scroll remesure and freezes runway span after settle",
);
contract(
  /<ShopWorld[\s\S]{0,220}revealed=\{worldReady\}/.test(walkthrough) &&
    /active=\{active && worldReady && uiOverlay === null\}/.test(walkthrough) &&
    /worldReady \? "opacity-0" : "opacity-100"/.test(walkthrough) &&
    /lit && warm && revealed \? "opacity-100" : "opacity-0"/.test(shopWorld),
  "partial shell/stations stay fully veiled until complete-route readiness",
);
contract(
  /REVEAL_PENDING\.size === 0[\s\S]{0,500}await finalizer\(\)[\s\S]{0,500}markWorldReady\(\)/.test(loaders),
  "complete route readiness submits a final full-composer frame before reveal",
);
const parkedOvenStart = loaders.indexOf("if (parkedNow() && root && composerTarget)");
const parkedOvenFirstWas = loaders.indexOf("const was = drawables.map", parkedOvenStart);
const parkedOvenSource = loaders.slice(
  parkedOvenStart,
  loaders.indexOf("const was = drawables.map", parkedOvenFirstWas + 1),
);
contract(
  (parkedOvenSource.match(/waitForReaderQuiet\(\)/g) ?? []).length === 1 &&
    /await waitForReaderQuiet\(\);\s*if \(stale\(\)\) return;\s*const was = drawables\.map/.test(parkedOvenSource),
  "parked oven pays one bounded courtesy before scene ownership, never per slice",
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
    /MODEL_REQUEST_TOTAL_TIMEOUT_MS = 60_000/.test(loaders) &&
    /MODEL_REQUEST_BR_BUDGET_MS = 30_000/.test(loaders) &&
    /loadModelRequestAttempt/.test(loaders) &&
    /file\.abort\(\)/.test(loaders) &&
    /return retry\(url, 2\)/.test(loaders),
  "model requests have bounded inactivity/hard timeouts, abort, and exact fallback retries",
);
contract(
  /MODEL_PREFETCH_QUEUE_TIMEOUT_MS = 45_000/.test(loaders) &&
    /if \(options\.demanded\) modelTransport\.demand\(cached\)/.test(loaders) &&
    /queueTimeoutMs: options\.demanded \? undefined : MODEL_PREFETCH_QUEUE_TIMEOUT_MS/.test(loaders) &&
    /demanded: true/.test(loaders),
  "mounted stations promote shared exact-byte promises ahead of stale speculative work",
);
contract(
  /MODEL_RESOURCE_ATTEMPTS = 2/.test(loaders) &&
    /runModelResourceAttempts\(\{[\s\S]{0,160}attempts: MODEL_RESOURCE_ATTEMPTS/.test(loaders) &&
    /MODEL_BOUNDARY_RETRIES = 1/.test(loaders) &&
    /MODEL_BOUNDARY_RETRY_DELAY_MS = 2_000/.test(loaders) &&
    /const MODEL_RECOVERIES = new Map<string, ModelRecovery>\(\)/.test(loaders) &&
    /if \(recovery\.timer\) return true;/.test(loaders) &&
    /useLoader\.clear\(IdleGLTFLoader, resource\)/.test(loaders) &&
    /resetModelRecoveries\(\)/.test(loaders),
  "transient model failures retry once per exact resource without clone races",
);
contract(
  /return await parseOnce\(activeMeshoptWorkerDecoder\(\)\)/.test(loaders) &&
    /if \(!executionOwner\.active\) throw new ParseGenerationCancelledError\(\)/.test(loaders) &&
    /disableMeshoptWorkers\(\);[\s\S]{0,420}return await parseOnce\(MeshoptDecoder\)/.test(loaders) &&
    !/onTimeout: disableMeshoptWorkers/.test(loaders) &&
    !/MODEL_PARSE_FALLBACK_TIMEOUT_MS/.test(loaders),
  "worker timeout continues inside one parser and stale generations settle before retry",
);
contract(
  /SHELL_FINALIZER_ATTEMPTS = 3/.test(loaders) &&
    /for \(let attempt = 1; attempt <= SHELL_FINALIZER_ATTEMPTS; attempt\+\+\)/.test(loaders) &&
    /await finalizer\(\)[\s\S]{0,240}finalizedWorld = finalizer;[\s\S]{0,160}reportWarm\("shell"\)/.test(loaders) &&
    /await wait\(SHELL_FINALIZER_RETRY_DELAY_MS \* attempt\)/.test(loaders),
  "a transient shell composer failure cannot permanently park the doorway",
);
contract(
  /const nextFrameWithin[\s\S]{0,420}window\.requestAnimationFrame\(finish\)[\s\S]{0,160}window\.setTimeout\(finish, timeoutMs\)/.test(loaders) &&
    /const nextUploadFrame = \(\) => nextFrameWithin\(\)/.test(loaders) &&
    /releaseOvenScene\(\);[\s\S]{0,100}await nextFrameWithin\(\)/.test(loaders) &&
    /const nextFrame = \(\) => nextFrameWithin\(\)/.test(loaders) &&
    (loaders.match(/window\.requestAnimationFrame/g) ?? []).length === 1,
  "Safari-suspended animation frames cannot strand texture or composer warm queues",
);
contract(
  /const PREFETCHED_ROUTE_URLS = new Set<string>\(\)/.test(loaders) &&
    /prefetchModelBytes\(url\)\.then\(\(\) => PREFETCHED_ROUTE_URLS\.add\(url\)\)/.test(loaders) &&
    !/PRELOADED_ROUTE_TIERS/.test(loaders),
  "failed early route requests remain eligible for a later preload retry",
);
contract(
  /STATION_READY_FAILSAFE_MS = 30_000/.test(loaders) &&
    /waitForWarmKey\(String\(station - 1\), 30000\)[\s\S]{0,180}armReadyFailsafe\(\)[\s\S]{0,100}await firstUse\(\)/.test(warmStationSource) &&
    /readyFailsafe[\s\S]{0,260}warm\.current = true;[\s\S]{0,120}reportWarm\(warmKey\)/.test(warmStationSource),
  "a loaded station bounds only its own driver first-use after its predecessor clears",
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
  await exerciseMeshoptWorkerCancellation();
}

if (failures.length > 0) {
  console.error("garage liveness contract: FAIL");
  for (const failure of failures) console.error(` - ${failure}`);
  process.exitCode = 1;
} else {
  console.log("garage liveness contract: PASS");
}
