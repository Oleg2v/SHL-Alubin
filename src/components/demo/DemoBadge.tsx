/**
 * Demo hygiene, drawn as an ISO 7200 title-block strip: the mandatory disclaimer is the STATUS
 * field, followed by the drawing number of the current page, the revision and the language.
 * Always on screen, on every route, in every language; inline-end bottom corner, mirrors in RTL.
 * It never collapses to an icon: the full sentence stays readable down to 320 px.
 */
type Props = {
  text?: string;
  dwg?: string;
  rev?: string;
  lang?: string;
};

export function DemoBadge({
  text = "Concept by Kikkey — not the official SHL-Alubin website",
  dwg = "SHL-WEB-000",
  rev = "A",
  lang = "EN",
}: Props) {
  return (
    <aside aria-label="Demo notice" className="demo-badge">
      <span className="demo-badge-cell demo-badge-status">
        <span className="demo-badge-dot" aria-hidden="true" />
        <span>{text}</span>
      </span>
      <span className="demo-badge-cell demo-badge-meta" dir="ltr">
        <span className="demo-badge-key">DWG</span> {dwg}
      </span>
      <span className="demo-badge-cell demo-badge-meta" dir="ltr">
        <span className="demo-badge-key">REV</span> {rev}
      </span>
      <span className="demo-badge-cell demo-badge-meta" dir="ltr">
        {lang}
      </span>
    </aside>
  );
}
