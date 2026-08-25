import fs from "node:fs";
import assert from "node:assert/strict";

const css = fs.readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const rule = css.match(/\.grain\s*\{([\s\S]*?)\}/)?.[1] || "";

assert.ok(rule, "global .grain rule is missing");
assert.ok(rule.includes("feTurbulence"), "film-grain turbulence source changed");
assert.match(rule, /baseFrequency='0\.9'/, "film-grain frequency changed");
assert.match(rule, /numOctaves='2'/, "film-grain octave count changed");
assert.match(rule, /opacity:\s*0\.055/, "film-grain opacity changed");
assert.match(rule, /mix-blend-mode:\s*overlay/, "film-grain blend changed");
assert.match(rule, /animation:\s*grain-shift 0\.9s steps\(4\) infinite/, "film-grain cadence changed");

const width = Number(rule.match(/width:\s*([\d.]+)%/)?.[1]);
const height = Number(rule.match(/height:\s*([\d.]+)%/)?.[1]);
const inset = Number(rule.match(/inset:\s*-([\d.]+)%/)?.[1]);
const surfaceRatio = (width / 100) * (height / 100);
const keyframes = css.match(/@keyframes grain-shift\s*\{([\s\S]*?)\n\}/)?.[1] || "";

assert.ok(Number.isFinite(width) && Number.isFinite(height), "grain surface dimensions missing");
assert.ok(Number.isFinite(inset), "grain overscan inset missing");
assert.ok(width >= 120 && height >= 120 && inset >= 10, "grain lacks safe animation overscan");
assert.ok(surfaceRatio <= 1.6, `grain compositor surface is ${surfaceRatio.toFixed(2)}× the viewport`);
assert.match(keyframes, /translate\(-1\.94%, 1\.29%\)/, "grain first-step pixel travel changed");
assert.match(keyframes, /translate\(1\.45%, -1\.77%\)/, "grain second-step pixel travel changed");
assert.match(keyframes, /translate\(-0\.97%, -0\.81%\)/, "grain third-step pixel travel changed");

console.log(
  `grain budget: PASS — exact visual recipe on ${width}%×${height}% (${surfaceRatio.toFixed(2)}× viewport)`,
);
