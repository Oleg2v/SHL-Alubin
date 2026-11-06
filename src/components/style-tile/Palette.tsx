import { palette } from "@/design/tokens";
import { HeatLaw } from "./HeatLaw";
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
    share: 48,
    span: "sm:col-span-4 lg:col-span-3",
    role: "The sheet. Every cold surface, every page background.",
    never: "Never as text on Alu Mid (2.20:1).",
  },
  {
    c: palette.ink,
    share: 24,
    span: "sm:col-span-4 lg:col-span-3",
    role: "Text on the sheet; the stage behind the press and the Finder.",
    never: "Never a pure #000: Ink keeps the depth of anodized black.",
  },
  {
    c: palette.graphite,
    share: 14,
    span: "sm:col-span-4 lg:col-span-2",
    role: "Raised dark surfaces: tiles, toasts, panels on the stage.",
    never: "Never Graphite on Ink as the only separator (1.10:1); add a hairline.",
  },
  {
    c: palette.aluMid,
    share: 12,
    span: "sm:col-span-4 lg:col-span-2",
    role: "Secondary text on dark, rules, the cold end of the cooling bar.",
    never: "Never text on Alu White (2.20:1): use Alu Deep #5A626A (5.33:1).",
  },
  {
    c: palette.glow,
    share: 2,
    span: "sm:col-span-8 lg:col-span-2",
    role: "Heat only: metal at 400 °C or more, the active state, the primary CTA.",
    never: "Never text on the sheet (2.68:1). Never decoration. Never two CTAs in view.",
  },
] as const;

const MATRIX = [palette.aluWhite, palette.aluMid, palette.graphite, palette.ink, palette.glow] as const;

export function Palette() {
  return (
    <section id="palette" aria-labelledby="palette-title" data-surface="sheet" className="st-section">
      <SectionHead n="01" kicker="Palette" id="palette-title" title="Four cold neutrals. One colour, rationed like heat.">
        One primary action per screen, and all other interface heat under two percent of it; the billet is the one
        licensed exception. A screen with no heat, no active state and no primary action has no orange at all.
      </SectionHead>

      {/* Usage proportion: the palette drawn at the share of a screen it is allowed */}
      <div className="swiss-grid">
        <figure className="col-span-4 sm:col-span-8 lg:col-span-12" aria-labelledby="usage-cap">
          <div className="usage-bar" role="img" aria-label="Share of a typical screen: Alu White 48 percent, Ink 24, Graphite 14, Alu Mid 12, Billet Glow 2 at most.">
            {SWATCHES.map((s) => (
              <div key={s.c.hex} style={{ width: `${s.share}%`, background: s.c.hex }} />
            ))}
          </div>
          <figcaption id="usage-cap" className="mt-3 flex flex-wrap gap-x-6 gap-y-2 t-data text-fg-muted">
            {SWATCHES.map((s) => (
              <span key={s.c.hex} className="inline-flex items-center gap-2">
                <span className="inline-block size-2" style={{ background: s.c.hex, boxShadow: "inset 0 0 0 1px var(--line-strong)" }} aria-hidden="true" />
                {s.c.name} <bdi dir="ltr">{s.c === palette.glow ? "≤ 2 %" : `${s.share}\u00a0%`}</bdi>
              </span>
            ))}
          </figcaption>
        </figure>
      </div>

      {/* Swatches, on the 12-column grid (3 · 3 · 2 · 2 · 2) */}
      <ul className="swiss-grid mt-16 gap-y-(--gutter)">
        {SWATCHES.map((s) => {
          const onInk = contrast(s.c.hex, palette.ink.hex);
          const onWhite = contrast(s.c.hex, palette.aluWhite.hex);
          const isGlow = s.c === palette.glow;
          const rows = [
            { k: "on Ink", r: onInk, self: s.c === palette.ink },
            { k: "on White", r: onWhite, self: s.c === palette.aluWhite },
          ];
          return (
            <li key={s.c.hex} className={`swatch bg-bg col-span-4 ${s.span}`}>
              {isGlow ? (
                /* the specimen obeys its own rule: 2 % of the chip, on Ink */
                <div className="swatch-chip swatch-chip-rationed" aria-hidden="true">
                  <span />
                </div>
              ) : (
                <div className="swatch-chip" style={{ background: s.c.hex }} aria-hidden="true" />
              )}
              <div className="grid content-start gap-3 p-4">
                <div>
                  <p className="t-title-s">{s.c.name}</p>
                  <p className="t-data text-fg-muted mt-1" dir="ltr">
                    {s.c.hex} · RGB {rgb(s.c.hex)}
                  </p>
                </div>
                <p className="t-small">{s.role}</p>
                <p className="t-small text-fg-muted">{s.never}</p>
                <dl className="grid gap-1 t-data">
                  {rows.map(({ k, r, self }) => (
                    <div key={k} className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                      <dt className="text-fg-muted">{k}</dt>
                      <dd className="flex items-center gap-2">
                        <bdi dir="ltr">{r.toFixed(2)}</bdi>
                        <span className="grade" data-fail={(!self && grade(r) === "FAIL") || undefined}>
                          {self ? "—" : grade(r)}
                        </span>
                      </dd>
                    </div>
                  ))}
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
            Text needs 4.5:1 (WCAG 2.0 AA, IS 5568). Crossed-out cells are pairs the system forbids for text.
            Derived Alu Deep exists for one reason: secondary text on the sheet.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <span className="inline-block h-10 w-16 border border-line" style={{ background: palette.aluDeep.hex }} aria-hidden="true" />
            <p className="t-data">
              Alu Deep <bdi dir="ltr">{palette.aluDeep.hex}</bdi>
              <br />
              <span className="text-fg-muted">
                on Alu White <bdi dir="ltr">{contrast(palette.aluDeep.hex, palette.aluWhite.hex).toFixed(2)}</bdi> · AA
              </span>
            </p>
          </div>
        </div>
        <div className="col-span-4 sm:col-span-8 lg:col-span-9 scroll-x" role="region" aria-label="Contrast matrix, scrolls sideways" tabIndex={0}>
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
                          <span aria-hidden="true">—</span>
                          <span className="sr-only">same colour</span>
                        </td>
                      );
                    }
                    const r = contrast(f.hex, b.hex);
                    const g = grade(r);
                    return (
                      <td key={b.hex} className={g === "FAIL" || g === "AA·L" ? "cell-cancel" : undefined}>
                        <span className="cell">
                          <bdi dir="ltr">{r.toFixed(2)}</bdi>
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

      {/* Heat law */}
      <div className="swiss-grid mt-24 gap-y-6">
        <div className="col-span-4 sm:col-span-8 lg:col-span-3">
          <h3 className="t-title-s">Heat law</h3>
          <p className="t-small text-fg-muted mt-3 max-w-[36ch]">
            Glow follows radiance above ambient, which rises with T⁴. In 3D it varies continuously. The flat interface
            uses a threshold: 400 °C or more renders in Glow, 150 to 399 °C shows a reading only, and below that the
            metal is cold.
          </p>
        </div>
        <div className="col-span-4 sm:col-span-8 lg:col-span-9">
          <HeatLaw />
        </div>
      </div>
    </section>
  );
}
