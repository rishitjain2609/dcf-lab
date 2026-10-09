"use client";

import { Line, LineChart, ResponsiveContainer } from "recharts";
import { CHART_COLORS } from "../chart-theme";

export function Sparkline({ values, className }: { values: number[]; className?: string }) {
  const data = values.map((v, i) => ({ i, v }));
  const trendingUp = values[values.length - 1] >= values[0];

  return (
    <div className={className} style={{ height: 32, width: 96 }} aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={trendingUp ? CHART_COLORS.up : CHART_COLORS.down}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
