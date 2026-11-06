// Generates the fluid clamp() values for the 9-step type scale.
//
// The scale is the ISO 3098 lettering-height series. At the 1600 px endpoint each step's
// CAP HEIGHT is an ISO 3098 height: 2.5 · 3.0 · 3.5 · 5 · 7 · 10 · 14 · 20 · 40 mm
// (2.5 mm is CAD dimension text, 3.5 mm the standard note height). font-size = cap / 0.710,
// Geist's cap-height ratio read from the font file (sCapHeight 710 / 1000 upm).
// At 360 px the scale relaxes to readable phone sizes. Linear interpolation in between,
// written as rem + vw so zoom and the user's font size still work (WCAG 1.4.4).
//
// Usage: node scripts/type-scale.mjs
export const VMIN = 360;
export const VMAX = 1600;
export const CAP_RATIO = 0.71;
export const PX_PER_MM = 96 / 25.4;

export const capToPx = (mm) => Number(((mm * PX_PER_MM) / CAP_RATIO).toFixed(2));

export const steps = [
  // name,      min px, cap mm at 1600
  ["micro", 12, 2.5],
  ["small", 13.5, 3],
  ["body", 16, 3.5],
  ["lead", 18.5, 5],
  ["title-s", 21, 7],
  ["title-m", 25, 10],
  ["title-l", 30, 14],
  ["headline", 40, 20],
  ["display", 64, 40],
].map(([name, min, cap]) => [name, min, capToPx(cap), cap]);

const r = (n, d = 4) => Number(n.toFixed(d));

export function fluid(minPx, maxPx, vmin = VMIN, vmax = VMAX) {
  const slope = (maxPx - minPx) / (vmax - vmin);
  const interceptPx = minPx - slope * vmin;
  return `clamp(${r(minPx / 16)}rem, ${r(interceptPx / 16)}rem + ${r(slope * 100, 4)}vw, ${r(maxPx / 16)}rem)`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const [name, min, max, cap] of steps) {
    console.log(`--text-${name}: ${fluid(min, max)}; /* ${min} -> ${max} px, cap ${cap} mm */`);
  }
}
