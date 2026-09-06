import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";

const root = "output/playwright/garage-performance-2026-09-06";
const beforeLabel = process.env.QA_REFLECTION_BEFORE || "reflection-origin-phone-8f4ae";
const afterLabel = process.env.QA_REFLECTION_AFTER || "reflection-readiness-phone-canary";
for (const label of [beforeLabel, afterLabel]) assert.match(label, /^[a-z0-9-]+$/);
const load = async (label, name) => JSON.parse(await fs.readFile(`${root}/${label}/${name}.json`, "utf8"));
const beforeRun = await load(beforeLabel, "results"), afterRun = await load(afterLabel, "results");
const prepared = JSON.parse(await fs.readFile("output/release-prepared.json", "utf8"));
assert.equal(beforeRun.status, "PASS"); assert.equal(afterRun.status, "PASS");
assert.equal(beforeRun.release, "8f4ae7f5d545490e8ab580cb7ca5c7e3");
assert.equal(afterRun.release, process.env.QA_CANDIDATE_RELEASE || prepared.releaseId);
assert.ok(beforeRun.diagnosticOnly && afterRun.diagnosticOnly);
for (const key of ["gpu", "profile", "networkConditions", "officeTextures", "modelCoverage"]) assert.deepEqual(afterRun[key], beforeRun[key]);
const before = (await load(beforeLabel, "startup-programs")).filter(p => p.context === 2);
const after = (await load(afterLabel, "startup-programs")).filter(p => p.context === 2);
const digest = p => createHash("sha256").update(p.sources.join("\n---fragment---\n")).digest("hex");
const original = before.find(p => p.sources.some(s => s.includes("PMREMGGXConvolution")));
assert.ok(original);
assert.ok(original.queriesMs > 80 && original.firstQueryAt < original.readiness.readyAt, "Reproduce premature use of the original reflection shader");
const matches = after.filter(p => digest(p) === digest(original));
assert.equal(matches.length, 1, "Share the exact original GGX shader, never a lower-quality replacement");
const candidate = matches[0];
assert.ok(candidate.readiness.readyAt > 0 && candidate.readiness.readyAt <= candidate.firstQueryAt,
  "Reflection readiness must precede lazy first use by every material consumer");
assert.ok(candidate.queriesMs < 20, "Remove the reproduced synchronous reflection lookup stall");
assert.deepEqual([...new Set(after.map(digest))].sort(), [...new Set(before.map(digest))].sort(),
  "Preserve the complete original garage shader set without creating alternate variants");
const sample = p => ({ queriesMs: p.queriesMs, linkAt: p.linkAt, firstQueryAt: p.firstQueryAt, readiness: p.readiness, firstQueryStack: p.firstQueryStack });
const report = { status: "PASS", beforeLabel, afterLabel, baselineRelease: beforeRun.release, candidateRelease: afterRun.release,
  shaderHash: digest(original), originalGarageShaderCount: new Set(before.map(digest)).size,
  before: sample(original), after: sample(candidate), scope: "Private exact shader/readiness proof, not an overall performance benchmark" };
await fs.writeFile(`output/${afterLabel}-program-verification.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ ...report, before: { ...report.before, firstQueryStack: undefined }, after: { ...report.after, firstQueryStack: undefined } }, null, 2));
