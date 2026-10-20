/**
 * The site's one motif: the discount curve, drawn as bars. Each bar is what a
 * fixed future payment is worth today, so the row shrinks year by year at the
 * discount rate. It shows up at every scale: cropped huge in the hero, as the
 * interactive chart, as the stepped top edge that masks every photograph, as
 * the footer mark, and as the small bullet beside the wordmark.
 */

export function discountFactors(rate: number, years: number): number[] {
  return Array.from({ length: years }, (_, i) => 1 / Math.pow(1 + rate, i + 1));
}

/**
 * A clip-path whose top edge steps down left to right, like the tops of a row
 * of discounted bars. Used to mask photographs so they carry the motif.
 */
export function stepClip(steps = 5, drop = 0.06): string {
  const points: string[] = ["0% 0%"];
  for (let i = 1; i <= steps; i++) {
    const x = ((i / steps) * 100).toFixed(2);
    const yPrev = (((i - 1) * drop) * 100).toFixed(2);
    const y = ((i * drop) * 100).toFixed(2);
    points.push(`${x}% ${yPrev}%`);
    if (i < steps) points.push(`${x}% ${y}%`);
  }
  points.push("100% 100%", "0% 100%");
  return `polygon(${points.join(", ")})`;
}

/** Bars that shrink at `rate`, bottoms on one line, filling their box. */
export function MotifBars({
  rate = 0.15,
  count = 8,
  gap = 8,
  className = "",
  barClassName = "bg-accent",
  animate = false,
}: {
  rate?: number;
  count?: number;
  gap?: number;
  className?: string;
  barClassName?: string;
  /** Grow each bar up from the baseline when it scrolls into view. */
  animate?: boolean;
}) {
  const factors = discountFactors(rate, count);
  const max = factors[0];
  return (
    <div aria-hidden className={`flex items-end ${className}`} style={{ gap }} data-rise-group={animate ? "" : undefined}>
      {factors.map((f, i) => (
        <div
          key={i}
          className={`flex-1 ${barClassName} ${animate ? "bar-grow" : ""}`}
          style={{ height: `${(f / max) * 100}%`, ["--i" as string]: i }}
        />
      ))}
    </div>
  );
}

/** Three small descending bars, sized to sit inline with text. */
export function StepMark({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 15 12" className={`inline-block h-[0.8em] w-auto ${className}`} fill="currentColor">
      <rect x="0" y="0" width="4" height="12" />
      <rect x="5.5" y="3" width="4" height="9" />
      <rect x="11" y="5.5" width="4" height="6.5" />
    </svg>
  );
}
