import fs from "node:fs";

import { fileURLToPath } from "node:url";
import path from "node:path";
const dir = path.dirname(fileURLToPath(import.meta.url));
const concepts = [
  { id: "a", file: "concept-a-architectural-n.svg", title: "Concept A — Architectural N", tag: "Letterform",
    note: "Two piers of unequal height joined by one sloped span. The letter becomes a roofline in profile; the rising diagonal carries the ascent." },
  { id: "b", file: "concept-b-doorway.svg", title: "Concept B — Abstract doorway", tag: "Sense of place",
    note: "A solid field with an opening cut out of it. The threshold is the mark — no roof, walls or pin, so it reads as arriving somewhere rather than as a building." },
  { id: "c", file: "concept-c-spatial.svg", title: "Concept C — Geometric spatial symbol", tag: "Abstract geometry",
    note: "Two planes seen in plan, offset so the negative space becomes a passage between them. The most abstract of the three." },
];

const inline = (svg, size) =>
  svg.replace("<svg", `<svg width="${size}" height="${size}" style="display:block"`);

const ladder = (svg) =>
  [96, 40, 24, 16].map((s) =>
    `<figure style="margin:0;text-align:center">${inline(svg, s)}<figcaption>${s}px</figcaption></figure>`
  ).join("");

const cards = concepts.map((c) => {
  const svg = fs.readFileSync(path.join(dir, c.file), "utf8");
  return `<div class="card">
    <div class="stage">${inline(svg, 120)}</div>
    <div class="meta">
      <h2>${c.title}</h2><span class="tag">${c.tag}</span>
      <p>${c.note}</p>
      <div class="ladder">${ladder(svg)}</div>
    </div>
  </div>`;
}).join("\n");

const navbars = concepts.map((c) => {
  const svg = fs.readFileSync(path.join(dir, c.file), "utf8");
  return `<div class="navbar-mock">${inline(svg, 26)}<span class="wordmark">NIVORA</span></div>`;
}).join("\n");

const darks = concepts.map((c) => {
  const svg = fs.readFileSync(path.join(dir, c.file), "utf8");
  return `<div class="stage dark">${inline(svg, 96)}</div>`;
}).join("\n");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>NIVORA — logo concept exploration</title>
<style>
  :root { --ink:#151515; --muted:#707070; --line:#EAEAE7; --mist:#F7F7F5; }
  * { box-sizing:border-box; }
  body { margin:0; padding:52px; background:#fff; color:var(--ink);
         font-family:"Inter","Helvetica Neue",Arial,sans-serif; }
  header { display:flex; align-items:baseline; justify-content:space-between;
           border-bottom:1px solid var(--line); padding-bottom:18px; }
  h1 { font-size:22px; font-weight:600; letter-spacing:-.01em; margin:0; }
  header p { margin:0; font-size:13px; color:var(--muted); }
  .grid { display:grid; grid-template-columns:repeat(3,1fr); gap:28px; margin-top:32px; }
  .card { border:1px solid var(--line); border-radius:16px; overflow:hidden; }
  .stage { display:flex; align-items:center; justify-content:center; height:210px;
           background:var(--mist); color:var(--ink); }
  .stage.dark { background:var(--ink); color:#fff; height:150px; }
  .meta { padding:16px 18px 20px; }
  .meta h2 { margin:0; font-size:15px; font-weight:600; }
  .tag { display:inline-block; margin-top:5px; font-size:10px; letter-spacing:.14em;
         text-transform:uppercase; color:var(--muted); }
  .meta p { margin:9px 0 0; font-size:12.5px; line-height:1.55; color:var(--muted); }
  .ladder { display:flex; align-items:flex-end; gap:20px; margin-top:14px; }
  .ladder figcaption { margin-top:6px; font-size:10px; color:var(--muted); }
  .ribbon { display:flex; gap:44px; align-items:center; margin-top:28px;
            border:1px solid var(--line); border-radius:16px; padding:20px 24px; }
  .ribbon .label { font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:var(--muted); }
  .navbar-mock { display:flex; align-items:center; gap:10px; }
  .wordmark { font-size:17px; font-weight:600; letter-spacing:.28em; }
</style></head><body>
<header><h1>NIVORA — logo concept exploration</h1>
<p>Monochrome only · current mark unchanged · for evaluation</p></header>
<div class="grid">${cards}</div>
<div class="ribbon"><span class="label">At navbar scale</span>${navbars}</div>
<div class="grid" style="margin-top:18px">${darks}</div>
</body></html>`;

fs.writeFileSync(path.join(dir, "sheet.html"), html);
console.log("sheet built with inline SVG");
