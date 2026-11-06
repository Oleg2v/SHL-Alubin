"use client";

import { useEffect, useRef, useState } from "react";
import { MM_PER_PX } from "@/design/tokens";
import { DimH, DimV } from "./Dim";

/**
 * Dimension lines that measure themselves: the label is the rendered length in CSS mm
 * (96 px = 25.4 mm), updated on resize. No dimension on this site is typed by hand.
 */
function useMeasured(axis: "w" | "h", decimals: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [mm, setMm] = useState<string | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      if (!e) return;
      const b = e.borderBoxSize?.[0];
      const px = axis === "w" ? (b ? b.inlineSize : e.contentRect.width) : b ? b.blockSize : e.contentRect.height;
      setMm((px * MM_PER_PX).toFixed(decimals));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [axis, decimals]);
  return { ref, mm };
}

export function DimHLive({ className = "", decimals = 1 }: { className?: string; decimals?: number }) {
  const { ref, mm } = useMeasured("w", decimals);
  return (
    <div ref={ref} className={className}>
      <DimH>{mm ? `${mm} mm` : " "}</DimH>
    </div>
  );
}

export function DimVLive({ className = "", decimals = 1 }: { className?: string; decimals?: number }) {
  const { ref, mm } = useMeasured("h", decimals);
  return (
    <div ref={ref} className={`h-full ${className}`}>
      <DimV>{mm ? `${mm} mm` : " "}</DimV>
    </div>
  );
}
