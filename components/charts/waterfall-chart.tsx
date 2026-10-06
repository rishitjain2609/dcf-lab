export interface WaterfallStep {
  label: string;
  value: number;
  kind: "total" | "change";
}

const COLOR_BY_KIND_AND_SIGN: Record<string, string> = {
  total: "fill-indigo-500 dark:fill-indigo-400",
  positive: "fill-emerald-500 dark:fill-emerald-400",
  negative: "fill-rose-500 dark:fill-rose-400",
};

export function WaterfallChart({
  steps,
  height = 200,
  valueFormatter = (v: number) => v.toFixed(1),
}: {
  steps: WaterfallStep[];
  height?: number;
  valueFormatter?: (value: number) => string;
}) {
  const { bars } = steps.reduce<{ bars: (WaterfallStep & { from: number; to: number; colorClass: string })[]; running: number }>(
    (acc, step) => {
      const from = step.kind === "total" ? 0 : acc.running;
      const to = step.kind === "total" ? step.value : acc.running + step.value;
      const colorClass =
        step.kind === "total" ? COLOR_BY_KIND_AND_SIGN.total : COLOR_BY_KIND_AND_SIGN[step.value >= 0 ? "positive" : "negative"];
      return {
        bars: [...acc.bars, { ...step, from, to, colorClass }],
        running: to,
      };
    },
    { bars: [], running: 0 }
  );

  const max = Math.max(...bars.map((b) => Math.max(b.from, b.to)), 1);
  const groupWidth = 100 / bars.length;
  const plotHeight = height - 40;

  const scaleY = (v: number) => height - 24 - (v / max) * plotHeight;

  return (
    <div>
      <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="h-56 w-full overflow-visible">
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <line
            key={f}
            x1={0}
            x2={100}
            y1={height - 24 - f * plotHeight}
            y2={height - 24 - f * plotHeight}
            className="stroke-border"
            strokeWidth={0.3}
          />
        ))}
        {bars.map((bar, i) => {
          const barTop = scaleY(Math.max(bar.from, bar.to));
          const barBottom = scaleY(Math.min(bar.from, bar.to));
          const barHeight = Math.max(barBottom - barTop, 0.5);
          const x = i * groupWidth + groupWidth * 0.2;
          return (
            <g key={bar.label}>
              <rect x={x} y={barTop} width={groupWidth * 0.6} height={barHeight} rx={0.6} className={bar.colorClass} />
              <text
                x={i * groupWidth + groupWidth / 2}
                y={barTop - 2}
                textAnchor="middle"
                className="fill-foreground"
                style={{ fontSize: 3.6 }}
              >
                {valueFormatter(bar.to)}
              </text>
              <text
                x={i * groupWidth + groupWidth / 2}
                y={height - 8}
                textAnchor="middle"
                className="fill-muted"
                style={{ fontSize: 3.4 }}
              >
                {bar.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
