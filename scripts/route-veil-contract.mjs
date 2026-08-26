import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const template = await readFile(new URL("app/template.tsx", root), "utf8");
const css = await readFile(new URL("app/globals.css", root), "utf8");
const pkg = JSON.parse(await readFile(new URL("package.json", root), "utf8"));

assert.doesNotMatch(
  template,
  /framer-motion|<motion\./,
  "A one-shot route veil must not ship the Framer Motion runtime.",
);
assert.equal(
  pkg.dependencies?.["framer-motion"],
  undefined,
  "Framer Motion must leave the client dependency graph when the veil no longer needs it.",
);
assert.match(
  template,
  /onAnimationEnd=[\s\S]*animationName === "route-veil-lift"[\s\S]*setGone\(true\)/,
  "The CSS route animation must own the healthy-path unmount.",
);
assert.match(
  css,
  /@keyframes route-veil-lift[\s\S]*\.route-veil \{[\s\S]*route-veil-lift 830ms cubic-bezier\(0\.65, 0, 0\.35, 1\)/,
  "The CSS veil must retain the existing 280ms hold and 550ms cinematic lift.",
);
assert.match(
  css,
  /preloader-failsafe 0\.5s ease 3s forwards/,
  "The independent route-veil dead-man must remain in place.",
);

console.log("route veil contract: PASS");
