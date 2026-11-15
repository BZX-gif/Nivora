/**
 * Captures the screenshots in this folder from the running dev server.
 *
 *   npm run dev                     # in one shell
 *   node docs/screens/capture.mjs   # in another
 *
 * Requires headless Chromium as a build-time tool:
 *   npm install --no-save @sparticuz/chromium puppeteer-core
 *
 * The sandbox this was captured in can only reach npm/PyPI, so remote imagery is
 * intercepted (see README.md):
 *   - images.unsplash.com  → a local stand-in photograph from .stand-ins/ (if present)
 *                            otherwise a neutral grey panel
 *   - tile.openstreetmap.org → a neutral tile
 * Layout, typography and the identity are real; the photographs are not shipped.
 */

import fs from "node:fs";
import path from "node:path";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

const BASE = "http://127.0.0.1:3000";
const here = path.dirname(new URL(import.meta.url).pathname);
const standInDir = path.join(here, ".stand-ins");

const standIns = fs.existsSync(standInDir)
  ? fs.readdirSync(standInDir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).map((f) => path.join(standInDir, f))
  : [];

const GREY = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAMgAAAB4CAIAAAA7EHsWAAAAQ0lEQVR4nO3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAvBsYAAABbEnXhwAAAABJRU5ErkJggg==",
  "base64"
);
const TILE = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAEElEQVR4nGP4z8DwHwwAEP8D/wFB2m0AAAAASUVORK5CYII=",
  "base64"
);

const browser = await puppeteer.launch({
  args: [...chromium.args, "--no-sandbox"],
  executablePath: await chromium.executablePath(),
  headless: true,
});

const page = await browser.newPage();
await page.setRequestInterception(true);

let photoIndex = 0;
page.on("request", (req) => {
  const url = req.url();
  if (url.includes("images.unsplash.com") || url.includes("plus.unsplash.com")) {
    if (standIns.length) {
      const file = standIns[photoIndex++ % standIns.length];
      req.respond({ status: 200, contentType: "image/jpeg", body: fs.readFileSync(file) });
    } else {
      req.respond({ status: 200, contentType: "image/png", body: GREY });
    }
    return;
  }
  if (url.includes("tile.openstreetmap.org")) {
    req.respond({ status: 200, contentType: "image/png", body: TILE });
    return;
  }
  req.continue();
});

async function open(url, width, height) {
  await page.setViewport({ width, height, deviceScaleFactor: 2 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.goto(BASE + url, { waitUntil: "networkidle0", timeout: 90000 });
  await page.evaluate(() => document.fonts.ready);
  // Scroll through the page in steps so IntersectionObserver reveals fire and
  // lazy images decode, then return to the top. A single jump to the bottom
  // leaves mid-page sections unrevealed, which captures as blank bands.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 300));
  });
  await new Promise((r) => setTimeout(r, 600));
}

async function shot({ url, width, height, out, selector = null, viewport = false }) {
  await open(url, width, height);
  if (viewport) {
    // What the visitor actually sees first, with the fixed header in place.
    await page.screenshot({ path: path.join(here, out), clip: { x: 0, y: 0, width, height } });
  } else {
    const target = await page.$(selector);
    if (!target) throw new Error(`selector not found: ${selector} (${url})`);
    await target.screenshot({ path: path.join(here, out) });
  }
  console.log(`  ${out.padEnd(30)} ${width}×${height}`);
}

const JOBS = [
  // full journey — element capture of <main>; fullPage duplicates fixed headers
  { url: "/", width: 1440, height: 900, out: "home-1440.png", selector: "main" },
  { url: "/", width: 390, height: 844, out: "home-390.png", selector: "main" },
  { url: "/buy", width: 1440, height: 900, out: "buy-1440.png", selector: "main" },
  { url: "/buy", width: 390, height: 844, out: "buy-390.png", selector: "main" },
  { url: "/explore", width: 1440, height: 900, out: "explore-1440.png", selector: "main" },
  { url: "/explore", width: 390, height: 844, out: "explore-390.png", selector: "main" },
  { url: "/property/niv-001", width: 1440, height: 900, out: "property-1440.png", selector: "main" },
  { url: "/property/niv-001", width: 390, height: 844, out: "property-390.png", selector: "main" },
  { url: "/list-property", width: 1440, height: 900, out: "wizard-1440.png", selector: "main" },
  { url: "/list-property", width: 390, height: 844, out: "wizard-390.png", selector: "main" },
  { url: "/dashboard", width: 390, height: 844, out: "dashboard-390.png", selector: "main" },
  // identity — the lockup in its real contexts
  { url: "/", width: 1440, height: 900, out: "header-desktop.png", selector: "header" },
  { url: "/", width: 390, height: 844, out: "header-mobile.png", selector: "header" },
  { url: "/", width: 1440, height: 900, out: "footer-desktop.png", selector: "footer" },
  { url: "/", width: 390, height: 844, out: "footer-mobile.png", selector: "footer" },
  // hero at every breakpoint — first viewport as seen
  { url: "/", width: 1440, height: 900, out: "hero-desktop-1440.png", viewport: true },
  { url: "/", width: 1366, height: 768, out: "hero-desktop-1366.png", viewport: true },
  { url: "/", width: 1024, height: 768, out: "hero-tablet-1024.png", viewport: true },
  { url: "/", width: 768, height: 1024, out: "hero-tablet-768.png", viewport: true },
  { url: "/", width: 390, height: 844, out: "hero-mobile-390.png", viewport: true },
  { url: "/", width: 360, height: 800, out: "hero-mobile-360.png", viewport: true },
];

for (const job of JOBS) await shot(job);

await browser.close();
console.log("done");
