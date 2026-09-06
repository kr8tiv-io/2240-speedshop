import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync("components/IntentLink.tsx", "utf8");
const tree = ts.createSourceFile("IntentLink.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const handler = tree.statements.find((node) => ts.isFunctionDeclaration(node) && node.name?.text === "navigateSameDocumentHash");
assert.ok(handler, "Handle same-document fragments natively instead of duplicating the current hash in Next's route cache");
const js = ts.transpileModule(handler.getText(tree) + "\nmodule.exports = navigateSameDocumentHash;", {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
function check({ current = "https://2240speedshop.com/quote/#form", href = "https://2240speedshop.com/quote/#form", target = "", download = false, overrides = {}, expected = true, newerNavigation = false } = {}) {
  const frames = [];
  const navigations = [];
  const historyUpdates = [];
  const scrolls = [];
  const event = { button: 0, defaultPrevented: false, ...overrides,
    currentTarget: { href, target, hasAttribute: (name) => name === "download" && download },
    preventDefault() { this.defaultPrevented = true; },
  };
  const context = vm.createContext({ URL, module: { exports: {} }, document: { getElementById: (id) => ({ id, scrollIntoView: () => scrolls.push(id) }) }, window: {
    location: { href: current, assign: (url) => navigations.push(url) },
    requestAnimationFrame: (callback) => frames.push(callback),
    history: { pushState: (_state, _title, url) => historyUpdates.push(url) },
  } });
  vm.runInContext(js, context);
  context.module.exports(event);
  assert.equal(frames.length, expected ? 1 : 0);
  assert.equal(navigations.length, 0, "Allow mobile menu cleanup before fragment navigation");
  if (expected) {
    assert.equal(event.defaultPrevented, true, "Next must not append another fragment");
    if (newerNavigation) context.window.location.href = "https://2240speedshop.com/about/";
    frames[0]();
    const nativeDestination = new URL(current);
    nativeDestination.hash = new URL(href).hash;
    const queryChange = new URL(current).search !== new URL(href).search;
    if (queryChange) {
      nativeDestination.search = new URL(href).search;
      assert.deepEqual(navigations, [], "Changing a static quote lane must not reload the document");
      assert.deepEqual(historyUpdates, newerNavigation ? [] : [nativeDestination.href], "Native history keeps lane changes and Back synchronized with useSearchParams");
      assert.deepEqual(scrolls, newerNavigation ? [] : ["form"]);
    } else assert.deepEqual(navigations, newerNavigation ? [] : [nativeDestination.href], "Use one exact hash without slash-only reloads or overwriting newer navigation");
  }
}
check();
check({ current: "https://2240speedshop.com/quote/#form#form" });
check({ current: "https://2240speedshop.com/quote/" });
check({ current: "https://2240speedshop.com/quote" });
check({ href: "https://2240speedshop.com/quote#form" });
check({ newerNavigation: true });
check({ href: "https://2240speedshop.com/quote/?service=restoration#form" });
check({ current: "https://2240speedshop.com/quote/?service=restoration#form", href: "https://2240speedshop.com/quote/?service=engine#form" });
check({ current: "https://2240speedshop.com/quote/?service=restoration#form" });
check({ current: "https://2240speedshop.com/quote/?service=restoration#form", href: "https://2240speedshop.com/quote/?service=restoration#form" });
for (const overrides of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }, { defaultPrevented: true }]) check({ overrides, expected: false });
check({ target: "_blank", expected: false });
check({ download: true, expected: false });
for (const href of ["https://2240speedshop.com/about/#form", "https://kr8tiv.io/quote/#form", "https://2240speedshop.com/quote/"]) check({ href, expected: false });
check({ current: "https://2240speedshop.com/about/?page=1", href: "https://2240speedshop.com/about/?page=2#form", expected: false });
assert.match(source, /onClick\?\.\(event\);[\s\S]*?navigateSameDocumentHash\(event\)/, "Preserve caller handlers and their cancellation before native routing");
assert.match(readFileSync("components/Footer.tsx", "utf8"), /<IntentLink\s+href=\{l.href\}/, "Shared footer Quote uses the same tested behavior");
assert.match(readFileSync("app/quote/page.tsx", "utf8"), /<IntentLink[\s\S]*?href=\{`\/quote\?service=\$\{s.slug\}#form`\}/, "Repeated service-lane fragments use the same handler; query changes still navigate");
console.log("same-document hash contract: PASS — exact fragment, menu cleanup, query routing and native modified clicks");
