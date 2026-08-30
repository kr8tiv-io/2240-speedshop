import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const reveal = await readFile(
  new URL("../components/shop/StationReveal.tsx", import.meta.url),
  "utf8",
);
const rail = await readFile(
  new URL("../components/shop/CinemaRail.tsx", import.meta.url),
  "utf8",
);

assert.ok(
  /new IntersectionObserver\([\s\S]*rootMargin: "35% 0px"/.test(reveal),
  "Station panels must use proximity rather than measuring every offscreen panel each frame.",
);
assert.ok(
  /const attach = \(\) =>[\s\S]*registerPanel\(read, write\)/.test(reveal) &&
    /const detach = \(\) =>/.test(reveal),
  "Panel RAF work must be attached only while the panel is near and removable when it settles.",
);
assert.ok(
  /if \(r >= 1\) \{[\s\S]*latched\.current = true;[\s\S]*queueMicrotask\(detach\)/.test(reveal),
  "A fully revealed panel must leave the shared measurement loop immediately.",
);
assert.ok(
  /if \(!near \|\| window\.matchMedia\("\(prefers-reduced-motion: reduce\)"\)\.matches\) return;[\s\S]*return subscribe/.test(rail),
  "Cinema furniture must not subscribe to the garage RAF while the runway is offscreen.",
);

console.log("station reveal proximity contract: PASS");
