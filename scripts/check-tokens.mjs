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
for (const e of ["--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)", "--ease-in: cubic-bezier(0.55, 0, 1, 0.45)", "--ease-linear: linear"]) {
  if (!css.includes(e)) errors.push(`easing drifted: ${e}`);
}
for (const r of ["--radius-none: 0px", "--radius-xs: 2px", "--radius-sm: 4px", "--radius-full: 9999px"]) {
  if (!css.includes(r)) errors.push(`radius drifted: ${r}`);
}
for (const f of ["--font-sans: var(--font-plex-hebrew)", "--font-mono: var(--font-plex-hebrew)"]) {
  if (!css.includes(f)) errors.push(`${f.split(":")[0]} must start with Plex Hebrew (Hebrew-only unicode-range)`);
}

// Billet Glow may only be named through tokens: a raw value anywhere else fails.
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const root = new URL("../src/", import.meta.url).pathname;
for (const file of walk(root)) {
  if (!/\.(css|tsx?|mjs)$/.test(file) || /styles\/tokens\.css$|design\/tokens\.ts$/.test(file)) continue;
  const text = readFileSync(file, "utf8");
  if (/255[ ,]+90[ ,]+31|#ff5a1f/i.test(text)) errors.push(`raw Billet Glow in ${file.replace(root, "src/")}: use var(--color-glow) or a --glow-* token`);
}

if (errors.length) {
  console.error("Token drift:\n- " + errors.join("\n- "));
  process.exit(1);
}
console.log("tokens.css and tokens.ts agree (type scale, palette, durations, house ease).");
