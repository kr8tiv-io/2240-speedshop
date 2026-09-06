import assert from "node:assert/strict";
import fs from "node:fs/promises";

const root = "output/playwright/garage-performance-2026-09-06";
const mean = values => values.reduce((sum, value) => sum + value, 0) / values.length;
const results = {};
for (const [network, prefix] of [["fast4g", "packets-abba-v3"], ["unthrottled", "packets-local"]]) {
  const runs = await Promise.all(["old-1", "new-1", "new-2", "old-2"].map(async suffix => JSON.parse(await fs.readFile(`${root}/${prefix}-${suffix}/results.json`, "utf8"))));
  for (const run of runs) {
    assert.equal(run.status, "PASS");
    assert.equal(run.modelCoverage.garage, 71); assert.equal(run.modelCoverage.hero, 3);
    assert.equal(run.gpu.unmaskedRenderer, runs[0].gpu.unmaskedRenderer);
    assert.deepEqual(run.profile, runs[0].profile);
    assert.deepEqual(run.networkConditions, runs[0].networkConditions);
    assert.deepEqual(run.officeTextures, runs[0].officeTextures, "Original photo dimensions and texture settings remain identical");
    assert.deepEqual(run.verifiedModels.map(model => `${model.name}:${model.sha256}`).sort(), runs[0].verifiedModels.map(model => `${model.name}:${model.sha256}`).sort());
  }
  const before = [runs[0], runs[3]], after = [runs[1], runs[2]];
  const overview = batch => ({ revealMs: mean(batch.map(run => run.worldVisibleAt)), heroMs: mean(batch.map(run => run.heroReadyAt)), startupLongTaskMs: mean(batch.map(run => run.metrics.longTasks.filter(task => task.startTime < run.worldVisibleAt).reduce((sum, task) => sum + task.duration, 0))), cls: mean(batch.map(run => run.metrics.cls)), modelTransports: mean(batch.map(run => run.modelCoverage.individualRequests + run.modelCoverage.packetRequests)) });
  const old = overview(before), current = overview(after);
  results[network] = { old, candidate: current, improvementMs: old.revealMs - current.revealMs, improvementPercent: (old.revealMs - current.revealMs) / old.revealMs * 100, runs: runs.map(run => ({ label: run.label, revealMs: run.worldVisibleAt, heroMs: run.heroReadyAt, release: run.release })) };
}
assert.ok(results.fast4g.improvementMs > 0, "Latency-limited full-page loading must improve");
assert.ok(Math.max(...results.fast4g.runs.filter(run => run.label.includes("new")).map(run => run.revealMs)) < Math.min(...results.fast4g.runs.filter(run => run.label.includes("old")).map(run => run.revealMs)), "Both candidates must beat both baselines");
assert.ok(results.unthrottled.improvementMs > -250, "No material unthrottled startup regression beyond measured 250 ms baseline spread");
for (const comparison of Object.values(results)) {
  assert.ok(comparison.candidate.heroMs - comparison.old.heroMs < 100, "Opening hero timing remains within 100 ms");
  assert.ok(comparison.candidate.cls <= comparison.old.cls + 0.01, "No layout stability regression");
}
const report = { status: "PASS", checkedAt: new Date().toISOString(), scope: "Cold-cache Chromium mobile emulation on Radeon 740M; 6-second controlled entry scroll; original-byte response capture identical in old/new tests. Not physical Apple or production field metrics.", results };
await fs.writeFile("output/model-packet-comparison.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
