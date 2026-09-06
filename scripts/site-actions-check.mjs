import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer-core";
import { services, site } from "../lib/site.ts";

const BASE = (process.env.BASE_URL || "http://127.0.0.1:3197").replace(/\/+$/, "");
const OUTPUT = path.resolve(process.env.ACTION_OUTPUT || "output/playwright/site-actions-2026-09-06");
const CHROME = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const REPRESENTATIVE = process.argv.includes("--representative");
const ONLY = process.env.ACTION_ROUTES?.split(",").filter(Boolean);
const CASE_FILTER = process.env.ACTION_CASE_FILTER ? new RegExp(process.env.ACTION_CASE_FILTER) : null;
const PHOTO = path.resolve("public/shop/hero-video-poster.jpg");
const sitemap = await readFile("out/sitemap.xml", "utf8");
const allRoutes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
assert.ok(allRoutes.length >= 69, "Read the complete prepared sitemap before auditing site actions.");
const representativeRoutes = ["/", "/services/", `/services/${services[0].slug}/`, "/guides/", "/blog/",
  allRoutes.find((route) => route.startsWith("/blog/") && route !== "/blog/"), "/quote/", "/contact/", "/faq/"];
const routes = ONLY || (REPRESENTATIVE ? representativeRoutes : allRoutes);
const report = {
  base: BASE, startedAt: new Date().toISOString(), mode: REPRESENTATIVE ? "representative" : "all-pages",
  sitemapRoutes: allRoutes.length, cases: [], browserErrors: [], blockedMutations: [], mockedPosts: [], mapReadRequests: [],
  caseFilter: process.env.ACTION_CASE_FILTER || null,
  limitations: ["Chromium device emulation, not physical Safari/iPhone validation.",
    "Final POST responses are intercepted; no real email was sent and inbox delivery is unverified.",
    "Telephone/email destinations are inspected; external handlers are never launched."],
};
await mkdir(OUTPUT, { recursive: true });
const save = () => writeFile(path.join(OUTPUT, "results.json"), JSON.stringify(report, null, 2));
const profiles = [
  { name: "desktop", width: 1440, height: 900, deviceScaleFactor: 1 },
  { name: "iphone-390-emulated", width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
];
const browser = await puppeteer.launch({ executablePath: CHROME, headless: false, protocolTimeout: 120_000,
  args: ["--window-position=-2400,0", "--disable-features=CalculateNativeWinOcclusion",
    "--disable-backgrounding-occluded-windows", "--disable-renderer-backgrounding", "--disable-background-timer-throttling"] });

async function newPage(profile) {
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  await page.setViewport(profile);
  const control = { mock: null };
  page.on("pageerror", (error) => report.browserErrors.push({ profile: profile.name, url: page.url(), message: error.message }));
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    if (request.isInterceptResolutionHandled()) return;
    const url = new URL(request.url());
    // These public Maps RPCs read map tiles/place details and initialize an
    // anonymous viewing session. Blocking every POST made the real map show
    // "Place info couldn't load"; retain the strict guard on lead submissions.
    const mapRead = request.method() === "POST" && (
      (url.hostname === "maps.googleapis.com" &&
        /^\/\$rpc\/google\.internal\.maps\.mapsjs\.v1\.MapsJsInternalService\/(GetViewportInfo|InitMapsJwt|GetPlaceWidgetMetadata)$/.test(url.pathname)) ||
      (url.hostname === "places.googleapis.com" && url.pathname === "/$rpc/google.maps.places.v1.Places/GetPlace")
    );
    if (mapRead) {
      report.mapReadRequests.push({ origin: url.origin, path: url.pathname });
      void request.continue();
      return;
    }
    if (!["GET", "HEAD", "OPTIONS"].includes(request.method())) {
      if (url.pathname === "/quote.php" && request.method() === "POST" && control.mock) {
        report.mockedPosts.push({ profile: profile.name, result: control.mock, method: request.method(), path: url.pathname });
        void request.respond({ status: control.mock === "success" ? 200 : 503, contentType: "application/json",
          body: JSON.stringify(control.mock === "success"
            ? { ok: true, reference: "Q-QATEST", photosReceived: 1, photosStored: 1 }
            : { ok: false, error: "QA simulated failure — no request was sent." }) });
      } else {
        report.blockedMutations.push({ profile: profile.name, method: request.method(), origin: url.origin, path: url.pathname });
        void request.abort("blockedbyclient");
      }
    } else void request.continue();
  });
  return { page, context, control };
}

