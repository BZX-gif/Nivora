import fs from "node:fs";
import path from "node:path";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import { mark, symbolSvg } from "./geometry.mjs";

/* Builds docs/brand/logo-size-test.html — the sign-off sheet.
   Geometry comes from docs/brand/geometry.mjs; nothing here is hand-typed. */

const OPTIONS = [
  {
    id: "S1",
    name: "Sharp",
    detail: "Square-cut volumes · zero radius",
    note: "Most architectural, most severe. Reads as a machined block at every size, but the detailing gives no warmth.",
    options: { r: 0 },
  },
  {
    id: "S2",
    name: "Soft",
    detail: "3-unit fillet on outer corners",
    note: "Recommended. A fillet under 5% of the form softens where edge meets light without rounding the idea. Sits naturally with the site's surfaces.",
    options: { r: 3 },
    recommended: true,
  },
  {
    id: "S3",
    name: "Mitred",
    detail: "Channel turns 45° at its corner",
    note: "The concave corner is cut so the channel turns on a mitre. Strongest architectural gesture at large sizes; the cut is only ~2px at 16px.",
    options: { r: 3, chamferL: 10 },
  },
];

const svgOf = (o) => symbolSvg(o);
const at = (o, size, colour) =>
  svgOf(o).replace(
    "<svg",
    `<svg width="${size}" height="${size}" style="display:block;color:${colour}"`
  );

const ladderRow = (o) =>
  [96, 64, 40, 32, 24, 16]
    .map((s) => `<figure>${at(o, s, "#151515")}<figcaption>${s}</figcaption></figure>`)
    .join("");

const row = (i) => `
  <section class="row ${i.recommended ? "rec" : ""}">
    <div class="col-id">
      <div class="tag">${i.id}${i.recommended ? " <em>recommended</em>" : ""}</div>
      <h3>${i.name}</h3>
      <p class="detail">${i.detail}</p>
      <p class="note">${i.note}</p>
    </div>
    <div class="col-big">${at(i.options, 186, "#151515")}</div>
    <div class="col-ladder">
      <div class="ladder">${ladderRow(i.options)}</div>
      <div class="pols">
        <div class="pol mist">${at(i.options, 32, "#151515")}<span>mist</span></div>
        <div class="pol ink">${at(i.options, 32, "#fff")}<span>ink</span></div>
        <div class="pol tile">${at(i.options, 20, "#fff")}<span>app</span></div>
        <div class="pol fav">${at(i.options, 12, "#fff")}<span>16</span></div>
      </div>
    </div>
    <div class="col-lock">
      <div class="lock">${at(i.options, 32, "#151515")}<span class="wm">NIVORA</span></div>
      <div class="lock">${at(i.options, 26, "#151515")}<span class="wm wm-sm">NIVORA</span></div>
      <div class="locklbl">horizontal lockup · 32px / 26px symbol</div>
    </div>
  </section>`;

const rasterCell = (i) => `
  <div class="rcell">
    <div class="rhead"><b>${i.id}</b> ${i.name}</div>
    <div class="rrow" id="ras-${i.id}"></div>
    <div class="rfoot">16px light · 16px dark · 24px light</div>
  </div>`;

const payload = OPTIONS.map((o) => ({ id: o.id, svg: svgOf(o.options) }));

