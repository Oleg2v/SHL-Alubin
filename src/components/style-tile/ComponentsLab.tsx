"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { TextField, RangeField } from "@/components/ui/Field";
import { ToggleChip, RemovableChip } from "@/components/ui/Chip";
import { ProfileCard, ProfileCardSkeleton, type ProfileCardData } from "@/components/ui/ProfileCard";
import { SpecTable } from "@/components/ui/SpecTable";
import { ToastCard, ToastProvider, useToast } from "@/components/ui/Toast";
import { ArrowRight, Download, Plus, Compare } from "@/components/icons/Icons";
import { LANGS, numberLocale, specimen, type Lang } from "@/content/specimen-copy";
import { heatSink, chamberFrame, tSlotRail, kgPerMetre, sectionArea, bounds } from "@/lib/geometry/profile";
import { SectionHead } from "./SectionHead";

const PROFILES: ProfileCardData[] = [
  { id: "AL-40217", family: "frame", alloy: "6063", temper: "T6", wall: 1.8, shape: chamberFrame(64, 46, 1.8, 3, 9) },
  { id: "AL-52108", family: "heatSink", alloy: "6060", temper: "T5", wall: 2.0, shape: heatSink(80, 36, 9, 6, 2) },
  { id: "AL-30440", family: "rail", alloy: "6082", temper: "T6", wall: 2.6, shape: tSlotRail(40, 8.2, 2.6, 6.4, 7.4) },
];

