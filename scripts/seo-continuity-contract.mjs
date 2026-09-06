import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve("out"), baseline = path.resolve("output/baseline-f33a4109");
const origin = "https://2240speedshop.com";
const sitemap = await fs.readFile(path.join(root, "sitemap.xml"), "utf8");
const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1]).pathname);
assert.equal(routes.length, 69);
assert.equal((await fs.readFile(path.join(baseline, ".well-known/2240-release.txt"), "utf8")).trim(), "f33a4109f9ed40f4a730339010d3a6b1");
const stripExecutable = html => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
const text = html => stripExecutable(html).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const schemas = html => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
const pages = new Map();
let images = 0, fragmentReferences = 0, schemaBlocks = 0;
for (const route of routes) {
  const html = await fs.readFile(path.join(root, route, "index.html"), "utf8");
  const old = await fs.readFile(path.join(baseline, route, "index.html"), "utf8");
  const rendered = stripExecutable(html);
  assert.equal(text(html), text(old), `Preserve all published copy: ${route}`);
  assert.deepEqual(schemas(html), schemas(old), `Preserve factual schema: ${route}`);
  schemaBlocks += schemas(html).length;
  const headings = [...rendered.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)];
  assert.equal(headings.length, 1, `Exactly one H1: ${route}`);
  assert.ok(text(headings[0][1]), `Nonempty H1: ${route}`);
  assert.match(rendered, /<html\b[^>]*lang="en-CA"/, route);
  assert.match(rendered, /<meta name="viewport" content="[^"]*width=device-width/, route);
  const ids = [...rendered.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length, `No duplicate IDs: ${route}`);
  for (const image of rendered.matchAll(/<img\b[^>]*>/g)) {
    images++; assert.match(image[0], /\balt="[^"]*"/, `Image alt presence: ${route}`);
  }
  const links = [...rendered.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)].map(m => m[1].replaceAll("&amp;", "&"));
  for (const href of links) assert.ok(href && href !== "#" && !/^javascript:/i.test(href), `No inert anchor: ${route}`);
  pages.set(route, { ids: new Set(ids), links });
}
const graph = new Map();
for (const [route, page] of pages) {
  const destinations = [];
  for (const href of page.links) {
    const url = new URL(href, origin + route);
    if (url.origin !== origin) continue;
    const destination = pages.has(url.pathname) ? url.pathname : `${url.pathname}/`;
    if (!pages.has(destination)) continue; // Asset reachability is checked by verify-final-domain-release.
    destinations.push(destination);
    if (url.hash) {
      fragmentReferences++;
      assert.ok(pages.get(destination).ids.has(decodeURIComponent(url.hash.slice(1))), `Missing fragment: ${route} -> ${url.href}`);
    }
  }
  graph.set(route, destinations);
}
const depth = new Map([["/", 0]]), queue = ["/"];
for (let index = 0; index < queue.length; index++) {
  for (const route of graph.get(queue[index]) || []) if (!depth.has(route)) {
    depth.set(route, depth.get(queue[index]) + 1); queue.push(route);
  }
}
assert.equal(depth.size, routes.length, "No orphan pages: every canonical is linked from the home crawl graph");
const report = { status: "PASS", checkedAt: new Date().toISOString(),
  release: (await fs.readFile(path.join(root, ".well-known/2240-release.txt"), "utf8")).trim(),
  pages: pages.size, unchangedTextPages: pages.size, unchangedSchemaBlocks: schemaBlocks,
  singleH1Pages: pages.size, imagesWithAlt: images, fragmentReferences, duplicateIds: 0,
  reachablePages: depth.size, maximumLinkDepth: Math.max(...depth.values()),
  limits: "Static continuity and crawl graph only; alt presence is not editorial quality. Activation, live response correspondence, indexing and scores require separate checks." };
await fs.writeFile("output/seo-continuity-check.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
