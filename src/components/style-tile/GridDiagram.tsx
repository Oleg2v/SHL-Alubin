"use client";

import { useEffect, useRef, useState } from "react";
import { DimH } from "@/components/drawing/Dim";

type G = { vw: number; cols: number; margin: number; gutter: number };

/** The grid at the reader's own viewport, drawn to proportion and labelled with live values. */
export function GridDiagram() {
  const [g, setG] = useState<G | null>(null);
  const self = useRef<HTMLElement>(null);
  useEffect(() => {
    const read = () => {
      const cs = getComputedStyle(document.documentElement);
      const margin = parseFloat(cs.getPropertyValue("--margin")) || 16;
      const gutter = parseFloat(cs.getPropertyValue("--gutter")) || 12;
      const vw = document.documentElement.clientWidth;
      // the grid this diagram sits in: laid out whenever the diagram is (resolved track list)
      const probe = self.current?.closest(".swiss-grid");
      const spec = probe ? getComputedStyle(probe).gridTemplateColumns : "";
      const tracks = spec && !spec.includes("repeat") ? spec.split(" ").filter(Boolean).length : 0;
      const cols = tracks || (window.matchMedia("(min-width: 64rem)").matches ? 12 : window.matchMedia("(min-width: 40rem)").matches ? 8 : 4);
      setG({ vw, cols, margin, gutter });
    };
    read();
    const ro = new ResizeObserver(read);
    if (self.current) ro.observe(self.current);
    window.addEventListener("resize", read);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", read);
    };
  }, []);
  const cols = g?.cols ?? 12;
  const vw = g?.vw ?? 1440;
  const margin = g?.margin ?? 48;
  const gutter = g?.gutter ?? 24;
  const content = vw - margin * 2;
  const col = (content - gutter * (cols - 1)) / cols;
  const pct = (px: number) => `${(px / vw) * 100}%`;
  return (
    <figure ref={self} aria-label={`The grid at this viewport: ${cols} columns, ${content} px content, margin ${margin} px, gutter ${gutter} px.`}>
      <div className="relative border border-line py-6" style={{ paddingInline: pct(margin) }} aria-hidden="true">
        <div className="grid h-40" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, columnGap: pct(gutter) }}>
          {Array.from({ length: cols }, (_, i) => (
            <div key={i} className="bg-bg-sunken border-x border-line" />
          ))}
        </div>
      </div>
      <div className="mt-3" style={{ paddingInline: pct(margin) }} aria-hidden="true">
        <DimH ticks>
          {cols} columns · {Math.round(content)} px
        </DimH>
      </div>
      <figcaption className="t-data text-fg-muted mt-3">
        <bdi dir="ltr">
          At {vw} px: margin {margin} · gutter {gutter} · column {col.toFixed(1)} px
        </bdi>
      </figcaption>
    </figure>
  );
}
