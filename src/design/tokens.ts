/**
 * JS mirror of src/styles/tokens.css for code that cannot read CSS (GSAP timelines, WebGL
 * uniforms) and for the style tile's documentation. scripts/check-tokens.mjs fails if the two
 * drift apart.
 */

export const palette = {
  aluWhite: { hex: "#ECEEF0", name: "Alu White", token: "--color-alu-white" },
  aluMid: { hex: "#9BA3AB", name: "Alu Mid", token: "--color-alu-mid" },
  graphite: { hex: "#16191C", name: "Graphite", token: "--color-graphite" },
  ink: { hex: "#0B0D0F", name: "Ink", token: "--color-ink" },
  glow: { hex: "#FF5A1F", name: "Billet Glow", token: "--color-glow" },
  aluDeep: { hex: "#5A626A", name: "Alu Deep", token: "--color-alu-deep" },
} as const;

export const VIEWPORT = { min: 360, max: 1600 } as const;

export type TypeStep = {
  step: number;
  token: string;
  role: string;
  min: number;
  max: number;
  /** Cap height in mm at the 1600 px endpoint (ISO 3098 series). */
  capMm: number;
  lineHeight: number;
  tracking: number;
  weight: number;
  family: "sans" | "mono";
};

/** 9 fluid steps. min at 360 px viewport, max at 1600 px; max = ISO 3098 cap height / 0.710. */
export const typeScale: TypeStep[] = [
  { step: -2, token: "micro", role: "Labels, dimension text (CAD 2.5 mm)", min: 12, max: 13.31, capMm: 2.5, lineHeight: 1.35, tracking: 0.06, weight: 500, family: "mono" },
  { step: -1, token: "small", role: "UI text, table cells, captions", min: 13.5, max: 15.97, capMm: 3, lineHeight: 1.45, tracking: 0, weight: 400, family: "sans" },
  { step: 0, token: "body", role: "Body copy (ISO note height 3.5 mm)", min: 16, max: 18.63, capMm: 3.5, lineHeight: 1.55, tracking: -0.003, weight: 400, family: "sans" },
  { step: 1, token: "lead", role: "Lead paragraphs", min: 18.5, max: 26.62, capMm: 5, lineHeight: 1.38, tracking: -0.012, weight: 400, family: "sans" },
  { step: 2, token: "title-s", role: "Card, step and sub-section titles", min: 21, max: 37.26, capMm: 7, lineHeight: 1.14, tracking: -0.018, weight: 500, family: "sans" },
  { step: 3, token: "title-m", role: "Section titles", min: 25, max: 53.23, capMm: 10, lineHeight: 1.05, tracking: -0.028, weight: 500, family: "sans" },
  { step: 4, token: "title-l", role: "Statements", min: 30, max: 74.53, capMm: 14, lineHeight: 1, tracking: -0.035, weight: 500, family: "sans" },
  { step: 5, token: "headline", role: "Page headline", min: 43, max: 106.47, capMm: 20, lineHeight: 0.94, tracking: -0.045, weight: 500, family: "sans" },
  { step: 6, token: "display", role: "Giant numerals", min: 86, max: 212.93, capMm: 40, lineHeight: 0.84, tracking: -0.055, weight: 400, family: "sans" },
];

/** Geist cap height / em, from the font file (sCapHeight 710, unitsPerEm 1000). */
export const CAP_RATIO = 0.71;

/** 4 px grid. Tailwind: p-1 = 4px ... p-48 = 192px. */
export const spacing = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160, 192] as const;

export const radii = [
  { token: "--radius-none", px: 0, use: "Surfaces, cards, tiles, drawings: machined edges" },
  { token: "--radius-xs", px: 2, use: "Buttons, inputs, chips" },
  { token: "--radius-sm", px: 4, use: "Toasts, popovers" },
  { token: "--radius-full", px: 9999, use: "Status dots and switches only" },
] as const;

/** Time on an 80 ms grid. */
export const durations = {
  tick: 80,
  fast: 160,
  base: 240,
  dissolve: 400,
  slow: 640,
  travel: 960,
  preload: 1120,
} as const;

export const stagger = 40;

/** Never bouncy: no control point leaves the 0..1 range on y. */
export const easings = {
  out: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
  in: [0.55, 0, 1, 0.45],
} as const;

export const cssEase = (e: readonly number[]) => `cubic-bezier(${e.join(", ")})`;

/** 1 CSS px = 1/96 in = 0.2646 mm. Used by the crosshair readout and live dimensions. */
export const MM_PER_PX = 25.4 / 96;

/**
 * Heat: the share of Billet Glow at temperature T (deg C), from radiance above ambient
 * (Stefan-Boltzmann, T^4), normalised so 480 C = 1 and 20 C = 0. The hero's cooling shader and the
 * style tile's heat ramp use the same curve.
 */
export const HEAT = { maxC: 480, ambientC: 20 } as const;
export function heatWeight(tC: number, maxC: number = HEAT.maxC, ambientC: number = HEAT.ambientC) {
  const k = (c: number) => c + 273.15;
  const w = (k(tC) ** 4 - k(ambientC) ** 4) / (k(maxC) ** 4 - k(ambientC) ** 4);
  return Math.min(1, Math.max(0, w));
}
