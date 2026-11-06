import { SectionHead } from "./SectionHead";

export const DECISIONS = [
  {
    title: "Colour is temperature",
    body: "Billet Glow is a reading, not an accent. It appears only where something is hot, live or the one primary action, every hot element carries its °C, and it never covers more than 2% of a screen.",
  },
  {
    title: "Type set in lettering heights",
    body: "The nine sizes are the drawing office's ISO 3098 lettering heights, from 2.5 mm dimension text to 40 mm numerals, and every annotation measures something real, live, in millimetres.",
  },
  {
    title: "Scroll is the ram",
    body: "No parallax. Scroll drives the press stroke 1:1: the visitor extrudes the profile, sees it morph through four real sections and cool from 480 °C to brushed silver. Long stories index like a rotary table: push, stop, hold.",
  },
  {
    title: "Hatching is the state language",
    body: "Unavailable, loading and non-conforming states wear ISO 128 section hatching: never 40% opacity, never a shimmer, never red, so no state depends on colour alone.",
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
        <div className="col-span-4 sm:col-span-8 lg:col-span-6">
          <h3 className="t-label text-fg-muted mb-6">We commit to</h3>
          <ol className="border-t border-line">
            {DECISIONS.map((d, i) => (
              <li key={d.title} className="grid grid-cols-[48px_1fr] gap-4 border-b border-line py-6">
                <span className="t-label text-fg-muted pt-1" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="grid gap-2">
                  <p className="t-title-s">{d.title}</p>
                  <p className="t-small text-fg-muted max-w-[56ch]">{d.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="col-span-4 sm:col-span-8 lg:col-span-6">
          <h3 className="t-label text-fg-muted mb-6">We refuse</h3>
          <ol className="border-t border-line">
            {CLICHES.map((d, i) => (
              <li key={d.cliche} className="grid grid-cols-[48px_1fr] gap-4 border-b border-line py-6">
                <span className="t-label text-fg-muted pt-1" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="grid gap-2">
                  <p className="t-title-s">
                    <del className="cliche-strike">{d.cliche}</del>
                  </p>
                  <p className="t-small text-fg-muted max-w-[56ch]">
                    <span className="t-label text-fg">Instead · </span>
                    {d.instead}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function TitleBlock() {
  const cells = [
    ["Client", "SHL-Alubin (concept)"],
    ["Project", "Website, EN · DE · HE"],
    ["Document", "Style tile"],
    ["Sheet", "00 of 04"],
    ["Revision", "A · for approval"],
    ["Date", "2026-11-06"],
    ["Drawn", "Kikkey"],
    ["Scale", "1:1 · 1 px = 0.2646 mm"],
    ["Grid", "4 px · 80 ms"],
    ["Standards", "WCAG 2.0 AA · IS 5568"],
    ["Status", "Unofficial demo · noindex"],
    ["Next", "Stage 1 · hero lab"],
  ];
  return (
    <footer data-surface="sheet" className="px-(--margin) pb-24 pt-16">
      <p className="t-label text-fg-muted mb-4">Title block</p>
      <dl className="title-block">
        {cells.map(([k, v]) => (
          <div key={k}>
            <dt className="t-label text-fg-muted">{k}</dt>
            <dd className="t-small">{v}</dd>
          </div>
        ))}
      </dl>
    </footer>
  );
}
