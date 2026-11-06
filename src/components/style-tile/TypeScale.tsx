"use client";

import { useEffect, useRef, useState } from "react";
import { typeScale, MM_PER_PX, CAP_RATIO } from "@/design/tokens";
import { SectionHead } from "./SectionHead";
import { DimH } from "@/components/drawing/Dim";

const SAMPLE: Record<string, string> = {
  micro: "AL-40217 · 6063 T6 · 1.284 KG/M · ±0.20",
  small: "Max width 120 mm · 42 profiles match",
  body: "An own casthouse turns raw material and scrap into billets for three presses.",
  lead: "6,000+ profile types, 1,000 to 1,200 tonnes a month.",
  "title-s": "Window and door systems",
  "title-m": "From billet to finish",
  "title-l": "Profile Finder",
  headline: "One press away.",
  display: "6,000",
};

/** Measures the rendered size of every step at the current viewport (and user font size). */
function useLiveSizes() {
  const refs = useRef<(HTMLElement | null)[]>([]);
  const [sizes, setSizes] = useState<number[]>([]);
  const [vw, setVw] = useState<number | null>(null);
  useEffect(() => {
    const measure = () => {
      setVw(window.innerWidth);
      setSizes(refs.current.map((el) => (el ? parseFloat(getComputedStyle(el).fontSize) : 0)));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  return { refs, sizes, vw };
}

/** A numeral that carries its own dimension line, measured live in millimetres. */
function DimensionedNumeral({ value, unit, label }: { value: string; unit?: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [mm, setMm] = useState<string>("—");
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      if (e) setMm((e.contentRect.width * MM_PER_PX).toFixed(1));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <figure className="grid content-start gap-3 min-w-0">
      <div className="inline-grid w-fit max-w-full gap-3" dir="ltr">
        <span ref={ref} className="t-display inline-block whitespace-nowrap">
          {value}
          {unit ? <span className="t-title-l align-top ms-2 inline-block translate-y-[0.18em]">{unit}</span> : null}
        </span>
        <DimH ticks>
          <span>{mm} mm</span>
        </DimH>
      </div>
      <figcaption className="t-label text-fg-muted">{label}</figcaption>
    </figure>
  );
}

export function TypeSection() {
  const { refs, sizes, vw } = useLiveSizes();
  return (
    <section id="type" aria-labelledby="type-title" data-surface="sheet" className="st-section">
      <SectionHead n="02" kicker="Type" id="type-title" title="Nine sizes, and every one is a lettering height from the drawing office.">
        At 1600 px each step&apos;s cap height is an ISO 3098 lettering height, from 2.5 mm dimension text to 40 mm
        numerals. Between a 360 px phone and that display the scale is fluid, written in rem plus vw so zoom and
        the reader&apos;s own font size still work.
      </SectionHead>

      {/* Families */}
      <div className="swiss-grid gap-y-[var(--gutter)]">
        <article className="col-span-4 sm:col-span-8 lg:col-span-4 border border-line p-6 grid gap-6 content-between min-h-[320px]">
          <p className="t-label text-fg-muted">Geist · display + UI · 400 / 500 / 600</p>
          <p className="t-title-l" aria-hidden="true">
            Aa 6,000
          </p>
          <p className="t-small text-fg-muted">
            Swiss proportions without Helvetica nostalgia. Tight negative tracking from title-l up; tabular figures
            wherever numbers change.
          </p>
        </article>
        <article className="col-span-4 sm:col-span-4 lg:col-span-4 border border-line p-6 grid gap-6 content-between min-h-[320px]">
          <p className="t-label text-fg-muted">Geist Mono · specs, numbers, tolerances</p>
          <p className="t-title-m t-mono" aria-hidden="true" dir="ltr">
            Ø 254 ±0.20
            <br />
            1.284 kg/m
          </p>
          <p className="t-small text-fg-muted">
            The drawing-sheet voice: IDs, alloys, tempers, kg/m, every dimension. Always an isolated LTR run, also inside
            Hebrew.
          </p>
        </article>
        <article lang="he" dir="rtl" className="col-span-4 sm:col-span-4 lg:col-span-4 border border-line p-6 grid gap-6 content-between min-h-[320px]">
          <p className="t-label text-fg-muted">IBM Plex Sans Hebrew · עברית</p>
          <p className="t-title-l" aria-hidden="true">
            אבג <span dir="ltr">6,000</span>
          </p>
          <p className="t-small text-fg-muted">
            אותיות עבריות בלבד; הספרות והלטינית נשארות ב־Geist. בלי ריווח שלילי, עם מעט יותר מרווח שורות.
          </p>
        </article>
      </div>

      {/* Scale */}
      <div className="swiss-grid mt-24">
        <div className="col-span-4 sm:col-span-8 lg:col-span-12 flex items-baseline justify-between gap-4 border-b border-line-strong pb-3 t-label text-fg-muted">
          <span>Step · token · role</span>
          <span dir="ltr" aria-live="off" className="t-data">
            Live at {vw ?? "—"} px viewport
          </span>
        </div>
      </div>
      <ol className="swiss-grid">
        {[...typeScale].reverse().map((s, i) => (
          <li key={s.token} className="col-span-4 sm:col-span-8 lg:col-span-12 grid grid-cols-subgrid scale-row">
            <div className="col-span-4 sm:col-span-3 lg:col-span-3 grid gap-1 content-start">
              <p className="t-data">
                <span className="text-fg-muted" dir="ltr">
                  {s.step > 0 ? `+${s.step}` : s.step}
                </span>{" "}
                · --text-{s.token}
              </p>
              <p className="t-small text-fg-muted">{s.role}</p>
              <p className="t-data text-fg-muted" dir="ltr">
                {s.min} → {s.max} px · now{" "}
                <span className="text-fg">{sizes[typeScale.length - 1 - i] ? sizes[typeScale.length - 1 - i]!.toFixed(1) : "—"}</span>
                <br />
                cap h {s.capMm} mm · now{" "}
                <span className="text-fg">
                  {sizes[typeScale.length - 1 - i] ? (sizes[typeScale.length - 1 - i]! * CAP_RATIO * MM_PER_PX).toFixed(1) : "—"}
                </span>
                <br />
                lh {s.lineHeight} · {s.tracking === 0 ? "±0" : `${s.tracking > 0 ? "+" : "−"}${Math.abs(s.tracking)}`} em · w {s.weight}
              </p>
            </div>
            <p
              ref={(el) => {
                refs.current[typeScale.length - 1 - i] = el;
              }}
              className={`col-span-4 sm:col-span-5 lg:col-span-9 scale-sample t-${s.token === "micro" ? "label" : s.token}`}
            >
              {SAMPLE[s.token]}
            </p>
          </li>
        ))}
      </ol>

      {/* Giant numerals, dimensioned */}
      <div className="swiss-grid mt-24 gap-y-16">
        <div className="col-span-4 sm:col-span-8 lg:col-span-12">
          <h3 className="t-title-s">Giant numerals carry the facts, and the type is dimensioned like a part.</h3>
        </div>
        <div className="col-span-4 sm:col-span-4 lg:col-span-6">
          <DimensionedNumeral value="6,000" label="Profile types in the library" />
        </div>
        <div className="col-span-4 sm:col-span-4 lg:col-span-6">
          <DimensionedNumeral value="1,200" unit="t" label="Tonnes of profiles a month" />
        </div>
        <div className="col-span-4 sm:col-span-4 lg:col-span-6">
          <DimensionedNumeral value="50" label="New dies a week from our die shop" />
        </div>
        <div className="col-span-4 sm:col-span-4 lg:col-span-6">
          <DimensionedNumeral value="35" unit="%" label="Exported, Rotterdam to New York" />
        </div>
      </div>

      {/* Three languages */}
      <div className="swiss-grid mt-24 gap-y-10">
        <div className="col-span-4 sm:col-span-8 lg:col-span-3">
          <h3 className="t-title-s">One headline, three scripts</h3>
          <p className="t-small text-fg-muted mt-3 max-w-[36ch]">
            German runs about 30 percent longer and carries 25-letter compounds; Hebrew reads right to left while its
            numerals stay left to right.
          </p>
        </div>
        <div className="col-span-4 sm:col-span-8 lg:col-span-9 grid gap-10">
          <figure lang="en" className="grid gap-2">
            <figcaption className="t-label text-fg-muted">EN</figcaption>
            <p className="t-title-l">6,000 profiles. One press away.</p>
          </figure>
          <figure lang="de" className="grid gap-2">
            <figcaption className="t-label text-fg-muted">DE</figcaption>
            <p className="t-title-l">6.000 Profile. Nur einen Pressenhub entfernt.</p>
            <p className="t-small text-fg-muted">
              Stresstest: Pulverbeschichtungsanlage · Strangpresswerkzeugbau · Wärmeableitprofile · Fassadenpfosten
            </p>
          </figure>
          <figure lang="he" dir="rtl" className="grid gap-2">
            <figcaption className="t-label text-fg-muted">HE</figcaption>
            <p className="t-title-l">6,000 פרופילים. במרחק לחיצה.</p>
            <p className="t-small text-fg-muted">
              סגסוגת <span dir="ltr">6063 T6</span>, משקל <span dir="ltr">1.284 kg/m</span>, סבולת לפי{" "}
              <span dir="ltr">EN 755-9</span>.
            </p>
          </figure>
        </div>
      </div>
    </section>
  );
}
