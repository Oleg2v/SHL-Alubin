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

// No dead tokens: every custom property declared in tokens.css is consumed somewhere in src, by a
// var() or Tailwind arbitrary value, a theme utility (bg-alu-white, rounded-xs, hd:), or for the
// few below, through tokens.ts (the motion and radius specimens read the mirror).
const READ_ELSEWHERE = new Set([
  "--spacing", // Tailwind's spacing base: every p-4 and gap-6
  "--color-transparent", // keyword colours kept after the --color-* reset
  "--color-current",
  "--radius-none", // radii specimen (tokens.ts radii)
  "--dur-preload", // preloader (tokens.ts durations.preload)
  "--stagger", // motion specimen (tokens.ts stagger)
]);
const source = walk(root)
  .filter((f) => /\.(css|tsx?)$/.test(f) && !/styles\/tokens\.css$/.test(f))
  .map((f) => readFileSync(f, "utf8"))
  .join("\n") + css.replace(/(--[a-z0-9-]+)\s*:/g, ":"); // tokens.css may consume its own tokens
const UTIL = { "--color-": "(?:bg|text|border|fill|stroke|outline|ring|decoration|accent|caret|divide|from|via|to)", "--radius-": "rounded(?:-[sebt]{1,2})?", "--shadow-": "shadow", "--ease-": "ease", "--font-": "font", "--text-": "text", "--tracking-": "tracking", "--leading-": "leading" };
const declared = [...new Set([...css.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]))].filter((n) => !n.endsWith("-") && !READ_ELSEWHERE.has(n));
for (const name of declared) {
  if (new RegExp(`var\\(${name}[\\s,)]|\\(${name}\\)`).test(source)) continue;
  const sub = name.match(/^(--text-[a-z-]+?)--/); // --text-small--line-height rides on text-small
  const base = sub ? sub[1] : name;
  const ns = Object.keys(UTIL).find((p) => base.startsWith(p));
  if (ns && new RegExp(`[\\s"'\`:]${UTIL[ns]}-${base.slice(ns.length)}(?![\\w-])`).test(source)) continue;
  if (name.startsWith("--breakpoint-") && new RegExp(`\\b${name.slice(13)}:`).test(source)) continue;
  errors.push(`${name} is declared in tokens.css but never used`);
}

if (errors.length) {
  console.error("Token drift:\n- " + errors.join("\n- "));
  process.exit(1);
}
console.log("tokens.css and tokens.ts agree (type scale, palette, durations, house ease).");
