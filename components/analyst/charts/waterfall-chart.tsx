"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CHART_COLORS, axisTickStyle, tooltipContentStyle, tooltipLabelStyle } from "../chart-theme";

export interface WaterfallStep {
  label: string;
  /** For a running step, the signed amount added/subtracted. For a total step, the absolute total to display. */
  value: number;
  isTotal?: boolean;
}

interface WaterfallRow {
  label: string;
  range: [number, number];
  delta: number;
  isTotal: boolean;
}

function toWaterfallRows(steps: WaterfallStep[]): WaterfallRow[] {
  const { rows } = steps.reduce<{ rows: WaterfallRow[]; cumulative: number }>(
    (acc, step) => {
      if (step.isTotal) {
        const row: WaterfallRow = { label: step.label, range: [0, step.value], delta: step.value, isTotal: true };
        return { rows: [...acc.rows, row], cumulative: step.value };
      }
      const start = acc.cumulative;
      const end = start + step.value;
      const row: WaterfallRow = {
        label: step.label,
        range: [Math.min(start, end), Math.max(start, end)],
        delta: step.value,
        isTotal: false,
      };
      return { rows: [...acc.rows, row], cumulative: end };
    },
    { rows: [], cumulative: 0 }
  );
  return rows;
}

export function WaterfallChart({ steps, valueFormatter }: { steps: WaterfallStep[]; valueFormatter: (v: number) => string }) {
  const data = toWaterfallRows(steps);

  return (
    <div style={{ height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.border} vertical={false} />
          <XAxis dataKey="label" tick={axisTickStyle} interval={0} angle={-20} textAnchor="end" height={60} />
          <YAxis tick={axisTickStyle} tickFormatter={valueFormatter} width={64} />
          <Tooltip
            contentStyle={tooltipContentStyle}
            labelStyle={tooltipLabelStyle}
            formatter={(_v, _name, item) => {
              const payload = item.payload as { delta?: number } | undefined;
              return [valueFormatter(payload?.delta ?? 0), "Amount"];
            }}
          />
          <Bar dataKey="range" barSize={36} isAnimationActive={false} radius={2}>
            {data.map((entry) => (
              <Cell
                key={entry.label}
                fill={entry.isTotal ? CHART_COLORS.ink : entry.delta >= 0 ? CHART_COLORS.up : CHART_COLORS.down}
                fillOpacity={entry.isTotal ? 1 : 0.75}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
