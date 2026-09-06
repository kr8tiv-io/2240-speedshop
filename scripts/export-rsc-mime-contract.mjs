import assert from "node:assert/strict";
const base = process.env.BASE_URL || "http://127.0.0.1:3197";
for (const resource of ["/quote/index.txt", "/quote/__next._tree.txt"]) {
  const response = await fetch(new URL(resource, base));
  assert.equal(response.status, 200, resource);
  assert.match(response.headers.get("content-type") || "", /^text\/(?:plain|x-component)/,
    "Next static navigation rejects octet-stream RSC and falls back to a second document navigation");
}
console.log("static-export RSC response MIME contract: PASS");
