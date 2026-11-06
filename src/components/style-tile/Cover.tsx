import { ProfileDrawing } from "@/components/drawing/ProfileDrawing";
import { DimH } from "@/components/drawing/Dim";
import { chamberFrame } from "@/lib/geometry/profile";

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

        <figure className="self-end w-[min(56%,320px)] text-fg" aria-labelledby="cold-cap">
          <ProfileDrawing
            shape={frame}
            title="Cross-section of a three-chamber window frame profile"
            description="Overall 64.0 by 51.4 millimetres, wall 1.8 millimetres."
            box={300}
            margin={44}
          />
          <figcaption id="cold-cap" className="mt-2 flex justify-between t-label">
            <span className="text-fg-muted">AL-40217 · 6063 T6</span>
            <span dir="ltr">20 °C</span>
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
        <div className="flex items-start justify-between gap-4 t-label">
          <span className="text-fg-muted">Billet · 6063 · Ø 254</span>
          <span className="text-accent-text" dir="ltr">
            480 °C
          </span>
        </div>

        <div className="relative grid place-items-center py-6" aria-hidden="true">
          <div className="relative">
            <div className="billet" />
            {/* chain centre lines through the billet */}
            <svg className="billet-axis" viewBox="0 0 100 100" preserveAspectRatio="none">
              <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray="14 3 2 3" vectorEffect="non-scaling-stroke" />
              <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="14 3 2 3" vectorEffect="non-scaling-stroke" />
            </svg>
            <DimH className="mt-6">Ø 254</DimH>
          </div>
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
    ["One story", "A 480 °C billet becomes a cold, exact profile, and every page tells part of that journey."],
    ["Cold interface", "Swiss grid, hairlines, mono specs and drawing-sheet dimensions; heat appears only where the process is hot."],
    ["A working tool", "Find a profile, read its drawing, request a quote: in English, German and true right-to-left Hebrew."],
  ] as const;
  return (
    <section id="concept" aria-labelledby="concept-title" data-surface="sheet" className="st-section">
      <div className="swiss-grid st-section-head">
        <p className="col-span-4 sm:col-span-2 lg:col-span-3 t-label text-fg-muted st-index">
          <span>§ 00</span>
          <span>Concept</span>
        </p>
        <h2 id="concept-title" className="col-span-4 sm:col-span-6 lg:col-span-9 t-title-m max-w-[24ch]">
          Cold metal. Hot process. In three lines.
        </h2>
      </div>
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
    </section>
  );
}
