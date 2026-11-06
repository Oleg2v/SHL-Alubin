// Fails (exit 1) if src/design/tokens.ts and src/styles/tokens.css disagree.
import { readFileSync } from "node:fs";
import { steps, fluid } from "./type-scale.mjs";

const css = readFileSync(new URL("../src/styles/tokens.css", import.meta.url), "utf8");
const ts = readFileSync(new URL("../src/design/tokens.ts", import.meta.url), "utf8");
const errors = [];

for (const [name, min, max] of steps) {
  const want = fluid(min, max);
  const m = css.match(new RegExp(`--text-${name}:\\s*([^;]+);`));
  if (!m) errors.push(`missing --text-${name} in tokens.css`);
  else if (m[1].trim() !== want) errors.push(`--text-${name}: css "${m[1].trim()}" != generated "${want}"`);
  const t = ts.match(new RegExp(`token: "${name}"[^}]*min: ([\\d.]+), max: ([\\d.]+)`));
  if (!t) errors.push(`missing ${name} in tokens.ts`);
  else if (Number(t[1]) !== min || Number(t[2]) !== max) errors.push(`${name}: tokens.ts ${t[1]}->${t[2]} != ${min}->${max}`);
}

const hexes = { "alu-white": "#ECEEF0", "alu-mid": "#9BA3AB", graphite: "#16191C", ink: "#0B0D0F", glow: "#FF5A1F", "alu-deep": "#5A626A" };
for (const [k, v] of Object.entries(hexes)) {
  const m = css.match(new RegExp(`--color-${k}:\\s*(#[0-9a-fA-F]{6})`));
  if (!m || m[1].toLowerCase() !== v.toLowerCase()) errors.push(`--color-${k} drifted (${m?.[1]})`);
  if (!ts.includes(`hex: "${v}"`)) errors.push(`tokens.ts missing ${v}`);
}

const durs = { tick: 80, fast: 160, base: 240, dissolve: 400, slow: 640, travel: 960, preload: 1120 };
for (const [k, v] of Object.entries(durs)) {
  if (!css.includes(`--dur-${k}: ${v}ms`)) errors.push(`--dur-${k} != ${v}ms in tokens.css`);
  if (!new RegExp(`\\b${k}: ${v},`).test(ts)) errors.push(`durations.${k} != ${v} in tokens.ts`);
  if (v % 80 !== 0) errors.push(`--dur-${k} (${v}ms) is off the 80 ms grid`);
}

if (!css.includes("--ease-out: cubic-bezier(0.22, 1, 0.36, 1)")) errors.push("house ease drifted");

if (errors.length) {
  console.error("Token drift:\n- " + errors.join("\n- "));
  process.exit(1);
}
console.log("tokens.css and tokens.ts agree (type scale, palette, durations, house ease).");
