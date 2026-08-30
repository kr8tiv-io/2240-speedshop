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
    /owner\.courtesy \?\?=/.test(parseScheduler),
  "A Canvas generation must share one visible-page courtesy instead of delaying every glTF parse.",
);
assert.ok(
  /const PREFETCH_CONCURRENCY = 2/.test(opening) &&
    /prefetchModelBytes\(url\)/.test(opening) &&
    !/useLoader\.preload\(IdleGLTFLoader/.test(opening),
  "Opening preload must fetch two lossless byte streams at a time without parsing them.",
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
  /for \(let attempt = 0; attempt < 2; attempt\+\+\)/.test(loaders),
  "A transient edge miss should retry the lossless Brotli twin once before falling back to heavier bytes.",
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
