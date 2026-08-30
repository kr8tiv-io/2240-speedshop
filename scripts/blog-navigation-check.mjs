import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";

const CHROME =
  process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = (process.env.BASE_URL || "https://steelblue-gaur-917651.hostingersite.com").replace(
  /\/+$/,
  "",
);

function canonicalDocumentUrl(value) {
  const url = new URL(value);
  if (url.pathname !== "/") url.pathname = url.pathname.replace(/\/+$/, "");
  return url.href;
}

const profiles = [
  { name: "desktop", width: 1440, height: 900, dsf: 1 },
  { name: "iphone-390", width: 390, height: 844, dsf: 3, mobile: true },
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: false,
  protocolTimeout: 120_000,
  args: [
    "--window-position=-2400,0",
    "--disable-features=CalculateNativeWinOcclusion",
    "--disable-backgrounding-occluded-windows",
    "--disable-renderer-backgrounding",
  ],
});

try {
  for (const profile of profiles) {
    for (const selector of [
      'section[aria-label="Featured article"] a[href^="/blog/"]',
      'section[aria-label="All articles"] a[href^="/blog/"]',
    ]) {
      const context = await browser.createBrowserContext();
      const page = await context.newPage();
      await page.setViewport({
        width: profile.width,
        height: profile.height,
        deviceScaleFactor: profile.dsf,
        isMobile: Boolean(profile.mobile),
        hasTouch: Boolean(profile.mobile),
      });
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error" && !message.text().includes("/_next/webpack-hmr")) {
          errors.push(message.text());
        }
      });

      await page.goto(`${BASE}/blog/`, { waitUntil: "domcontentloaded", timeout: 60_000 });
      const target = await page.$eval(selector, (link) => {
        link.scrollIntoView({ block: "center" });
        const rect = link.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const hit = document.elementFromPoint(x, y);
        return {
          href: link.href,
          rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
          hit: hit?.tagName || null,
          hitClosestHref: hit?.closest?.("a")?.href || null,
          pointerEvents: getComputedStyle(link).pointerEvents,
        };
      });

      await page.click(selector);
      await page.waitForFunction(
        (expected) => {
          const url = new URL(location.href);
          if (url.pathname !== "/") url.pathname = url.pathname.replace(/\/+$/, "");
          return url.href === expected;
        },
        { timeout: 8_000 },
        canonicalDocumentUrl(target.href),
      ).catch(() => {});
      const actual = page.url();
      const navigationEntry = await page.evaluate(
        () => performance.getEntriesByType("navigation")[0]?.name || null,
      );
      console.log(
        JSON.stringify({ profile: profile.name, selector, target, actual, navigationEntry, errors }),
      );
      assert.equal(
        canonicalDocumentUrl(actual),
        canonicalDocumentUrl(target.href),
        `${profile.name}: click did not navigate to ${target.href}`,
      );
      assert.equal(
        canonicalDocumentUrl(navigationEntry),
        canonicalDocumentUrl(target.href),
        `${profile.name}: article entry relied on intercepted client navigation`,
      );
      assert.deepEqual(errors, [], `${profile.name}: blog click emitted browser errors`);
      await context.close();
    }

    /* Reproduce the user path, not only a hard-loaded index: the persistent
       layout, native mobile disclosure, body lock and route veil all survive
       or clean up across Home → Journal. A stale inert shell makes every
       article look clickable while suppressing its activation. */
    const context = await browser.createBrowserContext();
    const page = await context.newPage();
    await page.setViewport({
      width: profile.width,
      height: profile.height,
      deviceScaleFactor: profile.dsf,
      isMobile: Boolean(profile.mobile),
      hasTouch: Boolean(profile.mobile),
    });
    await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await page.waitForFunction(
      () => {
        const loader = document.querySelector("[data-preloader]");
        if (!loader) return true;
        const style = getComputedStyle(loader);
        return style.visibility === "hidden" || style.display === "none";
      },
      { timeout: 20_000 },
    );
    if (profile.mobile) {
      await page.click('[aria-controls="mobile-nav"]');
      await page.waitForFunction(() => document.querySelector("details")?.open);
      await page.click('#mobile-nav a[href^="/blog"]');
    } else {
      await page.click('nav[aria-label="Primary"] a[href^="/blog"]');
    }
    await page.waitForFunction(() => /^\/blog\/?$/.test(location.pathname), { timeout: 10_000 });
    /* A native navigation updates `location` just before Chromium replaces the
       old execution context. Waiting only on the path can therefore win that
       tiny race and make the next evaluate run against a document being torn
       down. The featured section exists only in the destination document, so
       it is the stable readiness boundary for both native and client routes. */
    await page.waitForSelector(
      'section[aria-label="Featured article"] a[href^="/blog/"]',
      { visible: true, timeout: 10_000 },
    );
    const afterIndexRoute = await page.evaluate(() => ({
      inert: document.getElementById("site-shell")?.inert ?? false,
      ariaHidden: document.getElementById("site-shell")?.getAttribute("aria-hidden"),
      bodyPosition: getComputedStyle(document.body).position,
      overlay: document.documentElement.dataset.uiOverlay || null,
    }));
    const article = await page.$eval(
      'section[aria-label="Featured article"] a[href^="/blog/"]',
      (link) => link.href,
    );
    await page.click('section[aria-label="Featured article"] a[href^="/blog/"]');
    await page
      .waitForFunction(
        (expected) => {
          const url = new URL(location.href);
          if (url.pathname !== "/") url.pathname = url.pathname.replace(/\/+$/, "");
          return url.href === expected;
        },
        { timeout: 8_000 },
        canonicalDocumentUrl(article),
      )
      .catch(() => {});
    const navigationEntry = await page.evaluate(
      () => performance.getEntriesByType("navigation")[0]?.name || null,
    );
    console.log(
      JSON.stringify({
        profile: profile.name,
        scenario: "home-journal-article",
        afterIndexRoute,
        expected: article,
        actual: page.url(),
        navigationEntry,
      }),
    );
    assert.equal(
      afterIndexRoute.inert,
      false,
      `${profile.name}: site shell remained inert after entering the Journal`,
    );
    assert.equal(
      canonicalDocumentUrl(page.url()),
      canonicalDocumentUrl(article),
      `${profile.name}: routed Journal card did not navigate`,
    );
    assert.equal(
      canonicalDocumentUrl(navigationEntry),
      canonicalDocumentUrl(article),
      `${profile.name}: routed Journal card relied on intercepted client navigation`,
    );
    await context.close();
  }
  console.log("blog navigation check: PASS");
} finally {
  await browser.close();
}
