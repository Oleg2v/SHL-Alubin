"use client";

import { useState } from "react";
import { BrushedMetal, FINISHES } from "@/components/material/BrushedMetal";

/** Material specimen: one WebGL surface, six real finishes, the Finish lab's 400 ms dissolve. */
export function FinishLab() {
  const [id, setId] = useState(FINISHES[0]!.id);
  const finish = FINISHES.find((f) => f.id === id)!;
  return (
    <div className="grid gap-(--gutter) lg:grid-cols-12">
      <figure className="lg:col-span-8 grid gap-3" aria-labelledby="finish-cap">
        <div className="relative aspect-[16/9] overflow-hidden border border-line bg-[var(--color-ink)]">
          <BrushedMetal finish={finish} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4">
            <span className="t-label bg-[var(--color-ink)] px-2 py-1 text-[var(--color-alu-white)]">{finish.name}</span>
            <span className="t-label bg-[var(--color-ink)] px-2 py-1 text-[var(--color-alu-mid)]" dir="ltr">
              {finish.hex.toUpperCase()}
            </span>
          </div>
        </div>
        <figcaption id="finish-cap" className="t-label text-fg-muted">
          WebGL · anisotropic highlight across the brush grooves · move the pointer to move the light · 400 ms dissolve
        </figcaption>
      </figure>
      <fieldset className="lg:col-span-4 grid content-start gap-2">
        <legend className="t-label text-fg-muted mb-3">Finish</legend>
        {FINISHES.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={id === f.id}
            onClick={() => setId(f.id)}
            className="finish-option"
          >
            <span className="finish-swatch" style={{ background: f.hex }} aria-hidden="true" />
            <span className="grid text-start">
              <span className="t-small font-medium">{f.name}</span>
              <span className="t-label text-fg-muted">
                {/* text-transform would turn µm into "MM": keep units in their own case */}
                {f.note.split(/(µm)/).map((part, i) => (part === "µm" ? <span key={i} className="normal-case">µm</span> : part))}
              </span>
            </span>
            <span className="chip-dot ms-auto" aria-hidden="true" />
          </button>
        ))}
      </fieldset>
    </div>
  );
}
