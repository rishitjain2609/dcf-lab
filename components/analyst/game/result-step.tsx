"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { GameCompany, GameResult, TornadoRow } from "@/lib/game";
import { formatMoneyPerShare, formatPercent } from "@/lib/format";
import { CHART_COLORS } from "@/components/analyst/chart-theme";
import { FootballField, type FootballFieldRow } from "@/components/analyst/charts/football-field";
import { TornadoChart } from "@/components/analyst/charts/tornado-chart";

export function ResultStep({
  company,
  result,
  tornado,
  onContinue,
}: {
  company: GameCompany;
  result: GameResult;
  tornado: TornadoRow[];
  onContinue: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const perShare = (v: number) => formatMoneyPerShare(v, company.currency);

  const rows: FootballFieldRow[] = [
    { label: "You", value: result.user.impliedValuePerShare, color: CHART_COLORS.user },
    { label: "Market", value: result.marketPricePerShare, color: CHART_COLORS.market },
    { label: "Reference", value: result.reference.impliedValuePerShare, color: CHART_COLORS.reference },
  ];

  function copyLink() {
    if (typeof window === "undefined") return;
    navigator.clipboard?.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div>
      <h2 className="text-xl font-semibold">Your results</h2>
      <p className="mt-1 text-sm text-muted">
        {company.company} ({company.exchange}: {company.ticker})
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-card p-5 ring-1 ring-border">
          <div className="flex items-baseline justify-between">
            <p className="text-sm font-medium">Your price vs. everyone else</p>
            <p
              className={`text-sm font-medium tabular-nums ${result.errorVsMarket >= 0 ? "text-series-up" : "text-series-down"}`}
            >
              {formatPercent(result.errorVsMarket)} vs. market
            </p>
          </div>
          <div className="mt-3">
            <FootballField rows={rows} valueFormatter={perShare} />
          </div>
        </div>

        <div className="rounded-2xl bg-card p-5 ring-1 ring-border">
          <p className="text-sm font-medium">What drove the gap</p>
          <p className="text-xs text-muted">Each assumption swapped in on its own, others held at the reference.</p>
          <div className="mt-3">
            <TornadoChart rows={tornado} valueFormatter={perShare} />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-card p-5 ring-1 ring-border">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-muted">Your implied price</p>
            <p className="text-3xl font-semibold tabular-nums">{perShare(result.user.impliedValuePerShare)}</p>
          </div>
          <button
            type="button"
            onClick={copyLink}
            className="flex items-center gap-2 rounded-full bg-foreground/10 px-4 py-2 text-sm font-medium hover:bg-foreground/15"
          >
            {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
            {copied ? "Copied" : "Copy link to this result"}
          </button>
        </div>
      </div>

      {result.driverNotes.length > 0 && (
        <div className="mt-6 space-y-3">
          {result.driverNotes.map((note) => (
            <div key={note.factor} className="rounded-xl bg-foreground/5 p-4 text-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">{note.factor}</p>
              <p className="mt-1">{note.message}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button type="button" onClick={onContinue} className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white">
          Continue to the final quiz
        </button>
      </div>
    </div>
  );
}
