"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CHART_COLORS, axisTickStyle, tooltipContentStyle, tooltipLabelStyle } from "../chart-theme";

export interface FootballFieldRow {
  label: string;
  value: number;
  color: string;
  /** Optional [min, max] range drawn as a faint background bar behind the point (e.g. community range). */
  range?: [number, number];
}

function PointMarker(props: unknown) {
  const { x, y, width, height, fill } = props as { x: number; y: number; width: number; height: number; fill: string };
  const cx = x + width;
  const cy = y + height / 2;
  return <circle cx={cx} cy={cy} r={6} fill={fill} stroke="#ffffff" strokeWidth={1.5} />;
}

export function FootballField({ rows, valueFormatter }: { rows: FootballFieldRow[]; valueFormatter: (v: number) => string }) {
  const data = rows.map((r) => ({
    label: r.label,
    value: r.value,
    range: r.range ?? null,
    color: r.color,
  }));

  return (
    <div style={{ height: rows.length * 48 + 16 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.border} horizontal={false} />
          <XAxis type="number" tick={axisTickStyle} tickFormatter={valueFormatter} />
          <YAxis type="category" dataKey="label" tick={axisTickStyle} width={90} />
          <Tooltip
            contentStyle={tooltipContentStyle}
            labelStyle={tooltipLabelStyle}
            formatter={(v) => valueFormatter(Number(v))}
          />
          <Bar dataKey="range" fill={CHART_COLORS.reference} fillOpacity={0.2} barSize={10} isAnimationActive={false} />
          <Bar dataKey="value" barSize={1} isAnimationActive={false} shape={PointMarker}>
            {data.map((entry) => (
              <Cell key={entry.label} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
