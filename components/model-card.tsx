"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { GapBar } from "@/components/charts/gap-bar";
import { formatPercent, formatRupees } from "@/lib/format";

export function ModelCard({
  slug,
  ticker,
  company,
  impliedValuePerShare,
  gap,
}: {
  slug: string;
  ticker: string;
  company: string;
  impliedValuePerShare: number;
  gap: number;
}) {
  return (
    <Link href={`/models/${slug}`} className="block">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent"
      >
        <p className="font-mono text-xs text-muted">{ticker}</p>
        <h2 className="mt-1 font-medium group-hover:text-accent">{company}</h2>
        <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div>
            <dt className="text-muted">Implied value</dt>
            <dd className="font-mono">{formatRupees(impliedValuePerShare)}</dd>
          </div>
          <div>
            <dt className="text-muted">Latest vs. implied</dt>
            <dd className={`font-mono ${gap >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
              {formatPercent(gap)}
            </dd>
          </div>
        </dl>
        <div className="mt-3">
          <GapBar value={gap} />
        </div>
      </motion.div>
    </Link>
  );
}
