import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const nav = await readFile(new URL("../components/Nav.tsx", import.meta.url), "utf8");
const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");
const overlay = await readFile(
  new URL("../components/ui-overlay.ts", import.meta.url),
  "utf8",
).catch(() => "");
const home = await readFile(
  new URL("../components/home/HomeCinema.tsx", import.meta.url),
  "utf8",
);
const shop = await readFile(
  new URL("../components/shop/WalkthroughWorld.tsx", import.meta.url),
  "utf8",
);
const images = await readFile(
  new URL("../components/gl/GLImagesLayer.tsx", import.meta.url),
  "utf8",
);

assert.ok(/h-12 w-12/.test(nav), "The mobile menu control must be at least 48×48 CSS px.");
assert.ok(
  /role="dialog"/.test(nav) && /aria-modal="true"/.test(nav),
  "The open mobile navigation must expose modal dialog semantics.",
);
assert.ok(
  /fixed inset-0/.test(nav) && /bg-\[#070708\]/.test(nav) && /isolate/.test(nav),
  "The menu must be an opaque isolated viewport layer.",
);
assert.ok(
  /event\.key === "Escape"/.test(nav) && /event\.key !== "Tab"/.test(nav),
  "Escape and tab containment must be explicit.",
);
assert.ok(
  /shell\.inert = true/.test(nav) && /body\.style\.position = "fixed"/.test(nav),
  "The underlying site must be inert and the iOS body must be fixed while open.",
);
assert.ok(/setUIOverlay\("menu"\)/.test(nav), "Opening the menu must publish renderer pause state.");
assert.ok(/id="site-shell"/.test(layout), "Main content and footer need one inert-able shell.");
assert.ok(/viewportFit: "cover"/.test(layout), "Apple safe-area layout requires viewport-fit=cover.");
assert.ok(
  /useSyncExternalStore/.test(overlay) && /data-ui-overlay/.test(overlay),
  "Overlay state must be shared without importing a renderer.",
);
assert.ok(
  /useUIOverlay/.test(home) && /useUIOverlay/.test(shop) && /useUIOverlay/.test(images),
  "Hero, shop, and image canvases must all park behind the modal layer.",
);

console.log("mobile menu contract: PASS");