async function settled(page) {
  await page.waitForFunction(() => {
    const loader = document.querySelector("[data-preloader]");
    const style = loader ? getComputedStyle(loader) : null;
    return !loader || style.visibility === "hidden" || style.display === "none";
  }, { timeout: 30_000 });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
  await page.waitForFunction(() => {
    const veil = document.querySelector(".route-veil");
    if (!veil) return true;
    const style = getComputedStyle(veil);
    return style.visibility === "hidden" || style.display === "none";
  }, { timeout: 8_000 });
}

async function visit(page, route) {
  // A same-document goto returns null and preserves the previous form state.
  // Each independent case starts a real document; repeated actions are tested
  // explicitly below without another visit in between.
  await page.goto("about:blank");
  const response = await page.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded", timeout: 60_000 });
  // Production correctly revalidates cached HTML with 304; Chromium supplies
  // the cached document. The fresh local no-store server always returns 200.
  assert.ok([200, 304].includes(response?.status()), `Document ${route} must load or revalidate successfully (${response?.status()}).`);
  await page.waitForSelector("main", { timeout: 15_000 });
  await settled(page);
}

async function click(page, selector) {
  await page.waitForSelector(selector, { visible: true, timeout: 12_000 });
  await page.$eval(selector, (element) => {
    element.scrollIntoView({ block: "center", behavior: "instant" });
    const lenis = window.__lenis2240;
    if (lenis && !lenis.isStopped) lenis.scrollTo(window.scrollY, { immediate: true });
  });
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const point = await page.$eval(selector, (element) => {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const hit = document.elementFromPoint(x, y);
    return { x, y, receivesPointer: hit === element || element.contains(hit),
      hit: hit?.outerHTML.slice(0, 220), inert: Boolean(element.closest("[inert]")) };
  });
  assert.equal(point.inert, false, `${selector} cannot remain inside an inert page.`);
  assert.equal(point.receivesPointer, true, `${selector} is obscured by ${point.hit}`);
  if (page.viewport()?.hasTouch) await page.touchscreen.tap(point.x, point.y);
  else await page.mouse.click(point.x, point.y);
}

async function formArrival(page) {
  await page.waitForFunction(() => /^\/quote\/?$/.test(location.pathname) && location.hash === "#form", { timeout: 15_000 });
  await page.waitForSelector('#form input[name="service"]', { visible: true, timeout: 15_000 });
  await page.waitForFunction(() => {
    const form = document.querySelector("#form form");
    const header = document.querySelector("header");
    if (!form) return false;
    const rect = form.getBoundingClientRect();
    return rect.top >= (header?.getBoundingClientRect().bottom || 0) - 2 && rect.top < Math.min(innerHeight * 0.6, 400);
  }, { timeout: 10_000 });
  return page.evaluate(() => ({ url: location.href, scrollY,
    formTop: document.querySelector("#form form").getBoundingClientRect().top,
    headerBottom: document.querySelector("header").getBoundingClientRect().bottom,
    inert: document.getElementById("site-shell")?.inert || false,
    bodyPosition: getComputedStyle(document.body).position,
    horizontalOverflow: document.documentElement.scrollWidth - innerWidth }));
}

async function checkContactDestinations(page) {
  const destinations = await page.$$eval('a[href^="tel:"], a[href^="mailto:"]', (links) => links.map((link) => link.getAttribute("href")));
  for (const href of destinations) {
    if (href.startsWith("tel:")) assert.equal(href.slice(4).replace(/\D/g, ""), site.phone.replace(/\D/g, ""));
    else assert.equal(decodeURIComponent(href.slice(7).split("?")[0]).toLowerCase(), site.email.toLowerCase());
  }
  return destinations.length;
}

async function summaries(page) {
  const count = await page.$$eval("main details > summary", (elements) => elements.length);
  for (let i = 0; i < count; i++) {
    await page.$$eval("main details > summary", (elements, index) => {
      elements[index].dataset.actionSummary = "selected";
    }, i);
    const selector = '[data-action-summary="selected"]';
    const initial = await page.$eval(selector, (element) => element.parentElement.open);
    await click(page, selector);
    await page.waitForFunction((before) => document.querySelector('[data-action-summary="selected"]').parentElement.open !== before, {}, initial);
    await click(page, selector);
    await page.waitForFunction((before) => document.querySelector('[data-action-summary="selected"]').parentElement.open === before, { timeout: 5_000 }, initial);
    assert.equal(await page.$eval(selector, (element) => element.parentElement.open), initial);
    await page.$eval(selector, (element) => delete element.dataset.actionSummary);
  }
  return count;
}

