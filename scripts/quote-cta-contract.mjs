import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const name = path.join(directory, entry.name);
    return entry.isDirectory() ? files(name) : name.endsWith(".tsx") ? [name] : [];
  });
}

const sources = [...files("app"), ...files("components"), ...files("lib")];
const missed = sources.filter((file) => /href\s*(?:=|:)\s*["']\/quote\/?["']/.test(readFileSync(file, "utf8")));
assert.deepEqual(missed, [], "Quote calls to action must open the actionable form, including from the quote page itself");
const quotePage = readFileSync("app/quote/page.tsx", "utf8");
assert.match(quotePage, /<section id="form" className="[^"]*scroll-mt-28/, "The fixed navigation must not cover the form anchor");
assert.match(quotePage, /href=\{`mailto:\$\{site.email\}/, "Keep the direct email alternative");
assert.match(quotePage, /href=\{`tel:\$\{site.phone\}/, "Keep the direct telephone alternative");
assert.ok(sources.filter((file) => readFileSync(file, "utf8").includes('href="/quote#form"')).length >= 15, "Cover the shared navigation and all page CTA templates");
console.log("quote CTA contract: PASS — direct form destinations, fixed-header offset, email and phone alternatives");
