import assert from "node:assert/strict";
import fs from "node:fs/promises";
const label = process.env.QA_LABEL || "prepare-waits-phone4g";
const run = JSON.parse(await fs.readFile(`output/playwright/garage-performance-2026-09-06/${label}/results.json`, "utf8"));
assert.equal(run.status, "PASS");
assert.ok(run.diagnosticOnly && run.waitProfile.length > 0);
assert.equal(run.modelCoverage.garage, 71);
const rendererAt = Number(run.consoleLog.find(log => /renderer created/.test(log.text)).text.match(/@(\d+)/)[1]);
const readyAt = run.metrics.stages.find(stage => stage.stage === "world").at;
const models = run.metrics.resources.filter(r => /\/(?:models-(?:opt|mobile)-[^/]+\/.*\.glb(?:\.br)?|model-packets\/.*\.bin\.br)$/.test(new URL(r.name).pathname));
const settle = run.waitProfile.find(row => row.delay === 70 && row.fired);
const chunk = settle.stack.match(/https?:\/\/[^\s)]+\.js/)[0];
const shopWaits = run.waitProfile.filter(row => row.stack.includes(chunk) && row.fired && row.scheduled >= rendererAt && row.scheduled < readyAt);
const unionDuration = rows => {
  const intervals = rows.map(row => [Math.max(row.scheduled, rendererAt), Math.min(row.fired, readyAt)]).sort((a, b) => a[0] - b[0]);
  let total = 0, end = rendererAt;
  for (const [start, finish] of intervals) { if (finish > end) { total += finish - Math.max(start, end); end = finish; } }
  return total;
};
const report = { label, release: run.release, diagnosticOnly: true,
  caveat: "Stack capture adds overhead. Timer sums overlap, are not CPU execution time and do not individually prove the critical path. Resource completion is not decoded/GPU readiness.",
  rendererAt, readyAt, fullyVisibleAt: run.worldVisibleAt,
  lastModelByteAt: Math.max(...models.map(r => r.responseEnd)),
  garageEncodedBytes: models.reduce((sum, row) => sum + row.encodedBodySize, 0),
  waitsByDelay: Object.fromEntries([...new Set(shopWaits.map(row => row.delay))].sort((a, b) => a - b).map(delay => {
    const rows = shopWaits.filter(row => row.delay === delay);
    return [delay, { count: rows.length, summedWallMs: rows.reduce((sum, row) => sum + row.fired - row.scheduled, 0), unionWallMs: unionDuration(rows) }];
  })),
  allWaitUnionMs: unionDuration(shopWaits),
  lateModels: [...models].sort((a, b) => b.responseEnd - a.responseEnd).slice(0, 8).map(row => ({ file: row.name.split("/").at(-1), start: row.startTime, end: row.responseEnd, encodedBytes: row.encodedBodySize })) };
await fs.writeFile("output/garage-preparation-waits.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