async function pageCta(page, mobile = false) {
  const selected = await page.evaluate(() => {
    const candidates = [...document.querySelectorAll('main a[href*="/quote"]')];
    const callsToAction = candidates.filter((link) => /start.*(?:quote|build)|get.*quote|send.*(?:photos|project|details|sheet)/i.test(link.textContent));
    const plain = candidates.find((link) => !new URL(link.href).search);
    const link = callsToAction[0] || plain || candidates[0] || document.querySelector('nav[aria-label="Primary"] a[href*="/quote"]');
    if (!link) return null;
    link.dataset.actionCta = "selected";
    return { href: link.getAttribute("href"), label: link.textContent.trim(), main: Boolean(link.closest("main")) };
  });
  assert.ok(selected, "Page must offer a quote CTA in its content or shared navigation.");
  if (mobile && !selected.main) {
    await click(page, '[aria-controls="mobile-nav"]');
    await click(page, '#mobile-nav a[href*="/quote"]');
  } else await click(page, '[data-action-cta="selected"]');
  return { selected, arrival: await formArrival(page) };
}

async function runCase(page, profile, name, action) {
  if (CASE_FILTER && !CASE_FILTER.test(name)) return;
  const started = Date.now();
  const beforeErrors = report.browserErrors.length;
  try {
    const evidence = await action();
    assert.equal(report.browserErrors.length, beforeErrors, "Action must not produce an uncaught browser error.");
    report.cases.push({ profile, name, pass: true, milliseconds: Date.now() - started, evidence });
  } catch (error) {
    const screenshot = `${report.cases.length}-${profile}-${name.replace(/[^a-z0-9]+/gi, "-").slice(0, 70)}.png`;
    await page.screenshot({ path: path.join(OUTPUT, screenshot) }).catch(() => {});
    report.cases.push({ profile, name, pass: false, milliseconds: Date.now() - started, error: error.message, stack: error.stack,
      url: page.url(), screenshot });
  }
  await save();
  console.log(JSON.stringify(report.cases.at(-1)));
}

async function expectStep(page, index) {
  await page.waitForFunction((expected) => document.querySelector('[aria-label="Quote progress"] [aria-current="step"]')?.textContent.trim().startsWith(expected),
    { timeout: 8_000 }, String(index).padStart(2, "0"));
}
const next = (page) => click(page, '#form button[type="submit"]');
const back = (page) => click(page, '#form form > div:last-child button[type="button"]');
async function fill(page, selector, value) {
  await click(page, selector);
  await page.keyboard.down("Control");
  await page.keyboard.press("A");
  await page.keyboard.up("Control");
  await page.type(selector, value);
}

