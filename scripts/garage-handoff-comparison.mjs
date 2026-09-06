import assert from "node:assert/strict";
import fs from "node:fs/promises";

const root = "output/playwright/garage-performance-2026-09-06";
const mean = values => values.reduce((sum, value) => sum + value, 0) / values.length;
const report = { checkedAt: new Date().toISOString(), status: "HOLD", profiles: {},
  scope: "Sequential cold hardware-backed Chromium ABBA. Original media and rendering settings must match. Not physical Apple, field metrics, or a whole-site speed guarantee.",
  excluded: "Initial handoff-4g-old-2 and handoff-desktop-old-1 overlapped for four seconds. The initial series is retained as diagnostic evidence, not used in this comparison." };
const all = [];
for (const group of ["4g", "desktop"]) {
  const runs = await Promise.all(["old-1", "new-1", "new-2", "old-2"].map(async suffix =>
    JSON.parse(await fs.readFile(`${root}/handoff2-${group}-${suffix}/results.json`, "utf8"))));
  all.push(...runs);
  for (const run of runs) {
    assert.equal(run.status, "PASS");
    assert.equal(run.modelCoverage.garage, 71);
    assert.equal(run.modelCoverage.hero, 3);
    for (const field of ["gpu", "profile", "networkConditions", "officeTextures", "modelCoverage"])
      assert.deepEqual(run[field], runs[0][field], `Keep ${field} identical`);
    assert.deepEqual(run.verifiedModels.map(m => `${m.name}:${m.sha256}`).sort(),
      runs[0].verifiedModels.map(m => `${m.name}:${m.sha256}`).sort());
  }
  const before = [runs[0], runs[3]], after = [runs[1], runs[2]];
  const overview = batch => ({ revealMs: mean(batch.map(r => r.worldVisibleAt)),
    entryP95Ms: mean(batch.map(r => r.frameSummary["entry-scroll"].p95Ms)),
    entryP99Ms: mean(batch.map(r => r.frameSummary["entry-scroll"].p99Ms)),
    startupLongTaskMs: mean(batch.map(r => r.startupLongTaskSummary.totalMs)),
    cls: mean(batch.map(r => r.metrics.cls)) });
  report.profiles[group] = { before: overview(before), after: overview(after),
    revealDeltaMs: overview(after).revealMs - overview(before).revealMs,
    consistentlyEarlier: Math.max(...after.map(r => r.worldVisibleAt)) < Math.min(...before.map(r => r.worldVisibleAt)),
    runs: runs.map(r => ({ label: r.label, release: r.release, revealMs: r.worldVisibleAt,
      startedAt: r.startedAt, finishedAt: r.finishedAt,
      rendererLog: r.consoleLog.find(log => /renderer created/.test(log.text))?.text,
      curtain: r.metrics.curtainStages })) };
}
all.sort((a, b) => Date.parse(a.startedAt) - Date.parse(b.startedAt));
for (let i = 1; i < all.length; i++)
  assert.ok(Date.parse(all[i].startedAt) > Date.parse(all[i - 1].finishedAt), "GPU timing runs must never overlap");
const red = JSON.parse(await fs.readFile(`${root}/handoff-measure-red/results.json`, "utf8"));
const green = JSON.parse(await fs.readFile(`${root}/handoff-measure-green/results.json`, "utf8"));
assert.equal(red.status, "FAIL");
assert.ok(red.curtainMountGate.delayMs >= 500);
assert.equal(green.status, "PASS");
assert.ok(green.curtainMountGate.delayMs < 500);
report.regression = { before: red.curtainMountGate, after: green.curtainMountGate };
report.status = Object.values(report.profiles).every(p => p.consistentlyEarlier && p.after.entryP95Ms <= p.before.entryP95Ms + .5) ? "PASS" : "HOLD";
report.reason = report.status === "PASS" ? "Consistently earlier complete reveal with normal entry cadence retained; lifecycle checks still required before release."
  : "Removing scroll measurement starvation did not produce a consistent complete-scene speed win across both profiles. Do not deploy as a loading optimization.";
await fs.writeFile("output/garage-handoff-comparison.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (report.status === "HOLD") process.exitCode = 1;
