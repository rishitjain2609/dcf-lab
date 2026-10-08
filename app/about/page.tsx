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
        credit="Photo via Unsplash"
      />
      <div className="mx-auto max-w-5xl space-y-10 px-4 pb-16 pt-12">
        <section className="flex items-start gap-4">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-accent font-mono text-lg font-semibold text-white dark:text-background">
            RJ
          </div>
          <div>
            <h2 className="font-medium">Rishit Jain</h2>
            <p className="text-sm text-muted">Founder &amp; writer, DCF Lab</p>
            <div className="mt-3">
              <Todo>
                Your own words on why you built this, what you were doing before (coursework,
                competitions, internships) that led here, and what you want a reader to take away.
              </Todo>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted">Methodology</h2>
          <p className="mt-3 text-foreground/90">
            Every number on this site traces back to one tested module,{" "}
            <code className="rounded bg-foreground/10 px-1 py-0.5 font-mono text-[0.9em]">/lib/dcf.ts</code>.
            The same discounting, terminal value, and EV-to-equity math runs the guide&apos;s
            worked examples, the models, and the game, so a formula fixed in one place is fixed
            everywhere. Company data for the real models is entered by hand from public filings,
            not scraped, and cross-checked before publishing.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted">Sources</h2>
          <Todo>
            List the specific filings, exchange data, and any paid/free data sources used for each
            real model, with publish dates.
          </Todo>
        </section>

        <section>
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted">Reviewer feedback</h2>
          <Todo>
            Credit anyone who reviewed a model before or after publishing and what they caught.
            This is also where a wrong call gets acknowledged, not hidden.
          </Todo>
        </section>

        <p className="rounded-md border border-border bg-card px-4 py-3 text-sm text-muted">{DISCLAIMER}</p>
      </div>
    </div>
  );
}
