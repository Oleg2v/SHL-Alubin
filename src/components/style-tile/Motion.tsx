"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { durations, easings, cssEase } from "@/design/tokens";
import { SectionHead } from "./SectionHead";
import { Wordmark } from "./Chrome";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return reduced;
}

const CURVES = [
  { key: "out", name: "--ease-out", label: "House curve", use: "Entrances, settles, the magnet's return. The brief's cubic-bezier(0.22, 1, 0.36, 1).", e: easings.out, dur: durations.slow },
  { key: "inOut", name: "--ease-in-out", label: "Stroke", use: "State to state: the 400 ms finish dissolve, morphs, toggles.", e: easings.inOut, dur: durations.dissolve },
  { key: "in", name: "--ease-in", label: "Retract", use: "Exits only. Things leave faster than they arrive.", e: easings.in, dur: durations.base },
  { key: "linear", name: "linear", label: "Ram", use: "Scroll-scrubbed motion: the ram position is the scroll position.", e: [0, 0, 1, 1] as const, dur: durations.travel },
] as const;

function CurvePlot({ e }: { e: readonly number[] }) {
  const [x1, y1, x2, y2] = e as [number, number, number, number];
  const S = 120;
  const P = (x: number, y: number) => `${(x * S).toFixed(1)} ${((1 - y) * S).toFixed(1)}`;
  return (
    <svg viewBox={`-8 -8 ${S + 16} ${S + 16}`} className="w-full max-w-[160px] overflow-visible" aria-hidden="true">
      <rect x="0" y="0" width={S} height={S} fill="none" stroke="var(--line)" />
      {[0.25, 0.5, 0.75].map((t) => (
        <g key={t} stroke="var(--line)" strokeWidth="1">
          <line x1={t * S} y1="0" x2={t * S} y2={S} />
          <line x1="0" y1={t * S} x2={S} y2={t * S} />
        </g>
      ))}
      <g stroke="var(--fg-muted)" strokeWidth="0.75">
        <line x1="0" y1={S} x2={x1 * S} y2={(1 - y1) * S} />
        <line x1={S} y1="0" x2={x2 * S} y2={(1 - y2) * S} />
      </g>
      <path d={`M${P(0, 0)} C${P(x1, y1)} ${P(x2, y2)} ${P(1, 1)}`} fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x={x1 * S - 2.5} y={(1 - y1) * S - 2.5} width="5" height="5" fill="var(--bg)" stroke="currentColor" />
      <rect x={x2 * S - 2.5} y={(1 - y2) * S - 2.5} width="5" height="5" fill="var(--bg)" stroke="currentColor" />
    </svg>
  );
}

