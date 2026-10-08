import Link from "next/link";
import { HeroIllustration } from "@/components/hero-illustration";
import { WhyDcfIcon, GuideIcon, ModelsIcon, GameIcon } from "@/components/section-icons";
import { SectionCard } from "@/components/section-card";
import { AnimatedCounter } from "@/components/animated-counter";

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
    <div>
      {/* Full-bleed hero */}
      <div className="relative flex h-[34rem] w-full items-end overflow-hidden sm:h-[40rem]">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/skyscrapers-real.jpg"
          className="absolute inset-0 h-full w-full scale-110 object-cover"
        >
          <source src="/videos/street-crossing.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20" />
        <div className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-14">
          <p className="font-mono text-sm font-semibold tracking-[0.2em] text-violet-300">DCF LAB</p>
          <h1 className="mt-4 text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-7xl">
            Can a student&apos;s DCF
            <br />
            beat the market?
          </h1>
          <p className="mt-5 max-w-xl text-base text-white/80 sm:text-lg">
            A DCF estimates what a company is worth from the cash it will generate, like figuring
            out what a lemonade stand is worth by adding up every cup it will ever sell. No
            finance background needed.
          </p>
          <Link
            href="/why-dcf"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold uppercase tracking-wide text-black transition hover:bg-white/90"
          >
            Start here
          </Link>
        </div>
        <p className="absolute bottom-2 right-3 z-10 text-[10px] text-white/50">Video via Mixkit</p>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-20">
        <section className="grid gap-4 sm:grid-cols-2">
          {SECTIONS.map((s) => (
            <SectionCard
              key={s.href}
              href={s.href}
              title={s.title}
              description={s.description}
              icon={<s.Icon className="h-10 w-10 flex-shrink-0" />}
              borderClass={s.borderClass}
            />
          ))}
        </section>

        <section className="mt-20 flex flex-col items-center gap-8 rounded-2xl border border-border bg-card p-8 sm:flex-row">
          <div className="w-full sm:w-64">
            <HeroIllustration />
          </div>
          <div className="flex flex-col items-start gap-2">
            <p className="font-mono text-5xl font-black text-emerald-600 dark:text-emerald-400">
              <AnimatedCounter to={200} suffix="+" />
            </p>
            <p className="text-sm text-muted">
              students have used DCF Lab to build their own valuation so far. The Game is the
              fastest way to become one of them.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
