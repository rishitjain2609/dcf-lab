"use client";

import { useMemo, useState } from "react";
import type { GameAssumptions, GameCompany } from "@/lib/game";
import { runCalculation } from "@/lib/game";
import { buildSensitivityTable, checkTerminalValueShare, terminalValueShareOfEv, validateTerminalGrowth } from "@/lib/dcf";
import { formatMoneyLarge, formatMoneyPerShare, formatPercent } from "@/lib/format";
import { AssumptionInput } from "@/components/analyst/assumption-input";
import { DcfFlowDiagram, type DcfFlowStep } from "@/components/analyst/dcf-flow-diagram";
import { FcfTable } from "@/components/analyst/fcf-table";
import { WaterfallChart } from "@/components/analyst/charts/waterfall-chart";
import { SensitivityHeatmap } from "@/components/analyst/charts/sensitivity-heatmap";
import { TimeValueIllustration } from "@/components/illustrations/time-value-illustration";
import { WaccBlendIllustration } from "@/components/illustrations/wacc-blend-illustration";
import { TerminalValueIllustration } from "@/components/illustrations/terminal-value-illustration";

const MARGIN_WARNING_THRESHOLD = 0.1; // 10 percentage points away from history

export function BuilderStep({
  company,
  initialAssumptions,
  onContinue,
}: {
  company: GameCompany;
  initialAssumptions: GameAssumptions;
  onContinue: (assumptions: GameAssumptions) => void;
}) {
  const [assumptions, setAssumptions] = useState<GameAssumptions>(initialAssumptions);
  const [activeFlowStep, setActiveFlowStep] = useState<DcfFlowStep | null>(null);

  const money = (v: number) => formatMoneyLarge(v, company.currency);
  const perShare = (v: number) => formatMoneyPerShare(v, company.currency);

  function update<K extends keyof GameAssumptions>(key: K, value: number) {
    setAssumptions((prev) => ({ ...prev, [key]: value }));
  }

  const terminalGuard = validateTerminalGrowth(assumptions.terminalGrowth, assumptions.wacc);

  const result = useMemo(() => {
    if (!terminalGuard.valid) return null;
    try {
      return runCalculation(company, assumptions);
    } catch {
      return null;
    }
  }, [company, assumptions, terminalGuard.valid]);

  const tvShare = result ? terminalValueShareOfEv(result.presentValueOfTerminalValue, result.enterpriseValue) : 0;
  const tvWarning = checkTerminalValueShare(tvShare);
  const marginWarning =
    Math.abs(assumptions.ebitdaMargin - company.ebitdaMargin) > MARGIN_WARNING_THRESHOLD
      ? `${formatPercent(assumptions.ebitdaMargin - company.ebitdaMargin)} away from this company's historical margin, double check it.`
      : undefined;

  const sensitivityRows = [assumptions.wacc - 0.02, assumptions.wacc - 0.01, assumptions.wacc, assumptions.wacc + 0.01, assumptions.wacc + 0.02];
  const sensitivityCols = [
    assumptions.terminalGrowth - 0.02,
    assumptions.terminalGrowth - 0.01,
    assumptions.terminalGrowth,
    assumptions.terminalGrowth + 0.01,
    assumptions.terminalGrowth + 0.02,
  ].filter((g) => g < Math.max(...sensitivityRows));

  const sensitivityTable = buildSensitivityTable(sensitivityRows, sensitivityCols, (w, g) => {
    if (g >= w) return NaN;
    try {
      return runCalculation(company, { ...assumptions, wacc: w, terminalGrowth: g }).impliedValuePerShare;
    } catch {
      return NaN;
    }
  });

  return (
    <div>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold">Build the model</h2>
        <p className="text-xs text-muted">
          {company.company} ({company.exchange}: {company.ticker})
        </p>
      </div>

      <div className="mt-4">
        <DcfFlowDiagram active={activeFlowStep} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[22rem_1fr]">
        <div
          className="space-y-6 rounded-2xl p-5 ring-1 ring-border"
          style={{
            backgroundImage:
              "linear-gradient(rgba(107,110,119,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(107,110,119,0.08) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
            backgroundColor: "var(--card)",
          }}
        >
          <div onFocus={() => setActiveFlowStep("revenue")}>
            <AssumptionInput
              id="revenueGrowth"
              label="Revenue growth (yrs 1-5)"
              value={assumptions.revenueGrowth}
              onChange={(v) => update("revenueGrowth", v)}
              min={0}
              max={0.4}
              step={0.005}
              format={formatPercent}
              explanation="How much revenue grows each year for the next five years. Small changes add up: 8% a year is 47% more revenue by year 5, 10% a year is 61% more."
              diagram={<TimeValueIllustration className="h-16 w-32" />}
              historicalValue={undefined}
            />
          </div>

          <div onFocus={() => setActiveFlowStep("margins")}>
            <AssumptionInput
              id="ebitdaMargin"
              label="EBITDA margin"
              value={assumptions.ebitdaMargin}
              onChange={(v) => update("ebitdaMargin", v)}
              min={0}
              max={0.5}
              step={0.005}
              format={formatPercent}
              explanation="EBITDA as a share of revenue: profit before interest, tax, depreciation and amortization. Start from the company's recent margin, shown below."
              historicalValue={company.ebitdaMargin}
              warning={marginWarning}
            />
          </div>

          <div onFocus={() => setActiveFlowStep("margins")}>
            <AssumptionInput
              id="taxRate"
              label="Tax rate"
              value={assumptions.taxRate}
              onChange={(v) => update("taxRate", v)}
              min={0}
              max={0.4}
              step={0.005}
              format={formatPercent}
              explanation="The share of operating profit (EBIT) paid in tax. What is left is NOPAT."
              historicalValue={company.taxRate}
            />
          </div>

          <div onFocus={() => setActiveFlowStep("fcf")}>
            <AssumptionInput
              id="daPct"
              label="D&A, % of revenue"
              value={assumptions.daPct}
              onChange={(v) => update("daPct", v)}
              min={0}
              max={0.15}
              step={0.0025}
              format={formatPercent}
              explanation="Depreciation and amortization. It lowers taxable profit, but no cash leaves the business, so you add it back when working out free cash flow."
              historicalValue={company.daPct}
            />
          </div>

          <div onFocus={() => setActiveFlowStep("fcf")}>
            <AssumptionInput
              id="capexPct"
              label="Capex, % of revenue"
              value={assumptions.capexPct}
              onChange={(v) => update("capexPct", v)}
              min={0}
              max={0.2}
              step={0.0025}
              format={formatPercent}
              explanation="Money spent on equipment, buildings and software to keep the business running and growing. It comes straight out of free cash flow."
              historicalValue={company.capexPct}
            />
          </div>

          <div onFocus={() => setActiveFlowStep("fcf")}>
            <AssumptionInput
              id="nwcPct"
              label="Change in NWC, % of Δrevenue"
              value={assumptions.nwcPct}
              onChange={(v) => update("nwcPct", v)}
              min={0}
              max={0.2}
              step={0.0025}
              format={formatPercent}
              explanation="A growing business ties up more cash in stock and in money customers still owe it. This is that extra cash, as a share of each year's revenue increase."
              historicalValue={company.nwcPct}
            />
          </div>

          <div onFocus={() => setActiveFlowStep("discount")}>
            <AssumptionInput
              id="wacc"
              label="WACC"
              value={assumptions.wacc}
              onChange={(v) => update("wacc", v)}
              min={0.04}
              max={0.22}
              step={0.0025}
              format={formatPercent}
              explanation="The return investors expect for the risk of owning this business. Each future year's cash is divided down by this rate, so a higher WACC gives a lower price."
              diagram={<WaccBlendIllustration className="h-16 w-32" />}
              historicalValue={undefined}
            />
          </div>

          <div onFocus={() => setActiveFlowStep("terminal")}>
            <AssumptionInput
              id="terminalGrowth"
              label="Terminal growth"
              value={assumptions.terminalGrowth}
              onChange={(v) => update("terminalGrowth", v)}
              min={0}
              max={0.08}
              step={0.0025}
              format={formatPercent}
              explanation="How fast cash flow grows each year after year 5, forever. Most analysts keep it near long-run GDP growth: about 2-3% for the US and 5% for India."
              diagram={<TerminalValueIllustration className="h-16 w-32" />}
              historicalValue={undefined}
              error={terminalGuard.valid ? undefined : terminalGuard.message}
              warning={tvWarning.warn ? tvWarning.message : undefined}
            />
          </div>
        </div>

        <div className="space-y-6">
          {result ? (
            <>
              <div className="rounded-2xl bg-card p-5 ring-1 ring-border" onMouseEnter={() => setActiveFlowStep("bridge")}>
                <p className="text-xs font-medium uppercase tracking-wide text-muted">Implied price</p>
                <p className="mt-1 text-4xl font-semibold tabular-nums">{perShare(result.impliedValuePerShare)}</p>
                {company.dataPending && (
                  <p className="mt-2 text-xs text-amber-700 dark:text-amber-500">
                    Built on illustrative company data, not real financials.
                  </p>
                )}
              </div>

              <div className="rounded-2xl bg-card p-5 ring-1 ring-border" onMouseEnter={() => setActiveFlowStep("fcf")}>
                <p className="text-sm font-medium">5-year free cash flow</p>
                <div className="mt-3">
                  <FcfTable
                    revenue={result.revenue}
                    ebitda={result.ebitda}
                    ebit={result.ebit}
                    ufcf={result.ufcf}
                    presentValuesOfFcf={result.presentValuesOfFcf}
                    valueFormatter={money}
                  />
                </div>
              </div>

              <div className="rounded-2xl bg-card p-5 ring-1 ring-border" onMouseEnter={() => setActiveFlowStep("bridge")}>
                <p className="text-sm font-medium">Enterprise value to equity value</p>
                <div className="mt-3">
                  <WaterfallChart
                    valueFormatter={money}
                    steps={[
                      { label: "PV of FCFs", value: result.presentValuesOfFcf.reduce((a, b) => a + b, 0) },
                      { label: "PV of terminal value", value: result.presentValueOfTerminalValue },
                      { label: "Enterprise value", value: result.enterpriseValue, isTotal: true },
                      { label: company.netDebt < 0 ? "Plus net cash" : "Less net debt", value: -company.netDebt },
                      { label: "Equity value", value: result.equityValue, isTotal: true },
                    ]}
                  />
                </div>
              </div>

              <div className="rounded-2xl bg-card p-5 ring-1 ring-border" onMouseEnter={() => setActiveFlowStep("terminal")}>
                <p className="text-sm font-medium">Sensitivity: WACC × terminal growth</p>
                <p className="text-xs text-muted">Implied price per share for nearby combinations.</p>
                <div className="mt-3">
                  <SensitivityHeatmap
                    waccValues={sensitivityRows}
                    terminalGrowthValues={sensitivityCols}
                    table={sensitivityTable}
                    userWacc={assumptions.wacc}
                    userTerminalGrowth={assumptions.terminalGrowth}
                    valueFormatter={perShare}
                    percentFormatter={formatPercent}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => onContinue(assumptions)}
                  className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white"
                >
                  See the results
                </button>
              </div>
            </>
          ) : (
            <div className="rounded-2xl bg-card p-5 text-sm text-series-down ring-1 ring-border">
              {terminalGuard.message ?? "These numbers don't give a valid price. Check that terminal growth is below WACC."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
