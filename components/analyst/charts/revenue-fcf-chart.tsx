"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CHART_COLORS, axisTickStyle, tooltipContentStyle, tooltipLabelStyle } from "../chart-theme";

export interface RevenueFcfChartProps {
  historicalRevenue: number[];
  projectedRevenue: number[];
  projectedFcf: number[];
  valueFormatter: (v: number) => string;
}

export function RevenueFcfChart({ historicalRevenue, projectedRevenue, projectedFcf, valueFormatter }: RevenueFcfChartProps) {
  const historyLen = historicalRevenue.length;
  const data = [
    ...historicalRevenue.map((v, i) => {
      const yearsAgo = historyLen - i - 1;
      return {
        label: yearsAgo === 0 ? "FY0" : `FY-${yearsAgo}`,
        revenue: v,
        fcf: null as number | null,
        forecast: false,
      };
    }),
    ...projectedRevenue.map((v, i) => ({
      label: `Yr ${i + 1}`,
      revenue: v,
      fcf: projectedFcf[i] ?? null,
      forecast: true,
    })),
  ];

  return (
    <div style={{ height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.border} vertical={false} />
          <XAxis dataKey="label" tick={axisTickStyle} />
          <YAxis tick={axisTickStyle} tickFormatter={valueFormatter} width={64} />
          <Tooltip
            contentStyle={tooltipContentStyle}
            labelStyle={tooltipLabelStyle}
            formatter={(v, name) => [valueFormatter(Number(v)), name === "revenue" ? "Revenue" : "Unlevered FCF"]}
          />
          <Bar dataKey="revenue" barSize={20} isAnimationActive={false} radius={2}>
            {data.map((entry) => (
              <Cell key={entry.label} fill={entry.forecast ? CHART_COLORS.reference : "#c7c9cf"} fillOpacity={entry.forecast ? 0.35 : 0.6} />
            ))}
          </Bar>
          <Bar dataKey="fcf" barSize={10} fill={CHART_COLORS.user} isAnimationActive={false} radius={2} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
