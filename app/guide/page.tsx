import { PageHeader } from "@/components/page-header";
import { Todo } from "@/components/todo";

const STEPS = [
  "Setup & conventions",
  "Historicals",
  "Assumptions",
  "Revenue build",
  "Income statement to EBIT",
  "Unlevered free cash flow",
  "WACC",
  "Discounting (mid-year)",
  "Terminal value (Gordon + exit multiple)",
  "EV-to-equity bridge",
  "Sensitivity tables",
  "Checks",
];

export default function GuidePage() {
  return (
    <div>
      <PageHeader
        title="Guide"
        description="A step-by-step build of a full DCF model, each step with a worked numeric example and a downloadable Excel."
      />
      <div className="mx-auto max-w-5xl px-4 pb-16">
        <ol className="space-y-2">
          {STEPS.map((step, i) => (
            <li
              key={step}
              className="flex items-center gap-3 rounded-md border border-border bg-card px-4 py-3"
            >
              <span className="font-mono text-sm text-muted">{String(i + 1).padStart(2, "0")}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <div className="mt-6">
          <Todo>
            Each step becomes its own MDX sub-page with a worked example and downloadable .xlsx (build phase 2).
          </Todo>
        </div>
      </div>
    </div>
  );
}
