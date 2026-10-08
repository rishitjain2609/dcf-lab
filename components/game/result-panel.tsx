"use client";

import type { GameCompany, GameResult } from "@/lib/game";
import { formatCrore, formatPercent, formatRupees } from "@/lib/format";
import { BarChart } from "@/components/charts/bar-chart";

function CalculationTable({ calc, label }: { calc: GameResult["user"]; label: string }) {
  const years = [1, 2, 3, 4, 5];
  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full text-sm">
        <thead className="bg-foreground/5">
          <tr>
            <th className="px-3 py-2 text-left font-medium">{label} (₹ cr)</th>
            {years.map((y) => (
              <th key={y} className="px-3 py-2 text-right font-medium">
                Yr {y}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            { rowLabel: "Revenue", values: calc.revenue },
            { rowLabel: "EBITDA", values: calc.ebitda },
            { rowLabel: "EBIT", values: calc.ebit },
            { rowLabel: "UFCF", values: calc.ufcf },
            { rowLabel: "PV of UFCF", values: calc.presentValuesOfFcf },
          ].map((row) => (
            <tr key={row.rowLabel} className="border-b border-border last:border-0">
              <td className="px-3 py-2 text-muted">{row.rowLabel}</td>
              {row.values.map((v, i) => (
                <td key={i} className="px-3 py-2 text-right font-mono">
                  {v.toFixed(1)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ResultPanel({
  company,
  result,
  onContinue,
}: {
  company: GameCompany;
  result: GameResult;
  onContinue: () => void;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-medium">Your calculation</h2>
        <p className="mt-1 text-sm text-muted">{company.company}. Full build shown, not just the answer.</p>
        <div className="mt-4">
          <CalculationTable calc={result.user} label="Your model" />
        </div>
        <div className="mt-4 rounded-md border border-border bg-card p-4">
          <BarChart
            categories={["Yr 1", "Yr 2", "Yr 3", "Yr 4", "Yr 5"]}
            format="crore"
            series={[
              { label: "Revenue", values: result.user.revenue, colorClassName: "fill-indigo-500 dark:fill-indigo-400" },
              { label: "EBITDA", values: result.user.ebitda, colorClassName: "fill-amber-500 dark:fill-amber-400" },
              { label: "UFCF", values: result.user.ufcf, colorClassName: "fill-emerald-500 dark:fill-emerald-400" },
            ]}
          />
        </div>
        <p className="mt-2 text-sm text-muted">
          Terminal value {formatCrore(result.user.terminalValue)}, PV of terminal value{" "}
          {formatCrore(result.user.presentValueOfTerminalValue)}. Enterprise value{" "}
          {formatCrore(result.user.enterpriseValue)} − net debt {formatCrore(company.netDebt)} = equity value{" "}
          {formatCrore(result.user.equityValue)}, ÷ {company.dilutedShares} cr shares.
        </p>
      </div>

      <div>
        <h2 className="text-lg font-medium">Reveal</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted">Your implied value</p>
            <p className="mt-1 font-mono text-xl">{formatRupees(result.user.impliedValuePerShare)}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted">Market price (snapshot)</p>
            <p className="mt-1 font-mono text-xl">{formatRupees(result.marketPricePerShare)}</p>
            <p
              className={`mt-1 font-mono text-sm ${
                result.errorVsMarket >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {formatPercent(result.errorVsMarket)} vs. market
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted">Reference model</p>
            <p className="mt-1 font-mono text-xl">{formatRupees(result.reference.impliedValuePerShare)}</p>
            <p
              className={`mt-1 font-mono text-sm ${
                result.errorVsReference >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {formatPercent(result.errorVsReference)} vs. reference
            </p>
          </div>
        </div>
        <div className="mt-4 rounded-md border border-border bg-card p-4">
          <BarChart
            categories={["Your value", "Market", "Reference"]}
            format="rupees"
            series={[
              {
                label: "₹ per share",
                values: [
                  result.user.impliedValuePerShare,
                  result.marketPricePerShare,
                  result.reference.impliedValuePerShare,
                ],
                colorClassName: "fill-indigo-500 dark:fill-indigo-400",
              },
            ]}
          />
        </div>
      </div>

      {result.driverNotes.length > 0 && (
        <div>
          <h2 className="text-lg font-medium">What drove the difference</h2>
          <div className="mt-4 space-y-3">
            {result.driverNotes.map((note) => (
              <div key={note.factor} className="rounded-md border border-dashed border-border bg-card p-4">
                <p className="font-mono text-xs uppercase tracking-wide text-accent">{note.factor}</p>
                <p className="mt-1 text-sm text-foreground/90">{note.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {result.driverNotes.length === 0 && (
        <p className="text-sm text-muted">
          Your assumptions matched the reference model closely enough that there&apos;s nothing meaningful to call out.
          Your implied value and the reference model landed in the same place.
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onContinue}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white dark:text-background"
        >
          Continue to the final quiz →
        </button>
      </div>
    </div>
  );
}
