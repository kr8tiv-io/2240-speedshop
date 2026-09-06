import assert from "node:assert/strict";
import fs from "node:fs/promises";
const root = "output/playwright/garage-performance-2026-09-06";
const mean = values => values.reduce((sum, n) => sum + n, 0) / values.length;
const report = { checkedAt: new Date().toISOString(), status: "PASS", profiles: {},
  scope: "Cold hardware-backed Chromium ABBA. Timing observations, not a whole-site speed guarantee or physical Apple validation. Fidelity and curtain behavior are separate assertions." };
for (const group of ["4g", "desktop", "local"]) {
  const runs = await Promise.all(["old-1", "new-1", "new-2", "old-2"].map(async suffix =>
    JSON.parse(await fs.readFile(`${root}/curtain-${group}-${suffix}/results.json`, "utf8"))));
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
    runs: runs.map(r => ({ label: r.label, release: r.release, revealMs: r.worldVisibleAt,
      stations: r.stations.length, railClicks: r.railClicks?.length || 0 })) };
  if (group !== "4g") assert.equal(runs[2].stations.length, 7, "Full original tour passes");
  if (group === "desktop") assert.equal(runs[2].railClicks.length, 7);
}
const parked = JSON.parse(await fs.readFile("output/playwright/hero-curtain-green/results.json", "utf8"));
assert.equal(parked.status, "PASS");
assert.equal(parked.cases.length, 14);
for (const row of parked.cases) {
  assert.equal(row.sameScene, true);
  assert.equal(row.contexts, 1);
  if (!row.expectedVisible) assert.equal(row.drawSubmissions, 0);
}
report.curtainCases = parked.cases.length;
await fs.writeFile("output/garage-curtain-comparison.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
