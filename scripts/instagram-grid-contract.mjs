import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const dataUrl = new URL("lib/instagram-posts.json", root);

try {
  await access(dataUrl);
} catch {
  assert.fail("lib/instagram-posts.json is missing; the gallery still has no structured direct-post data.");
}

const [posts, grid] = await Promise.all([
  readFile(dataUrl, "utf8").then(JSON.parse),
  readFile(new URL("components/InstagramGrid.tsx", root), "utf8"),
]);

assert.equal(posts.length, 10, "The wall should be two complete rows of five unique posts.");
assert.equal(new Set(posts.map((post) => post.shortcode)).size, posts.length, "Post shortcodes must be unique.");
assert.equal(new Set(posts.map((post) => post.subject)).size, posts.length, "Repeated subjects must be removed.");

for (const post of posts) {
  assert.ok(["p", "reel"].includes(post.kind), `${post.shortcode} has an invalid Instagram kind.`);
  assert.match(post.shortcode, /^[A-Za-z0-9_-]+$/, `${post.shortcode} is not a valid shortcode.`);
  assert.ok(post.alt?.trim(), `${post.shortcode} needs descriptive alt text.`);
  assert.ok(post.subject?.trim(), `${post.shortcode} needs a deduplication subject.`);
  await access(new URL(`public/shop/${post.file}`, root));
}

assert.match(grid, /aspect-square/);
assert.doesNotMatch(grid, /aspect-\[4\/5\]/);
assert.match(grid, /grid-cols-2[\s\S]*sm:grid-cols-3[\s\S]*lg:grid-cols-5/);
assert.match(grid, /instagram\.com\/\$\{post\.kind\}\/\$\{post\.shortcode\}/);
assert.match(grid, /ig-card-glow/);

console.log("instagram grid contract: PASS");
