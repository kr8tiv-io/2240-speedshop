import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
const { useTexture } = require("@react-three/drei");
const THREE = require("three");
const { peek } = createRequire(require.resolve("@react-three/fiber"))("suspend-react");
const source = await readFile(new URL("../components/shop/ShopWorld.tsx", import.meta.url), "utf8");
const ast = ts.createSourceFile("ShopWorld.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
let created, gallery;
const definitions = [];
function visit(node) {
  if (ts.isJsxAttribute(node) && node.name.getText(ast) === "onCreated") created = node.initializer.expression;
  if (ts.isFunctionDeclaration(node) && node.name?.text === "OfficeGallery") gallery = node;
  if (ts.isVariableDeclaration(node) && ["SHOP_BASE", "SHOP_VERSION", "SHOP_VERSION_QUERY", "WALL_PHOTO"].includes(node.name.getText(ast))) {
    definitions.push(`const ${node.getText(ast)};`);
  }
  ts.forEachChild(node, visit);
}
visit(ast);
assert.ok(created && gallery);
let preload;
function findPreload(node) {
  if (ts.isCallExpression(node) && node.expression.getText(ast) === "useTexture.preload") preload = node;
  ts.forEachChild(node, findPreload);
}
findPreload(created);
assert.ok(preload, "Request the exact office textures at renderer creation, not only when station five mounts");
assert.equal(preload.arguments[0].getText(ast), "Object.values(WALL_PHOTO)", "Reuse the gallery's identical ordered cache key");
assert.match(gallery.getText(ast), /useTexture\(WALL_PHOTO\)/);

const executable = ts.transpileModule(`${definitions.join("\n")}\nmodule.exports = { urls: Object.values(WALL_PHOTO), start: () => ${preload.getText(ast)} };`, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText;
const context = vm.createContext({ module: { exports: {} }, useTexture, process: { env: { NEXT_PUBLIC_BASE_PATH: "/preview", NEXT_PUBLIC_SHOP_VERSION: "exact-version" } } });
vm.runInContext(executable, context);
const { urls, start } = context.module.exports;
assert.deepEqual(Array.from(urls, url => url.split("/").at(-1)), [
  "car-d100-truck.jpg?v=exact-version", "car-green-coupe.jpg?v=exact-version",
  "car-black-muscle.jpg?v=exact-version", "car-blue-pickup.jpg?v=exact-version",
  "car-red-pickup.jpg?v=exact-version", "car-black-classic.jpg?v=exact-version",
  "badge-2240-sign.png?v=exact-version",
]);
assert.ok(urls.every(url => url.startsWith("/preview/shop/")));

// Replace only the browser image transport. Real drei/Fiber/suspend-react and
// Three ImageLoader/TextureLoader own the request, cache and texture objects.
const originalDocument = globalThis.document;
const images = [];
globalThis.document = { createElementNS(_namespace, tag) {
  assert.equal(tag, "img");
  const image = new EventTarget();
  Object.defineProperty(image, "src", { set(value) { image.url = value; }, get() { return image.url; } });
  images.push(image);
  return image;
} };
try {
  start(); start();
  assert.equal(images.length, 7, "Repeated startup must share in-flight image requests");
  for (const image of images) { image.complete = true; image.dispatchEvent(new Event("load")); }
  await new Promise(resolve => setTimeout(resolve, 0));
  const first = peek([THREE.TextureLoader, ...urls]);
  assert.equal(first.length, 7, "The actual gallery cache key must already contain all seven textures");
  assert.ok(first.every((texture, index) => texture.image === images[index]), "Keep the exact decoded images without replacement or re-encoding");
  start();
  assert.equal(images.length, 7, "Gallery reuse/route return must not start another transfer");
  assert.equal(peek([THREE.TextureLoader, ...urls]), first, "Preserve texture identity through cache reuse");
} finally {
  useTexture.clear(urls);
  globalThis.document = originalDocument;
}
console.log("PASS: renderer-gated office preload, exact versioned URLs and decoded images, shared in-flight/completed texture cache");
