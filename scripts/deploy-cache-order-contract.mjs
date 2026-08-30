import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const deploy = await readFile(
  new URL("./deploy-combined.ps1", import.meta.url),
  "utf8",
);
const purgeSource = await readFile(
  new URL("./purge-hostinger-cache.mjs", import.meta.url),
  "utf8",
);

const markerWrite = deploy.indexOf("2240-release.txt");
const push = deploy.indexOf("git -C $Repo push");
const published = deploy.indexOf("Wait-ForPublishedRelease", push);
const purge = deploy.indexOf("purge-hostinger-cache.mjs", published);
const liveHtml = deploy.indexOf("Wait-ForLiveHtmlRelease", purge);
const liveAssets = deploy.indexOf("Assert-LiveReleaseAssets", liveHtml);

assert.ok(markerWrite >= 0, "Every export needs a unique live release marker.");
assert.ok(
  push >= 0 && published > push && purge > published,
  "Deployment must observe the new Hostinger release before purging caches.",
);
assert.ok(
  liveHtml > purge && liveAssets > liveHtml,
  "Deployment success must require exact root HTML and critical asset verification after cache handling.",
);
assert.match(deploy, /Cache-Control" = "no-cache"/);
assert.match(deploy, /throw "Hostinger did not publish release/);
assert.match(deploy, /meta name=.2240-release/);
assert.match(deploy, /\.deploy-current-shelves\.txt/);
assert.match(deploy, /models-opt-|models-mobile-|models[\\/]hero-/);
assert.match(deploy, /purge-hostinger-cache\.mjs --required/);
assert.match(deploy, /data-shop-world/);
assert.match(deploy, /garageChunk/);
assert.doesNotMatch(deploy, /runtimeAssets[\s\S]{0,180}First 3/);
assert.match(deploy, /if \(Test-Path -LiteralPath \$target\) \{ continue \}/);

assert.match(purgeSource, /AbortSignal\.timeout\(timeoutMs\)/);
assert.match(purgeSource, /status === 429 \|\| response\.status >= 500/);
assert.match(purgeSource, /process\.argv\.includes\("--required"\)/);

const { purgeHostingerCache } = await import(
  new URL("./purge-hostinger-cache.mjs", import.meta.url),
);
let calls = 0;
let delays = 0;
const result = await purgeHostingerCache({
  env: {
    HOSTINGER_API_TOKEN: "secret",
    HOSTINGER_USERNAME: "u2240",
    HOSTINGER_DOMAIN: "example.test",
  },
  fetchImpl: async (_url, options) => {
    calls += 1;
    assert.ok(options.signal, "Each API request must have a timeout signal.");
    return calls === 1
      ? { ok: false, status: 503, headers: new Headers() }
      : { ok: true, status: 200, headers: new Headers() };
  },
  sleep: async () => {
    delays += 1;
  },
  random: () => 0,
  log: () => {},
});
assert.equal(result.status, "purged");
assert.equal(calls, 2, "A transient Hostinger failure should be retried.");
assert.equal(delays, 1);

console.log("deploy cache order contract: PASS");
