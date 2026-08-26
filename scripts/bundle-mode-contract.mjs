import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const pkg = JSON.parse(await readFile(new URL("package.json", root), "utf8"));
const deploy = await readFile(new URL("scripts/deploy-combined.ps1", root), "utf8");

assert.match(
  pkg.scripts?.build ?? "",
  /next build --webpack$/,
  "Production builds must use webpack's shared chunks until Turbopack deduplicates the three lazy Three.js graphs.",
);
assert.match(
  deploy,
  /pnpm exec next build --webpack/,
  "The Hostinger export must use the measured shared-chunk build too.",
);

console.log("bundle mode contract: PASS");
