import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const pkg = JSON.parse(await readFile(new URL("package.json", root), "utf8"));
const deploy = await readFile(new URL("scripts/deploy-combined.ps1", root), "utf8");

assert.match(
  pkg.scripts?.build ?? "",
  /node --use-system-ca[\s\S]*next build --webpack$/,
  "Production builds must use webpack's shared chunks until Turbopack deduplicates the three lazy Three.js graphs.",
);
assert.match(
  deploy,
  /pnpm exec next build --webpack/,
  "The Hostinger export must use the measured shared-chunk build too.",
);
assert.match(
  deploy,
  /NODE_OPTIONS[\s\S]*--use-system-ca[\s\S]*pnpm exec next build --webpack/,
  "The Windows export must keep TLS verification while trusting its system CA store.",
);
assert.match(
  deploy,
  /\.deploy-current-static\.txt[\s\S]*\.deploy-current-shelves\.txt[\s\S]*preserving previous immutable runtime\/model generation[\s\S]*Copy-Item \(Join-Path \$out "\*"\) \$Repo -Recurse -Force[\s\S]*restoring previous immutable runtime\/model generation/,
  "Hostinger deploys must overlap one complete hashed runtime and model generation so propagation cannot strand the garage.",
);

console.log("bundle mode contract: PASS");
