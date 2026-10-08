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
          <div className="mt-3 overflow-x-auto rounded-md border border-border">
            <table className="w-full text-sm">
              <tbody>
                {model.assumptions.map((row) => (
                  <tr key={row.label} className="border-b border-border last:border-0">
                    <td className="px-3 py-2 text-muted">{row.label}</td>
                    <td className="px-3 py-2 font-mono">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted">
            Implied value vs. price
          </h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-sm text-muted">Implied value</p>
              <p className="mt-1 font-mono text-xl">{formatRupees(model.impliedValuePerShare)}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-sm text-muted">Price on publish date ({model.publishDate})</p>
              <p className="mt-1 font-mono text-xl">{formatRupees(model.priceAtPublish)}</p>
              <p className="mt-1 font-mono text-sm text-muted">{formatPercent(gapAtPublish)} vs. implied</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-sm text-muted">Latest price</p>
              <p className="mt-1 font-mono text-xl">{formatRupees(model.latestPrice)}</p>
              <p className="mt-1 font-mono text-sm text-muted">{formatPercent(gapNow)} vs. implied</p>
            </div>
          </div>
          <div className="mt-4 rounded-md border border-border bg-card p-4">
            <BarChart
              categories={["Implied value", `At publish (${model.publishDate})`, "Latest"]}
              valueFormatter={(v) => formatRupees(v)}
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
            This is an implied value under one set of assumptions, not a prediction. See the{" "}
            <Link href="/about" className="hover:text-accent">
              disclaimer
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted">Downloads &amp; links</h2>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            {model.excelUrl ? (
              <a href={model.excelUrl} className="rounded-md border border-border px-3 py-1.5 hover:border-accent">
                Download Excel
              </a>
            ) : (
              <span className="rounded-md border border-dashed border-border px-3 py-1.5 text-muted">
                Excel · TODO(Rishit)
              </span>
            )}
            {model.valuePickrUrl ? (
              <a href={model.valuePickrUrl} className="rounded-md border border-border px-3 py-1.5 hover:border-accent">
                ValuePickr thread
              </a>
            ) : (
              <span className="rounded-md border border-dashed border-border px-3 py-1.5 text-muted">
                ValuePickr thread · TODO(Rishit)
              </span>
            )}
            {model.substackUrl ? (
              <a href={model.substackUrl} className="rounded-md border border-border px-3 py-1.5 hover:border-accent">
                Substack post
              </a>
            ) : (
              <span className="rounded-md border border-dashed border-border px-3 py-1.5 text-muted">
                Substack post · TODO(Rishit)
              </span>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted">Version history</h2>
          <ol className="mt-3 space-y-3">
            {model.versions.map((version) => (
              <li key={version.version} className="rounded-md border border-border bg-card p-4">
                <p className="font-mono text-sm">
                  {version.version} <span className="text-muted">· {version.date}</span>
                </p>
                <p className="mt-1 text-sm text-foreground/90">{version.changelog}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
