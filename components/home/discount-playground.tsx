"use client";

import { useId, useState } from "react";
import { discountCashFlows } from "@/lib/dcf";
import { formatIndianNumber } from "@/lib/format";

const YEARS = 10;
const PAYMENT = 100;

/**
 * The homepage's one live thing: ₹100 a year for ten years, each payment
 * divided by (1 + r) once per year of waiting. Dragging r reshapes the motif
 * bars and the total. Server-renders at 10% so it reads fine without script.
 */
export function DiscountPlayground() {
  const [ratePct, setRatePct] = useState(10);
  const sliderId = useId();
  const { presentValues, sum } = discountCashFlows(Array(YEARS).fill(PAYMENT), ratePct / 100);

  return (
    <div>
      <p className="t-body max-w-[60ch]">
        Say a company will pay you ₹100 at the end of every year for ten years. Money you wait for is worth
        less than money in hand, so each payment is divided by (1 + r) once for every year you wait. That r is
        the discount rate.
      </p>

      <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
        <div className="lg:col-span-4 lg:pb-10">
          <p className="t-head ui tabular-nums">₹{formatIndianNumber(sum)}</p>
          <p className="t-body mt-3 max-w-[30ch]">
            is what ₹{formatIndianNumber(PAYMENT * YEARS)}, paid over ten years, is worth today.
          </p>

          <label htmlFor={sliderId} className="t-body ui mt-10 block font-bold">
            Discount rate: {ratePct.toFixed(1)}%
          </label>
          <input
            id={sliderId}
            type="range"
            min={2}
            max={25}
            step={0.5}
            value={ratePct}
            onChange={(e) => setRatePct(Number(e.target.value))}
            className="mt-4 h-11 w-full cursor-pointer accent-[var(--accent)]"
          />
        </div>

        <figure className="lg:col-span-8" data-ui>
          <div className="flex h-[46svh] min-h-72 items-end gap-1.5 sm:gap-2" role="img" aria-label={`Bar chart of the present value of ₹100 received in each of years 1 to 10 at a ${ratePct}% discount rate, shrinking from ₹${presentValues[0].toFixed(0)} to ₹${presentValues[YEARS - 1].toFixed(0)}`}>
            {presentValues.map((pv, i) => (
              <div key={i} className="flex h-full flex-1 flex-col justify-end">
                <span className="t-small ui mb-2 text-center font-bold tabular-nums">
                  {pv.toFixed(0)}
                </span>
                <div
                  className="w-full bg-accent transition-[height] duration-300 ease-out"
                  style={{ height: `${(pv / PAYMENT) * 100}%` }}
                />
              </div>
            ))}
          </div>
          <figcaption className="t-small ui mt-3 flex gap-1.5 text-muted sm:gap-2">
            {presentValues.map((_, i) => (
              <span key={i} className="flex-1 text-center tabular-nums">
                Y{i + 1}
              </span>
            ))}
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
