import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const loaders = await readFile(
  new URL("../components/shop/Loaders.tsx", import.meta.url),
  "utf8",
);

const begin = loaders.slice(
  loaders.indexOf("export function beginLoaderStream"),
  loaders.indexOf("export function highestContiguousWarmStation"),
);
const queue = loaders.slice(
  loaders.indexOf("function warmThroughComposer"),
  loaders.indexOf("function firstUseKey"),
);
const paced = loaders.slice(
  loaders.indexOf("async function pacedWarm"),
  loaders.indexOf("export function StationBundle"),
);
const subtree = loaders.slice(
  loaders.indexOf("async function warmTextures"),
  loaders.indexOf("type ComposerHandle"),
);
const station = loaders.slice(
  loaders.indexOf("export function StationBundle"),
  loaders.indexOf("export function WarmScene"),
);
const shellHelpers = loaders.slice(
  loaders.indexOf("async function warmComposerPrograms"),
  loaders.indexOf("function warmThroughComposer"),
);

assert.ok(
  /loaderGeneration\s*\+=\s*1/.test(begin) &&
    /warmQueue\s*=\s*Promise\.resolve\(\)/.test(begin),
  "A new garage Canvas must invalidate the previous generation and own a fresh warm queue.",
);
assert.ok(
  /const generation = loaderGeneration/.test(queue) &&
    /pacedWarm\(node, label, root, generation\)/.test(queue),
  "Every queued composer warm must capture the Canvas generation that created it.",
);
assert.ok(
  /const stale = \(\) => generation !== loaderGeneration/.test(paced) &&
    (paced.match(/if \(stale\(\)\)/g) ?? []).length >= 6,
  "Long paced warm loops must repeatedly abandon work owned by a superseded Canvas.",
);
assert.ok(
  /async function warmTextures[\s\S]*isStale: \(\) => boolean/.test(subtree) &&
    /async function warmSubtree[\s\S]*isStale: \(\) => boolean/.test(subtree) &&
    (subtree.match(/if \(isStale\(\)\) return/g) ?? []).length >= 6,
  "Texture upload and subtree compile must stop at async boundaries after a Canvas is superseded.",
);
assert.ok(
  /const generation = loaderGeneration/.test(station) &&
    /const stale = \(\) => dead \|\| generation !== loaderGeneration/.test(station) &&
    /warmSubtree\(gl, node, camera, scene, stale\)[\s\S]{0,900}if \(stale\(\)\) return;[\s\S]{0,900}openGate\(station \+ 2\)/.test(station),
  "A completed warm owned by an old StationBundle must never unlock the fresh stream.",
);
assert.ok(
  /async function warmComposerPrograms[\s\S]*isStale: \(\) => boolean/.test(shellHelpers) &&
    /async function primeEnvironment[\s\S]*isStale: \(\) => boolean/.test(shellHelpers) &&
    (shellHelpers.match(/if \(isStale\(\)\) return/g) ?? []).length >= 5,
  "Composer discovery and environment capture must stop touching an obsolete shell renderer.",
);

console.log("loader generation contract: PASS");
