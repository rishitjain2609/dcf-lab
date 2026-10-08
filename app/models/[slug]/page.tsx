import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Todo } from "@/components/todo";
import { getModel, getModels } from "@/lib/data";
import { formatPercent, formatRupees } from "@/lib/format";
import { percentGap } from "@/lib/dcf";
import { BarChart } from "@/components/charts/bar-chart";

export function generateStaticParams() {
  return getModels().map((model) => ({ slug: model.slug }));
}

export default async function ModelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const model = getModel(slug);
  if (!model) {
    notFound();
  }

  const gapAtPublish = percentGap(model.impliedValuePerShare, model.priceAtPublish);
  const gapNow = percentGap(model.impliedValuePerShare, model.latestPrice);

  return (
    <div>
      <PageHeader title={model.company} description={`${model.ticker} · ${model.sector}`} accentClassName="bg-emerald-500" />
      <div className="mx-auto max-w-5xl space-y-10 px-4 pb-16">
        <Link href="/models" className="text-sm text-muted hover:text-accent">
          ← Back to all models
        </Link>
        <section>
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted">Summary</h2>
          <Todo>{model.summary}</Todo>
        </section>

        <section>
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted">Key assumptions</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {model.assumptions.map((row, i) => (
              <div
                key={row.label}
                className={`flex items-baseline justify-between rounded-2xl px-4 py-3 ${
                  i % 2 === 0 ? "bg-foreground/5" : "bg-emerald-50 dark:bg-emerald-950/30"
                }`}
              >
                <span className="text-sm text-foreground/60">{row.label}</span>
                <span className="font-mono text-sm font-medium">{row.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted">
            Implied value vs. price
          </h2>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row">
            <div className="rounded-3xl bg-emerald-50 p-6 dark:bg-emerald-950/40 sm:w-72">
              <p className="text-sm text-foreground/60">Implied value</p>
              <p className="mt-1 font-[family-name:var(--font-display)] text-5xl font-semibold italic text-emerald-700 dark:text-emerald-400">
                {formatRupees(model.impliedValuePerShare)}
              </p>
            </div>
            <div className="flex flex-1 gap-4">
              <div className="flex-1 rounded-3xl bg-foreground/5 p-5">
                <p className="text-sm text-foreground/60">Price on publish ({model.publishDate})</p>
                <p className="mt-1 font-mono text-xl">{formatRupees(model.priceAtPublish)}</p>
                <p className="mt-1 font-mono text-sm text-foreground/60">{formatPercent(gapAtPublish)} vs. implied</p>
              </div>
              <div className="flex-1 rounded-3xl bg-foreground/5 p-5">
                <p className="text-sm text-foreground/60">Latest price</p>
                <p className="mt-1 font-mono text-xl">{formatRupees(model.latestPrice)}</p>
                <p className="mt-1 font-mono text-sm text-foreground/60">{formatPercent(gapNow)} vs. implied</p>
              </div>
            </div>
          </div>
          <div className="mt-4 rounded-3xl bg-foreground/5 p-5">
            <BarChart
              categories={["Implied value", `At publish (${model.publishDate})`, "Latest"]}
              format="rupees"
              series={[
                {
                  label: model.company,
                  values: [model.impliedValuePerShare, model.priceAtPublish, model.latestPrice],
                  colorClassName: "fill-indigo-500 dark:fill-indigo-400",
                },
              ]}
            />
          </div>
          <p className="mt-3 text-sm text-muted">
            This is an implied value under one set of assumptions, not a prediction.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted">Downloads &amp; links</h2>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            {model.excelUrl ? (
              <a
                href={model.excelUrl}
                className="rounded-full bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700"
              >
                ↓ Download Excel
              </a>
            ) : (
              <span className="rounded-full bg-amber-50 px-4 py-2 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                Excel · TODO(Rishit)
              </span>
            )}
            {model.valuePickrUrl ? (
              <a href={model.valuePickrUrl} className="rounded-full bg-foreground/5 px-4 py-2 font-medium transition hover:bg-foreground/10">
                ValuePickr thread ↗
              </a>
            ) : (
              <span className="rounded-full bg-amber-50 px-4 py-2 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                ValuePickr thread · TODO(Rishit)
              </span>
            )}
            {model.substackUrl ? (
              <a href={model.substackUrl} className="rounded-full bg-foreground/5 px-4 py-2 font-medium transition hover:bg-foreground/10">
                Substack post ↗
              </a>
            ) : (
              <span className="rounded-full bg-amber-50 px-4 py-2 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                Substack post · TODO(Rishit)
              </span>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted">Version history</h2>
          <ol className="mt-3 space-y-0 border-l-2 border-emerald-200 dark:border-emerald-900">
            {model.versions.map((version) => (
              <li key={version.version} className="relative py-3 pl-6">
                <span className="absolute -left-[5px] top-4 h-2 w-2 rounded-full bg-emerald-500" />
                <p className="font-mono text-sm font-medium">
                  {version.version} <span className="text-foreground/50">· {version.date}</span>
                </p>
                <p className="mt-1 text-sm text-foreground/80">{version.changelog}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