const html = `<!doctype html><html><head><meta charset="utf-8"><title>NIVORA — symbol size test</title><style>
  *{box-sizing:border-box}
  body{margin:0;padding:46px 48px 34px;font-family:Inter,-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif;color:#151515;background:#fff;-webkit-font-smoothing:antialiased}
  header{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;border-bottom:1px solid #EAEAE7;padding-bottom:18px}
  h1{font-size:22px;font-weight:600;margin:0 0 7px;letter-spacing:-.015em}
  .sub{margin:0;color:#707070;font-size:13px;line-height:1.55;max-width:660px}
  .stamp{font-size:10.5px;color:#A58A68;letter-spacing:.16em;text-transform:uppercase;white-space:nowrap;padding-bottom:4px}
  .row{display:grid;grid-template-columns:190px 210px 1fr 246px;gap:24px;align-items:center;padding:26px 0;border-bottom:1px solid #F2F2EF}
  .row.rec{background:#FCFBF9;margin:0 -20px;padding:26px 20px;border-radius:16px;border-bottom-color:transparent}
  .tag{font-size:10.5px;letter-spacing:.14em;color:#A9A9A9;text-transform:uppercase;margin-bottom:7px}
  .tag em{font-style:normal;color:#A58A68;letter-spacing:.04em;text-transform:none;margin-left:6px}
  h3{font-size:15.5px;font-weight:600;margin:0 0 6px}
  .detail{margin:0 0 9px;font-size:11.5px;color:#151515;letter-spacing:.01em}
  .note{margin:0;font-size:11.5px;line-height:1.6;color:#707070}
  .col-big{background:#F7F7F5;border-radius:16px;height:210px;display:flex;align-items:center;justify-content:center}
  .ladder{display:flex;align-items:flex-end;gap:19px;height:100px}
  .ladder figure{margin:0;display:flex;flex-direction:column;align-items:center;gap:6px}
  figcaption{font-size:9.5px;color:#BEBEBE;font-variant-numeric:tabular-nums}
  .pols{display:flex;gap:8px;margin-top:16px;align-items:flex-end}
  .pol{display:flex;flex-direction:column;align-items:center;gap:4px}
  .pol span{font-size:8.5px;letter-spacing:.07em;text-transform:uppercase;color:#BEBEBE}
  .pol.mist{background:#F7F7F5;border-radius:9px;padding:7px 8px 5px}
  .pol.ink{background:#151515;border-radius:9px;padding:7px 8px 5px}
  .pol.ink span{color:#6E6E6E}
  .pol.tile{background:#151515;border-radius:7px;padding:7px 8px 4px}
  .pol.tile span{color:#6E6E6E}
  .pol.fav{background:#151515;border-radius:4px;padding:3px 4px 3px}
  .pol.fav span{display:none}
  .lock{display:flex;align-items:center;gap:9px;margin-bottom:18px}
  .wm{font-size:18px;font-weight:600;line-height:1;letter-spacing:.28em;white-space:nowrap}
  .wm-sm{font-size:15px;letter-spacing:.26em}
  .locklbl{font-size:10px;color:#BEBEBE;line-height:1.5}
  .band{border-top:1px solid #EAEAE7;margin-top:30px;padding-top:22px}
  .band h2{font-size:13px;font-weight:600;margin:0 0 5px}
  .band p{margin:0 0 18px;font-size:11.5px;color:#707070}
  .rgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
  .rcell{border:1px solid #EAEAE7;border-radius:14px;padding:14px}
  .rhead{font-size:11.5px;margin-bottom:11px}
  .rhead b{letter-spacing:.06em}
  .rrow{display:flex;gap:9px}
  .rbox{border-radius:8px;padding:7px;background:#F7F7F5;display:flex;align-items:center;justify-content:center;flex:0 0 auto}
  .rbox.dark{background:#151515}
  .rbox canvas{display:block;image-rendering:pixelated}
  .rfoot{margin-top:9px;font-size:9.5px;color:#BEBEBE;letter-spacing:.02em}
  footer{display:grid;grid-template-columns:repeat(3,1fr);gap:34px;margin-top:26px;font-size:11px;color:#707070;line-height:1.65}
  footer b{display:block;color:#151515;font-weight:600;font-size:11px;margin-bottom:3px;letter-spacing:.02em}
</style></head><body>
  <header>
    <div>
      <h1>NIVORA — the symbol</h1>
      <p class="sub">Two volumes, one channel. A wall turning into a floor, and a separate block, held apart by a 10-unit channel of space that enters the mark from two sides. Architectural in origin, abstract in reading — not a house, roof, door or pin.</p>
    </div>
    <div class="stamp">size &amp; polarity test</div>
  </header>

  ${OPTIONS.map(row).join("")}

  <div class="band">
    <h2>What 16px actually resolves</h2>
    <p>Each symbol rendered to a 16px and 24px bitmap, then enlarged with no smoothing. If the channel survives here, it survives everywhere.</p>
    <div class="rgrid">${OPTIONS.map(rasterCell).join("")}</div>
  </div>

  <footer>
    <div><b>Geometry</b>48-unit form in a 64-unit box · wall 14 · block 24 · channel 10 on both axes. Monochrome, single colour, no gradients.</div>
    <div><b>What is fixed</b>The proportion and the channel are settled. Only the corner treatment differs between these three.</div>
    <div><b>After sign-off</b>One pick drives everything: horizontal lockup, standalone symbol, wordmark, mono variants, favicon, app icon, and the site.</div>
  </footer>

<script>
const OPTIONS = ${JSON.stringify(payload)};

function raster(svg, px, dark) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = c.height = px;
      const ctx = c.getContext("2d");
      ctx.fillStyle = dark ? "#151515" : "#F7F7F5";
      ctx.fillRect(0, 0, px, px);
      ctx.drawImage(img, 0, 0, px, px);
      const scale = px === 16 ? 5 : 3;
      const big = document.createElement("canvas");
      big.width = big.height = px * scale;
      big.style.width = big.width + "px";
      big.style.height = big.height + "px";
      const bctx = big.getContext("2d");
      bctx.imageSmoothingEnabled = false;
      bctx.drawImage(c, 0, 0, big.width, big.height);
      resolve(big);
    };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(
      svg.replace('fill="currentColor"', 'fill="' + (dark ? "#ffffff" : "#151515") + '"')
    );
  });
}

(async () => {
  for (const o of OPTIONS) {
    const host = document.getElementById("ras-" + o.id);
    for (const [px, dark] of [[16, false], [16, true], [24, false]]) {
      const box = document.createElement("div");
      box.className = "rbox" + (dark ? " dark" : "");
      box.appendChild(await raster(o.svg, px, dark));
      host.appendChild(box);
    }
  }
})();
</script>
</body></html>`;

const here = path.dirname(new URL(import.meta.url).pathname);
const htmlOut = path.join(here, "logo-size-test.html");
fs.writeFileSync(htmlOut, html);

const browser = await puppeteer.launch({
  args: [...chromium.args, "--no-sandbox"],
  executablePath: await chromium.executablePath(),
  headless: true,
});
const page = await browser.newPage();
await page.setViewport({ width: 1420, height: 1000, deviceScaleFactor: 2 });
await page.goto("file://" + htmlOut, { waitUntil: "networkidle0" });
await page.evaluate(() => document.fonts.ready);
await new Promise((r) => setTimeout(r, 900));
await page.screenshot({ path: path.join(here, "logo-size-test.png"), fullPage: true });
await browser.close();

console.log("wrote docs/brand/logo-size-test.html and .png");
console.log("channel width", mark(OPTIONS[1].options).channel, "units");
