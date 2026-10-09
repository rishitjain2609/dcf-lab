"use client";

import type { GameCompany } from "@/lib/game";
import { formatMoneyLarge } from "@/lib/format";
import { Sparkline } from "@/components/analyst/charts/sparkline";

export function CompanyPickerStep({
  companies,
  onPick,
}: {
  companies: GameCompany[];
  onPick: (company: GameCompany) => void;
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold">Pick a company</h2>
      <p className="mt-1 text-sm text-muted">Real, listed companies across a few different sectors.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {companies.map((company) => (
          <button
            key={company.slug}
            type="button"
            onClick={() => onPick(company)}
            className="flex flex-col gap-3 rounded-2xl bg-card p-5 text-left ring-1 ring-border transition hover:ring-accent"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-xs text-muted">
                  {company.exchange} · {company.ticker}
                </p>
                <p className="mt-1 font-semibold">{company.company}</p>
                <p className="text-xs text-muted">{company.sector}</p>
              </div>
              <Sparkline values={company.revenueHistory} />
            </div>

            <dl className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <dt className="text-xs text-muted">Last FY revenue</dt>
                <dd className="tabular-nums">{formatMoneyLarge(company.lastFYRevenue, company.currency)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Community DCFs</dt>
                <dd className="tabular-nums">0</dd>
              </div>
            </dl>

            <div className="flex items-center justify-between text-xs">
              {company.dataPending ? (
                <span className="rounded-full bg-amber-500/15 px-2 py-0.5 font-medium text-amber-700 dark:text-amber-400">
                  Illustrative data, not real financials
                </span>
              ) : (
                <span className="text-muted">As of {company.snapshotDate}</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
