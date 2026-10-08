"use client";

export function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  formatValue,
  error,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  formatValue: (value: number) => string;
  error?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium">{label}</label>
        <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 font-mono text-sm text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
          {formatValue(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-indigo-600"
      />
      {error && <p className="mt-1 text-sm text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  );
}
