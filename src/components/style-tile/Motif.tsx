"use client";

import { useEffect, useRef, useState } from "react";
import { MM_PER_PX } from "@/design/tokens";
import { ProfileDrawing } from "@/components/drawing/ProfileDrawing";
import { DimH, DimV, Callout } from "@/components/drawing/Dim";
import { tSlotRail } from "@/lib/geometry/profile";
import { SectionHead } from "./SectionHead";
import { FinishLab } from "./FinishLab";

const rail = tSlotRail(40, 8.2, 2.6, 6.4, 7.4);

/** Crosshair with a live X/Y readout in millimetres (1 px = 0.2646 mm). Fine pointers only. */
function CrosshairField() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [fine, setFine] = useState(true);
  useEffect(() => {
    setFine(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);
  const read = pos ?? { x: 160, y: 120 };
  const mm = (v: number) => (v * MM_PER_PX).toFixed(1).padStart(5, "0");
  return (
    <figure className="grid gap-3">
      <div
        ref={ref}
        data-surface="press"
        className="crosshair-field"
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
          const r = e.currentTarget.getBoundingClientRect();
          setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
        }}
        onPointerLeave={() => setPos(null)}
        aria-hidden="true"
      >
        <span className="crosshair-h" style={{ top: read.y }} />
        <span className="crosshair-v" style={{ left: read.x }} />
        <span className="crosshair-read" dir="ltr" style={{ left: read.x + 12, top: read.y + 12 }}>
          X {mm(read.x)} · Y {mm(read.y)} mm
        </span>
        <span className="absolute bottom-3 start-3 t-label text-fg-muted">
          {fine ? "Move the pointer here" : "Desktop only: touch keeps the native cursor"}
        </span>
      </div>
      <figcaption className="t-label text-fg-muted">
        Desktop cursor: a crosshair with live X/Y in mm. Touch and reduced motion keep the system cursor.
      </figcaption>
    </figure>
  );
}


export function MotifSection() {
  return (
    <section id="motif" aria-labelledby="motif-title" data-surface="sheet" className="st-section">
      <SectionHead n="07" kicker="Motif & material" id="motif-title" title="The page is a drawing sheet. The metal is the only texture.">
        Dimension lines, leaders and section hatching annotate the interface itself. Finishes are the client&apos;s real
        finishes, and the only other colours that ever appear.
      </SectionHead>

      <div className="swiss-grid gap-y-16">
        {/* Drawing */}
        <figure className="col-span-4 sm:col-span-8 lg:col-span-6 border border-line p-6 grid gap-4" aria-labelledby="rail-cap">
          <div className="text-fg mx-auto w-full max-w-[440px]">
            <ProfileDrawing
              shape={rail}
              title="Cross-section of AL-30440, a 40 by 40 millimetre T-slot machine rail"
              description="Overall 40.0 by 40.0 millimetres, four 8.2 millimetre slots, centre bore 7.4 millimetres."
              box={360}
              margin={52}
            />
          </div>
          <figcaption id="rail-cap" className="flex flex-wrap justify-between gap-2 t-label text-fg-muted">
            <span>AL-30440 · 6082 T6 · Section A–A</span>
            <span>Scale 6:1 · dimensions in mm</span>
          </figcaption>
        </figure>

        {/* Annotation kit */}
        <div className="col-span-4 sm:col-span-8 lg:col-span-6 grid content-start gap-10">
          <div className="grid gap-3">
            <p className="t-label text-fg-muted">Horizontal dimension · stretches to its container</p>
            <DimH>1,042.6 mm</DimH>
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-6 items-stretch">
            <div className="h-40">
              <DimV>180</DimV>
            </div>
            <div className="grid content-center gap-3">
              <p className="t-label text-fg-muted">Vertical dimension · reads bottom to top</p>
              <p className="t-small text-fg-muted max-w-[40ch]">
                Labels are isolated LTR runs: in Hebrew the line mirrors with the layout, the number never does.
              </p>
            </div>
          </div>
          <div className="grid gap-4">
            <p className="t-label text-fg-muted">Leader callouts</p>
            <div className="flex flex-wrap gap-x-10 gap-y-4">
              <Callout>R2</Callout>
              <Callout>Ø 7.4</Callout>
              <Callout>±0.20 · EN 755-9</Callout>
            </div>
          </div>
          <div lang="he" dir="rtl" className="grid gap-3 border-t border-line pt-6">
            <p className="t-label text-fg-muted">אותו קו מידה בעברית</p>
            <DimH>1,042.6 mm</DimH>
          </div>
        </div>

        {/* Crosshair */}
        <div className="col-span-4 sm:col-span-8 lg:col-span-6">
          <CrosshairField />
        </div>

        {/* Photography */}
        <figure className="col-span-4 sm:col-span-8 lg:col-span-6 grid gap-3" aria-labelledby="photo-cap">
          <div data-surface="press" className="relative h-[360px] overflow-hidden">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <defs>
                <filter id="mono-grain">
                  <feTurbulence type="fractalNoise" baseFrequency="0.012 0.6" numOctaves="3" seed="9" />
                  <feColorMatrix type="saturate" values="0" />
                  <feComponentTransfer>
                    <feFuncR type="discrete" tableValues="0 0.08 0.2 0.55 0.9 1" />
                    <feFuncG type="discrete" tableValues="0 0.08 0.2 0.55 0.9 1" />
                    <feFuncB type="discrete" tableValues="0 0.08 0.2 0.55 0.9 1" />
                  </feComponentTransfer>
                </filter>
                <linearGradient id="hard-light" x1="0" x2="1" y1="0" y2="0.3">
                  <stop offset="0" stopColor="#000" />
                  <stop offset="0.55" stopColor="#000" stopOpacity="0.2" />
                  <stop offset="1" stopColor="#000" />
                </linearGradient>
              </defs>
              <rect width="600" height="360" filter="url(#mono-grain)" opacity="0.9" />
              <rect width="600" height="360" fill="url(#hard-light)" />
            </svg>
            <div className="absolute inset-0 grid place-items-center">
              <p className="t-label text-alu-white bg-ink px-3 py-2">Photo placeholder · press hall, line 2</p>
            </div>
          </div>
          <figcaption id="photo-cap" className="t-small text-fg-muted">
            Photography: monochrome, hard light, macro on die, billet and surface. No hard hats, no handshakes, no blue
            tint. Placeholders stay placeholders until the shoot.
          </figcaption>
        </figure>

        {/* Finishes */}
        <div className="col-span-4 sm:col-span-8 lg:col-span-12 grid gap-6">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h3 className="t-title-s">Finishes: brushed, anisotropic, real</h3>
            <p className="t-label text-fg-muted">The client&apos;s six finishes are the only other colours in the system</p>
          </div>
          <FinishLab />
        </div>
      </div>
    </section>
  );
}
