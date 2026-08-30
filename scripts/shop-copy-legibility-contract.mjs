import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const sections = await readFile(
  new URL("../components/shop/WalkthroughSections.tsx", import.meta.url),
  "utf8",
);

assert.match(sections, /wt-station-eyebrow/);
assert.match(sections, /wt-station-body/);
assert.match(sections, /wt-station-list/);
assert.match(sections, /wt-glide-body/);
assert.match(
  sections,
  /text-\[clamp\(1\.0625rem,[^\]]+1\.125rem\)\]/,
  "Shop paragraphs need a fluid 17–18 px type scale.",
);
assert.match(
  sections,
  /text-\[clamp\(0\.75rem,[^\]]+0\.8125rem\)\]/,
  "Shop metadata and lists need a 12 px minimum.",
);
assert.match(
  sections,
  /wt-glide-body[^"\n]*text-base/,
  "Travel copy needs a 16 px mobile floor.",
);
assert.doesNotMatch(
  sections,
  /STATION_BODY\s*=\s*\n?\s*"[^"]*text-\[15px\]/,
  "The old 15 px station paragraph definition must not remain.",
);

console.log("shop copy legibility contract: PASS");
