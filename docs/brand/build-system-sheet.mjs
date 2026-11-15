/**
 * Builds docs/brand/logo-system.png — the identity system overview.
 *
 *   node docs/brand/build-system-sheet.mjs
 *
 * Reads the shipped SVGs in public/brand/ (not the geometry module) so the sheet
 * verifies the actual deliverables rather than the intent behind them.
 * Requires headless Chromium: npm install --no-save @sparticuz/chromium puppeteer-core
 */

import fs from "node:fs";
import path from "node:path";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const brand = path.join(root, "public/brand");
const read = (name) => fs.readFileSync(path.join(brand, name), "utf8");
const at = (name, width, height) =>
  read(name).replace("<svg", `<svg width="${width}"${height ? ` height="${height}"` : ""}`);

const clearSpace = read("nivora-symbol.svg").replace(
  "<svg",
  `<svg width="150" height="150" style="overflow:visible"`
);

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  *{box-sizing:border-box}
  body{margin:0;padding:46px 48px 40px;font-family:Inter,-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif;color:#151515;background:#fff;-webkit-font-smoothing:antialiased}
  header{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:1px solid #EAEAE7;padding-bottom:16px;margin-bottom:26px}
  h1{font-size:22px;font-weight:600;margin:0 0 6px;letter-spacing:-.015em}
  .sub{margin:0;font-size:13px;color:#707070;max-width:640px;line-height:1.55}
  .stamp{font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:#A58A68;white-space:nowrap}
  h2{font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:#A9A9A9;font-weight:500;margin:0 0 12px}
  .grid{display:grid;gap:16px;margin-bottom:30px}
  .g2{grid-template-columns:1fr 1fr}
  .g4{grid-template-columns:repeat(4,1fr)}
  .cell{border:1px solid #EAEAE7;border-radius:14px;overflow:hidden}
  .stage{display:flex;align-items:center;justify-content:center;padding:26px 20px;min-height:132px}
  .stage.tall{min-height:180px}
  .white{background:#fff}.mist{background:#F7F7F5}.ink{background:#151515}
  .lbl{padding:9px 13px;font-size:10.5px;color:#999;border-top:1px solid #EAEAE7;font-variant-numeric:tabular-nums;letter-spacing:.01em}
  .row{display:flex;align-items:flex-end;gap:26px}
  .col{display:flex;flex-direction:column;align-items:center;gap:8px}
  .col small{font-size:9.5px;color:#BEBEBE;font-variant-numeric:tabular-nums}
  .cs{position:relative;display:inline-flex;align-items:center;justify-content:center;padding:24px}
  .cs-box{position:absolute;inset:0;border:1px dashed #C9C9C4;border-radius:6px}
  .cs-lbl{position:absolute;left:50%;bottom:-7px;transform:translateX(-50%);background:#fff;padding:0 6px;font-size:8.5px;color:#A58A68;letter-spacing:.1em;white-space:nowrap}
  footer{display:grid;grid-template-columns:repeat(3,1fr);gap:30px;border-top:1px solid #EAEAE7;padding-top:18px;font-size:11px;color:#707070;line-height:1.7}
  footer b{display:block;color:#151515;font-weight:600;margin-bottom:2px}
</style></head><body>
  <header>
    <div>
      <h1>NIVORA — identity system</h1>
      <p class="sub">Two volumes, one channel. A wall turning into a floor and a separate block, held apart by a 10-unit channel of space — architecture in negative space, with no house, roof, door or pin.</p>
    </div>
    <div class="stamp">v1 · approved</div>
  </header>

  <h2>Primary horizontal logo</h2>
  <div class="grid g2">
    <div class="cell"><div class="stage tall white">${at("nivora-logo.svg", 360)}</div><div class="lbl">nivora-logo.svg — ink on light</div></div>
    <div class="cell"><div class="stage tall ink">${at("nivora-logo-white.svg", 360)}</div><div class="lbl">nivora-logo-white.svg — white on dark</div></div>
  </div>

  <h2>Standalone symbol and wordmark</h2>
  <div class="grid g4">
    <div class="cell"><div class="stage mist">${at("nivora-symbol.svg", 88)}</div><div class="lbl">nivora-symbol.svg</div></div>
    <div class="cell"><div class="stage white">${at("nivora-symbol-black.svg", 88)}</div><div class="lbl">nivora-symbol-black.svg</div></div>
    <div class="cell"><div class="stage ink">${at("nivora-symbol-white.svg", 88)}</div><div class="lbl">nivora-symbol-white.svg</div></div>
    <div class="cell"><div class="stage mist"><div class="row">
      <div class="col">${at("nivora-symbol.svg", 16)}<small>16</small></div>
      <div class="col">${at("nivora-symbol.svg", 24)}<small>24</small></div>
      <div class="col">${at("nivora-symbol.svg", 32)}<small>32</small></div>
      <div class="col">${at("nivora-symbol.svg", 56)}<small>56</small></div>
    </div></div><div class="lbl">size ladder</div></div>
  </div>
  <div class="grid g2">
    <div class="cell"><div class="stage white">${at("nivora-wordmark.svg", 300)}</div><div class="lbl">nivora-wordmark.svg — Inter SemiBold, outlined</div></div>
    <div class="cell"><div class="stage ink">${at("nivora-wordmark-white.svg", 300)}</div><div class="lbl">nivora-wordmark-white.svg</div></div>
  </div>

  <h2>App icon, social avatar, favicons</h2>
  <div class="grid g4">
    <div class="cell"><div class="stage mist"><div class="row">
      <div class="col">${at("nivora-favicon-16.svg", 16)}<small>16</small></div>
      <div class="col">${at("nivora-favicon-16.svg", 32)}<small>×2</small></div>
      <div class="col">${at("nivora-favicon.svg", 32)}<small>32</small></div>
      <div class="col">${at("nivora-favicon.svg", 64)}<small>×2</small></div>
    </div></div><div class="lbl">favicons — 16px and 32px</div></div>
    <div class="cell"><div class="stage mist">${at("nivora-app-icon.svg", 104)}</div><div class="lbl">nivora-app-icon.svg — 512, radius 22%</div></div>
    <div class="cell"><div class="stage mist">${at("nivora-social-avatar.svg", 104)}</div><div class="lbl">nivora-social-avatar.svg — 1024, dark</div></div>
    <div class="cell"><div class="stage mist">${at("nivora-social-avatar-light.svg", 104)}</div><div class="lbl">nivora-social-avatar-light.svg — 1024, light</div></div>
  </div>

  <h2>Clear space and minimum size</h2>
  <div class="grid g2">
    <div class="cell"><div class="stage white">
      <div class="cs">
        <div class="cs-box"></div>
        ${at("nivora-symbol.svg", 96)}
        <span class="cs-lbl">CLEAR SPACE = ¼ SYMBOL HEIGHT</span>
      </div>
    </div><div class="lbl">keep at least ¼ of the symbol's height clear on every side</div></div>
    <div class="cell"><div class="stage white">
      <div class="row">
        <div class="col">${at("nivora-symbol.svg", 16)}<small>symbol · min 16px</small></div>
        <div class="col">${at("nivora-logo.svg", 96)}<small>lockup · min 96px wide</small></div>
      </div>
    </div><div class="lbl">minimum sizes — below these the channel closes up</div></div>
  </div>

  <footer>
    <div><b>Geometry</b>64-unit box · 48-unit form · wall 14 · block 24 · channel 10 on both axes · 3-unit fillet on outer corners · single colour, no gradients.</div>
    <div><b>Files</b>public/brand/ — SVG masters, PNG fallbacks for iOS and social, and an Open Graph card. Regenerate with docs/brand/build-assets.mjs and render-pngs.mjs.</div>
    <div><b>Rule</b>The symbol never gets a shadow, gradient, outline, rotation or extra colour. It is one tone, on white, mist or ink.</div>
  </footer>
</body></html>`;

const browser = await puppeteer.launch({
  args: [...chromium.args, "--no-sandbox"],
  executablePath: await chromium.executablePath(),
  headless: true,
});
const page = await browser.newPage();
await page.setViewport({ width: 1420, height: 1000, deviceScaleFactor: 2 });
await page.setContent(html, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await new Promise((r) => setTimeout(r, 300));
await page.screenshot({ path: path.join(root, "docs/brand/logo-system.png"), fullPage: true });
await browser.close();
console.log("wrote docs/brand/logo-system.png");
