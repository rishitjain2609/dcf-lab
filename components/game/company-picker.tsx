"use client";

import { motion } from "motion/react";
import type { GameCompany } from "@/lib/game";
import { formatCrore } from "@/lib/format";

const TINTS = [
  "bg-sky-50 dark:bg-sky-950/40",
  "bg-amber-50 dark:bg-amber-950/40",
  "bg-rose-50 dark:bg-rose-950/40",
];

export function CompanyPicker({
  companies,
  onPick,
}: {
  companies: GameCompany[];
  onPick: (company: GameCompany) => void;
}) {
  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold italic">Pick a company</h2>
      <p className="mt-1 text-sm text-foreground/60">
        Sample companies for now. Real ones land once this is wired to real data.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {companies.map((company, i) => (
          <motion.button
            key={company.slug}
            type="button"
            onClick={() => onPick(company)}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`rounded-3xl p-5 text-left ${TINTS[i % TINTS.length]}`}
          >
            <p className="font-mono text-xs text-foreground/60">{company.ticker}</p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-xl font-semibold">{company.company}</p>
            <p className="mt-1 text-sm text-foreground/60">{company.sector}</p>
            <p className="mt-3 text-sm">
              Last FY revenue <span className="font-mono">{formatCrore(company.lastFYRevenue)}</span>
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
