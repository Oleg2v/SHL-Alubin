import { chamberFrame, heatSink, tSlotRail, solarRail, toPathData, bounds, type ProfileShape } from "@/lib/geometry/profile";

/**
 * Photography direction, shown before the shoot exists: three plates rendered from our own
 * geometry under one hard light, graded the way every photo will be (Ink to Alu White duotone,
 * 2 % grain, no warm cast). Heat enters a plate only as a crisp Glow overlay with a reading.
 * They are labelled as placeholders; nothing pretends to be the client's plant.
 */

/** Place a profile (mm) into a target box (px), centred, uniformly scaled. */
function placed(shape: ProfileShape, cx: number, cy: number, size: number) {
  const b = bounds(shape);
  const s = size / Math.max(b.width, b.height);
  const tx = cx - (b.minX + b.width / 2) * s;
  const ty = cy - (b.minY + b.height / 2) * s;
  return { d: toPathData(shape, 2), transform: `translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${s.toFixed(4)})` };
}

function Filters({ id, light = 28, azimuth = 235 }: { id: string; light?: number; azimuth?: number }) {
  return (
    <defs>
      {/* height from alpha, one distant hard light, then a duotone Ink -> Alu White and grain */}
      <filter id={`${id}-lit`} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2.2" result="h" />
        <feSpecularLighting in="h" surfaceScale="7" specularConstant="0.85" specularExponent="26" lightingColor="#ffffff" result="spec">
          <feDistantLight azimuth={azimuth} elevation={light} />
        </feSpecularLighting>
        <feDiffuseLighting in="h" surfaceScale="7" diffuseConstant="0.95" lightingColor="#9aa0a6" result="diff">
          <feDistantLight azimuth={azimuth} elevation={light} />
        </feDiffuseLighting>
        <feComposite in="spec" in2="diff" operator="arithmetic" k1="0" k2="0.55" k3="0.85" k4="0" result="lit" />
        <feComposite in="lit" in2="SourceAlpha" operator="in" />
      </filter>
      <filter id={`${id}-grade`} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feColorMatrix type="saturate" values="0" result="mono" />
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="3" result="n" />
        <feColorMatrix in="n" type="saturate" values="0" result="ng" />
        <feComposite in="mono" in2="ng" operator="arithmetic" k1="0" k2="1" k3="0.04" k4="-0.02" result="grain" />
        {/* duotone: black point Ink #0B0D0F, white point Alu White #ECEEF0 */}
        <feComponentTransfer in="grain">
          <feFuncR type="linear" slope="0.8824" intercept="0.0431" />
          <feFuncG type="linear" slope="0.8824" intercept="0.0510" />
          <feFuncB type="linear" slope="0.8824" intercept="0.0588" />
        </feComponentTransfer>
      </filter>
      <radialGradient id={`${id}-falloff`} cx="0.32" cy="0.28" r="0.95">
        <stop offset="0" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.72" />
      </radialGradient>
    </defs>
  );
}

function Plate({ code, title, ratio, grade, children, label }: { code: string; title: string; ratio: string; grade: string; children: React.ReactNode; label: string }) {
  return (
    <figure className="grid gap-3 min-w-0">
      <div className="plate" style={{ aspectRatio: ratio }} role="img" aria-label={label}>
        {children}
        <span className="plate-crop plate-crop-tl" aria-hidden="true" />
        <span className="plate-crop plate-crop-tr" aria-hidden="true" />
        <span className="plate-crop plate-crop-bl" aria-hidden="true" />
        <span className="plate-crop plate-crop-br" aria-hidden="true" />
        <span className="plate-tag t-data" aria-hidden="true">
          Placeholder
        </span>
      </div>
      <figcaption className="grid gap-1">
        <span className="t-data">
          <bdi dir="ltr">{code}</bdi> · {title}
        </span>
        <span className="t-small text-fg-muted">{grade}</span>
      </figcaption>
    </figure>
  );
}

