import { SectionHead } from "./SectionHead";

export const DECISIONS = [
  {
    title: "Colour is temperature",
    body: "Billet Glow is a reading, not an accent. It appears only where something is hot, live or the one primary action, every hot element carries its °C, and it never covers more than 2% of a screen.",
  },
  {
    title: "Type set in lettering heights",
    body: "The nine sizes are drawing-office lettering heights, from 2.5 mm dimension text to 40 mm numerals, and every dimension line on the sheet measures something real, live, in millimetres.",
  },
  {
    title: "Scroll is the ram",
    body: "No parallax. Scroll drives the press stroke 1:1: the visitor extrudes the profile, sees it morph through four real sections and cool from 480 °C to brushed silver. Long stories index like a rotary table: push, stop, hold.",
  },
  {
    title: "Line types carry state",
    body: "Interface states borrow ISO 128 line types: a dashed hidden line for unavailable, a phantom line for loading, a wide line and a note for an error. Never 40% opacity, never a shimmer, never red. Hatching is kept for cut metal.",
  },
  {
    title: "Hebrew is a mirror, not a translation",
    body: "True RTL from the first component. Layout, arrows and timelines mirror; drawings, part IDs and every number stay left to right, as on Israeli engineering drawings. Text reveals by line, never by letter.",
  },
] as const;

export const CLICHES = [
  {
    cliche: "Molten metal and orange everywhere",
    instead: "Extrusion is a solid-state process and a 480 °C billet barely glows. Heat is a measured reading, on the billet only.",
  },
  {
    cliche: "Stock factory photography",
    instead: "No hard hats, handshakes or blue tint: monochrome macro on die, billet and surface, or an honest placeholder.",
  },
  {
    cliche: "The fake blueprint",
    instead: "No white-on-blue grids or decorative dimensions with invented numbers: ISO 128 lines, and values that are measured or come from data.",
  },
  {
    cliche: "Bouncy springs, blob cursors, parallax",
    instead: "One damped house curve, the system crosshair with a live mm readout, and depth only inside the WebGL hero.",
  },
  {
    cliche: "\u201CInnovative solutions\u201D, marquees, carousels",
    instead: "Tonnes, dies, alloys, tolerances and ports: facts only SHL-Alubin can state, set large and left still.",
  },
] as const;

export function DecisionsSection() {
  return (
    <section id="decisions" aria-labelledby="decisions-title" data-surface="press" className="st-section">
      <SectionHead n="08" kicker="Decisions" id="decisions-title" title="Five commitments. Five things we refuse.">
        What we hold ourselves to from Stage 1 onwards, and the habits of industrial websites we will not repeat.
      </SectionHead>

      <div className="swiss-grid gap-y-16">
        {[
          { key: "commit", heading: "We commit to", items: DECISIONS.map((d) => ({ title: d.title, body: d.body, strike: false })) },
          { key: "refuse", heading: "We refuse", items: CLICHES.map((d) => ({ title: d.cliche, body: d.instead, strike: true })) },
        ].map((col) => (
          <div key={col.key} className="col-span-4 sm:col-span-8 lg:col-span-6 grid grid-cols-subgrid content-start">
            <h3 className="col-span-full t-label text-fg-muted mb-6">{col.heading}</h3>
            <ol className="col-span-full grid grid-cols-subgrid border-t border-line">
              {col.items.map((d, i) => (
                <li key={d.title} className="col-span-full grid grid-cols-subgrid border-b border-line py-6">
                  <span className="col-span-1 t-data text-fg-muted pt-1" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="col-span-3 sm:col-span-7 lg:col-span-5 grid gap-2">
                    <p className="t-title-s">{d.strike ? <del className="cliche-strike">{d.title}</del> : d.title}</p>
                    <p className="t-small text-fg-muted max-w-[56ch]">
                      {d.strike ? <span className="t-label text-fg">Instead · </span> : null}
                      {d.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}

/** ISO 7200 title block: the sheet's finale. Varied cell widths, a revision row, drawing number. */
export function TitleBlock() {
  return (
    <footer data-surface="sheet" className="px-(--margin) pb-12 pt-16">
      <div className="iso-block" role="group" aria-label="Title block">
        <div className="iso-title">
          <span className="t-label text-fg-muted">Title</span>
          <span className="t-title-l">Style tile</span>
          <span className="t-small text-fg-muted">Art direction · Stage 0 of the SHL-Alubin website concept</span>
        </div>
        <div className="iso-c1">
          <span className="t-label text-fg-muted">Client</span>
          <span className="t-small">SHL-Alubin (concept, unofficial)</span>
        </div>
        <div className="iso-c2">
          <span className="t-label text-fg-muted">Project</span>
          <span className="t-small">Website · EN · DE · HE</span>
        </div>
        <div className="iso-c3">
          <span className="t-label text-fg-muted">Drawn · standards</span>
          <span className="t-small">Kikkey · WCAG 2.0 AA, IS 5568, ISO 128 / 129 / 3098</span>
        </div>
        <div className="iso-c4">
          <span className="t-label text-fg-muted">Data</span>
          <span className="t-small">Facts per the brief; every other value illustrative</span>
        </div>
        <div className="iso-rev">
          <span className="t-label text-fg-muted">Rev · description · date</span>
          <bdi className="t-data" dir="ltr">
            A · for approval · 2026-11-06
          </bdi>
        </div>
        <div className="iso-scale">
          <span className="t-label text-fg-muted">Scale · grid</span>
          <bdi className="t-data" dir="ltr">
            1:1 · 1 px = 0.2646 mm · 4 px · 80 ms
          </bdi>
        </div>
        <div className="iso-dwg">
          <span className="t-label text-fg-muted">Drawing no.</span>
          <bdi className="t-title-s t-mono whitespace-nowrap" dir="ltr">
            SHL-WEB-000
          </bdi>
        </div>
        <div className="iso-sheet">
          <span className="t-label text-fg-muted">Sheet</span>
          <bdi className="t-title-s t-mono" dir="ltr">
            00 / 04
          </bdi>
        </div>
      </div>
    </footer>
  );
}
