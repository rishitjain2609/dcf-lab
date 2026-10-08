"use client";

import { BarChart } from "@/components/charts/bar-chart";
import { WaterfallChart } from "@/components/charts/waterfall-chart";
import { SensitivityHeatmap } from "@/components/charts/sensitivity-heatmap";

const YEARS = ["Yr 1", "Yr 2", "Yr 3", "Yr 4", "Yr 5"];

/** Revenue / EBITDA / UFCF across the 5-year forecast, from the guide's running example. */
export function UfcfBuildChart() {
  return (
    <div className="mt-4 rounded-md border border-border bg-card p-4">
      <BarChart
        categories={YEARS}
        format="crore"
        series={[
          { label: "Revenue", values: [1100, 1210, 1331, 1464.1, 1610.51], colorClassName: "fill-indigo-500 dark:fill-indigo-400" },
          { label: "EBITDA", values: [220, 242, 266.2, 292.82, 322.1], colorClassName: "fill-amber-500 dark:fill-amber-400" },
          { label: "UFCF", values: [102.75, 113.03, 124.33, 136.76, 150.44], colorClassName: "fill-emerald-500 dark:fill-emerald-400" },
        ]}
      />
    </div>
  );
}

/** EV -> net debt -> equity value, from the guide's EV-to-equity-bridge step. */
export function EquityBridgeWaterfall() {
  return (
    <div className="mt-4 rounded-md border border-border bg-card p-4">
      <WaterfallChart
        format="crore"
        steps={[
          { label: "Enterprise value", value: 1494.5, kind: "total" },
          { label: "Net debt", value: -200, kind: "change" },
          { label: "Equity value", value: 1294.5, kind: "total" },
        ]}
      />
    </div>
  );
}

/** WACC x terminal-growth grid from the guide's sensitivity-tables step. */
export function SensitivityGrid() {
  return (
    <div className="mt-4">
      <SensitivityHeatmap
        rowAxisLabel="WACC"
        colAxisLabel="g"
        rowLabels={["11.3%", "12.3%", "13.3%"]}
        colLabels={["3.5%", "4.0%", "4.5%"]}
        baseRowIndex={1}
        baseColIndex={1}
        formatValue={(v) => `₹${v.toFixed(2)}`}
        values={[
          [35.49, 37.64, 40.11],
          [30.74, 32.36, 34.19],
          [26.97, 28.22, 29.62],
        ]}
      />
    </div>
  );
}
