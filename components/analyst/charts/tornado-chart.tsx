"use client";

import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TornadoRow } from "@/lib/game";
import { CHART_COLORS, axisTickStyle, tooltipContentStyle, tooltipLabelStyle } from "../chart-theme";

export function TornadoChart({ rows, valueFormatter }: { rows: TornadoRow[]; valueFormatter: (v: number) => string }) {
  const data = [...rows].reverse(); // largest at top

  return (
    <div style={{ height: data.length * 36 + 16 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.border} horizontal={false} />
          <XAxis type="number" tick={axisTickStyle} tickFormatter={valueFormatter} />
          <YAxis type="category" dataKey="factor" tick={axisTickStyle} width={110} />
          <ReferenceLine x={0} stroke={CHART_COLORS.ink} />
          <Tooltip
            contentStyle={tooltipContentStyle}
            labelStyle={tooltipLabelStyle}
            formatter={(v) => valueFormatter(Number(v))}
          />
          <Bar dataKey="delta" barSize={16} isAnimationActive={false} radius={2}>
            {data.map((entry) => (
              <Cell key={entry.factor} fill={entry.delta >= 0 ? CHART_COLORS.up : CHART_COLORS.down} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
