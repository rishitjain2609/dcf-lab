import { toParenthetical } from "@/lib/format";

export interface FcfTableProps {
  revenue: number[];
  ebitda: number[];
  ebit: number[];
  ufcf: number[];
  presentValuesOfFcf: number[];
  valueFormatter: (v: number) => string;
}

export function FcfTable({ revenue, ebitda, ebit, ufcf, presentValuesOfFcf, valueFormatter }: FcfTableProps) {
  const years = revenue.map((_, i) => `Yr ${i + 1}`);
  const rows: { label: string; values: number[] }[] = [
    { label: "Revenue", values: revenue },
    { label: "EBITDA", values: ebitda },
    { label: "EBIT", values: ebit },
    { label: "Unlevered FCF", values: ufcf },
    { label: "PV of FCF", values: presentValuesOfFcf },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th scope="col" className="border-b border-border p-2 text-left text-xs font-medium text-muted">
              ₹/$ (as entered)
            </th>
            {years.map((y) => (
              <th key={y} scope="col" className="border-b border-border p-2 text-right text-xs font-medium text-muted">
                {y}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row" className="border-b border-border p-2 text-left font-medium">
                {row.label}
              </th>
              {row.values.map((v, i) => (
                <td key={i} className="border-b border-border p-2 text-right tabular-nums">
                  {toParenthetical(valueFormatter(v), v)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
