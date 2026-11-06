import { palette } from "@/design/tokens";
import { SectionHead } from "./SectionHead";

/* WCAG 2.x contrast, computed at build time from the tokens (no hand-typed ratios). */
const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const lum = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => lin(v / 255));
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
};
export const contrast = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
const grade = (r: number) => (r >= 7 ? "AAA" : r >= 4.5 ? "AA" : r >= 3 ? "AA·L" : "FAIL");

const rgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
};

const SWATCHES = [
  {
    c: palette.aluWhite,
    share: 46,
    role: "The sheet. Every cold surface, every page background.",
    never: "Never as text on Alu Mid (2.20:1).",
  },
  {
    c: palette.ink,
    share: 24,
    role: "Text on the sheet; the stage behind the press and the Finder.",
    never: "Never a pure #000: Ink keeps the depth of anodized black.",
  },
  {
    c: palette.graphite,
    share: 14,
    role: "Raised dark surfaces: tiles, toasts, panels on the stage.",
    never: "Never Graphite on Ink as the only separator (1.10:1); add a hairline.",
  },
  {
    c: palette.aluMid,
    share: 12,
    role: "Secondary text on dark, rules, the cooled end of the heat ramp.",
    never: "Never text on Alu White (2.20:1): use Alu Deep #5A626A (5.33:1).",
  },
  {
    c: palette.glow,
    share: 2,
    role: "Heat only: the billet, the active state, the primary CTA.",
    never: "Never text on the sheet (2.68:1). Never decoration. Never two CTAs.",
  },
] as const;

const MATRIX = [palette.aluWhite, palette.aluMid, palette.graphite, palette.ink, palette.glow] as const;

