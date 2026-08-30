import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const versioner = await readFile(new URL("./model-version.js", import.meta.url), "utf8");
const config = await readFile(new URL("../next.config.ts", import.meta.url), "utf8");
const optimized = await readFile(new URL("../lib/optimized.ts", import.meta.url), "utf8");
const imageLoader = await readFile(new URL("../lib/image-loader.ts", import.meta.url), "utf8");
const cinema = await readFile(new URL("../components/home/HomeCinema.tsx", import.meta.url), "utf8");
const shop = await readFile(new URL("../components/shop/ShopWorld.tsx", import.meta.url), "utf8");

assert.match(versioner, /function shopVersion\(/);
assert.match(versioner, /module\.exports\.shopVersion = shopVersion/);
assert.match(config, /NEXT_PUBLIC_SHOP_VERSION: SHOP_VERSION/);
assert.match(optimized, /export function versionShopAsset/);
assert.match(optimized, /\?v=\$\{SHOP_VERSION\}/);
assert.match(imageLoader, /NEXT_PUBLIC_SHOP_VERSION/);
assert.match(cinema, /versionShopAsset\("\/shop\/hero-still-mobile\.jpg"\)/);
assert.match(shop, /const SHOP_VERSION_QUERY = SHOP_VERSION \? `\?v=\$\{SHOP_VERSION\}` : ""/);

console.log("shop image version contract: PASS");
