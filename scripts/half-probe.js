const puppeteer = require("puppeteer-core");
(async () => {
  const b = await puppeteer.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", headless: false, args: ["--window-position=-2400,0","--mute-audio","--no-first-run"] });
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  await p.goto("http://localhost:3213/", { waitUntil: "domcontentloaded", timeout: 120000 });
  await new Promise(r => setTimeout(r, 12000));
  const out = await p.evaluate(() => {
    const f = window.__film;
    return { half: f.half.map(h => [h.x, h.y, h.z].map(v => +v.toFixed(2))), centreY: f.centreY.map(v => +v.toFixed(2)) };
  });
  console.log(JSON.stringify(out));
  await b.close();
})();
