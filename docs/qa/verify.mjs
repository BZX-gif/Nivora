/**
 * Functional verification for the identity pass.
 *
 *   npm run dev            # one shell
 *   node docs/qa/verify.mjs # another
 *
 * Requires headless Chromium as a build-time tool:
 *   npm install --no-save @sparticuz/chromium puppeteer-core
 *
 * Checks that the brand integration did not break the site: routes, assets,
 * the lockup, icon metadata, footer touch targets, search filtering and the
 * interactive controls the identity pass touched.
 */

import fs from "node:fs";
import path from "node:path";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

const BASE = "http://127.0.0.1:3000";
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");

let pass = 0;
const failures = [];
function check(name, ok, detail = "") {
  if (ok) {
    pass++;
    console.log(`  ✓ ${name}${detail ? ` — ${detail}` : ""}`);
  } else {
    failures.push(`${name}${detail ? ` — ${detail}` : ""}`);
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

/* ------------------------------------------------------------------ routes */

const ROUTES = [
  "/", "/buy", "/rent", "/explore", "/saved", "/property/niv-001",
  "/list-property", "/dashboard", "/dashboard/listings", "/dashboard/enquiries",
  "/about", "/contact", "/privacy", "/terms", "/sign-in", "/sign-up", "/account",
];

console.log("\nRoutes");
for (const route of ROUTES) {
  const res = await fetch(BASE + route);
  check(`GET ${route}`, res.status === 200, String(res.status));
}

/* ------------------------------------------------------------------ assets */

const ASSETS = fs
  .readdirSync(path.join(root, "public/brand"))
  .filter((f) => /\.(svg|png)$/.test(f));

console.log("\nBrand assets");
for (const asset of ASSETS) {
  const res = await fetch(`${BASE}/brand/${asset}`);
  check(`/brand/${asset}`, res.status === 200, String(res.status));
}

const svgWithUnresolvedFill = ASSETS.filter((f) =>
  f.endsWith(".svg") ? /fill="undefined"|NaN/.test(fs.readFileSync(path.join(root, "public/brand", f), "utf8")) : false
);
check("no SVG has an unresolved fill", svgWithUnresolvedFill.length === 0, svgWithUnresolvedFill.join(", ") || "all clean");

const oldRoofPaths = ASSETS.filter((f) =>
  f.endsWith(".svg") ? fs.readFileSync(path.join(root, "public/brand", f), "utf8").includes("M8 24 32 10") : false
);
check("retired roof mark is gone from every asset", oldRoofPaths.length === 0);

/* --------------------------------------------------------------- the site */

const browser = await puppeteer.launch({
  args: [...chromium.args, "--no-sandbox"],
  executablePath: await chromium.executablePath(),
  headless: true,
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);

const resultsText = async () => {
  await page.waitForFunction(() => /\d+\s+propert(y|ies) found/.test(document.body.innerText), { timeout: 30000 });
  const text = await page.evaluate(() => document.body.innerText);
  return Number(text.match(/(\d+)\s+propert(?:y|ies) found/)[1]);
};

console.log("\nHeader, footer and metadata");
await page.goto(BASE + "/", { waitUntil: "networkidle0", timeout: 60000 });
await page.evaluate(() => document.fonts.ready);

const header = await page.evaluate(() => {
  const link = document.querySelector("header a[aria-label='NIVORA home']");
  const svg = link?.querySelector("svg");
  if (!svg) return null;
  const r = svg.getBoundingClientRect();
  const paths = [...svg.querySelectorAll("path")];
  return {
    w: Math.round(r.width),
    h: Math.round(r.height),
    paths: paths.length,
    colours: [...new Set(paths.map((p) => p.getAttribute("fill")))],
    viewBox: svg.getAttribute("viewBox"),
    srText: link.innerText.trim(),
  };
});
check("header lockup renders", Boolean(header));
check("lockup is symbol + one outlined wordmark path", header?.paths === 3, `${header?.paths} paths`);
check("lockup inherits currentColor", JSON.stringify(header?.colours) === JSON.stringify(["currentColor"]));
check("lockup is 36px tall at its designed ratio", header?.h === 36, `${header?.w}×${header?.h}, viewBox ${header?.viewBox}`);
check("lockup retains an accessible name", /NIVORA/.test(header?.srText || ""), header?.srText);

const footer = await page.evaluate(() => {
  const links = [...document.querySelectorAll("footer nav a")];
  const heights = links.map((a) => Math.round(a.getBoundingClientRect().height));
  const logo = document.querySelector("footer svg");
  return { count: links.length, minHeight: Math.min(...heights), hasLogo: Boolean(logo) };
});
check("footer renders the white lockup", footer.hasLogo);
check("every footer link target is at least 32px tall", footer.minHeight >= 32, `min ${footer.minHeight}px across ${footer.count} links`);

const head = await page.evaluate(() => ({
  icons: [...document.querySelectorAll("link[rel*='icon']")].map((l) => l.getAttribute("href")),
  apple: document.querySelector("link[rel='apple-touch-icon']")?.getAttribute("href"),
  og: document.querySelector("meta[property='og:image']")?.getAttribute("content"),
  twitter: document.querySelector("meta[name='twitter:card']")?.getAttribute("content"),
}));
check("favicon set includes an SVG and a PNG at both sizes", head.icons.filter((i) => i.endsWith(".svg")).length === 2 && head.icons.filter((i) => i.endsWith(".png")).length >= 2, head.icons.join(" "));
check("apple-touch-icon points at the 180px PNG", head.apple === "/brand/apple-touch-icon.png", head.apple);
check("og:image is the 1200×630 card", Boolean(head.og?.endsWith("/brand/nivora-og.png")), head.og);
check("twitter card is summary_large_image", head.twitter === "summary_large_image", head.twitter);

/* ---------------------------------------------------------------- search */

console.log("\nSearch filtering");
await page.goto(BASE + "/buy", { waitUntil: "networkidle0" });
const allBuy = await resultsText();

await page.goto(BASE + "/buy?locality=Jagatpura", { waitUntil: "networkidle0" });
const buyLocality = await resultsText();
check("locality filter narrows results", buyLocality > 0 && buyLocality < allBuy, `${buyLocality} of ${allBuy} in Jagatpura`);

const restored = await page.evaluate(() => {
  const input = document.querySelector("input[type='text'], input[placeholder*='locality' i], input[placeholder*='City' i]");
  return input ? input.value : null;
});
check("search field restores the URL query", restored === "Jagatpura", String(restored));

await page.goto(BASE + "/buy?category=Villa", { waitUntil: "networkidle0" });
const villas = await resultsText();
check("category filter narrows results", villas > 0 && villas < allBuy, `${villas} of ${allBuy}`);

await page.goto(BASE + "/rent?maxPrice=30000", { waitUntil: "networkidle0" });
const budget = await resultsText();
check("rent budget band returns matches", budget > 0, `${budget} under ₹30,000/mo`);

await page.goto(BASE + "/buy?locality=Jagatpura", { waitUntil: "networkidle0" });
await resultsText();
const badge = await page.evaluate(() => {
  const button = [...document.querySelectorAll("button")].find((b) => b.textContent.includes("Filters"));
  if (!button) return null;
  const digits = button.textContent.replace(/\D/g, "");
  return { text: button.textContent.trim(), count: digits ? Number(digits) : 0 };
});
check("query alone does not light the Filters badge", badge?.count === 0, badge?.text);

await page.goto(BASE + "/buy", { waitUntil: "networkidle0" });
await resultsText();
await page.evaluate(() => {
  const button = [...document.querySelectorAll("button")].find((b) => b.textContent.includes("Filters"));
  button?.click();
});
await new Promise((r) => setTimeout(r, 400));
const drawer = await page.evaluate(() => {
  // The filter drawer is an <aside>, not a role="dialog" element.
  const panel = [...document.querySelectorAll("aside")].find((a) => a.innerText.includes("Filters"));
  return panel ? { open: true, text: panel.innerText.slice(0, 40).replace(/\n/g, " · ") } : { open: false };
});
check("Filters drawer opens", drawer.open, drawer.text);

/* ----------------------------------------------------------- interactions */

console.log("\nInteractions");
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
await page.goto(BASE + "/", { waitUntil: "networkidle0" });
await page.click("button[aria-label='Open menu']");
await new Promise((r) => setTimeout(r, 500));
const menuOpen = await page.evaluate(() => Boolean(document.querySelector("nav[aria-label='Mobile']")));
check("mobile menu opens from the header", menuOpen);

await page.goto(BASE + "/buy", { waitUntil: "networkidle0" });
await resultsText();
await page.evaluate(() => {
  const button = [...document.querySelectorAll("button")].find((b) => /^Map$/i.test(b.textContent.trim()));
  button?.click();
});
await new Promise((r) => setTimeout(r, 1500));
const mapVisible = await page.evaluate(() => Boolean(document.querySelector(".leaflet-container")));
check("map view still renders Leaflet", mapVisible);

await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto(BASE + "/property/niv-001", { waitUntil: "networkidle0" });
const saveButton = await page.evaluate(() => {
  const button = document.querySelector("button[aria-label*='ave' i]");
  if (!button) return null;
  const before = button.getAttribute("aria-pressed");
  button.click();
  return { before };
});
// React commits the state change on the next tick — read after it lands.
await new Promise((r) => setTimeout(r, 400));
const saveAfter = await page.evaluate(() => ({
  pressed: document.querySelector("button[aria-label*='ave' i]")?.getAttribute("aria-pressed"),
  stored: (() => {
    try { return JSON.parse(localStorage.getItem("nivora:favs") || "[]").length; } catch { return -1; }
  })(),
}));
check("saving a property toggles its pressed state", saveButton?.before !== saveAfter.pressed, `${saveButton?.before} → ${saveAfter.pressed}`);
check("saved property persists to storage", saveAfter.stored > 0, `${saveAfter.stored} saved`);

await browser.close();

console.log(`\n${pass} checks passed, ${failures.length} failed`);
if (failures.length) {
  console.log("\nFailures:");
  for (const f of failures) console.log("  - " + f);
  process.exitCode = 1;
}
