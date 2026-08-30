import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [loaders, shopWorld, parseScheduler] = await Promise.all([
  readFile(new URL("../components/shop/Loaders.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/shop/ShopWorld.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/shop/parseScheduler.ts", import.meta.url), "utf8"),
]);
const parseQueue = loaders.slice(
  loaders.indexOf("function queueParse"),
  loaders.indexOf("class IdleGLTFLoader"),
);
const opening = loaders.slice(
  loaders.indexOf("const OPENING_MODELS"),
  loaders.indexOf("function useShopModel"),
);

assert.ok(
  /const MODEL_BYTE_CACHE = new Map<string, Promise<ArrayBuffer>>/.test(loaders) &&
    /function fetchModelBytes/.test(loaders),
  "Early garage requests must cache exact model bytes independently from glTF parsing.",
);
assert.ok(
  /createParseScheduler/.test(loaders) &&
    /waitForCourtesy: \(\) => untilIdle\(1200, true\)/.test(loaders) &&
    !/untilIdle/.test(parseQueue) &&
    /effectiveOwner\.courtesies\.get\(courtesyKey\)/.test(parseScheduler) &&
    /effectiveOwner\.courtesies\.set\(courtesyKey, courtesy\)/.test(parseScheduler),
  "Each route bay must share one visible-page courtesy instead of delaying every glTF parse.",
);
assert.ok(
  /const PREFETCH_CONCURRENCY = 2/.test(loaders) &&
    /createRequestPool\(PREFETCH_CONCURRENCY\)/.test(loaders) &&
    /for \(const url of urls\)/.test(opening) &&
    /prefetchModelBytes\(url\)/.test(opening) &&
    !/useLoader\.preload\(IdleGLTFLoader/.test(opening),
  "Every route byte promise must register immediately behind two lossless transport slots.",
);
assert.ok(
  /MODEL_REQUEST_TOTAL_TIMEOUT_MS = 60_000/.test(loaders) &&
    /MODEL_PREFETCH_QUEUE_TIMEOUT_MS = 45_000/.test(loaders) &&
    /MODEL_REQUEST_BR_BUDGET_MS = 30_000/.test(loaders) &&
    /const PREFETCHED_ROUTE_URLS = new Set<string>\(\)/.test(opening) &&
    !/PRELOADED_ROUTE_TIERS/.test(opening),
  "One slow model must have bounded queue/Brotli/total budgets and failed preloads must remain retryable.",
);
assert.ok(
  /M\.charger,[\s\S]*M\.camaro,[\s\S]*M\.pickup/.test(opening),
  "The visually critical vehicles must lead the lossless opening byte queue.",
);
assert.ok(
  !/let brTwin: boolean \| null/.test(loaders),
  "One transient Brotli-twin failure must not disable compressed delivery for every model.",
);
assert.ok(
  /const brDeadline = Math\.min\(deadline, Date\.now\(\) \+ MODEL_REQUEST_BR_BUDGET_MS\)/.test(loaders) &&
    /return await retry\(`\$\{url\}\.br`, 2, brDeadline\)/.test(loaders) &&
    /return retry\(url, 2\)/.test(loaders),
  "Transient edge misses must retry both the lossless Brotli twin and exact plain fallback once.",
);
assert.ok(
  /if \(options\.demanded\) modelTransport\.demand\(cached\)/.test(loaders) &&
    /demanded: options\.demanded \?\? false/.test(loaders) &&
    /queueTimeoutMs: options\.demanded \? undefined : MODEL_PREFETCH_QUEUE_TIMEOUT_MS/.test(loaders) &&
    /demanded: true/.test(loaders),
  "A mounted station must promote its shared exact-byte promise ahead of expendable prefetch work.",
);
assert.ok(
  /MODEL_RESOURCE_ATTEMPTS = 2/.test(loaders) &&
    /runModelResourceAttempts\(\{[\s\S]{0,160}attempts: MODEL_RESOURCE_ATTEMPTS/.test(loaders) &&
    /MODEL_BOUNDARY_RETRIES = 1/.test(loaders) &&
    /const MODEL_RECOVERIES = new Map<string, ModelRecovery>\(\)/.test(loaders) &&
    /if \(recovery\.timer\) return true;/.test(loaders) &&
    /useLoader\.clear\(IdleGLTFLoader, resource\)/.test(loaders),
  "A transient transport/parse rejection must not remain cached for the whole SPA visit.",
);
assert.ok(
  /function releaseModelBytes/.test(loaders) &&
    /finally[\s\S]{0,220}releaseModelBytes/.test(loaders),
  "Parsed GLBs must release their duplicate ArrayBuffer cache entry on every outcome.",
);
assert.ok(
  /this\.manager\.itemStart\(url\)/.test(loaders) &&
    /this\.manager\.itemEnd\(url\)/.test(loaders) &&
    /function reportOpeningModelParsed/.test(loaders) &&
    /full: new Set<string>\(\)/.test(loaders) &&
    /lite: new Set<string>\(\)/.test(loaders) &&
    /PARSED_OPENING_MODELS\[tier\]/.test(loaders) &&
    /seedOpeningProgress/.test(loaders) &&
    !/PARSED_OPENING_MODELS\.clear\(\)/.test(loaders) &&
    /reportOpeningModelParsed\(url\)/.test(loaders) &&
    !/completedShopItems/.test(shopWorld),
  "Cached byte consumers must still report balanced, shop-local parse progress to the elegant loader.",
);

console.log("model byte prefetch contract: PASS");
