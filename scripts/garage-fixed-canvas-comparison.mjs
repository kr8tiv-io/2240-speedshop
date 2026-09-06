import assert from "node:assert/strict";
import fs from "node:fs/promises";

const root = "output/playwright/garage-performance-2026-09-06";
const mean = values => values.reduce((sum, value) => sum + value, 0) / values.length;
const results = {};
const failures = [];
for (const [network, prefix] of [["unthrottled", "fixed-local"], ["fast4g", "fixed-4g"], ["desktop", "fixed-desktop"]]) {
  const check = (condition, message) => { if (!condition) failures.push({ profile: network, message }); };
  const runs = await Promise.all(["old-1", "new-1", "new-2", "old-2"].map(async suffix =>
    JSON.parse(await fs.readFile(`${root}/${prefix}-${suffix}/results.json`, "utf8"))));
  for (const run of runs) {
    assert.equal(run.status, "PASS");
    assert.equal(run.modelCoverage.garage, 71);
    assert.equal(run.modelCoverage.hero, 3);
    assert.deepEqual(run.gpu, runs[0].gpu);
    assert.deepEqual(run.profile, runs[0].profile);
    assert.deepEqual(run.networkConditions, runs[0].networkConditions);
    assert.deepEqual(run.officeTextures, runs[0].officeTextures, "Exact original image dimensions and texture settings");
    assert.deepEqual(run.verifiedModels.map(model => `${model.name}:${model.sha256}`).sort(),
      runs[0].verifiedModels.map(model => `${model.name}:${model.sha256}`).sort());
    assert.deepEqual(run.modelCoverage, runs[0].modelCoverage, "No model/transport removal or shelf substitution");
  }
  const before = [runs[0], runs[3]], after = [runs[1], runs[2]];
  const overview = batch => ({
    revealMs: mean(batch.map(run => run.worldVisibleAt)),
    heroCanvasMs: mean(batch.map(run => run.heroReadyAt)),
    heroSceneReadyMs: mean(batch.map(run => run.metrics.heroStages.find(entry => entry.stage === "true").at)),
    startupLongTaskMs: mean(batch.map(run => run.startupLongTaskSummary.totalMs)),
    entryScrollP95Ms: mean(batch.map(run => run.frameSummary["entry-scroll"].p95Ms)),
    entryScrollP99Ms: mean(batch.map(run => run.frameSummary["entry-scroll"].p99Ms)),
    entryScrollMaxMs: mean(batch.map(run => run.frameSummary["entry-scroll"].maxMs)),
    cls: mean(batch.map(run => run.metrics.cls)),
  });
  const old = overview(before), candidate = overview(after);
  check(Math.max(...after.map(run => run.worldVisibleAt)) < Math.min(...before.map(run => run.worldVisibleAt)),
    "Both candidates must reveal the complete garage before both baselines");
  if (network !== "desktop") check(after.every(run => run.mountGate.delayMs < 1000), "Continuous scroll cannot defer initial canvas measurement");
  check(candidate.heroSceneReadyMs < old.heroSceneReadyMs + 300, "No material opening-scene delay");
  check(candidate.startupLongTaskMs < old.startupLongTaskMs + 100, "No material increase in startup long-task time");
  check(candidate.entryScrollP95Ms <= old.entryScrollP95Ms + 1, "Preserve normal entry-scroll frame cadence");
  check(candidate.entryScrollMaxMs <= old.entryScrollMaxMs + 50, "Do not create a new major entry-scroll stall");
  check(candidate.cls <= old.cls + 0.01, "No layout stability regression");
  results[network] = { old, candidate, improvementMs: old.revealMs - candidate.revealMs,
    improvementPercent: (old.revealMs - candidate.revealMs) / old.revealMs * 100,
    runs: runs.map(run => ({ label: run.label, release: run.release, revealMs: run.worldVisibleAt,
      mountGate: run.mountGate, entryScroll: run.frameSummary["entry-scroll"] })) };
}
const report = { status: failures.length ? "HOLD" : "PASS", checkedAt: new Date().toISOString(), failures,
  scope: "Cold Chromium, Radeon 740M, 390x844 mobile emulation and 1440x900 desktop, six-second continuous entry scroll, ABBA order per profile/network. Not physical Apple or field metrics. All model bytes and existing renderer settings preserved.", results };
await fs.writeFile("output/garage-fixed-canvas-comparison.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exitCode = 1;
