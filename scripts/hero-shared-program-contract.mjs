import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";

const root = "output/playwright/garage-performance-2026-09-06";
const beforeLabel = process.env.QA_HERO_BEFORE || "hero-stage-owner-phone-f33";
const afterLabel = process.env.QA_HERO_AFTER || "hero-shared-stage-canary";
for (const label of [beforeLabel, afterLabel]) assert.match(label, /^[a-z0-9-]+$/);
const load = async label => JSON.parse(await fs.readFile(`${root}/${label}/startup-programs.json`, "utf8"));
const results = async label => JSON.parse(await fs.readFile(`${root}/${label}/results.json`, "utf8"));
const beforeRun = await results(beforeLabel), afterRun = await results(afterLabel);
const prepared = JSON.parse(await fs.readFile("output/release-prepared.json", "utf8"));
assert.equal(beforeRun.status, "PASS"); assert.equal(afterRun.status, "PASS");
assert.equal(beforeRun.release, "f33a4109f9ed40f4a730339010d3a6b1");
assert.equal(afterRun.release, process.env.QA_CANDIDATE_RELEASE || prepared.releaseId);
assert.ok(beforeRun.diagnosticOnly && afterRun.diagnosticOnly);
for (const key of ["profile", "gpu", "networkConditions", "modelCoverage"]) assert.deepEqual(afterRun[key], beforeRun[key]);
const before = (await load(beforeLabel)).filter(p => p.context === 1);
const after = (await load(afterLabel)).filter(p => p.context === 1);
const digest = p => createHash("sha256").update(p.sources.join("\n---fragment---\n")).digest("hex");
const lamp = p => p.finalOwners?.some(o => o.owner === "hero" && o.geometry === "ConeGeometry" && o.materialType === "MeshStandardMaterial");
const original = before.find(p => lamp(p) && p.queriesMs > 100);
assert.ok(original, "Reproduce the original shared metal lamp's blocking first use");
const matches = after.filter(p => digest(p) === digest(original));
assert.equal(matches.length, 1, "Prepare the exact original metal lamp program once");
const candidate = matches[0];
assert.ok(lamp(candidate), "Confirm the exact shader still belongs to the original lamp");
assert.ok(candidate.readiness?.readyAt > 0 && candidate.readiness.readyAt <= candidate.firstQueryAt,
  "The metal lamp must finish asynchronous preparation before its first uniform query");
assert.ok(candidate.queriesMs < 50, "Remove the reproduced >100 ms synchronous lamp query");
assert.deepEqual([...new Set(after.map(digest))].sort(), [...new Set(before.map(digest))].sort(),
  "Retain every original hero shader source, without replacement or new variants");
const sample = p => ({ queriesMs: p.queriesMs, linkAt: p.linkAt, firstQueryAt: p.firstQueryAt, readiness: p.readiness });
const report = { status: "PASS", beforeLabel, afterLabel, shaderHash: digest(original),
  baselineRelease: beforeRun.release, candidateRelease: afterRun.release,
  originalHeroShaderCount: new Set(before.map(digest)).size, before: sample(original), after: sample(candidate),
  scope: "Private instrumented ownership and exact shader-source proof, not a total-load benchmark" };
await fs.writeFile(`output/${afterLabel}-program-verification.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
