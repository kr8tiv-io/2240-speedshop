import assert from "node:assert/strict";
import fs from "node:fs/promises";
const root = "output/playwright/garage-performance-2026-09-06";
const prefix = process.env.QA_COMPARISON_PREFIX || "transport";
assert.match(prefix, /^[a-z0-9-]+$/, "Comparison labels stay within the report directory");
const policy = process.env.QA_COMPARISON_POLICY || "all-tiers";
assert.ok(["all-tiers", "lite-only"].includes(policy), "Only named transport experiments may be compared");
const expectedCandidateSlots = group => policy === "lite-only" && group === "desktop" ? 2 : 4;
const mean = rows => rows.reduce((a, b) => a + b, 0) / rows.length;
const report = { checkedAt: new Date().toISOString(), policy, profiles: {}, status: "HOLD",
  scope: "Sequential cold Chromium ABBA on Radeon 740M. Fast 4G must have nonoverlapping earlier reveal; other profiles must retain mean reveal within 3% and entry p95 within 0.5 ms. These are experiment gates, not field performance guarantees." };
const all = [];
for (const group of ["4g", "desktop", "local"]) {
  const runs = await Promise.all(["old-1", "new-1", "new-2", "old-2"].map(async suffix =>
    JSON.parse(await fs.readFile(`${root}/${prefix}-${group}-${suffix}/results.json`, "utf8"))));
  all.push(...runs);
  for (const [index, run] of runs.entries()) {
    assert.equal(run.status, "PASS");
    assert.equal(run.diagnosticOnly, undefined, "Do not benchmark timer/CPU probes");
    assert.equal(run.transportSlots.peak, index === 0 || index === 3 ? 2 : expectedCandidateSlots(group));
    assert.equal(run.modelCoverage.garage, 71); assert.equal(run.modelCoverage.hero, 3);
    for (const field of ["gpu", "profile", "networkConditions", "officeTextures", "modelCoverage"])
      assert.deepEqual(run[field], runs[0][field], `No change to ${field}`);
    assert.deepEqual(run.verifiedModels.map(m => `${m.name}:${m.sha256}`).sort(),
      runs[0].verifiedModels.map(m => `${m.name}:${m.sha256}`).sort());
  }
  const before = [runs[0], runs[3]], after = [runs[1], runs[2]];
  const overview = batch => ({ revealMs: mean(batch.map(r => r.worldVisibleAt)),
    entryP95Ms: mean(batch.map(r => r.frameSummary["entry-scroll"].p95Ms)),
    entryP99Ms: mean(batch.map(r => r.frameSummary["entry-scroll"].p99Ms)),
    startupLongTaskMs: mean(batch.map(r => r.startupLongTaskSummary.totalMs)),
    lastModelByteMs: mean(batch.map(r => Math.max(...r.transportSlots.resources.map(i => i.end)))),
    cls: mean(batch.map(r => r.metrics.cls)) });
  const old = overview(before), next = overview(after);
  const consistentlyEarlier = Math.max(...after.map(r => r.worldVisibleAt)) < Math.min(...before.map(r => r.worldVisibleAt));
  const gate = (group === "4g" ? consistentlyEarlier : next.revealMs <= old.revealMs * 1.03) && next.entryP95Ms <= old.entryP95Ms + .5;
  report.profiles[group] = { before: old, after: next, consistentlyEarlier, gate,
    revealDeltaMs: next.revealMs - old.revealMs,
    runs: runs.map(r => ({ label: r.label, release: r.release, revealMs: r.worldVisibleAt, peakTransfers: r.transportSlots.peak,
      startedAt: r.startedAt, finishedAt: r.finishedAt, stations: r.stations.length, railClicks: r.railClicks?.length || 0 })) };
  if (group !== "4g") assert.equal(runs[2].stations.length, 7);
  if (group === "desktop") assert.equal(runs[2].railClicks.length, 7);
}
all.sort((a, b) => Date.parse(a.startedAt) - Date.parse(b.startedAt));
for (let i = 1; i < all.length; i++) assert.ok(Date.parse(all[i].startedAt) > Date.parse(all[i - 1].finishedAt), "No overlapping GPU benchmarks");
report.status = Object.values(report.profiles).every(p => p.gate) ? "PASS" : "HOLD";
await fs.writeFile(prefix === "transport" ? "output/garage-transport-window-comparison.json" : `output/${prefix}-comparison.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (report.status === "HOLD") process.exitCode = 1;
