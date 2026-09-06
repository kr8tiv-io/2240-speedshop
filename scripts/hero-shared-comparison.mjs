import assert from "node:assert/strict";
import fs from "node:fs/promises";

const root = "output/playwright/garage-performance-2026-09-06";
const oldRelease = "f33a4109f9ed40f4a730339010d3a6b1";
const newRelease = process.env.QA_CANDIDATE_RELEASE;
const prefix = process.env.QA_COMPARISON_PREFIX || "hero-shared-stage";
assert.match(newRelease || "", /^[a-f0-9]{32}$/);
assert.match(prefix, /^[a-z0-9-]+$/);
const mean = values => values.reduce((a, b) => a + b, 0) / values.length;
const sceneReady = run => { const ready = run.metrics.heroStages.find(s => s.stage === "true"); assert.ok(ready); return ready.at; };
const all = [];
const report = { checkedAt: new Date().toISOString(), status: "HOLD", profiles: {},
  scope: "Sequential cold desktop and phone Fast 4G ABBA. Preserve average actual hero-scene readiness and complete garage reveal within 3%, entry p95 within 0.5 ms. Exact lamp first-use proof is a separate diagnostic gate. No field or physical Apple claim." };
for (const group of ["desktop", "4g"]) {
  const runs = [];
  for (const suffix of ["old-1", "new-1", "new-2", "old-2"]) {
    const run = JSON.parse(await fs.readFile(`${root}/${prefix}-${group}-${suffix}/results.json`, "utf8"));
    assert.equal(run.status, "PASS"); assert.equal(run.diagnosticOnly, undefined);
    assert.equal(run.release, suffix.startsWith("old") ? oldRelease : newRelease);
    assert.equal(run.transportSlots.peak, group === "desktop" ? 2 : 4);
    assert.equal(run.modelCoverage.garage, 71); assert.equal(run.modelCoverage.hero, 3);
    if (runs.length) {
      for (const key of ["gpu", "profile", "networkConditions", "officeTextures", "modelCoverage"]) assert.deepEqual(run[key], runs[0][key]);
      assert.deepEqual(run.verifiedModels.map(m => `${m.name}:${m.sha256}`).sort(), runs[0].verifiedModels.map(m => `${m.name}:${m.sha256}`).sort());
    }
    runs.push(run); all.push(run);
  }
  const summarize = batch => ({ heroSceneReadyMs: mean(batch.map(sceneReady)),
    revealMs: mean(batch.map(r => r.worldVisibleAt)), entryP95Ms: mean(batch.map(r => r.frameSummary["entry-scroll"].p95Ms)),
    entryP99Ms: mean(batch.map(r => r.frameSummary["entry-scroll"].p99Ms)), entryMaxMs: mean(batch.map(r => r.frameSummary["entry-scroll"].maxMs)),
    startupLongTaskMs: mean(batch.map(r => r.startupLongTaskSummary.totalMs)),
    accumulatedLayoutShift: mean(batch.map(r => r.metrics.cls)) });
  const before = summarize([runs[0], runs[3]]), after = summarize([runs[1], runs[2]]);
  const gate = after.heroSceneReadyMs <= before.heroSceneReadyMs * 1.03 && after.revealMs <= before.revealMs * 1.03 && after.entryP95Ms <= before.entryP95Ms + .5;
  assert.equal(runs[2].stations.length, 7);
  if (group === "desktop") assert.equal(runs[2].railClicks.length, 7);
  report.profiles[group] = { before, after, gate, heroDeltaMs: after.heroSceneReadyMs - before.heroSceneReadyMs,
    revealDeltaMs: after.revealMs - before.revealMs, runs: runs.map(r => ({ label: r.label, release: r.release,
      startedAt: r.startedAt, finishedAt: r.finishedAt, heroSceneReadyMs: sceneReady(r), revealMs: r.worldVisibleAt })) };
}
all.sort((a, b) => Date.parse(a.startedAt) - Date.parse(b.startedAt));
for (let i = 1; i < all.length; i++) assert.ok(Date.parse(all[i].startedAt) > Date.parse(all[i - 1].finishedAt), "Never overlap GPU comparisons");
report.status = Object.values(report.profiles).every(p => p.gate) ? "PASS" : "HOLD";
await fs.writeFile(`output/${prefix}-comparison.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (report.status !== "PASS") process.exitCode = 1;
