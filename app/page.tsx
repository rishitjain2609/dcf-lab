import Link from "next/link";
import { Todo } from "@/components/todo";
import { HeroIllustration } from "@/components/hero-illustration";

const SECTIONS = [
  {
    href: "/guide",
    title: "Guide",
    description: "A step-by-step build guide for a full DCF, with worked numbers at every step.",
  },
  {
    href: "/models",
    title: "Models",
    description: "Two real DCFs on Indian listed companies, with version history and downloadable Excel.",
  },
  {
    href: "/ledger",
    title: "Ledger",
    description: "Every published model tracked against what actually happened. Including when it was wrong.",
  },
  {
    href: "/game",
    title: "Game",
    description: "Build your own DCF on a real company and see how close you get, with a concept quiz either side.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <section className="grid items-center gap-8 sm:grid-cols-2">
        <div>
          <p className="font-mono text-sm text-accent">DCF Lab</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Can a student&apos;s DCF beat the market price, and why are DCFs wrong?
          </h1>
          <p className="mt-4 text-muted">
            New here? A DCF is just a way of estimating what a company is worth from its cash flows.
            No finance background needed to follow along.
          </p>
          <Link
            href="/why-dcf"
            className="mt-5 inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 dark:text-background"
          >
            Start here: Why DCF →
          </Link>
        </div>
        <div className="hidden sm:block">
          <HeroIllustration />
        </div>
      </section>

      <section className="mt-16 grid gap-4 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group rounded-lg border border-border bg-card p-5 transition hover:border-accent"
          >
            <h2 className="font-medium group-hover:text-accent">{s.title}</h2>
            <p className="mt-1 text-sm text-muted">{s.description}</p>
          </Link>
        ))}
      </section>

      <section className="mt-16">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted">So far</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Students", value: "—" },
            { label: "Valuations submitted", value: "—" },
            { label: "Schools", value: "—" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-border bg-card p-5">
              <p className="font-mono text-2xl font-semibold">{stat.value}</p>
              <p className="mt-1 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Todo>
            Live counters go live once Supabase logging and the /impact page are wired up (build phase 5).
          </Todo>
        </div>
      </section>
    </div>
  );
}
