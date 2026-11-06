import type { SVGProps } from "react";

/**
 * House icons: 16 px grid, 1.5 px stroke, square caps, mitred joins: drawn like
 * drawing-sheet symbols, not friendly UI glyphs. Directional icons carry data-flip so they
 * mirror in RTL.
 */
type P = SVGProps<SVGSVGElement>;
const base = {
  width: 16,
  height: 16,
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "square" as const,
  strokeLinejoin: "miter" as const,
  "aria-hidden": true,
  focusable: false,
};

export const ArrowRight = (p: P) => (
  <svg {...base} data-flip="" {...p}>
    <path d="M2 8h11M9 4l4 4-4 4" />
  </svg>
);
export const ArrowUpRight = (p: P) => (
  <svg {...base} data-flip="" {...p}>
    <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
  </svg>
);
export const Plus = (p: P) => (
  <svg {...base} {...p}>
    <path d="M8 3v10M3 8h10" />
  </svg>
);
export const Close = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 4l8 8M12 4l-8 8" />
  </svg>
);
export const Check = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 8.5l3.25 3L13 4.5" />
  </svg>
);
export const Download = (p: P) => (
  <svg {...base} {...p}>
    <path d="M8 2.5v8M4.5 7L8 10.5 11.5 7M3 13.5h10" />
  </svg>
);
/** Warning: a triangle with a bar, used with the word "Error", never alone. */
export const Alert = (p: P) => (
  <svg {...base} {...p}>
    <path d="M8 2l6.5 11.5h-13z" />
    <path d="M8 6.5v3.5M8 11.75v.5" />
  </svg>
);
export const Compare = (p: P) => (
  <svg {...base} {...p}>
    <path d="M2.5 3.5h4.5v9H2.5zM9 3.5h4.5v9H9z" />
  </svg>
);
