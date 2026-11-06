import { ProfileDrawing } from "@/components/drawing/ProfileDrawing";
import { bounds, kgPerMetre, type ProfileShape } from "@/lib/geometry/profile";
import type { ReactNode } from "react";
import { Phantom } from "@/components/drawing/Phantom";

export type ProfileCardData = {
  id: string;
  family: string;
  alloy: string;
  temper: string;
  shape: ProfileShape;
  wall: number;
};

type Props = {
  profile: ProfileCardData;
  href?: string;
  selected?: boolean;
  /** Slot for the compare toggle; sits above the stretched link. */
  action?: ReactNode;
  labels?: {
    kgm: string;
    drawingOf: (id: string) => string;
    dims: (w: string, h: string, wall: string) => string;
    /** Locale number formatting, e.g. de-DE decimal comma. */
    formatKgm?: (v: number) => string;
    formatDims?: (w: number, h: number) => string;
    formatDim?: (v: number) => string;
  };
  className?: string;
};

const EN = {
  kgm: "kg/m",
  drawingOf: (id: string) => `Cross-section of ${id}`,
  dims: (w: string, h: string, wall: string) => `Overall ${w} by ${h} millimetres, wall ${wall} millimetres.`,
};

/**
 * Finder result tile. Dark by default (data-surface="press"): the drawing is the hero, the
 * numbers are mono and isolated LTR, the whole tile is one link (stretched) and the compare
 * toggle stays independently focusable above it.
 */
export function ProfileCard({ profile, href, selected, action, labels = EN, className }: Props) {
  const b = bounds(profile.shape);
  const kgm = kgPerMetre(profile.shape);
  const w = b.width.toFixed(1);
  const h = b.height.toFixed(1);
  const wall = profile.wall.toFixed(1);
  return (
    <article data-surface="press" className={`pcard ${className ?? ""}`} data-selected={selected ? "true" : undefined}>
      <header className="pcard-head">
        <span className="flex items-center gap-2">
          <span className="pcard-temp" aria-hidden="true" />
          {href ? (
            <a className="pcard-id pcard-link" href={href} aria-label={`${profile.id}, ${profile.family}, ${labels.formatDims ? labels.formatDims(b.width, b.height) : `${w} × ${h}`} mm`}>
              <bdi dir="ltr">{profile.id}</bdi>
            </a>
          ) : (
            <bdi className="pcard-id" dir="ltr">
              {profile.id}
            </bdi>
          )}
        </span>
        <span className="pcard-family">{profile.family}</span>
      </header>
      <div className="pcard-figure">
        <ProfileDrawing
          shape={profile.shape}
          title={labels.drawingOf(profile.id)}
          description={labels.dims(w, h, wall)}
          box={280}
          margin={40}
          format={labels.formatDim}
        />
      </div>
      <footer className="pcard-foot">
        <p className="pcard-specs">
          <span>
            <bdi dir="ltr">
              <strong>{labels.formatKgm ? labels.formatKgm(kgm) : kgm.toFixed(3)}</strong>
            </bdi>{" "}
            {labels.kgm}
          </span>
          <bdi dir="ltr">
            {profile.alloy} {profile.temper}
          </bdi>
          <bdi dir="ltr">
            {labels.formatDims ? labels.formatDims(b.width, b.height) : `${w} × ${h}`}
          </bdi>
        </p>
        {action ? <div className="pcard-compare">{action}</div> : null}
      </footer>
    </article>
  );
}

/** Loading state: the same anatomy drawn in phantom lines. Announced once by the result list. */
export function ProfileCardSkeleton({ label = "Loading profile" }: { label?: string }) {
  return (
    <article data-surface="press" className="pcard" aria-busy="true" aria-hidden="true" data-label={label}>
      <header className="pcard-head" aria-hidden="true">
        <Phantom className="h-3 w-24" />
        <Phantom className="h-3 w-16" />
      </header>
      <div className="pcard-figure min-h-60" aria-hidden="true">
        <Phantom className="aspect-[4/3] w-1/2" />
      </div>
      <footer className="pcard-foot" aria-hidden="true">
        <Phantom className="h-3 w-40" />
        <Phantom className="h-8 w-20" />
      </footer>
    </article>
  );
}
