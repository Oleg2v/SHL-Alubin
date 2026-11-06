import { DimH } from "@/components/drawing/Dim";

/**
 * The seam between the cover and the sheet: the press exit drawn as an instrument.
 * Heat has an edge. The profile leaves the die hot, the whole colour change happens inside the
 * quench zone (6 % of the visible length), and the tail is cold metal. No long orange smear.
 */
const HOT_END = 15; // % of length still at ~480-470 C
const QUENCH_END = 21; // quench: 470 -> 180 C

export function CoolingBand() {
  return (
    <div data-surface="press" className="cooling-band">
      <div
        className="cooling-inner"
        role="img"
        aria-label="Cooling bar: the profile leaves the die at 480 degrees, is quenched from 470 to 180 degrees within 6 percent of its length, and reaches 20 degrees at the stretcher."
      >
        {/* chain dimensions above the bar (ISO 129 chain dimensioning) */}
        <div className="cooling-chain hidden sm:flex" aria-hidden="true">
          <div style={{ width: `${HOT_END}%` }}>
            <DimH>hot zone</DimH>
          </div>
          <div style={{ width: `${QUENCH_END - HOT_END}%` }}>
            <DimH ticks>Q</DimH>
          </div>
          <div style={{ width: `${100 - QUENCH_END}%` }}>
            <DimH>cold tail · 6,000 mm @ 20 °C</DimH>
          </div>
        </div>

        <div className="cooling-bar" aria-hidden="true">
          <span className="cooling-hot" data-heat="process" data-heat-temp="480" />
        </div>

        <div className="cooling-reads t-data" aria-hidden="true" dir="ltr">
          <span style={{ insetInlineStart: 0 }} className="text-accent-text">
            <span className="hidden sm:inline">Die exit · </span>480 °C
          </span>
          <span style={{ insetInlineStart: `${HOT_END}%` }} className="cooling-q">
            Q<span className="hidden sm:inline"> · 470 → 180 °C</span>
          </span>
          <span style={{ insetInlineStart: "60%" }} className="text-fg-muted hidden md:inline">
            Cooling table · 60 °C
          </span>
          <span style={{ insetInlineEnd: 0 }} className="text-fg-muted">
            <span className="hidden sm:inline">Stretcher · </span>20 °C
          </span>
        </div>
      </div>
    </div>
  );
}
