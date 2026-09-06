import assert from "node:assert/strict";
import fs from "node:fs/promises";
const root = "output/playwright/garage-performance-2026-09-06";
const runs = await Promise.all(["old-1", "new-1", "new-2", "old-2"].map(async suffix =>
  JSON.parse(await fs.readFile(`${root}/photos-4g-${suffix}/results.json`, "utf8"))));
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
const mean = values => values.reduce((sum, n) => sum + n, 0) / values.length;
const overview = batch => ({ revealMs: mean(batch.map(r => r.worldVisibleAt)),
  entryP95Ms: mean(batch.map(r => r.frameSummary["entry-scroll"].p95Ms)),
  startupLongTaskMs: mean(batch.map(r => r.startupLongTaskSummary.totalMs)),
  firstPhotoMs: mean(batch.map(r => Math.min(...r.officeResources.map(i => i.startTime)))),
  lastPhotoMs: mean(batch.map(r => Math.max(...r.officeResources.map(i => i.responseEnd)))) });
const improved = Math.max(...after.map(r => r.worldVisibleAt)) < Math.min(...before.map(r => r.worldVisibleAt));
const report = { status: improved ? "PASS" : "HOLD", checkedAt: new Date().toISOString(),
  scope: "Cold mobile Chromium Fast 4G, Radeon 740M; ABBA, original media and settings unchanged. Not physical Apple or field metrics.",
  before: overview(before), after: overview(after),
  reason: improved ? "Consistently earlier complete reveal" : "Earlier downloads did not consistently improve full garage reveal; do not deploy this candidate",
  runs: runs.map(r => ({ label: r.label, release: r.release, revealMs: r.worldVisibleAt, photoPreloadGate: r.photoPreloadGate })) };
await fs.writeFile("output/garage-photo-prefetch-comparison.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (!improved) process.exitCode = 1;