export function Palette() {
  return (
    <section id="palette" aria-labelledby="palette-title" data-surface="sheet" className="st-section">
      <SectionHead n="01" kicker="Palette" id="palette-title" title="Four cold neutrals. One colour, rationed like heat.">
        Billet Glow covers at most two percent of any screen. If a screen has no heat, active state or primary
        action on it, it has no orange at all.
      </SectionHead>

      {/* Usage proportion: the palette drawn at the share of a screen it is allowed */}
      <div className="swiss-grid">
        <figure className="col-span-4 sm:col-span-8 lg:col-span-12" aria-labelledby="usage-cap">
          <div className="usage-bar" role="img" aria-label="Share of a typical screen: Alu White 46 percent, Ink 24, Graphite 14, Alu Mid 12, Billet Glow 2 at most.">
            {SWATCHES.map((s) => (
              <div key={s.c.hex} style={{ width: `${s.share}%`, background: s.c.hex }} />
            ))}
          </div>
          <figcaption id="usage-cap" className="mt-3 flex flex-wrap gap-x-6 gap-y-2 t-label text-fg-muted">
            {SWATCHES.map((s) => (
              <span key={s.c.hex} className="inline-flex items-center gap-2">
                <span className="inline-block size-2" style={{ background: s.c.hex, boxShadow: "inset 0 0 0 1px var(--line-strong)" }} aria-hidden="true" />
                {s.c.name} <span dir="ltr">{s.c === palette.glow ? "≤ 2%" : `${s.share}%`}</span>
              </span>
            ))}
          </figcaption>
        </figure>
      </div>

      {/* Swatches */}
      <ul className="mt-16 grid grid-cols-2 gap-(--gutter) px-(--margin) sm:grid-cols-3 lg:grid-cols-5">
        {SWATCHES.map((s) => {
          const onInk = contrast(s.c.hex, palette.ink.hex);
          const onWhite = contrast(s.c.hex, palette.aluWhite.hex);
          return (
            <li key={s.c.hex} className={`swatch bg-bg ${s.c === palette.glow ? "col-span-2 sm:col-span-1" : ""}`}>
              <div className="swatch-chip" style={{ background: s.c.hex }} aria-hidden="true" />
              <div className="grid content-start gap-3 p-4">
                <div>
                  <p className="t-title-s">{s.c.name}</p>
                  <p className="t-label text-fg-muted mt-1" dir="ltr">
                    {s.c.hex} · RGB {rgb(s.c.hex)}
                  </p>
                </div>
                <p className="t-small">{s.role}</p>
                <p className="t-small text-fg-muted">{s.never}</p>
                <dl className="grid gap-1 t-label">
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-fg-muted">on Ink</dt>
                    <dd className="flex items-center gap-2">
                      <span dir="ltr">{onInk.toFixed(2)}</span>
                      <span className="grade" data-fail={grade(onInk) === "FAIL" || undefined}>
                        {s.c === palette.ink ? "—" : grade(onInk)}
                      </span>
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-fg-muted">on White</dt>
                    <dd className="flex items-center gap-2">
                      <span dir="ltr">{onWhite.toFixed(2)}</span>
                      <span className="grade" data-fail={grade(onWhite) === "FAIL" || undefined}>
                        {s.c === palette.aluWhite ? "—" : grade(onWhite)}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Contrast matrix */}
      <div className="swiss-grid mt-24 gap-y-8">
        <div className="col-span-4 sm:col-span-8 lg:col-span-3">
          <h3 className="t-title-s">Contrast matrix</h3>
          <p className="t-small text-fg-muted mt-3 max-w-[36ch]">
            Text needs 4.5:1 (WCAG 2.0 AA, IS 5568). Hatched cells are pairs the system forbids for text. Derived
            Alu Deep exists for one reason: secondary text on the sheet.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <span className="inline-block h-10 w-16 border border-line" style={{ background: palette.aluDeep.hex }} aria-hidden="true" />
            <p className="t-label">
              Alu Deep <span dir="ltr">{palette.aluDeep.hex}</span>
              <br />
              <span className="text-fg-muted">
                on Alu White <span dir="ltr">{contrast(palette.aluDeep.hex, palette.aluWhite.hex).toFixed(2)}</span> · AA
              </span>
            </p>
          </div>
        </div>
        <div className="col-span-4 sm:col-span-8 lg:col-span-9 overflow-x-auto">
          <table className="matrix min-w-[640px]">
            <caption className="sr-only">Contrast ratio of each foreground colour (rows) on each background colour (columns)</caption>
            <thead>
              <tr>
                <th scope="col" className="t-label text-fg-muted">
                  Text ↓ / Ground →
                </th>
                {MATRIX.map((b) => (
                  <th key={b.hex} scope="col" className="t-label">
                    <span className="inline-flex items-center gap-2">
                      <span className="inline-block size-3" style={{ background: b.hex, boxShadow: "inset 0 0 0 1px var(--line-strong)" }} aria-hidden="true" />
                      {b.name}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MATRIX.map((f) => (
                <tr key={f.hex}>
                  <th scope="row" className="t-label">
                    {f.name}
                  </th>
                  {MATRIX.map((b) => {
                    if (f === b) {
                      return (
                        <td key={b.hex} className="text-fg-muted">
                          <span aria-label="same colour">—</span>
                        </td>
                      );
                    }
                    const r = contrast(f.hex, b.hex);
                    const g = grade(r);
                    return (
                      <td key={b.hex} style={g === "FAIL" || g === "AA·L" ? { background: "repeating-linear-gradient(-45deg, transparent 0 6px, var(--line) 6px 7px)" } : undefined}>
                        <span className="cell">
                          <span dir="ltr">{r.toFixed(2)}</span>
                          <span className="grade" data-fail={g === "FAIL" || undefined}>
                            {g}
                          </span>
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Heat ramp */}
      <div className="swiss-grid mt-24 gap-y-6">
        <div className="col-span-4 sm:col-span-8 lg:col-span-3">
          <h3 className="t-title-s">Heat ramp</h3>
          <p className="t-small text-fg-muted mt-3 max-w-[36ch]">
            The only gradient in the system, and it is physics. Radiance falls with T⁴, so the glow has lost two thirds
            of its intensity by 300 °C and is gone long before the stretcher. The hero shader uses the same curve.
          </p>
        </div>
        <figure className="col-span-4 sm:col-span-8 lg:col-span-9" aria-label="Heat ramp from 480 degrees at the die to 20 degrees ambient">
          <div className="heat-ramp" />
          <div className="relative mt-2 h-5 t-label text-fg-muted" dir="ltr">
            {[480, 400, 300, 200, 100, 20].map((t) => {
              const at = (480 - t) / 460;
              return (
                <span key={t} className="absolute top-0 whitespace-nowrap" style={{ left: `${at * 100}%`, translate: at === 0 ? "0" : at === 1 ? "-100%" : "-50%" }}>
                  {t} °C
                </span>
              );
            })}
          </div>
          <div className="mt-1 flex justify-between t-label text-fg-muted">
            <span>Die exit</span>
            <span>Cooling table</span>
            <span>Stretcher</span>
          </div>
        </figure>
      </div>
    </section>
  );
}
