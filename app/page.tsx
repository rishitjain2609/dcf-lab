import Link from "next/link";
import { HeroIllustration } from "@/components/hero-illustration";
import { WhyDcfIcon, GuideIcon, ModelsIcon, GameIcon } from "@/components/section-icons";

const SECTIONS = [
  {
    href: "/why-dcf",
    title: "Why DCF",
    description: "What this is, where professionals actually use it, and where it breaks down.",
    Icon: WhyDcfIcon,
    borderClass: "hover:border-violet-400 dark:hover:border-violet-500",
  },
  {
    href: "/guide",
    title: "Guide",
    description: "A step-by-step build of a full DCF, with a worked example at every step.",
    Icon: GuideIcon,
    borderClass: "hover:border-indigo-400 dark:hover:border-indigo-500",
  },
  {
    href: "/models",
    title: "Models",
    description: "Two real DCFs on Indian listed companies, with version history and the full math.",
    Icon: ModelsIcon,
    borderClass: "hover:border-emerald-400 dark:hover:border-emerald-500",
  },
  {
    href: "/game",
    title: "Game",
    description: "Build your own DCF on a real company and see how close you get, with a quiz either side.",
    Icon: GameIcon,
    borderClass: "hover:border-amber-400 dark:hover:border-amber-500",
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
            A DCF is just a way of estimating what a company is worth from the cash it will
            generate — like figuring out what a lemonade stand is worth by adding up every cup
            of lemonade it will ever sell. No finance background needed to follow along.
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
            className={`group flex gap-4 rounded-lg border border-border bg-card p-5 transition ${s.borderClass}`}
          >
            <s.Icon className="h-10 w-10 flex-shrink-0" />
            <div>
              <h2 className="font-medium group-hover:text-accent">{s.title}</h2>
              <p className="mt-1 text-sm text-muted">{s.description}</p>
            </div>
          </Link>
        ))}
      </section>

      <section className="mt-16 flex flex-col items-start gap-4 rounded-lg border border-border bg-card p-6 sm:flex-row sm:items-center">
        <p className="font-mono text-4xl font-bold text-emerald-600 dark:text-emerald-400">200+</p>
        <p className="text-sm text-muted">
          students have used DCF Lab to build their own valuation so far — the Game is the fastest
          way to become one of them.
        </p>
      </section>
    </div>
  );
}
