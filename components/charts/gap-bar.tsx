/** A small horizontal diverging bar: fills right (emerald) if positive, left (rose) if negative. */
export function GapBar({ value, maxAbs = 0.5 }: { value: number; maxAbs?: number }) {
  const clamped = Math.max(-maxAbs, Math.min(maxAbs, value));
  const widthPct = (Math.abs(clamped) / maxAbs) * 50;
  const isPositive = value >= 0;

  return (
    <div className="relative h-2 w-20 overflow-hidden rounded-full bg-foreground/10">
      <div className="absolute left-1/2 top-0 h-full w-px bg-foreground/30" />
      <div
        className={`absolute top-0 h-full ${isPositive ? "bg-emerald-500" : "bg-rose-500"}`}
        style={
          isPositive
            ? { left: "50%", width: `${widthPct}%` }
            : { right: "50%", width: `${widthPct}%` }
        }
      />
    </div>
  );
}