function Cell({ code, title, children, className = "" }: { code: string; title: string; children: ReactNode; className?: string }) {
  return (
    <div className={`lab-cell ${className}`}>
      <div className="lab-cell-head" lang="en">
        <h3 className="t-label">{title}</h3>
        <bdi className="t-data text-fg-muted" dir="ltr">
          {code}
        </bdi>
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

function ToastTrigger({ lang }: { lang: Lang }) {
  const c = specimen[lang];
  const { push } = useToast();
  const nf = (n: number, d: number) => new Intl.NumberFormat(numberLocale[lang], { minimumFractionDigits: d, maximumFractionDigits: d }).format(n);
  return (
    <Button
      variant="secondary"
      size="sm"
      icon={<Plus className="btn-icon" />}
      onClick={() =>
        push({
          tone: "success",
          title: c.added,
          meta: `AL-40217 · ${nf(6, 1)} m · ${nf(2.4, 1)} t`,
          metaIsData: true,
          action: { label: c.undo, onAction: () => undefined },
        })
      }
    >
      {c.trigger}
    </Button>
  );
}

export function ComponentsLab() {
  const [lang, setLang] = useState<Lang>("en");
  const [compare, setCompare] = useState<string[]>(["AL-40217"]);
  const c = specimen[lang];
  const dir = LANGS.find((l) => l.code === lang)!.dir;
  const nf = (n: number, d: number) => new Intl.NumberFormat(numberLocale[lang], { minimumFractionDigits: d, maximumFractionDigits: d }).format(n);
  const fam: Record<string, string> = { frame: c.frame, heatSink: c.heatSink, rail: c.rail };

  const main = PROFILES[0]!;
  const b = bounds(main.shape);
  const rows = [
    { key: "alloy", label: c.rows.alloy, value: main.alloy, unit: "", note: "EN 573-3" },
    { key: "temper", label: c.rows.temper, value: main.temper, unit: "", note: "EN 515" },
    { key: "weight", label: c.rows.weight, value: nf(kgPerMetre(main.shape), 3), unit: "kg/m", note: `${nf(2.7, 2)} g/cm³` },
    { key: "area", label: c.rows.area, value: nf(sectionArea(main.shape), 1), unit: "mm²", note: "" },
    { key: "width", label: c.rows.width, value: nf(b.width, 1), unit: "mm", note: `±${nf(0.25, 2)} · ${c.tolerance}` },
    { key: "height", label: c.rows.height, value: nf(b.height, 1), unit: "mm", note: `±${nf(0.25, 2)} · ${c.tolerance}` },
    { key: "wall", label: c.rows.wallRow, value: nf(main.wall, 1), unit: "mm", note: `±${nf(0.15, 2)} · ${c.tolerance}` },
  ];

  return (
    <section id="components" aria-labelledby="components-title" data-surface="sheet" className="st-section">
      <SectionHead n="06" kicker="Components" id="components-title" title="Six parts, every state, three languages.">
        Keyboard and right-to-left first, mouse second. Switch the specimen language: Hebrew mirrors the layout, not the
        drawings and not the numbers.
      </SectionHead>

      <div className="swiss-grid mb-8">
        <div className="col-span-4 sm:col-span-8 lg:col-start-4 lg:col-span-9 flex flex-wrap items-center gap-4">
          <span className="t-label text-fg-muted" id="lang-label">
            Specimen language
          </span>
          <div className="segmented" role="group" aria-labelledby="lang-label">
            {LANGS.map((l) => (
              <button key={l.code} type="button" aria-pressed={lang === l.code} onClick={() => setLang(l.code)}>
                <span>{l.label}</span>
                <span className="sr-only" lang={l.code}>
                  , {l.native}
                </span>
              </button>
            ))}
          </div>
          <span className="t-data text-fg-muted" dir="ltr">
            dir=&quot;{dir}&quot; · lang=&quot;{lang}&quot;
          </span>
        </div>
      </div>

      <ToastProvider closeLabel={c.dismiss} lang={lang} dir={dir}>
        <div lang={lang} dir={dir} className="swiss-grid gap-y-(--gutter)">
          {/* C-01 Button */}
          <Cell code="C-01" title="Button" className="col-span-4 sm:col-span-8 lg:col-span-7">
            <div className="grid gap-6">
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary" size="lg" icon={<ArrowRight className="btn-icon" data-nudge="" />}>
                  {c.quote}
                </Button>
                <Button variant="secondary" size="lg">
                  {c.find}
                </Button>
                <Button variant="ghost" icon={<Download className="btn-icon" />}>
                  {c.dxf}
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary" size="sm" busy>
                  {c.sending}
                </Button>
                <Button variant="primary" size="sm" disabled>
                  {c.unavailable}
                </Button>
                <Button variant="secondary" size="sm" disabled>
                  {c.unavailable}
                </Button>
              </div>
              <div data-surface="press" className="-mx-4 -mb-4 sm:-mx-6 sm:-mb-6 flex flex-wrap items-center gap-4 p-4 sm:p-6">
                <Button variant="primary" icon={<ArrowRight className="btn-icon" data-nudge="" />}>
                  {c.quote}
                </Button>
                <Button variant="secondary">{c.find}</Button>
                <Button variant="ghost" icon={<Download className="btn-icon" />}>
                  {c.dxf}
                </Button>
              </div>
            </div>
          </Cell>

          {/* C-02 Chip */}
          <Cell code="C-02" title="Chip" className="col-span-4 sm:col-span-8 lg:col-span-5">
            <div className="grid gap-6">
              <fieldset className="grid gap-3">
                <legend className="t-label text-fg-muted mb-3">{c.alloy}</legend>
                <div className="flex flex-wrap gap-2">
                  <ToggleChip label="6060" count={18} countLabel={c.profiles} />
                  <ToggleChip label="6063" count={42} countLabel={c.profiles} defaultPressed />
                  <ToggleChip label="6082" count={9} countLabel={c.profiles} />
                  <ToggleChip label="6005A" count={0} countLabel={c.profiles} />
                </div>
              </fieldset>
              <fieldset className="grid gap-3">
                <legend className="t-label text-fg-muted mb-3">{c.temper}</legend>
                <div className="flex flex-wrap gap-2">
                  <ToggleChip label="T5" count={23} countLabel={c.profiles} />
                  <ToggleChip label="T6" count={51} countLabel={c.profiles} defaultPressed />
                  <ToggleChip label="T66" count={7} countLabel={c.profiles} />
                </div>
              </fieldset>
              <div className="flex flex-wrap gap-2 border-t border-line pt-4">
                <RemovableChip label={c.anodized} removeLabel={c.remove(c.anodized)} />
                <RemovableChip label="6063" removeLabel={c.remove("6063")} />
                <RemovableChip label="T6" removeLabel={c.remove("T6")} />
              </div>
            </div>
          </Cell>

          {/* C-03 Input */}
          <Cell code="C-03" title="Input" className="col-span-4 sm:col-span-8 lg:col-span-12">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <TextField label={c.maxWidth} unit="mm" inputMode="decimal" defaultValue={nf(120, 1)} hint={c.widthHint} aux={`≤ ${nf(250, 0)} mm`} />
              <TextField label={c.wall} unit="mm" inputMode="decimal" defaultValue={nf(0.6, 1)} error={c.wallError} hint={c.wallHint} />
              <RangeField label={c.maxHeight} min={0} max={200} defaultValue={80} format={(v) => nf(v, 0)} />
              <TextField label="kg/m" unit="kg/m" inputMode="decimal" defaultValue={nf(1.284, 3)} disabled hint={c.unavailable} />
            </div>
          </Cell>

          {/* C-04 Card */}
          <Cell code="C-04" title="Card" className="col-span-4 sm:col-span-8 lg:col-span-12">
            <ul className="grid gap-(--gutter) sm:grid-cols-2 xl:grid-cols-4">
              {PROFILES.map((p) => {
                const on = compare.includes(p.id);
                return (
                  <li key={p.id}>
                    <ProfileCard
                      profile={{ ...p, family: fam[p.family] ?? p.family }}
                      href="#components"
                      selected={on}
                      labels={{
                        kgm: c.kgm,
                        drawingOf: c.drawingOf,
                        dims: (w, h, wall) => c.dims(nf(+w, 1), nf(+h, 1), nf(+wall, 1)),
                        formatKgm: (v) => nf(v, 3),
                        formatDims: (w, h) => `${nf(w, 1)} × ${nf(h, 1)}`,
                      }}
                      action={
                        <button
                          type="button"
                          className="chip"
                          aria-pressed={on}
                          onClick={() => setCompare((xs) => (on ? xs.filter((x) => x !== p.id) : xs.length >= 3 ? xs : [...xs, p.id]))}
                        >
                          <Compare width={12} height={12} aria-hidden="true" />
                          <span>{c.compare}</span>
                          <span className="sr-only"> {p.id}</span>
                        </button>
                      }
                    />
                  </li>
                );
              })}
              <li>
                <ProfileCardSkeleton label={c.loading} />
              </li>
            </ul>
          </Cell>

          {/* C-05 Table row */}
          <Cell code="C-05" title="Table row" className="col-span-4 sm:col-span-8 lg:col-span-7">
            <div className="overflow-x-auto" role="region" aria-label={c.specCaption} tabIndex={0}>
              <SpecTable caption={c.specCaption} rows={rows} activeKey="width" headers={c.headers} className="min-w-[520px]" />
            </div>
          </Cell>

          {/* C-06 Toast */}
          <Cell code="C-06" title="Toast" className="col-span-4 sm:col-span-8 lg:col-span-5">
            <div className="grid gap-4">
              <ToastCard
                staticSpecimen
                life={6000}
                closeLabel={c.dismiss}
                item={{ tone: "success", title: c.added, meta: `AL-40217 · ${nf(6, 1)} m · ${nf(2.4, 1)} t`, metaIsData: true, action: { label: c.undo, onAction: () => undefined } }}
              />
              <ToastCard
                staticSpecimen
                life={0}
                closeLabel={c.dismiss}
                item={{ tone: "error", title: c.failed, meta: c.failedMeta, action: { label: c.retry, onAction: () => undefined } }}
              />
              <div className="pt-2">
                <ToastTrigger lang={lang} />
              </div>
            </div>
          </Cell>
        </div>
      </ToastProvider>
    </section>
  );
}