export function PhotoPlates() {
  // PL-01: the die face, the window-frame aperture cut through a steel disc
  const W1 = 400, H1 = 500;
  const frame = placed(chamberFrame(64, 46, 1.8, 3, 9), W1 / 2, H1 / 2, 190);
  // PL-02: billet ends, hex-packed; three of them are hot
  const W2 = 400, H2 = 500;
  const r = 46;
  const billets: { x: number; y: number; hot: boolean }[] = [];
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 6; col++) {
      const x = 20 + col * (r * 2 + 4) + (row % 2 ? r + 2 : 0);
      const y = 40 + row * (r * 1.74);
      billets.push({ x, y, hot: (row === 3 && (col === 1 || col === 2)) || (row === 2 && col === 2) });
    }
  }
  // PL-03: bundled profile ends at the packing line
  const W3 = 640, H3 = 360;
  const kinds = [heatSink(80, 36, 9, 6, 2), tSlotRail(40, 8.2, 2.6, 6.4, 7.4), solarRail(40, 44, 2.5, 12, 9), chamberFrame(64, 46, 1.8, 3, 9)];
  const ends: { d: string; transform: string }[] = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 7; col++) {
      const k = kinds[(row * 7 + col) % kinds.length]!;
      ends.push(placed(k, 60 + col * 88, 56 + row * 84, 70));
    }
  }

  return (
    <div className="grid gap-(--gutter) sm:grid-cols-2 lg:grid-cols-12">
      <div className="lg:col-span-3">
        <Plate
          code="PL-01"
          title="Die face · 4:5"
          ratio="4 / 5"
          grade="Hard light 28°, steel face, aperture in shadow. Duotone Ink → Alu White, 2 % grain."
          label="Placeholder plate rendered from geometry: the steel face of an extrusion die with a three-chamber window-frame aperture, under one hard light."
        >
          <svg viewBox={`0 0 ${W1} ${H1}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <Filters id="pl1" />
            <g filter="url(#pl1-grade)">
              <rect width={W1} height={H1} fill="#16191C" />
              <g filter="url(#pl1-lit)">
                <circle cx={W1 / 2} cy={H1 / 2} r="176" fill="#fff" />
              </g>
              <g filter="url(#pl1-lit)">
                <circle cx={W1 / 2} cy={H1 / 2} r="150" fill="#fff" opacity="0.6" />
              </g>
              <path d={frame.d} transform={frame.transform} fill="#0B0D0F" fillRule="evenodd" />
              <rect width={W1} height={H1} fill="url(#pl1-falloff)" />
            </g>
          </svg>
        </Plate>
      </div>
      <div className="lg:col-span-3">
        <Plate
          code="PL-02"
          title="Billet stack · thermal overlay"
          ratio="4 / 5"
          grade="Heat only as a crisp Glow overlay on matter at 400 °C or more, always with its reading."
          label="Placeholder plate rendered from geometry: sawn billet ends stacked in a rack; three billets carry a Billet Glow thermal overlay labelled about 480 degrees."
        >
          <svg viewBox={`0 0 ${W2} ${H2}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <Filters id="pl2" azimuth={215} light={32} />
            <g filter="url(#pl2-grade)">
              <rect width={W2} height={H2} fill="#16191C" />
              <g filter="url(#pl2-lit)">
                {billets.map((b, i) => (
                  <circle key={i} cx={b.x} cy={b.y} r={r} fill="#fff" />
                ))}
              </g>
              <rect width={W2} height={H2} fill="url(#pl2-falloff)" />
            </g>
            {/* thermal overlay: outside the grade, crisp mask, 1 px outline, reading */}
            <g>
              {billets.filter((b) => b.hot).map((b, i) => (
                <circle key={i} cx={b.x} cy={b.y} r={r - 1} fill="var(--color-glow)" opacity="0.62" style={{ mixBlendMode: "color" }} stroke="var(--color-glow)" strokeWidth="1" />
              ))}
            </g>
          </svg>
          <span className="plate-reading t-data" aria-hidden="true">
            <bdi dir="ltr">≈ 480 °C</bdi>
          </span>
        </Plate>
      </div>
      <div className="sm:col-span-2 lg:col-span-6">
        <Plate
          code="PL-03"
          title="Profile ends · 16:9"
          ratio="16 / 9"
          grade="Bundled lengths at the packing line, sawn ends to camera, cold. The section is the subject."
          label="Placeholder plate rendered from geometry: a bundle of sawn profile ends, heat sinks, T-slot rails, solar rails and window frames, under one hard light."
        >
          <svg viewBox={`0 0 ${W3} ${H3}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <Filters id="pl3" azimuth={245} light={24} />
            <g filter="url(#pl3-grade)">
              <rect width={W3} height={H3} fill="#16191C" />
              <g filter="url(#pl3-lit)">
                {ends.map((e, i) => (
                  <path key={i} d={e.d} transform={e.transform} fill="#fff" fillRule="evenodd" />
                ))}
              </g>
              <rect width={W3} height={H3} fill="url(#pl3-falloff)" />
            </g>
          </svg>
        </Plate>
      </div>
    </div>
  );
}

