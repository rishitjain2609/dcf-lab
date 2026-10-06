import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { getLedgerEntries } from "@/lib/data";
import { formatPercent, formatRupees } from "@/lib/format";
import { percentGap } from "@/lib/dcf";
import { GapBar } from "@/components/charts/gap-bar";

export default function LedgerPage() {
  const entries = [...getLedgerEntries()].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div>
      <PageHeader
        title="Ledger"
        description="Every implied value published here, tracked against what the market actually did next — including post-mortems when a model was wrong. Currently sample data; this fills in as real models publish."
      />
      <div className="mx-auto max-w-5xl px-4 pb-16">
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full text-sm">
            <thead className="bg-foreground/5">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Company</th>
                <th className="px-3 py-2 text-left font-medium">Date</th>
                <th className="px-3 py-2 text-left font-medium">Implied value</th>
                <th className="px-3 py-2 text-left font-medium">Price at publish</th>
                <th className="px-3 py-2 text-left font-medium">Latest price</th>
                <th className="px-3 py-2 text-left font-medium">Gap vs. implied</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => {
                const gap = percentGap(entry.impliedValuePerShare, entry.latestPrice);
                const company = entry.modelSlug ? (
                  <Link href={`/models/${entry.modelSlug}`} className="hover:text-accent">
                    {entry.company}
                  </Link>
                ) : (
                  entry.company
                );
                return (
                  <tr key={entry.id} className="border-b border-border last:border-0 align-top">
                    <td className="px-3 py-2">{company}</td>
                    <td className="px-3 py-2 font-mono text-muted">{entry.date}</td>
                    <td className="px-3 py-2 font-mono">{formatRupees(entry.impliedValuePerShare)}</td>
                    <td className="px-3 py-2 font-mono">{formatRupees(entry.priceAtPublish)}</td>
                    <td className="px-3 py-2 font-mono">{formatRupees(entry.latestPrice)}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono ${
                            gap >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {formatPercent(gap)}
                        </span>
                        <GapBar value={gap} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-8 space-y-4">
          {entries
            .filter((entry) => entry.postMortem)
            .map((entry) => (
              <div key={entry.id} className="rounded-md border border-dashed border-border bg-card p-4">
                <p className="font-mono text-xs uppercase tracking-wide text-accent">
                  Post-mortem — {entry.company}, {entry.date}
                </p>
                <p className="mt-1 text-sm text-foreground/90">{entry.postMortem}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
