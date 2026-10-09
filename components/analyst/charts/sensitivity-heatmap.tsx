"use client";

export interface SensitivityHeatmapProps {
  waccValues: number[];
  terminalGrowthValues: number[];
  /** table[waccIndex][terminalGrowthIndex] = implied price for that combination. */
  table: number[][];
  userWacc: number;
  userTerminalGrowth: number;
  valueFormatter: (v: number) => string;
  percentFormatter: (v: number) => string;
}

function closestIndex(values: number[], target: number): number {
  let best = 0;
  let bestDiff = Infinity;
  values.forEach((v, i) => {
    const diff = Math.abs(v - target);
    if (diff < bestDiff) {
      best = i;
      bestDiff = diff;
    }
  });
  return best;
}

export function SensitivityHeatmap({
  waccValues,
  terminalGrowthValues,
  table,
  userWacc,
  userTerminalGrowth,
  valueFormatter,
  percentFormatter,
}: SensitivityHeatmapProps) {
  const flat = table.flat();
  const min = Math.min(...flat);
  const max = Math.max(...flat);
  const userRow = closestIndex(waccValues, userWacc);
  const userCol = closestIndex(terminalGrowthValues, userTerminalGrowth);

  function cellBackground(value: number): string {
    const t = max === min ? 0.5 : (value - min) / (max - min);
    // Interpolate rose (low) -> paper (mid) -> emerald (high) via raw rgb mixing.
    const low = [194, 59, 59];
    const high = [31, 138, 95];
    const mix = (a: number, b: number) => Math.round(a + (b - a) * t);
    const [r, g, b] = [mix(low[0], high[0]), mix(low[1], high[1]), mix(low[2], high[2])];
    return `rgba(${r}, ${g}, ${b}, 0.18)`;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm" aria-label="Implied price sensitivity to WACC and terminal growth">
        <caption className="sr-only">
          Implied price per share across a range of WACC and terminal growth combinations. Your current inputs are
          highlighted.
        </caption>
        <thead>
          <tr>
            <th scope="col" className="border border-border p-2 text-left text-xs font-medium text-muted">
              WACC \ g
            </th>
            {terminalGrowthValues.map((g, col) => (
              <th
                key={g}
                scope="col"
                className={`border border-border p-2 text-center text-xs font-medium tabular-nums ${
                  col === userCol ? "bg-foreground/10 text-foreground" : "text-muted"
                }`}
              >
                {percentFormatter(g)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {waccValues.map((w, row) => (
            <tr key={w}>
              <th
                scope="row"
                className={`border border-border p-2 text-left text-xs font-medium tabular-nums ${
                  row === userRow ? "bg-foreground/10 text-foreground" : "text-muted"
                }`}
              >
                {percentFormatter(w)}
              </th>
              {terminalGrowthValues.map((g, col) => {
                const isUserCell = row === userRow && col === userCol;
                return (
                  <td
                    key={g}
                    className={`border p-2 text-center tabular-nums ${
                      isUserCell ? "border-2 border-accent font-semibold" : "border-border"
                    }`}
                    style={{ background: cellBackground(table[row][col]) }}
                  >
                    {valueFormatter(table[row][col])}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
