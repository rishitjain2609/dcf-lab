"use client";

import { motion } from "motion/react";

const USES = [
  {
    label: "Equity research",
    tint: "bg-violet-50 dark:bg-violet-950/40",
    text: "Analysts build a DCF to publish an implied value and justify a rating on a stock.",
  },
  {
    label: "M&A",
    tint: "bg-sky-50 dark:bg-sky-950/40",
    text: "The buyer runs a DCF to sanity-check the price against what the target can actually generate.",
  },
  {
    label: "Private equity",
    tint: "bg-amber-50 dark:bg-amber-950/40",
    text: "A PE firm underwrites a deal against a hold period and an assumed exit, running the DCF in reverse.",
  },
  {
    label: "IPO pricing",
    tint: "bg-rose-50 dark:bg-rose-950/40",
    text: "Bankers and the company triangulate a price range partly off a DCF, alongside comparables.",
  },
];

export function UsesGrid() {
  return (
    <div className="my-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {USES.map((u) => (
        <motion.div
          key={u.label}
          whileHover={{ y: -3 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`rounded-2xl p-5 ${u.tint}`}
        >
          <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold">{u.label}</h3>
          <p className="mt-1.5 text-sm text-foreground/70">{u.text}</p>
        </motion.div>
      ))}
    </div>
  );
}

const LIMITS = [
  {
    stat: "70%",
    text: "of a typical DCF's value often comes from one growth assumption about everything after the forecast window, not the carefully built years in between.",
  },
  {
    stat: "30%",
    text: "is roughly how much a 2-point change in the discount rate can move the implied value, with zero change to any actual business assumption.",
  },
  {
    stat: "any price",
    text: "can be justified if assumptions get picked after deciding what answer you want, instead of before.",
  },
];

export function LimitsBand() {
  return (
    <div className="my-8 rounded-3xl bg-rose-950 p-8 text-rose-50 sm:p-10">
      <p className="font-mono text-xs font-semibold tracking-[0.2em] text-rose-300">THE HONEST LIMITS</p>
      <div className="mt-6 space-y-6">
        {LIMITS.map((l) => (
          <div key={l.stat} className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
            <p className="font-[family-name:var(--font-display)] w-32 flex-shrink-0 text-4xl font-semibold italic text-rose-300">
              {l.stat}
            </p>
            <p className="text-rose-100/90">{l.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
