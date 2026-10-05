"use client";

import type { GameCompany } from "@/lib/game";
import { formatCrore } from "@/lib/format";

export function CompanyPicker({
  companies,
  onPick,
}: {
  companies: GameCompany[];
  onPick: (company: GameCompany) => void;
}) {
  return (
    <div>
      <h2 className="text-lg font-medium">Pick a company</h2>
      <p className="mt-1 text-sm text-muted">
        Sample companies for now — real ones land once this is wired to real data.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {companies.map((company) => (
          <button
            key={company.slug}
            type="button"
            onClick={() => onPick(company)}
            className="rounded-lg border border-border bg-card p-4 text-left transition hover:border-accent"
          >
            <p className="font-mono text-xs text-muted">{company.ticker}</p>
            <p className="mt-1 font-medium">{company.company}</p>
            <p className="mt-1 text-sm text-muted">{company.sector}</p>
            <p className="mt-3 text-sm">
              Last FY revenue <span className="font-mono">{formatCrore(company.lastFYRevenue)}</span>
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
