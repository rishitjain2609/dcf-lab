"use client";

import type { GameCompany, GameResult } from "@/lib/game";
import { formatCrore, formatPercent, formatRupees } from "@/lib/format";
import { BarChart } from "@/components/charts/bar-chart";

function CalculationTable({ calc, label }: { calc: GameResult["user"]; label: string }) {
  const years = [1, 2, 3, 4, 5];
  return (
    <div className="overflow-x-auto rounded-3xl bg-foreground/5 p-2">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="px-3 py-2 text-left font-medium text-foreground/60">{label} (₹ cr)</th>
            {years.map((y) => (
              <th key={y} className="px-3 py-2 text-right font-medium text-foreground/60">
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
          ].map((row, i) => (
            <tr key={row.rowLabel} className={i % 2 === 0 ? "bg-background/60" : ""}>
              <td className="rounded-l-xl px-3 py-2 text-foreground/70">{row.rowLabel}</td>
              {row.values.map((v, j) => (
                <td
                  key={j}
                  className={`px-3 py-2 text-right font-mono ${j === row.values.length - 1 ? "rounded-r-xl" : ""}`}
                >
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
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold italic">Your calculation</h2>
        <p className="mt-1 text-sm text-foreground/60">{company.company}. Full build shown, not just the answer.</p>
        <div className="mt-4">
          <CalculationTable calc={result.user} label="Your model" />
        </div>
        <div className="mt-4 rounded-3xl bg-foreground/5 p-5">
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
        <p className="mt-2 text-sm text-foreground/60">
          Terminal value {formatCrore(result.user.terminalValue)}, PV of terminal value{" "}
          {formatCrore(result.user.presentValueOfTerminalValue)}. Enterprise value{" "}
          {formatCrore(result.user.enterpriseValue)} − net debt {formatCrore(company.netDebt)} = equity value{" "}
          {formatCrore(result.user.equityValue)}, ÷ {company.dilutedShares} cr shares.
        </p>
      </div>

      <div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold italic">Reveal</h2>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row">
          <div className="rounded-3xl bg-indigo-50 p-6 dark:bg-indigo-950/40 sm:w-72">
            <p className="text-sm text-foreground/60">Your implied value</p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-5xl font-semibold italic text-indigo-700 dark:text-indigo-400">
              {formatRupees(result.user.impliedValuePerShare)}
            </p>
          </div>
          <div className="flex flex-1 gap-4">
            <div className="flex-1 rounded-3xl bg-foreground/5 p-5">
              <p className="text-sm text-foreground/60">Market price (snapshot)</p>
              <p className="mt-1 font-mono text-xl">{formatRupees(result.marketPricePerShare)}</p>
              <p
                className={`mt-1 font-mono text-sm ${
                  result.errorVsMarket >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {formatPercent(result.errorVsMarket)} vs. market
              </p>
            </div>
            <div className="flex-1 rounded-3xl bg-foreground/5 p-5">
              <p className="text-sm text-foreground/60">Reference model</p>
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
        </div>
        <div className="mt-4 rounded-3xl bg-foreground/5 p-5">
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
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold italic">What drove the difference</h2>
          <div className="mt-4 space-y-3">
            {result.driverNotes.map((note, i) => (
              <div
                key={note.factor}
                className={`rounded-2xl p-4 ${i % 2 === 0 ? "bg-amber-50 dark:bg-amber-950/30" : "bg-sky-50 dark:bg-sky-950/30"}`}
              >
                <p className="font-mono text-xs uppercase tracking-wide text-foreground/60">{note.factor}</p>
                <p className="mt-1 text-sm text-foreground/90">{note.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {result.driverNotes.length === 0 && (
        <p className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">
          Your assumptions matched the reference model closely enough that there&apos;s nothing meaningful to call out.
          Your implied value and the reference model landed in the same place.
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onContinue}
          className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Continue to the final quiz →
        </button>
      </div>
    </div>
  );
}
