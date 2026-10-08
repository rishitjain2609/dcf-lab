"use client";

import { useState } from "react";
import type { GameCompany, GameAssumptions } from "@/lib/game";
import { validateTerminalGrowth } from "@/lib/dcf";
import { Slider } from "./slider";

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

export function AssumptionForm({
  company,
  onReveal,
}: {
  company: GameCompany;
  onReveal: (assumptions: GameAssumptions) => void;
}) {
  const [assumptions, setAssumptions] = useState<GameAssumptions>({
    revenueGrowth: 0.1,
    ebitdaMargin: company.ebitdaMargin,
    capexPct: company.capexPct,
    wacc: 0.12,
    terminalGrowth: 0.04,
  });

  const guard = validateTerminalGrowth(assumptions.terminalGrowth, assumptions.wacc);

  function update<K extends keyof GameAssumptions>(key: K, value: number) {
    setAssumptions((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div>
      <h2 className="text-lg font-medium">Set your assumptions</h2>
      <p className="mt-1 text-sm text-muted">
        {company.company} ({company.ticker}). Last FY revenue carried forward 5 years at the
        growth rate you choose below.
      </p>

      <div className="mt-6 space-y-6 rounded-lg border border-border bg-card p-5">
        <Slider
          label="Revenue growth (flat, Years 1–5)"
          value={assumptions.revenueGrowth}
          onChange={(v) => update("revenueGrowth", v)}
          min={0}
          max={0.25}
          step={0.01}
          formatValue={pct}
        />
        <Slider
          label="EBITDA margin"
          value={assumptions.ebitdaMargin}
          onChange={(v) => update("ebitdaMargin", v)}
          min={0.05}
          max={0.4}
          step={0.01}
          formatValue={pct}
        />
        <Slider
          label="Capex, % of revenue"
          value={assumptions.capexPct}
          onChange={(v) => update("capexPct", v)}
          min={0.01}
          max={0.15}
          step={0.005}
          formatValue={pct}
        />
        <Slider
          label="WACC"
          value={assumptions.wacc}
          onChange={(v) => update("wacc", v)}
          min={0.05}
          max={0.2}
          step={0.001}
          formatValue={pct}
        />
        <Slider
          label="Terminal growth"
          value={assumptions.terminalGrowth}
          onChange={(v) => update("terminalGrowth", v)}
          min={0}
          max={0.08}
          step={0.001}
          formatValue={pct}
          error={guard.valid ? undefined : guard.message}
        />

        <div className="flex justify-end">
          <button
            type="button"
            disabled={!guard.valid}
            onClick={() => onReveal(assumptions)}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-40 dark:text-background"
          >
            Reveal
          </button>
        </div>
      </div>
    </div>
  );
}
