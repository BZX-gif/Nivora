/**
 * Builds the complete NIVORA identity system from a single geometry source.
 *
 *   node docs/brand/build-assets.mjs
 *
 * Inputs  : docs/brand/geometry.mjs (the symbol) + Inter SemiBold (Fontsource, variable)
 * Outputs : public/brand/*.svg, src/components/brand/mark-paths.generated.ts
 *
 * Requires fontkit, which is a build-time tool only — not a runtime dependency:
 *   npm install --no-save fontkit
 *
 * The wordmark is outlined from Inter SemiBold (wght 600) so no shipped asset
 * depends on a font being installed, and every glyph transform is baked into a
 * flat path — no nested groups, no <text>, clean scalable geometry.
 */

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { mark } from "./geometry.mjs";

const require = createRequire(import.meta.url);
const fontkit = require("fontkit");
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");

/* ---------------------------------------------------------------- constants */

const INK = "#151515"; // brand ink
const BLACK = "#000000"; // mono, print and stamp
const WHITE = "#FFFFFF";

const WORDMARK_TRACKING_EM = 0.22; // settled on the lockup test sheet
const LOCKUP_INK_RATIO = 1.9; // symbol ink height ÷ wordmark cap height
const LOCKUP_GAP = 18; // optical gap, symbol ink edge → wordmark ink
const SYMBOL_BOX = 64; // symbol viewBox
const SYMBOL_INK = 48; // ink size inside the box
const SYMBOL_INK_ORIGIN = 8; // ink starts at 8,8

/* ------------------------------------------------------------ font handling */

const fontFile = path.join(
  root,
  "node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2"
);
if (!fs.existsSync(fontFile)) {
  throw new Error(`Inter not found at ${fontFile} — run npm install first.`);
}
const inter = fontkit.openSync(fontFile).getVariation({ wght: 600 });
const UPM = inter.unitsPerEm;
const CAP = inter.capHeight;

/** Flat path for `text`, in font units, y-up, baseline at 0. */
function textPath(text, trackingEm) {
  const tracking = trackingEm * UPM;
  let x = 0;
  let flat = null;
  for (const ch of text) {
    const glyph = inter.glyphForCodePoint(ch.codePointAt(0));
    const shifted = glyph.path.translate(x, 0);
    if (shifted.commands.length) {
      if (!flat) {
        // fontkit has no public Path constructor; borrow the prototype.
        flat = Object.create(Object.getPrototypeOf(shifted));
        flat.commands = [...shifted.commands];
      } else {
        flat.commands = [...flat.commands, ...shifted.commands];
      }
    }
    x += glyph.advanceWidth + tracking;
  }
  return flat;
}

/**
 * Place a font-unit path (y-up) into SVG space (y-down).
 * fontkit transforms are immutable — they return new paths, so results must be
 * chained. Returns flat path data plus the resulting ink box.
 */
function placeInSvg(sourcePath, { scale, x, baseline }) {
  const sourceBox = sourcePath.bbox;
  const p = sourcePath.scale(scale, -scale).translate(x - sourceBox.minX * scale, baseline);
  return { d: p.toSVG(), box: p.bbox };
}

/* ---------------------------------------------------------------- symbol SVG */

const SYMBOL = mark({ r: 3 }); // S2 — the approved form
const symbolPaths = [SYMBOL.wall, SYMBOL.block];
const symbolMarkup = (fill) =>
  symbolPaths.map((d) => `<path fill="${fill}" d="${d}"/>`).join("");

/**
 * Symbol file: 64×64 box, 48-unit ink, 8-unit optical margin.
 * `fill="currentColor"`? No — assets must render correctly as <img>, so the
 * colour is baked per variant and a separate token file exists for CSS use.
 */
function symbolFile(fill) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SYMBOL_BOX} ${SYMBOL_BOX}" fill="none">
  <title>NIVORA symbol</title>
${symbolMarkup(fill)}
</svg>
`;
}

/* --------------------------------------------------------------- wordmark SVG */

const wordmarkSource = textPath("NIVORA", WORDMARK_TRACKING_EM);

/** Standalone wordmark: ink box is exactly the cap height, 100 units tall. */
const WORDMARK_CAP = 100;
const wordmarkStandalone = placeInSvg(wordmarkSource, {
  scale: WORDMARK_CAP / CAP,
  x: 0,
  baseline: WORDMARK_CAP,
});
const wordmarkViewBox = `0 0 ${round(wordmarkStandalone.box.maxX)} ${WORDMARK_CAP}`;

function wordmarkFile(fill) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${wordmarkViewBox}" fill="none">
  <title>NIVORA wordmark</title>
  <path fill="${fill}" d="${wordmarkStandalone.d}"/>
</svg>
`;
}

/* --------------------------------------------------------------- lockup SVG */

const lockupCap = SYMBOL_INK / LOCKUP_INK_RATIO;
const lockupBaseline = SYMBOL_BOX / 2 + lockupCap / 2;
const lockupWordmarkX = SYMBOL_INK_ORIGIN + SYMBOL_INK + LOCKUP_GAP;
const lockupWordmark = placeInSvg(wordmarkSource, {
  scale: lockupCap / CAP,
  x: lockupWordmarkX,
  baseline: lockupBaseline,
});
const lockupWidth = round(lockupWordmark.box.maxX);
const lockupHeight = SYMBOL_BOX;

function lockupFile(fill) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lockupWidth} ${lockupHeight}" fill="none">
  <title>NIVORA</title>
