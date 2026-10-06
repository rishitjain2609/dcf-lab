export interface BarChartSeries {
  label: string;
  values: number[];
  colorClassName: string;
}

const VB_WIDTH = 300;
const VB_HEIGHT = 150;
const BOTTOM_MARGIN = 20;
const TOP_MARGIN = 10;

export function BarChart({
  categories,
  series,
  valueFormatter = (v: number) => v.toFixed(0),
}: {
  categories: string[];
  series: BarChartSeries[];
  valueFormatter?: (value: number) => string;
}) {
  const max = Math.max(1, ...series.flatMap((s) => s.values));
  const plotHeight = VB_HEIGHT - BOTTOM_MARGIN - TOP_MARGIN;
  const groupWidth = VB_WIDTH / categories.length;
  const barWidth = groupWidth / (series.length + 1);

  return (
    <div>
      {/* Fixed 2:1 viewBox with default preserveAspectRatio (uniform scaling) so text never stretches. */}
      <svg
        viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}
        className="w-full"
        style={{ aspectRatio: `${VB_WIDTH} / ${VB_HEIGHT}` }}
      >
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <line
            key={f}
            x1={0}
            x2={VB_WIDTH}
            y1={VB_HEIGHT - BOTTOM_MARGIN - f * plotHeight}
            y2={VB_HEIGHT - BOTTOM_MARGIN - f * plotHeight}
            className="stroke-border"
            strokeWidth={1}
          />
        ))}
        {categories.map((cat, ci) => (
          <g key={cat}>
            {series.map((s, si) => {
              const value = s.values[ci] ?? 0;
              const barHeight = (value / max) * plotHeight;
              const x = ci * groupWidth + barWidth * (si + 0.5);
              const y = VB_HEIGHT - BOTTOM_MARGIN - barHeight;
              return (
                <rect
                  key={s.label}
                  x={x}
                  y={y}
                  width={barWidth * 0.8}
                  height={barHeight}
                  rx={1.5}
                  className={s.colorClassName}
                />
              );
            })}
            <text
              x={ci * groupWidth + groupWidth / 2}
              y={VB_HEIGHT - 6}
              textAnchor="middle"
              className="fill-muted"
              style={{ fontSize: 9 }}
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
