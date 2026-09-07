import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const site = fs.readFileSync(path.join(root, "lib", "site.ts"), "utf8");
const copy = fs.readFileSync(path.join(root, "app", "edmonton", "[slug]", "page.tsx"), "utf8");
const llms = fs.readFileSync(path.join(root, "public", "llms.txt"), "utf8");
const full = fs.readFileSync(path.join(root, "public", "llms-full.txt"), "utf8");

const areasBlock = site.slice(site.indexOf("export const areas = ["), site.indexOf("] as const;", site.indexOf("export const areas = [")));
const slugs = [...areasBlock.matchAll(/slug: "([a-z0-9-]+)"/g)].map((m) => m[1]);
assert.ok(slugs.includes("fort-saskatchewan"), "Fort Saskatchewan must be in lib/site.ts areas");
assert.ok(
  slugs.every((slug) => copy.includes(`"${slug}":`)),
  "every area slug must have a unique content block",
);
assert.ok(llms.includes("/edmonton/fort-saskatchewan/"), "llms.txt must link the Fort Saskatchewan page");
assert.ok(full.includes("/edmonton/fort-saskatchewan/"), "llms-full.txt must cite Fort Saskatchewan");
assert.ok(full.includes("llms.txt"), "llms-full.txt must point back at the short card");
assert.ok(llms.includes("llms-full.txt"), "llms.txt must point at the extended answers file");

console.log("area pages contract: PASS");