${symbolMarkup(fill)}
  <path fill="${fill}" d="${lockupWordmark.d}"/>
</svg>
`;
}

/* ------------------------------------------------------------------- tiles */

/**
 * Tile geometry: the symbol is centred in a rounded square at a given ink ratio.
 * Only the optical size changes between tile sizes — the form never does.
 */
function tileFile({ size, radius, inkRatio, background, foreground, title }) {
  const inkPx = size * inkRatio;
  const scale = inkPx / SYMBOL_INK;
  const boxPx = SYMBOL_BOX * scale;
  const offset = (size - boxPx) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" fill="none">
  <title>${title}</title>
  <rect width="${size}" height="${size}" rx="${radius}" fill="${background}"/>
  <g transform="translate(${round(offset)} ${round(offset)}) scale(${round(scale, 5)})">
${symbolMarkup(foreground).replace(/^/gm, "    ")}
  </g>
</svg>
`;
}

const TILE = {
  // 16px needs a tighter optical margin than 32px; the form itself is unchanged.
  favicon16: { size: 16, radius: 3.5, inkRatio: 0.66, background: INK, foreground: WHITE },
  favicon32: { size: 32, radius: 7, inkRatio: 0.58, background: INK, foreground: WHITE },
  appIcon: { size: 512, radius: 112, inkRatio: 0.56, background: INK, foreground: WHITE },
  social: { size: 1024, radius: 0, inkRatio: 0.52, background: INK, foreground: WHITE },
};

/* -------------------------------------------------------------------- write */

const outDir = path.join(root, "public/brand");
fs.mkdirSync(outDir, { recursive: true });

const files = {
  // symbol
  "nivora-symbol.svg": symbolFile(INK),
  "nivora-symbol-black.svg": symbolFile(BLACK),
  "nivora-symbol-white.svg": symbolFile(WHITE),
  // wordmark
  "nivora-wordmark.svg": wordmarkFile(INK),
  "nivora-wordmark-black.svg": wordmarkFile(BLACK),
  "nivora-wordmark-white.svg": wordmarkFile(WHITE),
  // horizontal lockup
  "nivora-logo.svg": lockupFile(INK),
  "nivora-logo-black.svg": lockupFile(BLACK),
  "nivora-logo-white.svg": lockupFile(WHITE),
  // tiles
  "nivora-favicon.svg": tileFile({ ...TILE.favicon32, title: "NIVORA" }),
  "nivora-favicon-16.svg": tileFile({ ...TILE.favicon16, title: "NIVORA" }),
  "nivora-app-icon.svg": tileFile({ ...TILE.appIcon, title: "NIVORA" }),
  "nivora-social-avatar.svg": tileFile({ ...TILE.social, title: "NIVORA" }),
};

for (const [name, content] of Object.entries(files)) {
  if (/fill="undefined"|fill="NaN"/.test(content)) {
    throw new Error(`${name} contains an unresolved fill — refusing to write.`);
  }
  fs.writeFileSync(path.join(outDir, name), content);
}

// White-on-transparent lockup for dark backgrounds is covered by -white.
// A light tile (mark on white) is used by the social profile fallback.
fs.writeFileSync(
  path.join(outDir, "nivora-social-avatar-light.svg"),
  tileFile({
    size: 1024,
    radius: 0,
    inkRatio: 0.52,
    background: "#F7F7F5",
    foreground: INK,
    title: "NIVORA",
  })
);

/* ------------------------------------- generated TS module for in-page use */

const ts = `/**
 * GENERATED FILE — do not edit.
 * Source: docs/brand/geometry.mjs · regenerate with \`node docs/brand/build-assets.mjs\`
 *
 * The symbol and the outlined wordmark, for inlining in React so the header
 * lockup is identical everywhere and depends on no font at runtime.
 */

export const SYMBOL_VIEW_BOX = "0 0 ${SYMBOL_BOX} ${SYMBOL_BOX}";

/** The approved form: two volumes, one 10-unit channel, 3-unit fillet. */
export const SYMBOL_PATHS = [
  ${symbolPaths.map((d) => `"${d}"`).join(",\n  ")},
] as const;

export const LOCKUP_VIEW_BOX = "0 0 ${lockupWidth} ${lockupHeight}";
export const LOCKUP_WIDTH = ${lockupWidth};
export const LOCKUP_HEIGHT = ${lockupHeight};
export const LOCKUP_WORDMARK_PATH = "${lockupWordmark.d}";

export const WORDMARK_VIEW_BOX = "${wordmarkViewBox}";
export const WORDMARK_PATH = "${wordmarkStandalone.d}";
`;

const generatedTs = path.join(root, "src/components/brand/mark-paths.generated.ts");
fs.mkdirSync(path.dirname(generatedTs), { recursive: true });
fs.writeFileSync(generatedTs, ts);

function round(n, dp = 3) {
  const f = 10 ** dp;
  return Math.round(n * f) / f;
}

console.log("identity system written → public/brand/");
for (const name of [...Object.keys(files), "nivora-social-avatar-light.svg"]) {
  const size = fs.statSync(path.join(outDir, name)).size;
  console.log(`  ${name.padEnd(30)} ${String(size).padStart(6)} B`);
}
console.log(`lockup viewBox 0 0 ${lockupWidth} ${lockupHeight} · wordmark ${wordmarkViewBox}`);
console.log(`generated ${path.relative(root, generatedTs)}`);
