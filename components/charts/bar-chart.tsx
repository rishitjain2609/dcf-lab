"use client";

import { motion } from "motion/react";
import { formatCrore, formatRupees } from "@/lib/format";

export interface BarChartSeries {
  label: string;
  values: number[];
  colorClassName: string;
}

export type ChartValueFormat = "crore" | "rupees" | "raw";

const VB_WIDTH = 300;
const VB_HEIGHT = 150;
const BOTTOM_MARGIN = 20;
const TOP_MARGIN = 10;
const BASELINE_Y = VB_HEIGHT - BOTTOM_MARGIN;

const FORMATTERS: Record<ChartValueFormat, (v: number) => string> = {
  crore: formatCrore,
  rupees: (v) => formatRupees(v, 0),
  raw: (v) => v.toFixed(0),
};

export function BarChart({
  categories,
  series,
  format = "raw",
}: {
  categories: string[];
  series: BarChartSeries[];
  format?: ChartValueFormat;
}) {
  const valueFormatter = FORMATTERS[format];
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
                <motion.rect
                  key={s.label}
                  x={x}
                  y={y}
                  width={barWidth * 0.8}
                  height={barHeight}
                  rx={1.5}
                  className={s.colorClassName}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (ci * series.length + si) * 0.05, ease: "easeOut" }}
                  style={{ transformOrigin: `${x + (barWidth * 0.8) / 2}px ${BASELINE_Y}px` }}
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
