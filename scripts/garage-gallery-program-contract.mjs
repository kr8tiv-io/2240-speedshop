import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";

const directory = "output/playwright/garage-performance-2026-09-06";
const beforeLabel = process.env.QA_GALLERY_BEFORE || "gallery-program-cost-cf744f5";
const afterLabel = process.env.QA_GALLERY_AFTER || "gallery-light-scope-cf744f5";
for (const label of [beforeLabel, afterLabel]) assert.match(label, /^[a-z0-9-]+$/);
const load = async (label, file) => JSON.parse(await fs.readFile(`${directory}/${label}/${file}`, "utf8"));
const before = await load(beforeLabel, "startup-programs.json");
const after = await load(afterLabel, "startup-programs.json");
const original = before.find(program => program.context === 2 && program.queriesMs > 400 &&
  program.sources.some(source => source.includes("#define USE_EMISSIVEMAP")));
assert.ok(original, "Baseline must reproduce the expensive original gallery shader");
const digest = program => createHash("sha256").update(program.sources.join("\n---fragment---\n")).digest("hex");
const shaderHash = digest(original);
const matches = after.filter(program => program.context === 2 && digest(program) === shaderHash);
assert.equal(matches.length, 1, "Prepare the exact original vertex/fragment program once, not an approximate replacement");
const candidate = matches[0];
assert.ok(candidate.readiness.readyAt < candidate.firstQueryAt, "The original gallery shader must complete non-blocking preparation before first uniform discovery");
assert.ok(candidate.queriesMs < 50, "Gallery first use must not wait hundreds of milliseconds for shader compilation");
const lights = await load(afterLabel, "startup-lights.json");
const gallery = lights.filter(event => event.kind === "compile" && event.emissiveMaps >= 7);
assert.ok(gallery.length > 0);
assert.ok(gallery.every(event => event.pointCount === 25), "Original full gallery prepares with the same 25 lights as its actual first draw");
const report = { status: "PASS", beforeLabel, afterLabel, shaderHash,
  before: { queriesMs: original.queriesMs, linkAt: original.linkAt, firstQueryAt: original.firstQueryAt },
  after: { queriesMs: candidate.queriesMs, linkAt: candidate.linkAt, readyAt: candidate.readiness.readyAt, firstQueryAt: candidate.firstQueryAt },
  galleryCompileCounts: gallery.map(event => event.pointCount),
  scope: "Instrumented exact shader/ownership proof, not a controlled total-load benchmark" };
await fs.writeFile("output/gallery-program-verification.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
