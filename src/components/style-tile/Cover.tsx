import { ProfileDrawing } from "@/components/drawing/ProfileDrawing";
import { DimH } from "@/components/drawing/Dim";
import { chamberFrame } from "@/lib/geometry/profile";
import { SectionHead } from "./SectionHead";

const frame = chamberFrame(64, 46, 1.8, 3, 9);

export function Cover() {
  return (
    <section aria-labelledby="cover-title" className="st-cover">
      {/* COLD: the sheet */}
      <div data-surface="sheet" className="st-cover-half">
        <div className="flex items-start justify-between gap-4 t-label text-fg-muted">
          <span>00 / Art direction</span>
          <span>Stage 0 · For approval</span>
        </div>

        <figure className="self-end w-[min(44%,180px)] sm:w-[min(56%,320px)] text-fg" aria-labelledby="cold-cap">
          <ProfileDrawing
            shape={frame}
            title="Cross-section of a three-chamber window frame profile"
            description="Overall 64.0 by 51.4 millimetres, wall 1.8 millimetres."
            box={300}
            margin={44}
          />
          <figcaption id="cold-cap" className="mt-2 hidden justify-between t-data sm:flex">
            <span className="text-fg-muted">AL-40217 · 6063 T6</span>
            <span dir="ltr">20 °C</span>
          </figcaption>
        </figure>

        <div>
          <p className="t-label text-fg-muted mb-4">The interface</p>
          <h1 id="cover-title" className="t-headline">
            Cold metal.
            <span className="sr-only"> Hot process.</span>
          </h1>
        </div>
      </div>

      {/* HOT: the press */}
      <div data-surface="press" className="st-cover-half">
        <div className="flex items-start justify-between gap-4 t-data">
          <span className="text-fg-muted">Billet · 6063 · Ø 254</span>
          <span className="text-accent-text" dir="ltr">
            480 °C
          </span>
        </div>

        <div className="grid place-items-center gap-6 lg:py-6" aria-hidden="true">
          <div className="billet-wrap">
            <div className="billet" data-heat="process" data-heat-temp="480" />
            {/* chain centre lines through the billet's true centre */}
            <svg className="billet-axis" viewBox="0 0 100 100" preserveAspectRatio="none">
              <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray="14 3 2 3" vectorEffect="non-scaling-stroke" />
              <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="14 3 2 3" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
          <DimH className="w-(--billet-d)">Ø 254</DimH>
        </div>

        <div>
          <p className="t-label text-fg-muted mb-4">The process</p>
          <p aria-hidden="true" className="t-headline">
            Hot process.
          </p>
        </div>
      </div>
    </section>
  );
}

export function Concept() {
  const lines = [
    ["One story", "A 480 °C billet is pushed through the die and leaves as a cold, dimensioned profile; every page is a station on that line."],
    ["Cold interface", "The drawing office: a 12-column sheet, ISO hairlines, lettering heights in millimetres, every spec in mono."],
    ["Hot process", "Heat is a reading, not a decoration: Billet Glow marks only the hot billet, the active state and the one primary action."],
  ] as const;
  return (
    <section id="concept" aria-labelledby="concept-title" data-surface="sheet" className="st-section">
      <SectionHead n="00" kicker="Concept" id="concept-title" title="Cold metal. Hot process. In three lines." />
      <ol className="swiss-grid">
        {lines.map(([k, v], i) => (
          <li key={k} className="col-span-4 sm:col-span-8 lg:col-start-4 lg:col-span-9 grid grid-cols-subgrid border-t border-line py-6 lg:py-8">
            <span className="col-span-1 t-label text-fg-muted pt-2" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="col-span-3 sm:col-span-7 lg:col-span-8 t-title-s">
              <span className="text-fg-muted">{k}. </span>
              {v}
            </p>
          </li>
        ))}
      </ol>
      <div className="swiss-grid mt-12">
        <p className="col-span-4 sm:col-span-8 lg:col-start-4 lg:col-span-7 t-small text-fg-muted">
          <span className="t-label text-fg">Data · </span>
          Facts come from the brief: 6,000+ profile types, 1,000 to 1,200 tonnes a month, 50+ new dies a week, about
          35 % exported, three presses, an own casthouse, two powder lines, a PVDF line and the first anodizing line
          approved by the Standards Institution of Israel. Every other value on this sheet (billet diameter,
          temperatures, tolerances, film thicknesses, ram stroke) is illustrative until SHL-Alubin&apos;s engineers
          confirm it.
        </p>
      </div>
    </section>
  );
}
