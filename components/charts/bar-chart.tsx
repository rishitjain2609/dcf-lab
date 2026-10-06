export interface BarChartSeries {
  label: string;
  values: number[];
  colorClassName: string;
}

export function BarChart({
  categories,
  series,
  height = 220,
  valueFormatter = (v: number) => v.toFixed(0),
}: {
  categories: string[];
  series: BarChartSeries[];
  height?: number;
  valueFormatter?: (value: number) => string;
}) {
  const max = Math.max(1, ...series.flatMap((s) => s.values));
  const groupWidth = 100 / categories.length;
  const barWidth = groupWidth / (series.length + 1);

  return (
    <div>
      <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="h-56 w-full overflow-visible">
        {/* gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <line
            key={f}
            x1={0}
            x2={100}
            y1={height - 24 - f * (height - 40)}
            y2={height - 24 - f * (height - 40)}
            className="stroke-border"
            strokeWidth={0.3}
          />
        ))}
        {categories.map((cat, ci) => (
          <g key={cat}>
            {series.map((s, si) => {
              const value = s.values[ci] ?? 0;
              const barHeight = (value / max) * (height - 40);
              const x = ci * groupWidth + barWidth * (si + 0.5);
              const y = height - 24 - barHeight;
              return (
                <rect
                  key={s.label}
                  x={x}
                  y={y}
                  width={barWidth * 0.8}
                  height={barHeight}
                  rx={0.6}
                  className={s.colorClassName}
                />
              );
            })}
            <text
              x={ci * groupWidth + groupWidth / 2}
              y={height - 8}
              textAnchor="middle"
              className="fill-muted"
              style={{ fontSize: 3.6 }}
            >
              {cat}
            </text>
          </g>
        ))}
      </svg>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        {series.map((s) => (
          <span key={s.label} className="flex items-center gap-1.5">
            <span className={`inline-block h-2.5 w-2.5 rounded-sm ${s.colorClassName}`} />
            {s.label} (max {valueFormatter(Math.max(...s.values))})
          </span>
        ))}
      </div>
    </div>
  );
}
