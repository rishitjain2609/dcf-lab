import { PageHero } from "@/components/page-hero-banner";
import { DISCLAIMER } from "@/lib/nav";
import { Todo } from "@/components/todo";

export default function AboutPage() {
  return (
    <div>
      <PageHero
        src="/images/students-laptop.jpg"
        alt="Students working together on laptops"
        kicker="ABOUT"
        kickerClassName="text-sky-300"
        title="About"
        description="Who built this, how, and why it should be trusted no more than it's earned."
      />
      <div className="mx-auto max-w-5xl space-y-16 px-4 pb-16 pt-12">
        <section className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-sky-600 font-[family-name:var(--font-display)] text-2xl italic text-white">
            RJ
          </div>
          <div className="flex-1">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold">Rishit Jain</h2>
            <p className="font-mono text-sm text-sky-700 dark:text-sky-400">Founder &amp; writer, DCF Lab</p>
          </div>
        </section>
        <Todo>
          Your own words on why you built this, what you were doing before (coursework,
          competitions, internships) that led here, and what you want a reader to take away.
        </Todo>

        <section className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <p className="flex-1 text-foreground/90">
            Every number on this site traces back to one tested module,{" "}
            <code className="rounded bg-foreground/10 px-1 py-0.5 font-mono text-[0.9em]">/lib/dcf.ts</code>.
            The same discounting, terminal value, and EV-to-equity math runs the guide&apos;s
            worked examples, the models, and the game, so a formula fixed in one place is fixed
            everywhere. Company data for the real models is entered by hand from public filings,
            not scraped, and cross-checked before publishing.
          </p>
          <div className="flex flex-shrink-0 flex-col items-center gap-2 rounded-2xl bg-indigo-50 p-5 dark:bg-indigo-950/40">
            <code className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
              /lib/dcf.ts
            </code>
            <span className="text-indigo-400">↓</span>
            <div className="flex gap-2">
              <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                Guide
              </span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                Models
              </span>
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                Game
              </span>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted">Sources</h2>
            <div className="mt-3">
              <Todo>
                List the specific filings, exchange data, and any paid/free data sources used for
                each real model, with publish dates.
              </Todo>
            </div>
          </div>
          <div>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted">
              Reviewer feedback
            </h2>
            <div className="mt-3">
              <Todo>
                Credit anyone who reviewed a model before or after publishing and what they
                caught. This is also where a wrong call gets acknowledged, not hidden.
              </Todo>
            </div>
          </div>
        </section>

        <p className="rounded-2xl bg-foreground/5 px-5 py-4 text-sm text-muted">{DISCLAIMER}</p>
      </div>
    </div>
  );
}
