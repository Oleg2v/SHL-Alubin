export type SpecRow = {
  key: string;
  label: string;
  value: string;
  unit?: string;
  note?: string;
};

type Props = {
  caption: string;
  rows: SpecRow[];
  /** Row key highlighted from the drawing (hover a dimension, its row lights up). */
  activeKey?: string;
  headers?: { property: string; value: string; unit: string; note: string };
  className?: string;
};

const EN = { property: "Property", value: "Value", unit: "Unit", note: "Standard / note" };

/** Spec table in Geist Mono. Values are isolated LTR runs and align to the logical end. */
export function SpecTable({ caption, rows, activeKey, headers = EN, className }: Props) {
  return (
    <table className={`spec ${className ?? ""}`}>
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">{headers.property}</th>
          <th scope="col" className="num">
            {headers.value}
          </th>
          <th scope="col">{headers.unit}</th>
          <th scope="col">{headers.note}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.key} data-active={activeKey === r.key ? "true" : undefined} aria-current={activeKey === r.key ? "true" : undefined}>
            <th scope="row">{r.label}</th>
            <td className="num">
              <bdi dir="ltr">{r.value}</bdi>
            </td>
            <td>{r.unit ? <bdi dir="ltr">{r.unit}</bdi> : null}</td>
            <td className="note">{r.note ? <bdi>{r.note}</bdi> : null}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
