"use client";

import { useState, type ReactNode } from "react";
import { Info } from "lucide-react";

export interface AssumptionInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  explanation: string;
  diagram?: ReactNode;
  historicalValue?: number;
  /** Omitted until the community layer has real published models to compute a median from. */
  communityMedian?: number;
  error?: string;
  warning?: string;
}

export function AssumptionInput({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step,
  format,
  explanation,
  diagram,
  historicalValue,
  communityMedian,
  error,
  warning,
}: AssumptionInputProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={`${id}-popover`}
            aria-label={`What is ${label.toLowerCase()}?`}
            className="flex h-5 w-5 items-center justify-center rounded-full text-muted hover:bg-foreground/10 hover:text-foreground"
          >
            <Info className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <input
            type="number"
            value={Number((value * 100).toFixed(2))}
            step={step * 100}
            onChange={(e) => onChange(Number(e.target.value) / 100)}
            aria-label={`${label}, percent`}
            className="w-20 rounded-md bg-background px-2 py-1 text-right text-sm tabular-nums ring-1 ring-border focus:ring-accent"
          />
        </div>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-[var(--accent)]"
      />
      <div className="mt-1 flex items-center justify-between text-xs text-muted">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
      {error && <p className="mt-1 text-sm text-series-down">{error}</p>}
      {!error && warning && <p className="mt-1 text-sm text-amber-700 dark:text-amber-500">{warning}</p>}

      {open && (
        <div
          id={`${id}-popover`}
          role="note"
          className="absolute left-0 right-0 top-full z-20 mt-2 rounded-xl bg-card p-4 text-sm shadow-lg ring-1 ring-border"
        >
          <p className="text-foreground/90">{explanation}</p>
          {diagram && <div className="mt-3 flex justify-center">{diagram}</div>}
          <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3 text-xs">
            <div>
              <dt className="text-muted">This company&apos;s history</dt>
              <dd className="tabular-nums">{historicalValue !== undefined ? format(historicalValue) : "Not available yet"}</dd>
            </div>
            <div>
              <dt className="text-muted">Community median</dt>
              <dd className="tabular-nums">
                {communityMedian !== undefined ? format(communityMedian) : "No published models yet"}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
