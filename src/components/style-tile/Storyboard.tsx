import type { CSSProperties } from "react";
import { ProfileDrawing } from "@/components/drawing/ProfileDrawing";
import { chamberFrame, heatSink, solarRail, mullion, bounds, type ProfileShape } from "@/lib/geometry/profile";
import { heatWeight } from "@/design/tokens";

type Frame = {
  pct: number;
  ram: number;
  tC: number;
  title: string;
  note: string;
  id?: string;
  shape?: ProfileShape;
};

/** Press stroke used for the storyboard readouts (a 10-inch press). */
const STROKE_MM = 1800;

const FRAMES: Frame[] = [
  { pct: 0, ram: 0, tC: 480, title: "Billet", note: "Dark stage; the only light is heat." },
  { pct: 25, ram: 0.25 * STROKE_MM, tC: 420, title: "Window frame", note: "The ram drives; the profile extrudes toward camera.", id: "AL-40217", shape: chamberFrame(64, 46, 1.8, 3, 9) },
  { pct: 50, ram: 0.5 * STROKE_MM, tC: 300, title: "Heat sink", note: "The section morphs; vertex counts are matched.", id: "AL-52108", shape: heatSink(80, 36, 9, 6, 2) },
  { pct: 75, ram: 0.75 * STROKE_MM, tC: 160, title: "Solar rail", note: "It cools along its length on the T⁴ curve.", id: "AL-61120", shape: solarRail(40, 44, 2.5, 12, 9) },
  { pct: 100, ram: STROKE_MM, tC: 20, title: "Mullion", note: "Brushed silver; the headline types in.", id: "AL-70452", shape: mullion() },
];

/** Line colour at temperature: Billet Glow mixed into Alu Mid by radiance (same curve as the heat ramp). */
const heatColor = (tC: number) => {
  const w = heatWeight(tC);
  return {
    w,
    color: `color-mix(in oklab, var(--color-glow) ${(w * 100).toFixed(1)}%, var(--color-alu-mid))`,
    filter: w > 0.02 ? `drop-shadow(0 0 ${(6 * w).toFixed(1)}px color-mix(in oklab, var(--color-glow) ${(65 * w).toFixed(0)}%, transparent))` : undefined,
  };
};

export function Storyboard() {
  return (
    <ol className="grid grid-cols-2 gap-(--gutter) sm:grid-cols-3 xl:grid-cols-5">
      {FRAMES.map((f) => {
        const h = heatColor(f.tC);
        const style: CSSProperties = { color: h.color, filter: h.filter };
        const b = f.shape ? bounds(f.shape) : null;
        return (
          <li key={f.pct} data-surface="press" className="grid grid-rows-[auto_1fr_auto] min-h-80 border border-line">
            <div className="flex items-baseline justify-between gap-2 border-b border-line px-3 py-2 t-data">
              <bdi dir="ltr" className="text-fg">
                {String(f.pct).padStart(3, "0")} %
              </bdi>
              <bdi dir="ltr" className={h.w > 0.3 ? "text-accent-text" : "text-fg-muted"}>
                {f.tC} °C
              </bdi>
            </div>
            <div className="grid place-items-center p-3">
              {f.shape ? (
                <div className="w-full max-w-[180px]" style={style}>
                  <ProfileDrawing
                    shape={f.shape}
                    box={200}
                    margin={30}
                    showCentre={false}
                    title={`${f.title}, ${f.id}`}
                    description={b ? `Overall ${b.width.toFixed(1)} by ${b.height.toFixed(1)} millimetres, at ${f.tC} degrees.` : undefined}
                  />
                </div>
              ) : (
                <div className="billet billet-sm" aria-hidden="true" data-heat="process" data-heat-temp="480" />
              )}
            </div>
            <div className="grid gap-1 border-t border-line px-3 py-3">
              <p className="t-small font-medium text-fg">{f.title}</p>
              <p className="t-data text-fg-muted grid">
                <bdi dir="ltr" className="whitespace-nowrap">
                  Ram {f.ram.toFixed(0)} mm
                </bdi>
                <bdi dir="ltr" className="whitespace-nowrap">
                  {f.id ?? "Ø 254 · 6063"}
                </bdi>
              </p>
              <p className="t-small text-fg-muted">{f.note}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
