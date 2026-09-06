import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const [beforePath, afterPath] = process.argv.slice(2);
assert.ok(beforePath && afterPath, "Pass baseline and candidate startup-programs.json paths");
const read = async path => JSON.parse(await readFile(path, "utf8"));
const [before, after] = await Promise.all([read(beforePath), read(afterPath)]);
const hash = p => createHash("sha256").update(JSON.stringify(p.sources)).digest("hex");
const reflections = list => list.filter(p => p.sources.some(s => /#define SHADER_NAME (PMREMGGXConvolution|CubemapToCubeUV)\b/.test(s)));
const oldPrograms = reflections(before), newPrograms = reflections(after);
assert.ok(oldPrograms.length >= 4, "Capture conversion and filtering from both renderers");
const rows = [];
for (const old of oldPrograms) {
  const matches = newPrograms.filter(p => p.context === old.context && hash(p) === hash(old));
  assert.equal(matches.length, 1, "Each exact shader source pair must compile once per renderer, without a second first-use variant");
  const next = matches[0];
  rows.push({ context: old.context, shader: old.sources[0].match(/#define SHADER_NAME (\w+)/)[1], sha256: hash(old), beforeQueryMs: old.queriesMs, afterQueryMs: next.queriesMs, submittedAt: next.linkAt, firstUsedAt: next.firstQueryAt });
}
assert.equal(newPrograms.length, oldPrograms.length, "Warm-up must not add unused reflection variants");
console.log(JSON.stringify({ status: "PASS", exactShaderPairs: rows }, null, 2));
