import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";

const generatorUrl = new URL("../lib/feeds.ts", import.meta.url);
assert.ok(fs.existsSync(generatorUrl), "legacy feed generator must exist");
const { createJournalFeeds } = await import(generatorUrl.href);
const old = {
  slug: "older-entry", title: 'Metal & "paint" <guide>',
  description: "An honest excerpt > a sales pitch. Terry's shop & classics.",
  author: "2240 Speed Shop", datePublished: "2026-08-01", dateModified: "2026-08-24",
};
const recent = {
  ...old, slug: "recent-entry", title: "Recent entry",
  datePublished: "2026-08-15", dateModified: "2026-08-15",
};
const input = [old, recent];
const feeds = createJournalFeeds(input, { name: "2240 Speed Shop", url: "https://2240speedshop.com" });
assert.equal(input[0], old, "feed ordering must not mutate editorial registry order");
const json = JSON.parse(feeds.json);
assert.equal(json.version, "https://jsonfeed.org/version/1.1");
assert.equal(json.feed_url, "https://2240speedshop.com/f.json");
assert.equal(json.home_page_url, "https://2240speedshop.com/blog/");
assert.deepEqual(json.items.map((item) => item.id), [
  "https://2240speedshop.com/blog/recent-entry/",
  "https://2240speedshop.com/blog/older-entry/",
]);
assert.equal(json.items[1].content_text, old.description);
assert.equal(json.items[1].date_published, "2026-08-01T00:00:00.000Z");
assert.equal(json.items[1].date_modified, "2026-08-24T00:00:00.000Z");
assert.deepEqual(json.items[1].authors, [{ name: old.author }]);
for (const format of ["rss", "atom"]) {
  const xml = feeds[format];
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.ok(xml.indexOf("/blog/recent-entry/") < xml.indexOf("/blog/older-entry/"));
  assert.ok(xml.includes("Metal &amp; &quot;paint&quot; &lt;guide&gt;"));
  assert.ok(xml.includes("Terry&apos;s shop &amp; classics."));
  assert.ok(!xml.includes("<guide>"), "metadata must not inject XML elements");
  assert.ok(!xml.includes("<![CDATA["), "plain excerpts do not need unsafe CDATA wrapping");
}
assert.ok(feeds.rss.includes('<atom:link href="https://2240speedshop.com/f.rss" rel="self" type="application/rss+xml"/>'));
assert.ok(feeds.rss.includes("<lastBuildDate>Mon, 24 Aug 2026 00:00:00 GMT</lastBuildDate>"));
assert.ok(feeds.rss.includes("<dc:creator>2240 Speed Shop</dc:creator>"));
assert.ok(feeds.atom.includes('<link href="https://2240speedshop.com/f.atom" rel="self" type="application/atom+xml"/>'));
assert.ok(feeds.atom.includes("<updated>2026-08-24T00:00:00.000Z</updated>"));
assert.throws(() => createJournalFeeds([], { name: "Shop", url: "https://2240speedshop.com" }), /article/i);
assert.throws(() => createJournalFeeds([{ ...old, datePublished: "2026-02-30" }], { name: "Shop", url: "https://2240speedshop.com" }), /date/i);
for (const extension of ["rss", "atom", "json"]) {
  const route = fs.readFileSync(new URL(`../app/f.${extension}/route.ts`, import.meta.url), "utf8");
  assert.match(route, /export const dynamic = "force-static"/);
  assert.match(route, /export function GET\(\)/);
  assert.ok(route.includes('from "@/lib/blog/registry"'), "feeds must use the published registry");
  assert.ok(route.includes(`feeds.${extension}`));
}

// Read actual metadata as TypeScript syntax; do not render article components
// or substitute fixture metadata for the registry integration check.
const registry = ts.createSourceFile("registry.ts", fs.readFileSync(new URL("../lib/blog/registry.ts", import.meta.url), "utf8"), ts.ScriptTarget.Latest, true);
const imports = new Map();
let registered = [];
for (const statement of registry.statements) {
  if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier)
      && statement.moduleSpecifier.text.startsWith("./articles/")) {
    imports.set(statement.importClause.namedBindings.name.text, statement.moduleSpecifier.text);
  }
  if (ts.isVariableStatement(statement)) {
    for (const declaration of statement.declarationList.declarations) {
      if (declaration.name.getText(registry) === "modules") {
        registered = declaration.initializer.elements.map((element) => element.getText(registry));
      }
    }
  }
}
assert.ok(registered.length > 0, "published registry must not be empty");
const metadata = registered.map((name) => {
  const file = new URL(`../lib/blog/${imports.get(name)}.tsx`, import.meta.url);
  const source = ts.createSourceFile(file.pathname, fs.readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const result = {};
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (declaration.name.getText(source) !== "meta") continue;
      for (const property of declaration.initializer.properties) {
        if (ts.isPropertyAssignment(property) && ts.isStringLiteral(property.initializer)) {
          result[property.name.getText(source)] = property.initializer.text;
        }
      }
    }
  }
  return result;
});
const actual = JSON.parse(createJournalFeeds(metadata, { name: "2240 Speed Shop", url: "https://2240speedshop.com" }).json);
assert.equal(actual.items.length, registered.length);
assert.equal(new Set(actual.items.map((item) => item.id)).size, registered.length);
for (const article of metadata) {
  const item = actual.items.find((entry) => entry.id === `https://2240speedshop.com/blog/${article.slug}/`);
  assert.ok(item, `feed includes registered ${article.slug}`);
  assert.equal(item.content_text, article.description);
  assert.equal(item.authors[0].name, article.author);
}
console.log(`journal feed contract: PASS — ${registered.length} registry entries, dates, ordering, escaping, authors, canonical URLs, static routes`);