async function formFlow(page, control) {
  await visit(page, "/quote/#form");
  await formArrival(page);
  await next(page);
  await page.waitForFunction(() => document.querySelector("#form").textContent.includes("Pick the closest lane"));
  await expectStep(page, 1);
  await click(page, `#form input[name="service"][value="${services[0].slug}"]`);
  await next(page);
  await expectStep(page, 2);
  await next(page);
  await page.waitForSelector('#year[aria-invalid="true"]');
  await fill(page, "#year", "1899");
  await next(page);
  assert.equal(await page.$eval("#year", (element) => element.getAttribute("aria-invalid")), "true");
  await fill(page, "#year", "1968");
  await fill(page, "#make", "Dodge");
  await fill(page, "#model", "QA fixture — never sent");
  await click(page, '#form input[name="condition"][value="Running and driving"]');
  await back(page);
  await expectStep(page, 1);
  assert.equal(await page.$eval('#form input[name="service"]:checked', (element) => element.value), services[0].slug);
  await next(page);
  await expectStep(page, 2);
  assert.equal(await page.$eval("#year", (element) => element.value), "1968");
  await next(page);
  await expectStep(page, 3);
  await next(page);
  await page.waitForSelector('#budget[aria-invalid="true"]');
  await click(page, '#form input[name="scope"][value="Not sure yet"]');
  await page.select("#budget", "Need a number before I can say");
  await next(page);
  await expectStep(page, 4);
  await (await page.$("#photos")).uploadFile(PHOTO);
  await page.waitForSelector("#form form ul li");
  assert.equal(await page.$$eval("#form form ul li", (elements) => elements.length), 1);
  await click(page, "#form form ul li button");
  await page.waitForFunction(() => !document.querySelector("#form form ul li"));
  await (await page.$("#photos")).uploadFile(PHOTO);
  await page.waitForSelector("#form form ul li");
  await next(page);
  await expectStep(page, 5);
  await next(page);
  await page.waitForSelector('#name[aria-invalid="true"]');
  await fill(page, "#name", "Automated QA fixture — intercepted only");
  await click(page, '#form input[name="method"][value="Email"]');
  await fill(page, "#email", "invalid");
  await next(page);
  await page.waitForSelector('#email[aria-invalid="true"]');
  await fill(page, "#email", "qa@example.com");
  await back(page);
  await expectStep(page, 4);
  assert.equal(await page.$$eval("#form form ul li", (elements) => elements.length), 1);
  await next(page);
  await expectStep(page, 5);
  control.mock = "failure";
  await next(page);
  await page.waitForFunction(() => document.querySelector('#form [role="alert"]')?.textContent.includes("QA simulated failure"));
  assert.equal(await page.$eval("#email", (element) => element.value), "qa@example.com");
  control.mock = "success";
  await next(page);
  await page.waitForFunction(() => document.querySelector('#form [role="status"]')?.textContent.includes("Q-QATEST"));
  assert.ok(await page.$eval('#form [role="status"]', (element) => element.textContent.includes("hero-video-poster.jpg")));
  const contactDestinations = await checkContactDestinations(page);
  await click(page, '#form [role="status"] button');
  await expectStep(page, 1);
  control.mock = null;
  return { steps: 5, validation: ["service", "vehicle", "year-range", "scope-budget", "contact", "email"],
    backPreservesSelections: true, photoAddedRemovedReadded: true, mockedFailureThenSuccess: true, reset: true, contactDestinations };
}

async function footerCases(page, profile) {
  const sourceRoute = profile === "desktop" ? "/services/" : "/guides/";
  await visit(page, sourceRoute);
  const links = await page.$$eval("footer a[href]", (elements) => [...new Set(elements
    .filter((element) => new URL(element.href).origin === location.origin)
    .map((element) => element.getAttribute("href")))]);
  for (const href of links) await runCase(page, profile, `footer-link ${href}`, async () => {
    const expected = new URL(href, BASE);
    await visit(page, expected.pathname.replace(/\/+$/, "") === sourceRoute.replace(/\/+$/, "") ? "/about/" : sourceRoute);
    await page.$$eval("footer a[href]", (elements, wanted) => {
      const link = elements.find((element) => element.getAttribute("href") === wanted);
      if (link) link.dataset.footerAction = "selected";
    }, href);
    await click(page, '[data-footer-action="selected"]');
    await page.waitForFunction((wanted) => {
      const current = new URL(location.href);
      return current.pathname.replace(/\/+$/, "") === wanted.pathname.replace(/\/+$/, "")
        && current.search === wanted.search && current.hash === wanted.hash;
    }, { timeout: 12_000 }, { pathname: expected.pathname, search: expected.search, hash: expected.hash });
    const arrival = expected.hash === "#form" ? await formArrival(page) : { url: page.url() };
    return { href, arrival };
  });
  await runCase(page, profile, "home-footer-after-garage-credit-and-contact", async () => {
    await visit(page, "/?perf");
    await page.evaluate(() => {
      const runway = document.querySelector("#walkthrough-runway");
      const rect = runway.getBoundingClientRect();
      const y = rect.top + scrollY + 0.16 * (rect.height - innerHeight);
      if (window.__lenis2240) window.__lenis2240.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo(0, y);
    });
    await page.waitForFunction(() => document.querySelector("[data-shop-stage]")?.getAttribute("data-shop-stage") === "world", { timeout: 90_000 });
    const newTab = browser.waitForTarget((target) => target.opener() === page.target(), { timeout: 12_000 })
      .then((target) => ({ target }), (error) => ({ error }));
    await click(page, 'footer a[href="https://kr8tiv.io"]');
    const observed = await newTab;
    if (observed.error) throw observed.error;
    const popup = await observed.target.page();
    assert.ok(popup, "KR8TIV must open its requested browser tab.");
    await popup.waitForFunction(() => /(^|\.)kr8tiv\.io$/.test(location.hostname), { timeout: 12_000 });
    const creditDestination = popup.url();
    await popup.close();
    const contact = await page.$$eval("footer a[href]", (elements) => {
      const link = elements.find((element) => /^\/contact\/?$/.test(new URL(element.href).pathname));
      if (link) link.dataset.footerAction = "contact";
      return link?.href;
    });
    assert.ok(contact);
    await click(page, '[data-footer-action="contact"]');
    await page.waitForFunction(() => /^\/contact\/?$/.test(location.pathname), { timeout: 12_000 });
    return { garageReadyBeforeExit: true, creditDestination, contactDestination: page.url() };
  });
}

