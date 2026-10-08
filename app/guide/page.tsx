import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { GUIDE_STEPS } from "@/lib/guide-steps";

export default function GuidePage() {
  return (
    <div>
      <PageHeader
        title="Guide"
        description="A step-by-step build of a full DCF model, each step with a worked numeric example."
        accentClassName="bg-indigo-500"
      />
      <div className="mx-auto max-w-5xl px-4 pb-16">
        <ol className="space-y-2">
          {GUIDE_STEPS.map((step, i) => (
            <li key={step.slug}>
              <Link
                href={`/guide/${step.slug}`}
                className="group flex items-center gap-3 rounded-md border border-border bg-card px-4 py-3 transition hover:border-accent"
              >
                <span className="font-mono text-sm text-muted">{String(i + 1).padStart(2, "0")}</span>
                <span className="group-hover:text-accent">{step.title}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
