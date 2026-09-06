import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
const release = JSON.parse(await readFile("output/release-prepared.json", "utf8"));
const base = "https://2240speedshop.com";
const root = path.resolve("out");
const hash = data => createHash("sha256").update(data).digest("hex");
const report = { release: release.releaseId, startedAt: new Date().toISOString(), pages: [], assets: [], redirects: [], errors: [] };
const get = async (url, options = {}) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(30_000), ...options });
  return { response, bytes: Buffer.from(await response.arrayBuffer()) };
};
async function checkFile(relative, collection) {
  const { response, bytes } = await get(`${base}/${relative}`);
  assert.equal(response.status, 200, relative);
  const local = relative.endsWith(".br") && response.headers.get("content-encoding") === "br" ? relative.slice(0, -3) : relative;
  assert.equal(hash(bytes), hash(await readFile(path.join(root, local))), `Exact live bytes: ${relative}`);
  collection.push({ path: relative, status: response.status, bytes: bytes.length, contentType: response.headers.get("content-type"), encoding: response.headers.get("content-encoding"), cacheControl: response.headers.get("cache-control"), sha256: hash(bytes) });
}
async function parallel(items, action) {
  let next = 0;
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (next < items.length) {
      const item = items[next++];
      try { await action(item); } catch (error) { report.errors.push({ item, error: error.message }); }
    }
  }));
}
try {
  const marker = await get(`${base}/.well-known/2240-release.txt`);
  assert.equal(marker.bytes.toString().trim(), release.releaseId, "Queryless production marker");
  const sitemap = await readFile(path.join(root, "sitemap.xml"), "utf8");
  const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]).pathname);
  assert.equal(routes.length, 69);
  await parallel(routes, async route => {
    const { response, bytes } = await get(base + route);
    const html = bytes.toString();
    assert.equal(response.status, 200, route);
    assert.equal(response.url, base + route, "Canonical route should not redirect");
    assert.equal(hash(bytes), hash(await readFile(path.join(root, route, "index.html"))), `Published HTML: ${route}`);
    assert.ok(html.includes(`<meta name="2240-release" content="${release.releaseId}">`));
    assert.ok(html.includes(`<link rel="canonical" href="${base}${route}"`));
    assert.ok(!/<meta name="robots" content="[^"]*noindex/.test(html));
    assert.match(html, /Made with.*KR8TIV/);
    const schema = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
    report.pages.push({ route, status: 200, bytes: bytes.length, schemaBlocks: schema.length, sha256: hash(bytes) });
  });
  await parallel([...new Set([...release.criticalAssets, "robots.txt", "sitemap.xml", "llms.txt", "f.rss", "f.atom", "f.json", "social/2240-speed-shop-edmonton-cinematic-v1.png", "quote/index.txt"])], file => checkFile(file, report.assets));
  for (const url of ["http://2240speedshop.com/", "http://www.2240speedshop.com/", "https://www.2240speedshop.com/", "https://2240speedshop.com/f/cutting-edge-automotive-solutions/"]) {
    let destination = url;
    const hops = [];
    // Hostinger's forced HTTPS layer precedes .htaccess. HTTP www therefore
    // legitimately takes two permanent hops; HTTPS www takes only one.
    for (let hop = 0; hop < 3; hop++) {
      const { response } = await get(destination, { redirect: "manual" });
      if (response.status === 200) break;
      assert.equal(response.status, 301, destination);
      const next = new URL(response.headers.get("location"), destination).href;
      assert.ok(["2240speedshop.com", "www.2240speedshop.com"].includes(new URL(next).hostname));
      assert.equal(new URL(next).protocol, "https:");
      hops.push({ from: destination, status: response.status, to: next });
      destination = next;
    }
    assert.ok(hops.length > 0 && hops.length <= 2, "No redirect loop or excessive chain");
    assert.ok(destination.startsWith(base + "/"), url);
    assert.equal((await get(destination, { redirect: "manual" })).response.status, 200, destination);
    report.redirects.push({ from: url, hops, to: destination, arrivalStatus: 200 });
  }
  const quote = await get(base + "/quote.php");
  assert.equal(quote.response.status, 405, "Quote endpoint exists and rejects GET; do not send a test lead");
  report.quoteEndpoint = { getStatus: 405, actualLeadSent: false, inboxDeliveryVerified: false };
} catch (error) { report.errors.push({ error: error.message }); }
report.finishedAt = new Date().toISOString();
report.status = report.errors.length ? "FAIL" : "PASS";
await writeFile("output/published-release-check.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify({ status: report.status, release: report.release, pages: report.pages.length, assets: report.assets.length, redirects: report.redirects, quoteEndpoint: report.quoteEndpoint, errors: report.errors }, null, 2));
if (report.errors.length) process.exitCode = 1;
