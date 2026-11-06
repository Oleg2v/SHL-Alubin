"use client";

import { useState } from "react";
import { BrushedMetal, FINISHES } from "@/components/material/BrushedMetal";
import { Segmented } from "@/components/ui/Segmented";

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
            <span className="t-data bg-[var(--color-ink)] px-2 py-1 text-[var(--color-alu-mid)]" dir="ltr">
              {finish.hex.toUpperCase()}
            </span>
          </div>
        </div>
        <figcaption id="finish-cap" className="t-small text-fg-muted">
          WebGL: metals carry die lines and an anisotropic highlight across them; powder and PVDF are isotropic paint
          films. Move the pointer to move the light; finishes dissolve in 400 ms. Screen approximation: order physical
          samples.
        </figcaption>
      </figure>
      <div className="lg:col-span-4 grid content-start gap-2">
        <p id="finish-label" className="t-label text-fg-muted mb-1">
          Finish · sample coupons
        </p>
        <Segmented
          labelledBy="finish-label"
          className="grid gap-2"
          optionClassName="finish-option"
          value={id}
          onChange={setId}
          options={FINISHES.map((f) => ({ value: f.id, label: f.name }))}
          renderOption={(o) => {
            const f = FINISHES.find((x) => x.id === o.value)!;
            return (
              <>
                <span className="finish-coupon" style={{ background: f.hex }} aria-hidden="true">
                  <span className="finish-coupon-hole" />
                </span>
                <span className="grid text-start">
                  <span className="t-small font-medium">{f.name}</span>
                  <span className="t-data text-fg-muted">{f.note}</span>
                </span>
                <span className="chip-dot ms-auto" aria-hidden="true" />
              </>
            );
          }}
        />
        <p className="t-small text-fg-muted mt-2">The anodizing line was the first approved by the Standards Institution of Israel.</p>
      </div>
    </div>
  );
}
