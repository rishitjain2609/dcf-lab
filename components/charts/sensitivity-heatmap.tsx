"use client";

import { motion } from "motion/react";

function colorForRatio(ratio: number): string {
  // ratio 0..1 (low..high). Rose -> amber -> emerald.
  if (ratio < 0.34) return "bg-rose-500/20 text-rose-700 dark:text-rose-300";
  if (ratio < 0.67) return "bg-amber-500/20 text-amber-700 dark:text-amber-300";
  return "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300";
}

export function SensitivityHeatmap({
  rowLabels,
  colLabels,
  values,
  rowAxisLabel,
  colAxisLabel,
  formatValue = (v: number) => v.toFixed(2),
  baseRowIndex,
  baseColIndex,
}: {
  rowLabels: string[];
  colLabels: string[];
  values: number[][];
  rowAxisLabel: string;
  colAxisLabel: string;
  formatValue?: (value: number) => string;
  baseRowIndex?: number;
  baseColIndex?: number;
}) {
  const flat = values.flat();
  const min = Math.min(...flat);
  const max = Math.max(...flat);
  const range = max - min || 1;

  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full text-center text-sm">
        <thead>
          <tr>
            <th className="border-b border-r border-border px-3 py-2 text-left text-xs text-muted">
              {rowAxisLabel} ↓ / {colAxisLabel} →
            </th>
            {colLabels.map((c) => (
              <th key={c} className="border-b border-border px-3 py-2 font-mono text-xs text-muted">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowLabels.map((r, ri) => (
            <tr key={r}>
              <th className="border-r border-border px-3 py-2 text-left font-mono text-xs text-muted">{r}</th>
              {colLabels.map((c, ci) => {
                const value = values[ri][ci];
                const ratio = (value - min) / range;
                const isBase = ri === baseRowIndex && ci === baseColIndex;
                return (
                  <motion.td
                    key={c}
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: (ri * colLabels.length + ci) * 0.04 }}
                    className={`px-3 py-2 font-mono transition-transform hover:scale-110 ${colorForRatio(ratio)} ${
                      isBase ? "ring-2 ring-inset ring-accent font-semibold" : ""
                    }`}
                  >
                    {formatValue(value)}
                  </motion.td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
