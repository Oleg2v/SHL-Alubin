import { ProfileDrawing } from "@/components/drawing/ProfileDrawing";
import { bounds, kgPerMetre, type ProfileShape } from "@/lib/geometry/profile";
import type { ReactNode } from "react";

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
  labels?: { kgm: string; drawingOf: (id: string) => string; dims: (w: string, h: string, wall: string) => string };
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
          <span className="pcard-id" dir="ltr">
            {profile.id}
          </span>
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
        />
      </div>
      <footer className="pcard-foot">
        <p className="pcard-specs">
          <span dir="ltr">
            <strong>{kgm.toFixed(3)}</strong> {labels.kgm}
          </span>
          <span dir="ltr">
            {profile.alloy} {profile.temper}
          </span>
          <span dir="ltr">
            {w} × {h}
          </span>
        </p>
        {action ? <div className="pcard-compare">{action}</div> : null}
      </footer>
      {href ? (
        <a className="pcard-link" href={href}>
          <span className="sr-only">{profile.id}</span>
        </a>
      ) : null}
    </article>
  );
}

/** Loading state: the same anatomy, hatched. Announced once by the result list, not per tile. */
export function ProfileCardSkeleton({ label = "Loading profile" }: { label?: string }) {
  return (
    <article data-surface="press" className="pcard" aria-busy="true">
      <span className="sr-only">{label}</span>
      <header className="pcard-head" aria-hidden="true">
        <span className="pcard-skel w-24" />
        <span className="pcard-skel w-16" />
      </header>
      <div className="pcard-figure min-h-60" aria-hidden="true" />
      <footer className="pcard-foot" aria-hidden="true">
        <span className="pcard-skel w-40" />
        <span className="pcard-skel h-8! w-20" />
      </footer>
    </article>
  );
}
