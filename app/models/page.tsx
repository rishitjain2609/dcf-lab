import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { getModels } from "@/lib/data";
import { formatPercent, formatRupees } from "@/lib/format";
import { percentGap } from "@/lib/dcf";

export default function ModelsPage() {
  const models = getModels();

  return (
    <div>
      <PageHeader
        title="Models"
        description="Two full DCFs on real Indian listed companies — assumptions, implied value vs. market price, and version history. Currently sample data; the real models will replace these."
      />
      <div className="mx-auto max-w-5xl px-4 pb-16">
        <div className="grid gap-4 sm:grid-cols-2">
          {models.map((model) => {
            const gap = percentGap(model.impliedValuePerShare, model.latestPrice);
            return (
              <Link
                key={model.slug}
                href={`/models/${model.slug}`}
                className="group rounded-lg border border-border bg-card p-5 transition hover:border-accent"
              >
                <p className="font-mono text-xs text-muted">{model.ticker}</p>
                <h2 className="mt-1 font-medium group-hover:text-accent">{model.company}</h2>
                <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <dt className="text-muted">Implied value</dt>
                    <dd className="font-mono">{formatRupees(model.impliedValuePerShare)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Latest vs. implied</dt>
                    <dd className={`font-mono ${gap >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                      {formatPercent(gap)}
                    </dd>
                  </div>
                </dl>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
