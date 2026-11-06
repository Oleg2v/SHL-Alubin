"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { MM_PER_PX } from "@/design/tokens";
import { DimH } from "@/components/drawing/Dim";

/**
 * A section title dimensioned like a part: the line under it is exactly as wide as the set text
 * (its widest line) and reads that width in CSS mm, live. The signature of the system: the type
 * is measured, not decorated.
 */
export function MeasuredTitle({ id, children, className = "" }: { id: string; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [w, setW] = useState<number | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      // widest rendered line of the (balanced, multi-line) title
      const rects = Array.from(el.getClientRects());
      const max = rects.reduce((m, r) => Math.max(m, r.width), 0);
      setW(max);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el.parentElement ?? el);
    document.fonts?.ready.then(measure).catch(() => undefined);
    return () => ro.disconnect();
  }, []);
  return (
    <div className="grid gap-3">
      <h2 id={id} className={className}>
        <span ref={ref}>{children}</span>
      </h2>
      <div style={{ width: w ? `${w}px` : "0px", maxWidth: "100%" }} className="transition-[width] duration-(--dur-slow) ease-out" aria-hidden="true">
        {w ? <DimH>{(w * MM_PER_PX).toFixed(1)} mm</DimH> : null}
      </div>
    </div>
  );
}
