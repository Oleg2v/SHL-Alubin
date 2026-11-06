"use client";

import { useEffect, useRef, useState } from "react";
import { MM_PER_PX } from "@/design/tokens";
import { ProfileDrawing, drawingWidthForScale } from "@/components/drawing/ProfileDrawing";
import { Callout } from "@/components/drawing/Dim";
import { DimHLive, DimVLive } from "@/components/drawing/LiveDim";
import { tSlotRail } from "@/lib/geometry/profile";
import { SectionHead } from "./SectionHead";
import { FinishLab } from "./FinishLab";
import { PhotoPlates } from "./PhotoPlates";

const rail = tSlotRail(40, 8.2, 2.6, 6.4, 7.4);
const RAIL_BOX = 360;
const RAIL_MARGIN = 52;
/* true ISO 5455 scales at the nominal 96 dpi: 2:1 from 640 px, 1:1 on phones */
const RAIL_W2 = drawingWidthForScale(rail, 2, RAIL_BOX, RAIL_MARGIN);
const RAIL_W1 = drawingWidthForScale(rail, 1, RAIL_BOX, RAIL_MARGIN);

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
      <figcaption className="t-small text-fg-muted">
        Desktop: the system crosshair plus drafting guides and a live X/Y readout in CSS mm (96 px = 25.4 mm), no
        smoothing, no lag. Touch keeps the native cursor.
      </figcaption>
    </figure>
  );
}


export function MotifSection() {
  return (
    <section id="motif" aria-labelledby="motif-title" data-surface="sheet" className="st-section">
      <SectionHead n="07" kicker="Motif & material" id="motif-title" title="The page is a drawing sheet. The metal is the only texture.">
        Dimension lines and leaders annotate the interface itself; section hatching marks cut metal and nothing else.
        Finishes are the client&apos;s real finishes, and the only other colours that ever appear.
      </SectionHead>

      <div className="swiss-grid gap-y-16">
        {/* Drawing */}
        <figure className="col-span-4 sm:col-span-8 lg:col-span-6 border border-line p-6 grid gap-4" aria-labelledby="rail-cap">
          <div
            className="text-fg mx-auto w-(--w1) sm:w-(--w2)"
            style={{ ["--w1" as string]: `${RAIL_W1.toFixed(1)}px`, ["--w2" as string]: `${RAIL_W2.toFixed(1)}px` }}
          >
            <ProfileDrawing
              shape={rail}
              title="Cross-section of AL-30440, a 40 by 40 millimetre T-slot machine rail"
              description="Overall 40.0 by 40.0 millimetres, four 8.2 millimetre slots, centre bore 7.4 millimetres."
              box={RAIL_BOX}
              margin={RAIL_MARGIN}
            />
          </div>
          <figcaption id="rail-cap" className="flex flex-wrap justify-between gap-2 t-data text-fg-muted">
            <span>AL-30440 · 6082 T6 · Section A–A</span>
            <span>
              <span className="sm:hidden">Scale 1:1</span>
              <span className="hidden sm:inline">Scale 2:1</span> · mm · 96 dpi nominal
            </span>
          </figcaption>
        </figure>

        {/* Annotation kit */}
        <div className="col-span-4 sm:col-span-8 lg:col-span-6 grid content-start gap-10">
          <div className="grid gap-3">
            <p className="t-small text-fg-muted">Horizontal dimension · stretches to its container</p>
            <DimHLive />
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-6 items-stretch">
            <div className="h-40">
              <DimVLive />
            </div>
            <div className="grid content-center gap-3">
              <p className="t-small text-fg-muted">Vertical dimension · reads bottom to top</p>
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
            <p className="t-small text-fg-muted">אותו קו מידה בעברית: הקו מתהפך, המספר לא</p>
            <DimHLive />
          </div>
        </div>

        {/* Crosshair */}
        <div className="col-span-4 sm:col-span-8 lg:col-span-12">
          <CrosshairField />
        </div>

        {/* Photography */}
        <div className="col-span-4 sm:col-span-8 lg:col-span-12 grid gap-6">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h3 className="t-title-s">Photography: monochrome plates, heat as a measured overlay</h3>
            <p className="t-small text-fg-muted">No hard hats, no handshakes, no blue tint, no AI fakes of the plant.</p>
          </div>
          <PhotoPlates />
        </div>

        {/* Finishes */}
        <div className="col-span-4 sm:col-span-8 lg:col-span-12 grid gap-6">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h3 className="t-title-s">Finishes: mill, anodized, powder, PVDF</h3>
            <p className="t-small text-fg-muted">The client&apos;s six finishes are the only other colours in the system.</p>
          </div>
          <FinishLab />
        </div>
      </div>
    </section>
  );
}
