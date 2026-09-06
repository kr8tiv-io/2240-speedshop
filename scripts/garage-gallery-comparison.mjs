import assert from "node:assert/strict";
import fs from "node:fs/promises";
const root = "output/playwright/garage-performance-2026-09-06";
const oldRelease = "cf744f55f22b43ec955394ea0df4fd6d";
const newRelease = process.env.QA_CANDIDATE_RELEASE || "8490226f10c2431e8a0fa96259bce9c5";
const prefix = process.env.QA_COMPARISON_PREFIX || "gallery-owner";
assert.match(newRelease, /^[a-f0-9]{32}$/);
assert.match(prefix, /^[a-z0-9-]+$/);
const mean = numbers => numbers.reduce((a, b) => a + b, 0) / numbers.length;
const all = [];
const report = { checkedAt: new Date().toISOString(), status: "HOLD", profiles: {},
  scope: "Cold sequential desktop and phone Fast 4G ABBA. Target: both desktop gallery worst slices below 50 ms from reproduced >400 ms. Retain average complete reveal within 3% and entry p95 within 0.5 ms on both profiles. No field/physical Apple performance claim." };
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
  const gallerySlice = run => {
    const message = run.consoleLog.find(log => /station 5 postage-stamp first use.*18\/18/.test(log.text));
    assert.ok(message, "Measure the actual original gallery first-use group");
    return Number(message.text.match(/worst slice (\d+) ms/)[1]);
  };
  const summarize = batch => ({ revealMs: mean(batch.map(r => r.worldVisibleAt)),
    entryP95Ms: mean(batch.map(r => r.frameSummary["entry-scroll"].p95Ms)),
    entryP99Ms: mean(batch.map(r => r.frameSummary["entry-scroll"].p99Ms)),
    startupLongTaskMs: mean(batch.map(r => r.startupLongTaskSummary.totalMs)),
    cls: mean(batch.map(r => r.metrics.cls)), gallerySlicesMs: batch.map(gallerySlice) });
  const before = summarize([runs[0], runs[3]]), after = summarize([runs[1], runs[2]]);
  const stallRemoved = group !== "desktop" || (Math.min(...before.gallerySlicesMs) > 400 && Math.max(...after.gallerySlicesMs) < 50);
  const gate = stallRemoved && after.revealMs <= before.revealMs * 1.03 && after.entryP95Ms <= before.entryP95Ms + .5;
  assert.equal(runs[2].stations.length, 7);
  if (group === "desktop") assert.equal(runs[2].railClicks.length, 7);
  report.profiles[group] = { before, after, stallRemoved, gate, revealDeltaMs: after.revealMs - before.revealMs,
    runs: runs.map(r => ({ label: r.label, release: r.release, startedAt: r.startedAt, finishedAt: r.finishedAt, revealMs: r.worldVisibleAt, gallerySliceMs: gallerySlice(r) })) };
}
all.sort((a, b) => Date.parse(a.startedAt) - Date.parse(b.startedAt));
for (let i = 1; i < all.length; i++) assert.ok(Date.parse(all[i].startedAt) > Date.parse(all[i - 1].finishedAt), "Never overlap GPU comparisons");
report.status = Object.values(report.profiles).every(profile => profile.gate) ? "PASS" : "HOLD";
await fs.writeFile(`output/${prefix}-comparison.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (report.status !== "PASS") process.exitCode = 1;
