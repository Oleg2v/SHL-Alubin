import { SectionHead } from "./SectionHead";

export const DECISIONS = [
  {
    title: "Colour is temperature",
    body: "Billet Glow is not a brand accent, it is a thermometer: it appears only where something is hot, live or the one primary action, and never covers more than 2% of a screen.",
  },
  {
    title: "The page is a drawing sheet",
    body: "Section numbers, title blocks, ISO hatching and dimension lines annotate the interface itself; even the giant numerals carry their own measured width in mm.",
  },
  {
    title: "Scroll is the ram",
    body: "In the hero, scroll drives the press stroke 1:1, with no free-floating parallax: the visitor extrudes the profile, sees it morph through four real sections and cool from 480 °C to silver.",
  },
  {
    title: "Facts set as giant numerals",
    body: "6,000 / 1,200 t / 50 / 35% set at up to 232 px with tabular figures and mono units: the numbers are the hero copy, not the adjectives.",
  },
  {
    title: "Hebrew is a mirror, not a translation",
    body: "True RTL from the first component: layout, timelines and arrows mirror; drawings, part IDs and every number stay left to right, exactly as Israeli engineering documents do.",
  },
] as const;

export const CLICHES = [
  { cliche: "Stock factory photography", instead: "Monochrome macro on die, billet and surface, or an honest placeholder." },
  { cliche: "Corporate blue and glassmorphism", instead: "Four cold neutrals and one rationed heat colour; no blur, no gradients but the cooling ramp." },
  { cliche: "Fade-up on everything", instead: "Motion only where the process moves: the ram, the cooling, a dimension being drawn." },
  { cliche: "“Innovative solutions” copy", instead: "Tonnes, dies, alloys, tolerances and ports: facts that only SHL-Alubin can say." },
  { cliche: "Bouncy springs and cursor blobs", instead: "One house curve, no overshoot, and a crosshair that tells you where you are in mm." },
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
