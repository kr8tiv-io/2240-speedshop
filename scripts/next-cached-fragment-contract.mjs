import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
for (const variant of ["client", "esm/client"]) {
  const source = readFileSync(`node_modules/next/dist/${variant}/components/segment-cache/navigation.js`, "utf8");
  const expression = source.match(/const canonicalUrl = (route\.canonicalUrl[^;]+);/)[1];
  for (const [cached, fragment, expected] of [
    ["/quote/#form", "#form", "/quote/#form"],
    ["/quote/#form", "", "/quote/"],
    ["/quote/?service=engine#old", "#form", "/quote/?service=engine#form"],
    ["/quote/", "#form", "/quote/#form"],
    ["/blog/a%23b/?q=a%23b#old", "#new", "/blog/a%23b/?q=a%23b#new"],
  ]) {
    assert.equal(vm.runInNewContext(expression, { route: { canonicalUrl: cached }, url: { hash: fragment } }), expected,
      `${variant}: the requested fragment must replace any cached initial-document fragment`);
  }
}
console.log("Next cached fragment contract: PASS — actual CJS/ESM routing expression retains exactly the destination fragment");
