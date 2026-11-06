import type { ReactNode } from "react";

/** Section header on the 12-column grid: index + kicker in cols 1-3, title in 4-12. */
export function SectionHead({ n, kicker, id, title, children }: { n: string; kicker: string; id: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="swiss-grid st-section-head">
      <p className="col-span-4 sm:col-span-2 lg:col-span-3 t-label text-fg-muted st-index">
        <span aria-hidden="true">§ {n}</span>
        <span>{kicker}</span>
      </p>
      <div className="col-span-4 sm:col-span-6 lg:col-span-9 grid gap-6">
        <h2 id={id} className="t-title-m max-w-[24ch] text-balance">
          {title}
        </h2>
        {children ? <p className="t-lead text-fg-muted max-w-[60ch]">{children}</p> : null}
      </div>
    </div>
  );
}
