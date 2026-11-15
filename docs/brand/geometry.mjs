/**
 * NIVORA brand mark — geometry generator.
 *
 * Single source of truth for the symbol. Every shipped asset (symbol, lockups,
 * favicon, app icon) is generated from this module so the form can never drift
 * between files, and no path data is ever hand-typed.
 *
 * The mark: two volumes — a vertical wall turning into a floor, and a block —
 * separated by one channel of space of constant width that enters the form from
 * two sides. Architectural in origin, abstract in reading: no house, roof, door
 * or location pin.
 *
 * Coordinate system: 64-unit square. The form occupies a 48-unit box inset by
 * 8 units, which leaves the optical margin the mark needs in a tile or favicon.
 *
 *   arm  (t) = 14   thickness of the wall / floor volume
 *   block (b) = 24  the detached volume
 *   channel  = 10   identical horizontally and vertically, by construction
 *
 * because both forms share a 48-unit box: channel = 48 - t - b on both axes.
 */

const PRECISION = 3;
const fmt = (v) => Number(v.toFixed(PRECISION));

/** round = fillet arc · chamfer = 45° cut · sharp = square corner */
const R = (size) => ({ type: "round", size });
const C = (size) => ({ type: "chamfer", size });
const S = { type: "sharp", size: 0 };

/**
 * Build an SVG path from polygon points with per-vertex corner treatments.
 * Corners are shortened along their incoming and outgoing edges and joined
 * with either an arc (fillet) or a straight diagonal (chamfer).
 */
export function poly(pts, styles) {
  const n = pts.length;
  let d = "";
  for (let i = 0; i < n; i++) {
    const prev = pts[(i - 1 + n) % n];
    const cur = pts[i];
    const next = pts[(i + 1) % n];
    const style = styles[i] || S;

    const vIn = [cur[0] - prev[0], cur[1] - prev[1]];
    const vOut = [next[0] - cur[0], next[1] - cur[1]];
    const lenIn = Math.hypot(...vIn);
    const lenOut = Math.hypot(...vOut);

    // A corner treatment can never consume more than half of either edge.
    const size = Math.min(style.size || 0, lenIn / 2, lenOut / 2);
    const a = [cur[0] - (vIn[0] / lenIn) * size, cur[1] - (vIn[1] / lenIn) * size];
    const b = [cur[0] + (vOut[0] / lenOut) * size, cur[1] + (vOut[1] / lenOut) * size];

    d += `${i === 0 ? "M" : "L"}${fmt(a[0])} ${fmt(a[1])}`;
    if (style.type === "round" && size > 0) {
      d += `A${fmt(size)} ${fmt(size)} 0 0 1 ${fmt(b[0])} ${fmt(b[1])}`;
    } else if (style.type === "chamfer" && size > 0) {
      d += `L${fmt(b[0])} ${fmt(b[1])}`;
    }
  }
  return `${d}Z`;
}

/** The two sub-paths of the mark. */
export function mark({ t = 14, b = 24, r = 3, chamferL = 0, chamferB = 0 } = {}) {
  const x0 = 8;
  const y0 = 8;
  const x1 = 56;
  const y1 = 56;
  const outer = R(r);

  // Vertical wall (left edge, full height) turning into a floor (bottom edge).
  // Vertex 2 is the concave corner where the channel turns; it stays sharp so
  // the channel keeps an exact 10-unit width.
  const wall = poly(
    [
      [x0, y0],
      [x0 + t, y0],
      [x0 + t, y1 - t],
      [x1, y1 - t],
      [x1, y1],
      [x0, y1],
    ],
    [outer, outer, chamferL ? C(chamferL) : S, outer, outer, outer]
  );

  // Detached block, flush with the top and right edges of the 48-unit box.
  // Vertex 3 is its corner facing the channel — the only one ever chamfered.
  const bx = x1 - b;
  const block = poly(
    [
      [bx, y0],
      [x1, y0],
      [x1, y0 + b],
      [bx, y0 + b],
    ],
    [outer, outer, outer, chamferB ? C(chamferB) : outer]
  );

  return { wall, block, channel: 48 - t - b };
}

/** Standalone symbol as SVG markup. `fill="currentColor"` so it inherits colour. */
export function symbolSvg(options = {}) {
  const m = mark(options);
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">` +
    `<path fill="currentColor" d="${m.wall}"/>` +
    `<path fill="currentColor" d="${m.block}"/>` +
    `</svg>`
  );
}

/** The chosen variants, named so assets and docs speak the same language. */
export const VARIANTS = {
  S1: { label: "Sharp", options: { r: 0 } },
  S2: { label: "Soft", options: { r: 3 } },
  S3: { label: "Mitred", options: { r: 3, chamferL: 10 } },
};

/* S2 pending the client's sign-off on docs/brand/logo-size-test.png */
export const DEFAULT_VARIANT = "S2";