try {
  const desktop = await newPage(profiles[0]);
  for (const route of routes) await runCase(desktop.page, "desktop", `page-CTA ${route}`, async () => {
    await visit(desktop.page, route);
    let decorativeCanvas = null;
    if (["/services/", "/builds/"].includes(route)) {
      const selector = 'div[aria-hidden="true"][class*="z-30"] canvas';
      await desktop.page.waitForSelector(selector, { visible: true, timeout: 15_000 });
      decorativeCanvas = await desktop.page.$eval(selector, (element) => ({
        mounted: true, pointerEvents: getComputedStyle(element).pointerEvents,
      }));
    }
    const contactDestinations = await checkContactDestinations(desktop.page);
    const disclosures = await summaries(desktop.page);
    return { route, contactDestinations, disclosures, decorativeCanvas, ...await pageCta(desktop.page) };
  });
  await runCase(desktop.page, "desktop", "contact-address-map", async () => {
    await visit(desktop.page, "/contact/");
    const iframe = await desktop.page.waitForSelector('iframe[title^="Map showing 2240"]');
    await iframe.evaluate((element) => element.scrollIntoView({ block: "center", behavior: "instant" }));
    const source = await iframe.evaluate((element) => ({ src: element.src, title: element.title }));
    assert.ok(new URL(source.src).searchParams.get("q")?.includes(site.street), "Map uses the published street address.");
    const frame = await iframe.contentFrame();
    assert.ok(frame, "Address map must create a real frame.");
    // Google renders the place card outside body.innerText. Verify its resolved
    // place payload (including the phone, which is not in our query) and loaded
    // map imagery, then preserve a screenshot for visual confirmation.
    await frame.waitForFunction(() => {
      const data = document.body?.textContent || "";
      return document.readyState === "complete" && /2240\s*Speed\s*Shop/i.test(data)
        && data.includes("2009 91 Ave") && data.includes("(780) 999-6450")
        && [...document.images].filter(image => image.complete && image.naturalWidth > 0).length >= 8;
    },
      { timeout: 25_000 });
    const contents = await frame.evaluate(() => ({ url: location.href, text: document.body.innerText.slice(0, 1600), images: document.images.length }));
    assert.doesNotMatch(contents.text, /refused to connect|blocked by.*policy|ERR_BLOCKED|Place info couldn.t load/i);
    const screenshot = "contact-address-map.png";
    await iframe.screenshot({ path: path.join(OUTPUT, screenshot) });
    return { ...source, contents, screenshot };
  });
  for (const service of services) await runCase(desktop.page, "desktop", `service-lane ${service.slug}`, async () => {
    await visit(desktop.page, "/quote/");
    await click(desktop.page, `main a[href*="?service=${service.slug}#form"]`);
    const arrival = await formArrival(desktop.page);
    await desktop.page.waitForFunction((expected) => document.querySelector('#form input[name="service"]:checked')?.value === expected,
      { timeout: 8_000 }, service.slug);
    return { service: service.slug, arrival };
  });
  await runCase(desktop.page, "desktop", "cold-fragment-guides-quote-and-back", async () => {
    await visit(desktop.page, "/quote/#form");
    await formArrival(desktop.page);
    await click(desktop.page, 'nav[aria-label="Primary"] a[href^="/guides"]');
    await desktop.page.waitForFunction(() => /^\/guides\/?$/.test(location.pathname), { timeout: 12_000 });
    await settled(desktop.page);
    const returned = await pageCta(desktop.page);
    await desktop.page.goBack({ waitUntil: "domcontentloaded", timeout: 15_000 });
    await desktop.page.waitForFunction(() => /^\/guides\/?$/.test(location.pathname), { timeout: 12_000 });
    return { returned, backDestination: desktop.page.url() };
  });
  await runCase(desktop.page, "desktop", "service-query-repeat-change-and-back", async () => {
    const first = services[0].slug;
    const second = services[1].slug;
    await visit(desktop.page, `/quote/?service=${first}#form`);
    await formArrival(desktop.page);
    const token = await desktop.page.evaluate(() => (window.__qaDocumentToken = crypto.randomUUID()));
    await click(desktop.page, `main a[href*="?service=${first}#form"]`);
    await formArrival(desktop.page);
    assert.equal(await desktop.page.evaluate(() => window.__qaDocumentToken), token, "Repeated same-query anchor must not reload the document.");
    await click(desktop.page, `main a[href*="?service=${second}#form"]`);
    await formArrival(desktop.page);
    await desktop.page.waitForFunction((expected) => document.querySelector('#form input[name="service"]:checked')?.value === expected, {}, second);
    await desktop.page.goBack({ waitUntil: "domcontentloaded", timeout: 15_000 });
    await desktop.page.waitForFunction((expected) => new URLSearchParams(location.search).get("service") === expected
      && document.querySelector('#form input[name="service"]:checked')?.value === expected, {}, first);
    return { first, second, backDestination: desktop.page.url() };
  });
  await runCase(desktop.page, "desktop", "same-page-header-repeat", async () => {
    await visit(desktop.page, "/quote/#form");
    await formArrival(desktop.page);
    const token = await desktop.page.evaluate(() => (window.__qaDocumentToken = crypto.randomUUID()));
    const arrivals = [];
    for (let i = 0; i < 2; i++) {
      await desktop.page.evaluate(() => window.__lenis2240
        ? window.__lenis2240.scrollTo(0, { immediate: true })
        : window.scrollTo({ top: 0, behavior: "instant" }));
      await click(desktop.page, 'nav[aria-label="Primary"] a[href*="/quote"]');
      arrivals.push(await formArrival(desktop.page));
      assert.equal(await desktop.page.evaluate(() => window.__qaDocumentToken), token, "Same-page header anchor must not reload the document.");
    }
    return arrivals;
  });
  await runCase(desktop.page, "desktop", "quote-form-validation-and-mocked-send", () => formFlow(desktop.page, desktop.control));
  await footerCases(desktop.page, "desktop");
  await desktop.context.close();

  const mobile = await newPage(profiles[1]);
  for (const route of ["/guides/", "/blog/", "/quote/"]) await runCase(mobile.page, profiles[1].name, `mobile-menu-CTA ${route}`, async () => {
    await visit(mobile.page, route);
    const disclosures = await summaries(mobile.page);
    await click(mobile.page, '[aria-controls="mobile-nav"]');
    await mobile.page.waitForFunction(() => document.querySelector('[aria-controls="mobile-nav"]').parentElement.open);
    await click(mobile.page, '#mobile-nav a[href*="/quote"]');
    const arrival = await formArrival(mobile.page);
    assert.equal(arrival.inert, false);
    assert.notEqual(arrival.bodyPosition, "fixed");
    assert.ok(arrival.horizontalOverflow <= 1);
    return { disclosures, arrival };
  });
  await runCase(mobile.page, profiles[1].name, "same-page-menu-repeat", async () => {
    await visit(mobile.page, "/quote/#form");
    await formArrival(mobile.page);
    const token = await mobile.page.evaluate(() => (window.__qaDocumentToken = crypto.randomUUID()));
    const arrivals = [];
    for (let i = 0; i < 2; i++) {
      await mobile.page.evaluate(() => window.__lenis2240
        ? window.__lenis2240.scrollTo(0, { immediate: true })
        : window.scrollTo({ top: 0, behavior: "instant" }));
      await click(mobile.page, '[aria-controls="mobile-nav"]');
      await click(mobile.page, '#mobile-nav a[href*="/quote"]');
      arrivals.push(await formArrival(mobile.page));
      assert.equal(await mobile.page.evaluate(() => window.__qaDocumentToken), token, "Same-page mobile anchor must not reload the document.");
    }
    return arrivals;
  });
  await runCase(mobile.page, profiles[1].name, "quote-form-validation-and-mocked-send", () => formFlow(mobile.page, mobile.control));
  await footerCases(mobile.page, profiles[1].name);
  await mobile.context.close();
} finally {
  await browser.close();
  report.finishedAt = new Date().toISOString();
  report.summary = { passed: report.cases.filter((result) => result.pass).length,
    failed: report.cases.filter((result) => !result.pass).length, browserErrors: report.browserErrors.length,
    blockedUnexpectedMutations: report.blockedMutations.length, mockedPosts: report.mockedPosts.length };
  await save();
}
console.log(JSON.stringify({ output: OUTPUT, summary: report.summary }));
if (report.summary.failed || report.summary.browserErrors || report.summary.blockedUnexpectedMutations) process.exitCode = 1;
