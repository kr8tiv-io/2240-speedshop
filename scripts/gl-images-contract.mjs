import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const shell = await readFile(
  new URL("../components/gl/GLImagesLayer.tsx", import.meta.url),
  "utf8",
);
const runtime = await readFile(
  new URL("../components/gl/GLImagesRuntime.tsx", import.meta.url),
  "utf8",
).catch(() => "");

assert.ok(
  !/from ["']three["']|@react-three\/fiber/.test(shell),
  "The root observer shell may not pull Three or R3F into the opening graph.",
);
assert.ok(
  /dynamic\(\s*\(\) => import\("\.\/GLImagesRuntime"\)/.test(shell),
  "The image renderer must live behind a client-only dynamic boundary.",
);
assert.ok(
  /const \[mounted, setMounted\] = useState\(false\)/.test(shell) &&
    /if \(isNear\) setMounted\(true\)/.test(shell),
  "The WebGL image runtime must latch on only after an image approaches.",
);
assert.ok(
  /if \(!enabled \|\| !mounted\) return null/.test(shell),
  "Capability alone may not allocate the image canvas.",
);
assert.ok(
  /<Canvas/.test(runtime) && /useLoader\(THREE\.TextureLoader, entry\.src\)/.test(runtime),
  "The unchanged high-fidelity image shader runtime must remain in the lazy chunk.",
);

console.log("GL image deferral contract: PASS");
