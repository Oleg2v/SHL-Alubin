# Stage 0 · Art direction

SHL-Alubin website concept by Kikkey. Sheet SHL-WEB-000, revision A, for approval.
Live specimen: `/style-tile/` (run `npm run dev`, or open `out/style-tile/index.html` after `npm run build`).

## The concept in three lines

1. **One story.** A 480 °C billet is pushed through the die and leaves as a cold, dimensioned profile;
   every page is a station on that line.
2. **Cold interface.** The drawing office: a 12-column sheet, ISO hairlines, lettering heights in
   millimetres, every spec in mono.
3. **Hot process.** Heat is a reading, not a decoration: Billet Glow marks only the hot billet, the
   active state and the one primary action.

## Five bold decisions we commit to

1. **Colour is temperature.** Billet Glow is a reading, not an accent. It appears only where something is
   hot, live or the one primary action, every hot element carries its °C, and it never covers more than
   2% of a screen.
2. **Type set in lettering heights.** The nine sizes are drawing-office lettering heights, from 2.5 mm
   dimension text to 40 mm numerals (cap height at 1600 px; the ISO 3098 series plus one 3 mm ANSI step),
   and every dimension line on the sheet measures something real, live, in millimetres.
3. **Scroll is the ram.** No parallax. Scroll drives the press stroke 1:1: the visitor extrudes the
   profile, sees it morph through four real sections and cool from 480 °C to brushed silver. Long stories
   index like a rotary table: push, stop, hold.
4. **Line types carry state.** Interface states borrow ISO 128 line types: a dashed hidden line for
   unavailable, a phantom line for loading, a wide line and a note for an error. Never 40% opacity, never a
   shimmer, never red. Hatching is kept for cut metal.
5. **Hebrew is a mirror, not a translation.** True RTL from the first component. Layout, arrows and
   timelines mirror; drawings, part IDs and every number stay left to right, as on Israeli engineering
   drawings. Text reveals by line, never by letter.

## Five clichés we refuse

| Cliché | Instead |
| --- | --- |
| Molten metal and orange everywhere | Extrusion is a solid-state process and a 480 °C billet barely glows. Heat is a measured reading, on the billet only. |
| Stock factory photography | No hard hats, handshakes or blue tint: monochrome macro on die, billet and surface, or an honest placeholder. |
| The fake blueprint | No white-on-blue grids or decorative dimensions with invented numbers: ISO 128 lines, and values that are measured or come from data. |
| Bouncy springs, blob cursors, parallax | One damped house curve, the system crosshair with a live mm readout, and depth only inside the WebGL hero. |
| “Innovative solutions”, marquees, carousels | Tonnes, dies, alloys, tolerances and ports: facts only SHL-Alubin can state, set large and left still. |

## Tokens at a glance

| Group | Values |
| --- | --- |
| Palette | Alu White `#ECEEF0` · Alu Mid `#9BA3AB` · Graphite `#16191C` · Ink `#0B0D0F` · Billet Glow `#FF5A1F` · derived Alu Deep `#5A626A` (secondary text on light, 5.33:1) |
| Contrast rules | Glow never as text on light (2.68:1) · primary CTA = Glow fill + Ink label (6.24:1) · Alu Mid never as text on Alu White (2.20:1) |
| Type (cap height at 1600 px) | micro 2.5 · small 3 · body 3.5 · lead 5 · title-s 7 · title-m 10 · title-l 14 · headline 20 · display 40 mm; 360 px floors 12 · 13.5 · 16 · 18.5 · 21 · 25 · 30 · 40 · 64 px |
| Space | 4 px grid; margins 16 · 32 · 40 · 48, gutters 12 · 16 · 20 · 24 at < 640 · 640 · 1024 · 1440 px |
| Radii | 0 surfaces · 2 controls · 4 toasts · full for dots only |
| Shadows | hairline · lift · float on the sheet; press inset · heat glow on the stage (the only coloured shadow) |
| Motion | 80 ms grid: 80 · 160 · 240 · 400 · 640 · 960 · 1120 ms; ease-out `cubic-bezier(0.22, 1, 0.36, 1)`, in-out `(0.65, 0, 0.35, 1)`, in `(0.55, 0, 1, 0.45)`, linear for scroll; no overshoot |
| Focus | Ink 2 px inside, Billet Glow 2 px outside: passes on both surfaces |
| Heat ramp | Glow share = radiance above ambient, (T⁴ − T₀⁴)/(T₄₈₀⁴ − T₀⁴); a third left at 300 °C |

## Panel and review process

Five independent proposals (Swiss typography and technical drawing, motion, material and heat, product
and accessibility, a contrarian Awwwards juror) were merged into this direction. The style tile was then
reviewed by four independent critics (design jury, accessibility with axe and a keyboard pass, Hebrew RTL
and German, design-system integrity), and every finding was checked by a skeptic before it was fixed.

## Open for later stages

- Stage 1: the R3F hero (polygon morph with matched vertex counts, emissive cooling on the T⁴ curve,
  WebM fallback, still frame for reduced motion); the CSS-only preloader (`@property` counter).
- Stage 2: hot-saw page transitions (a 2 px Billet Glow cut, top to bottom, 480 ms, direction-neutral
  for RTL); crosshair part coordinates with vertex snap over drawings; 1:1 calibrated drawing mode.
- Stage 3: bake the photo plates (SVG lighting) to AVIF at build time; subset Geist / Geist Mono to
  Latin + symbols (about 29 + 22 KB instead of 67 + 69 KB).
- Native review of Hebrew and German copy before launch. Dutch (NL) on hold.
