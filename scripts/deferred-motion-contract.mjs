import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const files = [
  "components/home/HomeCinema.tsx",
  "components/home/HomeFx.tsx",
  "components/home/ProcessRail.tsx",
  "components/home/ReviewsCinema.tsx",
  "components/fx/ClipReveal.tsx",
  "components/fx/Cursor.tsx",
  "components/fx/Kinetic.tsx",
  "components/fx/PageFx.tsx",
  "components/SmoothScroll.tsx",
];
const sources = await Promise.all(
  files.map(async (file) => [file, await readFile(new URL(file, root), "utf8")]),
);
const [runtime, pkg] = await Promise.all([
  readFile(new URL("components/fx/useDeferredGSAP.ts", root), "utf8"),
  readFile(new URL("package.json", root), "utf8").then(JSON.parse),
]);

for (const [file, source] of sources) {
  assert.doesNotMatch(source, /from ["'](?:gsap|gsap\/ScrollTrigger|@gsap\/react)["']/, `${file} must not pull motion libraries into opening hydration`);
}
assert.match(runtime, /import\("gsap"\)/, "The deferred runtime must load GSAP after hydration.");
assert.match(runtime, /import\("gsap\/ScrollTrigger"\)/, "The deferred runtime must load ScrollTrigger beside GSAP.");
assert.match(runtime, /context\?\.revert\(\)/, "Deferred timelines must be reverted on cleanup.");
assert.equal(pkg.dependencies?.["@gsap/react"], undefined, "The superseded eager hook package must be removed.");
assert.match(
  sources.find(([file]) => file === "components/SmoothScroll.tsx")[1],
  /import\("lenis"\)/,
  "Lenis must load after first paint rather than in the opening graph.",
);
assert.match(
  sources.find(([file]) => file === "components/SmoothScroll.tsx")[1],
  /syncTouch:\s*touch\.matches/,
  "Phone Lenis must use syncTouch so Safari WebGL and the document share one scroll clock (drei #1890).",
);

console.log("deferred motion contract: PASS");