function RamDemo({ e, dur, label, reduced }: { e: readonly number[]; dur: number; label: string; reduced: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);
  const [w, setW] = useState(300);
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const ro = new ResizeObserver(([x]) => x && setW(x.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div className="grid gap-3">
      <div
        ref={track}
        className="ram-track"
        data-run={run ? "true" : "false"}
        style={{ ["--track-w" as string]: `${w}px` }}
      >
        <span
          className="ram-head"
          style={{ transition: reduced ? "none" : `translate ${dur}ms ${cssEase(e)}` }}
          aria-hidden="true"
        />
      </div>
      <button type="button" className="btn btn-secondary btn-sm justify-self-start" onClick={() => setRun((r) => !r)}>
        <span className="btn-label">
          {run ? "Return" : "Run"}
          <span className="sr-only"> {label}</span> · <span dir="ltr">{dur} ms</span>
        </span>
      </button>
    </div>
  );
}

/** The preloader, in miniature: 0 -> 480 C in 800 ms, then resolves into the wordmark by 1120 ms. */
function PreloaderSpecimen({ reduced }: { reduced: boolean }) {
  const [t, setT] = useState(0);
  const [k, setK] = useState(0);
  const raf = useRef(0);
  const play = useCallback(() => setK((x) => x + 1), []);
  useEffect(() => {
    if (reduced) {
      setT(1);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / durations.preload);
      setT(p);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [k, reduced]);
  const countEnd = 800 / durations.preload;
  const cp = Math.min(1, t / countEnd);
  const eased = 1 - Math.pow(1 - cp, 3);
  const temp = Math.round(eased * 480);
  const resolve = Math.max(0, (t - countEnd) / (1 - countEnd));
  return (
    <div className="grid gap-4">
      <div data-surface="press" className="relative grid h-56 place-items-center overflow-hidden" aria-hidden="true">
        <span
          className="t-title-l t-mono absolute"
          dir="ltr"
          style={{ opacity: 1 - resolve, color: temp > 400 ? "var(--color-glow)" : "var(--fg)", transform: `translateY(${-resolve * 12}px)` }}
        >
          {String(temp).padStart(3, "0")} °C
        </span>
        <span className="absolute" style={{ opacity: resolve, transform: `translateY(${(1 - resolve) * 12}px)` }}>
          <Wordmark />
        </span>
        <span className="absolute inset-x-0 bottom-0 h-px bg-[var(--line)]" />
        <span className="absolute bottom-0 start-0 h-0.5 bg-[var(--color-glow)]" style={{ width: `${t * 100}%` }} />
      </div>
      <div className="flex items-center justify-between gap-4">
        <p className="t-label text-fg-muted" dir="ltr">
          0 → 480 °C · 800 ms + resolve 320 ms = 1120 ms
        </p>
        <button type="button" className="btn btn-secondary btn-sm" onClick={play}>
          <span className="btn-label">Replay</span>
        </button>
      </div>
    </div>
  );
}

export function MotionSection() {
  const reduced = useReducedMotion();
  const max = 1200;
  return (
    <section id="motion" aria-labelledby="motion-title" data-surface="sheet" className="st-section">
      <SectionHead n="05" kicker="Motion" id="motion-title" title="Precise and mechanical. Time sits on an 80 ms grid.">
        Things move like a press: one axis at a time, at a constant purpose, settling without overshoot. No spring, no
        bounce, no wobble, ever.
      </SectionHead>

      {/* Duration ruler */}
      <div className="swiss-grid gap-y-8">
        <h3 className="col-span-4 sm:col-span-8 lg:col-span-3 t-title-s">Durations</h3>
        <figure className="col-span-4 sm:col-span-8 lg:col-span-9" aria-label="Duration tokens on an 80 millisecond grid">
          <div className="relative h-28" dir="ltr">
            {/* 80 ms ticks */}
            <div className="absolute inset-x-0 top-0 h-3" style={{ background: `repeating-linear-gradient(90deg, var(--line-strong) 0 1px, transparent 1px ${(80 / max) * 100}%)` }} aria-hidden="true" />
            <div className="absolute inset-x-0 top-3 h-px bg-[var(--line-strong)]" aria-hidden="true" />
            {Object.entries(durations).map(([k, v], i) => {
              const at = v / max;
              // anchor labels so the ruler never pushes past its box: start, centre or end on the tick
              const shift = at < 0.12 ? "0%" : at > 0.84 ? "-100%" : "-50%";
              const tick = at < 0.12 ? "justify-self-start" : at > 0.84 ? "justify-self-end" : "justify-self-center";
              return (
                <div key={k} className="absolute grid" style={{ left: `${at * 100}%`, top: `${12 + (i % 3) * 30}px`, translate: `${shift} 0` }}>
                  <span className={`block h-3 w-px bg-[var(--fg)] ${tick}`} aria-hidden="true" />
                  <span className="t-label whitespace-nowrap">
                    {v} <span className="text-fg-muted">{k}</span>
                  </span>
                </div>
              );
            })}
          </div>
          <ul className="sr-only">
            {Object.entries(durations).map(([k, v]) => (
              <li key={k}>
                {k}: {v} milliseconds
              </li>
            ))}
          </ul>
          <figcaption className="t-label text-fg-muted mt-2">0 → 1200 ms · tick 80 ms · stagger 40 ms</figcaption>
        </figure>
      </div>

      {/* Easing curves */}
      <div className="swiss-grid mt-24 gap-y-10">
        <h3 className="col-span-4 sm:col-span-8 lg:col-span-3 t-title-s">Easing</h3>
        <ul className="col-span-4 sm:col-span-8 lg:col-span-9 grid gap-(--gutter) sm:grid-cols-2">
          {CURVES.map((c) => (
            <li key={c.key} className="grid grid-cols-[minmax(0,140px)_1fr] gap-6 border border-line p-6">
              <CurvePlot e={c.e} />
              <div className="grid content-start gap-2 min-w-0">
                <p className="t-small font-medium">{c.label}</p>
                <p className="t-label text-fg-muted" dir="ltr">
                  {c.name}
                </p>
                <p className="t-label text-fg-muted break-all" dir="ltr">
                  {cssEase(c.e)}
                </p>
                <p className="t-small text-fg-muted">{c.use}</p>
              </div>
              <div className="col-span-2">
                <RamDemo e={c.e} dur={c.dur} label={c.label} reduced={reduced} />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Preloader + rules */}
      <div className="swiss-grid mt-24 gap-y-10">
        <h3 className="col-span-4 sm:col-span-8 lg:col-span-3 t-title-s">Preloader</h3>
        <div className="col-span-4 sm:col-span-8 lg:col-span-5">
          <PreloaderSpecimen reduced={reduced} />
        </div>
        <ul className="col-span-4 sm:col-span-8 lg:col-span-4 grid content-start gap-0 border-t border-line">
          {[
            ["Never bouncy", "No curve leaves 0..1 on y. Overshoot is a defect."],
            ["One axis at a time", "Translate or fade, not both on different curves."],
            ["Scroll is the ram", "Scroll-bound motion is linear to progress; easing lives in the scene."],
            ["Exits are faster", "Leave in 240 ms, arrive in 400 to 640 ms."],
            ["Reduced motion", "Crossfades only, the hero becomes a still frame, counters show final values."],
          ].map(([k, v]) => (
            <li key={k} className="border-b border-line py-4">
              <p className="t-small font-medium">{k}</p>
              <p className="t-small text-fg-muted mt-1">{v}</p>
            </li>
          ))}
        </ul>
        {reduced ? (
          <p className="col-span-4 sm:col-span-8 lg:col-start-4 lg:col-span-9 t-label text-fg-muted">
            Reduced motion is on: demos jump to their end state.
          </p>
        ) : null}
      </div>
    </section>
  );
}
