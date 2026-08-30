import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const cursor = await readFile(
  new URL("../components/fx/Cursor.tsx", import.meta.url),
  "utf8",
);
const move = cursor.slice(
  cursor.indexOf("const onMagnetMove"),
  cursor.indexOf("document.addEventListener"),
);

assert.match(cursor, /let activeMagnet: HTMLElement \| null = null/);
assert.match(cursor, /let activeRect: DOMRect \| null = null/);
assert.doesNotMatch(move, /for \(const \[node, m\] of magnets\)/);
assert.match(cursor, /window\.addEventListener\("scroll", invalidateMagnetRect, \{ passive: true \}\)/);
assert.match(cursor, /window\.addEventListener\("resize", invalidateMagnetRect\)/);

console.log("cursor magnet contract: PASS");
