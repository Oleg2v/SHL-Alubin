import { useId } from "react";
import { bounds, type Contour, type ProfileShape } from "@/lib/geometry/profile";

/**
 * A cross-section drawn the way an engineering sheet draws it:
 * ISO 128 section hatching at 45 degrees, a continuous outline, chain centre lines and
 * ISO 129 dimension lines with closed arrowheads and extension lines.
 *
 * Everything is computed in pixel space (not a scaled group) so hatch spacing, stroke
 * widths, arrowheads and text stay constant whatever the profile's size in millimetres.
 *
 * RTL rule: drawings never mirror. The page around a drawing mirrors; the drawing does not,
 * and every numeral is an isolated LTR run.
 */

type Props = {
  shape: ProfileShape;
  /** Drawing box in px (the viewBox). The SVG scales to its container width. */
  box?: number;
  /** Space reserved around the part for dimensions, px. */
  margin?: number;
  showDims?: boolean;
  showCentre?: boolean;
  hatch?: boolean;
  /** Accessible name, e.g. "Cross-section of AL-40217". */
  title: string;
  /** Text alternative carrying the dimensions, e.g. "60.0 by 42.0 mm, three chambers". */
  description?: string;
  decimals?: number;
  /** Locale formatting for the dimension values (de-DE decimal comma per DIN EN ISO 129-1). */
  format?: (n: number) => string;
  className?: string;
};

const ARROW_L = 8;
const ARROW_W = 2.25;
const EXT_GAP = 3;
const EXT_OVER = 4;

const f = (n: number) => Number(n.toFixed(2));

function ring(c: Contour, map: (x: number, y: number) => [number, number]) {
  return (
    c
      .map(([x, y], i) => {
        const [px, py] = map(x, y);
        return `${i === 0 ? "M" : "L"}${f(px)} ${f(py)}`;
      })
      .join("") + "Z"
  );
}

function arrow(tipX: number, tipY: number, dirX: number, dirY: number) {
  // dir points from the tip back along the line
  const bx = tipX + dirX * ARROW_L;
  const by = tipY + dirY * ARROW_L;
  const nx = -dirY * ARROW_W;
  const ny = dirX * ARROW_W;
  return `${f(tipX)},${f(tipY)} ${f(bx + nx)},${f(by + ny)} ${f(bx - nx)},${f(by - ny)}`;
}

export function ProfileDrawing({
  shape,
  box = 320,
  margin = 44,
  showDims = true,
  showCentre = true,
  hatch = true,
  title,
  description,
  decimals = 1,
  format,
  className,
}: Props) {
  const fmt = format ?? ((n: number) => n.toFixed(decimals));
  const uid = useId().replace(/:/g, "");
  const b = bounds(shape);
  const inner = box - margin * 2;
  const scale = Math.min(inner / b.width, inner / b.height);
  const w = b.width * scale;
  const h = b.height * scale;
  // Part sits slightly up-left so the dimension lines (bottom, end side) have room.
  const ox = margin + (inner - w) / 2 - (showDims ? 8 : 0);
  const oy = margin + (inner - h) / 2 - (showDims ? 8 : 0);
  const map = (x: number, y: number): [number, number] => [ox + (x - b.minX) * scale, oy + (y - b.minY) * scale];
  const d = [ring(shape.outer, map), ...shape.holes.map((hl) => ring(hl, map))].join("");

  const x1 = ox, x2 = ox + w, y1 = oy, y2 = oy + h;
  const dimY = y2 + 22;
  const dimX = x2 + 22;
  const cx = ox + w / 2, cy = oy + h / 2;

  return (
    <svg
      viewBox={`0 0 ${box} ${box}`}
      className={className}
      role="img"
      aria-labelledby={`${uid}-t`}
      aria-describedby={description ? `${uid}-d` : undefined}
    >
      <title id={`${uid}-t`}>{title}</title>
      {description ? <desc id={`${uid}-d`}>{description}</desc> : null}
      <defs>
        <pattern id={`${uid}-hatch`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" strokeWidth="1" opacity="0.55" />
        </pattern>
      </defs>

      {showCentre ? (
        <g stroke="currentColor" strokeWidth="0.75" opacity="0.45" strokeDasharray="14 3 2 3" fill="none">
          <line x1={f(x1 - 10)} y1={f(cy)} x2={f(x2 + 10)} y2={f(cy)} />
          <line x1={f(cx)} y1={f(y1 - 10)} x2={f(cx)} y2={f(y2 + 10)} />
        </g>
      ) : null}

      <path
        d={d}
        fillRule="evenodd"
        fill={hatch ? `url(#${uid}-hatch)` : "currentColor"}
        fillOpacity={hatch ? 1 : 0.12}
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="miter"
      />

      {showDims ? (
        <g fill="currentColor" stroke="currentColor" strokeWidth="0.75" className="tabular-nums">
          {/* overall width, below */}
          <line x1={f(x1)} y1={f(y2 + EXT_GAP)} x2={f(x1)} y2={f(dimY + EXT_OVER)} />
          <line x1={f(x2)} y1={f(y2 + EXT_GAP)} x2={f(x2)} y2={f(dimY + EXT_OVER)} />
          <line x1={f(x1)} y1={f(dimY)} x2={f(x2)} y2={f(dimY)} />
          <polygon stroke="none" points={arrow(x1, dimY, 1, 0)} />
          <polygon stroke="none" points={arrow(x2, dimY, -1, 0)} />
          <text
            x={f(cx)}
            y={f(dimY - 5)}
            textAnchor="middle"
            stroke="none"
            direction="ltr"
            unicodeBidi="isolate"
            style={{ font: "500 11px var(--font-mono)", letterSpacing: "0.02em" }}
          >
            {fmt(b.width)}
          </text>

          {/* overall height, end side */}
          <line x1={f(x2 + EXT_GAP)} y1={f(y1)} x2={f(dimX + EXT_OVER)} y2={f(y1)} />
          <line x1={f(x2 + EXT_GAP)} y1={f(y2)} x2={f(dimX + EXT_OVER)} y2={f(y2)} />
          <line x1={f(dimX)} y1={f(y1)} x2={f(dimX)} y2={f(y2)} />
          <polygon stroke="none" points={arrow(dimX, y1, 0, 1)} />
          <polygon stroke="none" points={arrow(dimX, y2, 0, -1)} />
          <text
            x={f(dimX - 5)}
            y={f(cy)}
            textAnchor="middle"
            stroke="none"
            direction="ltr"
            unicodeBidi="isolate"
            transform={`rotate(-90 ${f(dimX - 5)} ${f(cy)})`}
            style={{ font: "500 11px var(--font-mono)", letterSpacing: "0.02em" }}
          >
            {fmt(b.height)}
          </text>
        </g>
      ) : null}
    </svg>
  );
}

/**
 * CSS width at which a ProfileDrawing renders its part at a true drawing scale (ISO 5455), in CSS
 * px at the nominal 96 dpi: ratio 2 means 2:1, the part appears twice its real size.
 */
export function drawingWidthForScale(shape: ProfileShape, ratio: number, box = 320, margin = 44) {
  const b = bounds(shape);
  const inner = box - margin * 2;
  const scale = Math.min(inner / b.width, inner / b.height); // viewBox px per model mm
  const pxPerMm = 96 / 25.4;
  return (ratio * pxPerMm * box) / scale;
}
