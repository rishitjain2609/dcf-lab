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

const VB_WIDTH = 300;
const VB_HEIGHT = 170;
const BOTTOM_MARGIN = 22;
const TOP_MARGIN = 20;

export function WaterfallChart({
  steps,
  valueFormatter = (v: number) => v.toFixed(1),
}: {
  steps: WaterfallStep[];
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
  const groupWidth = VB_WIDTH / bars.length;
  const plotHeight = VB_HEIGHT - BOTTOM_MARGIN - TOP_MARGIN;

  const scaleY = (v: number) => VB_HEIGHT - BOTTOM_MARGIN - (v / max) * plotHeight;

  return (
    <div>
      {/* Fixed-ratio viewBox with default preserveAspectRatio (uniform scaling) so text never stretches. */}
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
        {bars.map((bar, i) => {
          const barTop = scaleY(Math.max(bar.from, bar.to));
          const barBottom = scaleY(Math.min(bar.from, bar.to));
          const barHeight = Math.max(barBottom - barTop, 1.5);
          const x = i * groupWidth + groupWidth * 0.2;
          return (
            <g key={bar.label}>
              <rect x={x} y={barTop} width={groupWidth * 0.6} height={barHeight} rx={1.5} className={bar.colorClass} />
              <text
                x={i * groupWidth + groupWidth / 2}
                y={barTop - 6}
                textAnchor="middle"
                className="fill-foreground"
                style={{ fontSize: 10 }}
              >
                {valueFormatter(bar.to)}
              </text>
              <text
                x={i * groupWidth + groupWidth / 2}
                y={VB_HEIGHT - 6}
                textAnchor="middle"
                className="fill-muted"
                style={{ fontSize: 9 }}
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
