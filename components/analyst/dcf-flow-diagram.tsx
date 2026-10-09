export type DcfFlowStep = "revenue" | "margins" | "fcf" | "discount" | "terminal" | "bridge";

const STEPS: { key: DcfFlowStep; label: string }[] = [
  { key: "revenue", label: "Revenue" },
  { key: "margins", label: "Margins" },
  { key: "fcf", label: "FCF" },
  { key: "discount", label: "Discount" },
  { key: "terminal", label: "Terminal" },
  { key: "bridge", label: "Price" },
];

export function DcfFlowDiagram({ active }: { active: DcfFlowStep | null }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto rounded-xl bg-foreground/5 px-3 py-2 text-xs" role="img" aria-label="How a DCF fits together, from revenue to implied price">
      {STEPS.map((step, i) => (
        <div key={step.key} className="flex flex-shrink-0 items-center gap-1">
          <span
            className={`rounded-full px-2.5 py-1 font-medium transition-colors ${
              active === step.key ? "bg-accent text-white" : "text-muted"
            }`}
          >
            {step.label}
          </span>
          {i < STEPS.length - 1 && <span className="text-muted">→</span>}
        </div>
      ))}
    </div>
  );
}
