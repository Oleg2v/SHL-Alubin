import type { CSSProperties, ReactNode } from "react";

/**
 * A dimension line for annotating UI, not drawings: it stretches to its container
 * (horizontal) or to a given height (vertical), with closed arrowheads, extension ticks
 * and a label sitting in a gap. The label is an isolated LTR run, so "1,042 mm" never
 * reorders inside Hebrew text. Decorative by default (aria-hidden); pass `label` text that
 * also appears elsewhere as real text when it carries information.
 */

type Common = {
  children: ReactNode;
  className?: string;
  /** Show the end extension ticks. */
  ticks?: boolean;
  style?: CSSProperties;
};

export function DimH({ children, className = "", ticks = true, style }: Common) {
  return (
    <div aria-hidden="true" className={`dim dim-h ${ticks ? "dim-ticks" : ""} ${className}`} style={style}>
      <span className="dim-line" />
      <span className="dim-label" dir="ltr">
        {children}
      </span>
      <span className="dim-line" />
    </div>
  );
}

export function DimV({ children, className = "", ticks = true, style }: Common) {
  return (
    <div aria-hidden="true" className={`dim dim-v ${ticks ? "dim-ticks" : ""} ${className}`} style={style}>
      <span className="dim-line" />
      <span className="dim-label" dir="ltr">
        {children}
      </span>
      <span className="dim-line" />
    </div>
  );
}

/** A leader callout: a dot on the feature, a hairline leader and a mono label. */
export function Callout({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span aria-hidden="true" className={`callout ${className}`}>
      <span className="callout-dot" />
      <span className="callout-leader" />
      <span className="callout-label">
        <bdi dir="ltr">{children}</bdi>
      </span>
    </span>
  );
}
