"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { presentValue } from "@/lib/dcf";
import { formatPercent } from "@/lib/format";

const FUTURE_CASH_FLOWS = [100, 110, 121, 133, 146];
const MAX_CASH_FLOW = FUTURE_CASH_FLOWS[FUTURE_CASH_FLOWS.length - 1];

export function MiniDcfHero() {
  const [wacc, setWacc] = useState(0.1);

  const presentValues = useMemo(
    () => FUTURE_CASH_FLOWS.map((cf, i) => presentValue(cf, wacc, i + 1)),
    [wacc]
  );
  const totalValueToday = presentValues.reduce((a, b) => a + b, 0);

  return (
    <div className="rounded-2xl bg-card p-6 ring-1 ring-border sm:p-8">
      <p className="text-sm text-muted">Five years of future cash, discounted back to today</p>
      <div className="mt-6 flex h-40 gap-3 sm:h-48">
        {FUTURE_CASH_FLOWS.map((cf, i) => {
          const pv = presentValues[i];
          const futureHeightPct = (cf / MAX_CASH_FLOW) * 100;
          const pvHeightPct = (pv / MAX_CASH_FLOW) * 100;
          return (
            <div key={i} className="flex h-full flex-1 flex-col items-center gap-1">
              <div className="relative w-full flex-1">
                <div
                  className="absolute bottom-0 w-full rounded-t bg-foreground/10"
                  style={{ height: `${futureHeightPct}%` }}
                  aria-hidden="true"
                />
                <motion.div
                  className="absolute bottom-0 w-full rounded-t bg-series-user"
                  initial={false}
                  animate={{ height: `${pvHeightPct}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 18 }}
                />
              </div>
              <span className="flex-shrink-0 text-xs tabular-nums text-muted">Yr {i + 1}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <label htmlFor="hero-wacc" className="text-sm font-medium">
            WACC: <span className="tabular-nums">{formatPercent(wacc).replace("+", "")}</span>
          </label>
          <input
            id="hero-wacc"
            type="range"
            min={0.05}
            max={0.18}
            step={0.005}
            value={wacc}
            onChange={(e) => setWacc(Number(e.target.value))}
            className="mt-1 w-full accent-[var(--accent)] sm:w-56"
          />
        </div>
        <div className="text-right">
          <p className="text-sm text-muted">Value today</p>
          <motion.p
            key={Math.round(totalValueToday)}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            className="text-3xl font-semibold tabular-nums"
          >
            {totalValueToday.toFixed(0)}
          </motion.p>
        </div>
      </div>
    </div>
  );
}
