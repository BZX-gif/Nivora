/**
 * Rasterises the brand SVGs to the PNG sizes that platforms require.
 *
 *   node docs/brand/render-pngs.mjs
 *
 * Uses headless Chromium — a build-time tool, not a runtime dependency:
 *   npm install --no-save @sparticuz/chromium puppeteer-core
 *   (sandbox: run with LD_LIBRARY_PATH pointing at the decompressed al2023 libs)
 *
 * Everything rasterised here is generated from the same SVG sources, so the PNGs
 * can never drift from the vector originals.
 */

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const brand = path.join(root, "public/brand");
const read = (name) => fs.readFileSync(path.join(brand, name), "utf8");

const TARGETS = [
  { svg: "nivora-favicon-16.svg", png: "favicon-16.png", size: 16 },
  { svg: "nivora-favicon.svg", png: "favicon-32.png", size: 32 },
  { svg: "nivora-app-icon.svg", png: "apple-touch-icon.png", size: 180 },
  { svg: "nivora-app-icon.svg", png: "icon-192.png", size: 192 },
  { svg: "nivora-app-icon.svg", png: "icon-512.png", size: 512 },
  { svg: "nivora-social-avatar.svg", png: "social-avatar-1024.png", size: 1024 },
];

const browser = await puppeteer.launch({
  args: [...chromium.args, "--no-sandbox"],
  executablePath: await chromium.executablePath(),
  headless: true,
});

const page = await browser.newPage();

for (const target of TARGETS) {
  const svg = read(target.svg).replace(
    "<svg",
    `<svg width="${target.size}" height="${target.size}"`
  );
  await page.setViewport({ width: target.size, height: target.size, deviceScaleFactor: 1 });
  await page.setContent(
    `<!doctype html><html><body style="margin:0;padding:0;background:transparent">${svg}</body></html>`,
    { waitUntil: "load" }
  );
  await page.screenshot({
    path: path.join(brand, target.png),
    clip: { x: 0, y: 0, width: target.size, height: target.size },
    omitBackground: true,
  });
  const bytes = fs.statSync(path.join(brand, target.png)).size;
  console.log(`  ${target.png.padEnd(26)} ${String(target.size).padStart(5)}px ${String(bytes).padStart(6)} B`);
}

/* Open Graph card — 1200×630, typographic, no imagery. */
const lockupSvg = read("nivora-logo-white.svg").replace("<svg", `<svg width="360" height="94"`);
const ogHtml = `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face {
    font-family: "InterLocal";
    src: url("file://${path.join(root, "node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2")}") format("woff2");
    font-weight: 100 900;
  }
  body {
    margin: 0; width: 1200px; height: 630px; background: #151515; color: #fff;
    display: flex; flex-direction: column; justify-content: space-between;
    padding: 80px 84px; box-sizing: border-box; font-family: "InterLocal", sans-serif;
  }
  .tag { font-size: 34px; line-height: 1.3; color: rgba(255,255,255,.62); letter-spacing: -0.01em; max-width: 620px; }
  .foot { display: flex; justify-content: space-between; align-items: flex-end; }
  .url { font-size: 19px; letter-spacing: .16em; text-transform: uppercase; color: rgba(255,255,255,.4); }
  .rule { height: 1px; background: rgba(255,255,255,.14); margin: 26px 0 22px; }
</style></head><body>
  <div>${lockupSvg}</div>
  <div>
    <div class="tag">Discover properties, explore neighbourhoods, and connect directly with the people advertising them.</div>
    <div class="rule"></div>
    <div class="foot"><div class="url">nivora.example</div><div class="url">Find your place.</div></div>
  </div>
</body></html>`;

await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await page.setContent(ogHtml, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await new Promise((r) => setTimeout(r, 250));
await page.screenshot({ path: path.join(brand, "nivora-og.png"), clip: { x: 0, y: 0, width: 1200, height: 630 } });
console.log(`  nivora-og.png             1200×630  ${fs.statSync(path.join(brand, "nivora-og.png")).size} B`);

await browser.close();
