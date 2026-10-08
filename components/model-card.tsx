"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { GapBar } from "@/components/charts/gap-bar";
import { formatPercent, formatRupees } from "@/lib/format";

const TINTS = ["bg-emerald-50 dark:bg-emerald-950/40", "bg-teal-50 dark:bg-teal-950/40"];

export function ModelCard({
  slug,
  ticker,
  company,
  impliedValuePerShare,
  gap,
  index = 0,
}: {
  slug: string;
  ticker: string;
  company: string;
  impliedValuePerShare: number;
  gap: number;
  index?: number;
}) {
  return (
    <Link href={`/models/${slug}`} className="block">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`rounded-3xl p-6 ${TINTS[index % TINTS.length]}`}
      >
        <p className="font-mono text-xs text-foreground/60">{ticker}</p>
        <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-semibold">{company}</h2>
        <dl className="mt-5 grid grid-cols-2 gap-2 text-sm">
          <div>
            <dt className="text-foreground/60">Implied value</dt>
            <dd className="font-mono text-lg">{formatRupees(impliedValuePerShare)}</dd>
          </div>
          <div>
            <dt className="text-foreground/60">Latest vs. implied</dt>
            <dd className={`font-mono text-lg ${gap >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
              {formatPercent(gap)}
            </dd>
          </div>
        </dl>
        <div className="mt-4">
          <GapBar value={gap} />
        </div>
      </motion.div>
    </Link>
  );
}
