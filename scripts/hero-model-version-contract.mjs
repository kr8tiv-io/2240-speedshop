import fs from "node:fs";
import assert from "node:assert/strict";

const versioner = fs.readFileSync(new URL("./model-version.js", import.meta.url), "utf8");
const config = fs.readFileSync(new URL("../next.config.ts", import.meta.url), "utf8");
const hero = fs.readFileSync(new URL("../components/home/HeroScene.tsx", import.meta.url), "utf8");
const deploy = fs.readFileSync(new URL("./prepare-deploy.js", import.meta.url), "utf8");
const precompress = fs.readFileSync(new URL("./precompress.js", import.meta.url), "utf8");
const deployCommand = fs.readFileSync(new URL("./deploy-combined.ps1", import.meta.url), "utf8");

assert.match(versioner, /function heroVersion\(/, "hero content hash function missing");
assert.match(versioner, /models[\\/]hero/, "hero hash does not read the hero shelf");
assert.match(versioner, /module\.exports\.heroVersion\s*=\s*heroVersion/, "hero hash is not exported");
assert.match(
  versioner,
  /name\.endsWith\("\.glb\.br"\)/,
  "Content-addressed model shelves must include the exact Brotli transport bytes in their hash.",
);
assert.match(config, /NEXT_PUBLIC_HERO_MODELS_VERSION/, "hero hash is not compiled into export builds");
assert.match(hero, /NEXT_PUBLIC_HERO_MODELS_VERSION/, "HeroScene does not consume the compiled hero hash");
assert.match(hero, /hero-\$\{HERO_MODELS_VERSION\}/, "HeroScene URL is not content-addressed");
assert.match(
  hero,
  /const HERO_MODEL_EXTENSION = HERO_MODELS_VERSION \? "\.glb\.br" : "\.glb"/,
  "export hero URLs do not request their Brotli twins directly",
);
assert.match(deploy, /hero-\$\{HERO_VERSION\}/, "deploy does not stamp the hero directory");
assert.match(deploy, /renameSync\(HERO_FROM, HERO_TO\)/, "deploy does not atomically rename the hero shelf");
assert.match(precompress, /models[\\/]hero/, "hero shelf is missing Brotli transport twins");
assert.match(
  fs.readFileSync(new URL("./serve-export.mjs", import.meta.url), "utf8"),
  /"Content-Encoding": "br"/,
  "static export verifier does not emulate Hostinger's Brotli response",
);
assert.ok(
  deployCommand.indexOf("node scripts/precompress.js") < deployCommand.indexOf("pnpm exec next build"),
  "precompression must run before export copies public assets into out/",
);

console.log("hero model version contract: PASS");
