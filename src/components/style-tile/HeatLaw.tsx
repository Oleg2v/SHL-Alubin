"use client";

import { useEffect, useRef, useState } from "react";
import { heatWeight, HEAT } from "@/design/tokens";

/** The heat law: Glow share w(T) from radiance above ambient, with the flat-UI threshold at 400 °C. */
export function HeatLaw() {
  const ref = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(560);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => e && setW(Math.max(280, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const H = W < 480 ? 200 : 240;
  const P = { l: 40, r: 16, t: 16, b: 36 };
  const x = (t: number) => P.l + ((t - HEAT.ambientC) / (HEAT.maxC - HEAT.ambientC)) * (W - P.l - P.r);
  const y = (w: number) => P.t + (1 - w) * (H - P.t - P.b);
  const pts = Array.from({ length: 47 }, (_, i) => 20 + i * 10).map((t) => `${x(t).toFixed(1)},${y(heatWeight(t)).toFixed(1)}`);
  const thr = 400;
  const wThr = heatWeight(thr);
  const mono = { font: "500 11px var(--font-mono)", fontFeatureSettings: '"ss09" 1' } as const;
  return (
    <figure data-surface="press" className="grid gap-4 p-4 sm:p-6" aria-labelledby="heat-law-cap">
      <div ref={ref}>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="block w-full overflow-visible" role="img" aria-labelledby="heat-law-t">
        <title id="heat-law-t">
          {`Glow share against temperature: 480 °C is 1.00, 400 °C is ${wThr.toFixed(2)}, 300 °C is ${heatWeight(300).toFixed(2)}, 200 °C is ${heatWeight(200).toFixed(2)}. The flat interface renders Glow only at 400 °C and above.`}
        </title>
        {/* zones: HOT (Glow), WARM (reading only), COLD */}
        <rect x={x(thr)} y={P.t} width={x(480) - x(thr)} height={H - P.t - P.b} fill="rgb(255 90 31 / 0.14)" />
        <rect x={x(150)} y={P.t} width={x(thr) - x(150)} height={H - P.t - P.b} fill="rgb(236 238 240 / 0.05)" />
        <g stroke="var(--line-strong)" strokeWidth="1">
          <line x1={P.l} y1={H - P.b} x2={W - P.r} y2={H - P.b} />
          <line x1={P.l} y1={P.t} x2={P.l} y2={H - P.b} />
        </g>
        <g fill="var(--fg-muted)" style={mono}>
          {(W < 480 ? [20, 200, 400, 480] : [20, 100, 200, 300, 400, 480]).map((t) => (
            <g key={t}>
              <line x1={x(t)} y1={H - P.b} x2={x(t)} y2={H - P.b + 4} stroke="var(--line-strong)" />
              <text x={x(t)} y={H - P.b + 18} textAnchor={t === 480 ? "end" : t === 20 ? "start" : "middle"}>
                {t} °C
              </text>
            </g>
          ))}
          {[0, 0.5, 1].map((w) => (
            <text key={w} x={P.l - 8} y={y(w) + 4} textAnchor="end">
              {w.toFixed(1)}
            </text>
          ))}
        </g>
        <polyline points={pts.join(" ")} fill="none" stroke="var(--fg)" strokeWidth="1.5" />
        <line x1={x(thr)} y1={P.t} x2={x(thr)} y2={H - P.b} stroke="var(--color-glow)" strokeWidth="1" strokeDasharray="4 3" />
        <circle cx={x(thr)} cy={y(wThr)} r="3" fill="var(--color-glow)" />
        <circle cx={x(480)} cy={y(1)} r="3" fill="var(--color-glow)" />
        <g style={mono}>
          <text x={x(thr) + 8} y={P.t + 14} fill="var(--accent-text)">
            {W < 480 ? "HOT" : "HOT · Glow"}
          </text>
          <text x={x(275)} y={P.t + 14} fill="var(--fg-muted)" textAnchor="middle">
            {W < 480 ? "WARM" : "WARM · reading only"}
          </text>
          <text x={x(85)} y={P.t + 14} fill="var(--fg-muted)" textAnchor="middle">
            COLD
          </text>
        </g>
      </svg>
      </div>
      <figcaption id="heat-law-cap" className="t-data text-fg-muted" dir="ltr">
        w(T) = (T⁴ − T₂₀⁴) / (T₄₈₀⁴ − T₂₀⁴), T in kelvin · 400 °C → {wThr.toFixed(2)} · 300 °C → {heatWeight(300).toFixed(2)}
      </figcaption>
    </figure>
  );
}

