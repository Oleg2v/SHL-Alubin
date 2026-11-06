/**
 * Profile geometry in millimetres. A profile is one outer contour plus zero or more holes
 * (chambers). Contours are closed implicitly. Y grows downward, like SVG and like a sheet.
 */
export type Pt = readonly [number, number];
export type Contour = readonly Pt[];

export interface ProfileShape {
  outer: Contour;
  holes: readonly Contour[];
}

/** Aluminium density used for the weight column: 2.70 g/cm3. */
export const ALU_DENSITY_G_CM3 = 2.7;

export function signedArea(c: Contour): number {
  let a = 0;
  for (let i = 0; i < c.length; i++) {
    const [x1, y1] = c[i]!;
    const [x2, y2] = c[(i + 1) % c.length]!;
    a += x1 * y2 - x2 * y1;
  }
  return a / 2;
}

/** Net cross-sectional area in mm2 (outer minus holes). */
export function sectionArea(p: ProfileShape): number {
  const outer = Math.abs(signedArea(p.outer));
  const holes = p.holes.reduce((s, h) => s + Math.abs(signedArea(h)), 0);
  return outer - holes;
}

/** kg per metre: mm2 x 1 m = cm3 x 1000 / 1000 ... 1 mm2 x 1000 mm = 1 cm3. */
export function kgPerMetre(p: ProfileShape, density = ALU_DENSITY_G_CM3): number {
  return (sectionArea(p) * density) / 1000;
}

export function bounds(p: ProfileShape) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of p.outer) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

/** SVG path data with even-odd semantics: outer + holes in one path. */
export function toPathData(p: ProfileShape, precision = 3): string {
  const f = (n: number) => Number(n.toFixed(precision)).toString();
  const ring = (c: Contour) =>
    c.map(([x, y], i) => `${i === 0 ? "M" : "L"}${f(x)} ${f(y)}`).join("") + "Z";
  return [ring(p.outer), ...p.holes.map(ring)].join("");
}

export const rect = (x: number, y: number, w: number, h: number): Contour => [
  [x, y],
  [x + w, y],
  [x + w, y + h],
  [x, y + h],
];

/**
 * Heat sink: base plate with n rectangular fins on top, one outer contour, no holes.
 * width x height overall, base thickness tb, fin thickness tf.
 */
export function heatSink(width: number, height: number, n: number, tb: number, tf: number): ProfileShape {
  const pitch = (width - tf) / (n - 1);
  const baseTop = height - tb;
  const pts: Pt[] = [[0, height], [0, 0], [tf, 0]];
  for (let i = 1; i < n; i++) {
    const x = i * pitch;
    pts.push([x - pitch + tf, baseTop], [x, baseTop], [x, 0], [x + tf, 0]);
  }
  pts.push([width, height]);
  return { outer: pts, holes: [] };
}

/**
 * Thermally simple window-frame style multi-chamber box with a glazing flange.
 * Dimensions in mm, wall thickness t.
 */
export function chamberFrame(width: number, height: number, t: number, chambers: number, flange: number): ProfileShape {
  const outer: Pt[] = [
    [0, 0],
    [width, 0],
    [width, height],
    [width - flange, height],
    [width - flange, height + flange * 0.6],
    [width - flange - t, height + flange * 0.6],
    [width - flange - t, height],
    [0, height],
  ];
  const holes: Contour[] = [];
  const innerW = (width - t * (chambers + 1)) / chambers;
  for (let i = 0; i < chambers; i++) {
    holes.push(rect(t + i * (innerW + t), t, innerW, height - 2 * t));
  }
  return { outer, holes };
}

/** 40x40-style T-slot machine rail: square with four T-slots and a centre bore. */
export function tSlotRail(size: number, slot: number, lip: number, depth: number, bore: number): ProfileShape {
  const s = size, h = slot / 2, c = s / 2;
  const w2 = h + depth * 0.55; // inner chamber half-width
  const pts: Pt[] = [];
  // walk clockwise, carving one slot per side
  const side = (ax: number, ay: number, ux: number, uy: number, nx: number, ny: number) => {
    // a: side start corner, u: unit along side, n: inward normal
    const at = (along: number, inward: number): Pt => [ax + ux * along + nx * inward, ay + uy * along + ny * inward];
    pts.push(at(0, 0));
    pts.push(at(c - h, 0));
    pts.push(at(c - h, lip));
    pts.push(at(c - w2, lip));
    pts.push(at(c - w2 + depth * 0.25, lip + depth));
    pts.push(at(c + w2 - depth * 0.25, lip + depth));
    pts.push(at(c + w2, lip));
    pts.push(at(c + h, lip));
    pts.push(at(c + h, 0));
  };
  side(0, 0, 1, 0, 0, 1);
  side(s, 0, 0, 1, -1, 0);
  side(s, s, -1, 0, 0, -1);
  side(0, s, 0, -1, 1, 0);
  const n = 24;
  const r = bore / 2;
  const hole: Pt[] = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return [c + Math.cos(a) * r, c + Math.sin(a) * r] as Pt;
  });
  return { outer: pts, holes: [hole] };
}

const circle = (cx: number, cy: number, r: number, n = 28): Contour =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as Pt;
  });

/**
 * Solar mounting rail: a C-strut with in-turned lips (top slot for T-bolts and clamps).
 * One closed contour; the channel connects to the outside through the slot.
 */
export function solarRail(width = 40, height = 40, t = 2.5, slot = 14, lip = 8): ProfileShape {
  const a = (width - slot) / 2; // x of the left lip edge
  const b = a + slot; // x of the right lip edge
  const outer: Pt[] = [
    [0, 0],
    [a, 0],
    [a, lip],
    [a - t, lip],
    [a - t, t],
    [t, t],
    [t, height - t],
    [width - t, height - t],
    [width - t, t],
    [b + t, t],
    [b + t, lip],
    [b, lip],
    [b, 0],
    [width, 0],
    [width, height],
    [0, height],
  ];
  return { outer, holes: [] };
}

/**
 * Curtain-wall mullion (stick system): a deep two-chamber tube with a screw-spline nose on the
 * exterior face for the pressure plate.
 */
export function mullion(width = 52, depth = 140, t = 2.6): ProfileShape {
  const c = width / 2;
  const outer: Pt[] = [
    [0, 0],
    [width, 0],
    [width, depth],
    [c + 9, depth],
    [c + 9, depth + 11],
    [c + 5, depth + 14],
    [c - 5, depth + 14],
    [c - 9, depth + 11],
    [c - 9, depth],
    [0, depth],
  ];
  const split = depth * 0.72;
  const holes: Contour[] = [
    rect(t, t, width - 2 * t, split - t),
    rect(t, split + t, width - 2 * t, depth - split - 2 * t),
    circle(c, depth + 7, 3.2),
  ];
  return { outer, holes };
}
