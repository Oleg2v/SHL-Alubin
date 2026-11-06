import { spacing, radii } from "@/design/tokens";
import { SectionHead } from "./SectionHead";
import { GridDiagram } from "./GridDiagram";

export function SpaceSection() {
  return (
    <section id="space" aria-labelledby="space-title" data-surface="sheet" className="st-section">
      <SectionHead n="03" kicker="Space" id="space-title" title="A 4 px grid, a 12-column sheet, and a lot of air.">
        Every gap, padding and size is a multiple of four. Margins and gutters step at each breakpoint instead of
        floating, so they stay on the grid; columns collapse from 12 to 8 to 4, never to an odd count.
      </SectionHead>

      <div className="swiss-grid gap-y-16">
        <div className="col-span-4 sm:col-span-8 lg:col-span-5">
          <h3 className="t-title-s mb-6">Spacing scale</h3>
          <ol className="grid gap-2" aria-label="Spacing tokens in pixels">
            {spacing.map((px) => (
              <li key={px} className="grid grid-cols-[120px_1fr] items-center gap-4">
                <span className="t-data" dir="ltr">
                  <span className="text-fg-muted">{String(px / 4).padStart(2, "0")} ·</span> {px} px
                </span>
                <span className="block h-3 bg-fg" style={{ width: `min(100%, ${px}px)` }} aria-hidden="true" />
              </li>
            ))}
          </ol>
          <p className="t-small text-fg-muted mt-6 max-w-[44ch]">
            Tailwind&apos;s <code className="t-mono">--spacing: 0.25rem</code> makes <code className="t-mono">p-4</code> 16 px,{" "}
            <code className="t-mono">gap-12</code> 48 px. Arbitrary values are a review comment.
          </p>
        </div>

        <div className="col-span-4 sm:col-span-8 lg:col-start-7 lg:col-span-6 grid gap-10 content-start">
          <h3 className="t-title-s">Grid</h3>
          <dl className="grid grid-cols-3 border-t border-line">
            {[
              ["Columns", "4 · 8 · 12 · 12"],
              ["Margin", "16 · 32 · 40 · 48"],
              ["Gutter", "12 · 16 · 20 · 24"],
              ["Breaks", "640 · 1024 · 1440"],
              ["Section", "80 · 96 · 112 · 128"],
              ["Hairline", "1 px"],
            ].map(([k, v = ""]) => (
              <div key={k} className="border-b border-line py-4 pe-4">
                <dt className="t-label text-fg-muted">{k}</dt>
                <dd className="t-small mt-1 t-mono" dir="ltr">
                  {v.split(" · ").map((part, i, all) => (
                    <span key={i}>
                      <span className="whitespace-nowrap">{part}</span>
                      {i < all.length - 1 ? " · " : ""}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>

          {/* Diagram: the grid at the reader's own viewport, live */}
          <GridDiagram />
        </div>
      </div>
    </section>
  );
}

export function FormSection() {
  return (
    <section id="form" aria-labelledby="form-title" data-surface="sheet" className="st-section">
      <SectionHead n="04" kicker="Form" id="form-title" title="Machined edges, drawing-sheet lines, and only one glow.">
        Radii are quoted like a drawing quotes them. Elevation is mostly a hairline; the only shadow with colour is heat.
      </SectionHead>

      {/* Radii */}
      <div className="swiss-grid gap-y-10">
        <h3 className="col-span-4 sm:col-span-8 lg:col-span-3 t-title-s">Radii</h3>
        <ul className="col-span-4 sm:col-span-8 lg:col-span-9 grid grid-cols-2 sm:grid-cols-4 gap-(--gutter)">
          {radii.map((r) => (
            <li key={r.token} className="grid content-start gap-4">
              <div className="relative pt-8" aria-hidden="true">
                <span className="absolute top-0 end-0 t-data" dir="ltr">
                  {r.px > 100 ? "R ∞" : `R${r.px}`}
                </span>
                <span className="absolute top-5 end-1 h-3 w-px bg-[var(--fg-muted)]" />
                <div className="radius-specimen" style={{ borderRadius: r.px > 100 ? 9999 : r.px * 6 }} />
              </div>
              <div>
                <p className="t-data" dir="ltr">
                  {r.token}
                </p>
                <p className="t-small text-fg-muted mt-1">{r.use}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="col-span-4 sm:col-span-8 lg:col-start-4 lg:col-span-9 t-small text-fg-muted">
          Specimens drawn at 6:1 so the radius reads; real sizes are 0, 2, 4 px and full.
        </p>
      </div>

      {/* Lines */}
      <div className="swiss-grid mt-24 gap-y-10">
        <div className="col-span-4 sm:col-span-8 lg:col-span-3">
          <h3 className="t-title-s">Lines (after ISO 128)</h3>
          <p className="t-small text-fg-muted mt-3 max-w-[36ch]">
            Line types carry state the way a drawing does: dashed is unavailable, phantom is loading, wide is active
            or in error. Hatching is kept for cut metal.
          </p>
        </div>
        <ul className="col-span-4 sm:col-span-8 lg:col-span-9 grid gap-0 border-t border-line">
          {[
            ["Outline", "1.25 px continuous", "Visible edges of a section", <line key="a" x1="0" y1="6" x2="100%" y2="6" stroke="currentColor" strokeWidth="1.25" />],
            ["Hairline", "1 px continuous, 14% Ink", "UI rules, borders, table rows", <line key="b" x1="0" y1="6" x2="100%" y2="6" stroke="var(--line)" strokeWidth="1" />],
            [
              "Dimension",
              "0.75 px + closed arrowheads",
              "Dimension and extension lines",
              <g key="c">
                <line x1="0" y1="1" x2="0" y2="11" stroke="currentColor" strokeWidth="0.75" />
                <line x1="100%" y1="1" x2="100%" y2="11" stroke="currentColor" strokeWidth="0.75" />
                <line x1="0" y1="6" x2="100%" y2="6" stroke="currentColor" strokeWidth="0.75" />
                <polygon points="0,6 8,3.75 8,8.25" fill="currentColor" />
                <svg x="100%" y="0" width="1" height="12" overflow="visible">
                  <polygon points="0,6 -8,3.75 -8,8.25" fill="currentColor" />
                </svg>
              </g>,
            ],
            ["Centre", "0.75 px chain 14·3·2·3", "Axes of symmetry", <line key="d" x1="0" y1="6" x2="100%" y2="6" stroke="currentColor" strokeWidth="0.75" strokeDasharray="14 3 2 3" />],
            ["Hidden", "0.75 px dashed 6·3", "Hidden edges; unavailable states", <line key="e" x1="0" y1="6" x2="100%" y2="6" stroke="currentColor" strokeWidth="0.75" strokeDasharray="6 3" />],
            ["Phantom", "0.75 px long dash + two dots", "Loading: where a part will be", <line key="p" x1="0" y1="6" x2="100%" y2="6" stroke="currentColor" strokeWidth="0.75" strokeDasharray="12 3 2 3 2 3" />],
            [
              "Section hatching",
              "45°, 1 px, 6 px pitch",
              "Cut faces of metal, and nothing else",
              <g key="h">
                <defs>
                  <pattern id="lines-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" strokeWidth="1" opacity="0.6" />
                  </pattern>
                </defs>
                <rect x="0" y="0" width="100%" height="12" fill="url(#lines-hatch)" stroke="currentColor" strokeWidth="1" />
              </g>,
            ],
            ["Active", "2 px Billet Glow", "Active row, selected tile, live state", <line key="f" x1="0" y1="6" x2="100%" y2="6" stroke="var(--color-glow)" strokeWidth="2" />],
          ].map(([name, spec, use, line]) => (
            <li key={name as string} className="grid grid-cols-4 sm:grid-cols-9 gap-x-(--gutter) items-center border-b border-line py-4">
              <span className="col-span-2 sm:col-span-2 t-small">{name}</span>
              <span className="col-span-2 sm:col-span-2 t-data text-fg-muted">{spec}</span>
              <svg className="col-span-4 sm:col-span-3 h-3 w-full overflow-visible" aria-hidden="true">
                {line}
              </svg>
              <span className="col-span-4 sm:col-span-2 t-small text-fg-muted">{use}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Elevation */}
      <div className="swiss-grid mt-24 gap-y-10">
        <h3 className="col-span-4 sm:col-span-8 lg:col-span-3 t-title-s">Elevation</h3>
        <div className="col-span-4 sm:col-span-8 lg:col-span-9 grid gap-(--gutter) sm:grid-cols-2">
          <div className="grid grid-cols-3 gap-4 p-6 border border-line">
            {[
              ["hairline", "var(--shadow-hairline)"],
              ["lift", "var(--shadow-lift)"],
              ["float", "var(--shadow-float)"],
            ].map(([n, v]) => (
              <figure key={n} className="grid gap-3">
                <div className="aspect-square bg-bg-raised" style={{ boxShadow: v }} aria-hidden="true" />
                <figcaption className="t-label text-fg-muted">{n}</figcaption>
              </figure>
            ))}
          </div>
          <div data-surface="press" className="grid grid-cols-3 gap-4 p-6">
            {[
              ["press", "var(--shadow-press)", "var(--color-graphite)"],
              ["hairline", "var(--shadow-hairline)", "var(--color-ink)"],
              ["heat", "var(--shadow-heat)", "var(--color-glow)"],
            ].map(([n, v, bg]) => (
              <figure key={n} className="grid gap-3">
                <div className="aspect-square" style={{ boxShadow: v, background: bg }} aria-hidden="true" />
                <figcaption className="t-label text-fg-muted">{n}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>

      {/* Focus */}
      <div className="swiss-grid mt-24 gap-y-10">
        <div className="col-span-4 sm:col-span-8 lg:col-span-3">
          <h3 className="t-title-s">Focus</h3>
          <p className="t-small text-fg-muted mt-3 max-w-[36ch]">
            Ink inside, Billet Glow outside. Ink carries 16.7:1 on the sheet, Glow 6.2:1 on the stage, so one ring works
            on every surface. Focus is an active state, so it is hot.
          </p>
        </div>
        <div className="col-span-4 sm:col-span-8 lg:col-span-9 grid gap-(--gutter) sm:grid-cols-2">
          <div className="grid place-items-center gap-4 border border-line p-10">
            <span className="btn btn-secondary focus-demo" aria-hidden="true">
              <span className="btn-skin" />
              <span className="btn-label">Focused on the sheet</span>
            </span>
          </div>
          <div data-surface="press" className="grid place-items-center gap-4 p-10">
            <span className="btn btn-secondary focus-demo" aria-hidden="true">
              <span className="btn-skin" />
              <span className="btn-label">Focused on the stage</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
