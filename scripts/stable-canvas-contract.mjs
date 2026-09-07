import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const source = await readFile(new URL("../lib/stable-canvas.ts", import.meta.url), "utf8");

assert.match(source, /scroll:\s*false/);
assert.match(source, /minHeight:\s*"100svh"/);
assert.match(source, /height:\s*"100lvh"/);
assert.match(source, /export function aspectIgnoringChrome/);

const { aspectIgnoringChrome } = await import(
  `${new URL("../lib/stable-canvas.ts", import.meta.url).href}?contract=${Date.now()}`
);

const camera = {
  aspect: 0.44,
  updateProjectionMatrix() {
    this.updated = true;
  },
};
const lock = { width: 0, aspect: 0 };
assert.equal(aspectIgnoringChrome(camera, 390, lock), 0.44);
camera.aspect = 0.48;
assert.equal(aspectIgnoringChrome(camera, 390, lock), 0.44);
assert.equal(camera.aspect, 0.44);
assert.equal(camera.updated, true);
camera.aspect = 0.52;
assert.equal(aspectIgnoringChrome(camera, 844, lock), 0.52);
assert.equal(lock.width, 844);

console.log("stable canvas contract: PASS");
