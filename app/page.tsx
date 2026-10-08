import Link from "next/link";
import { HeroIllustration } from "@/components/hero-illustration";
import { WhyDcfIcon, GuideIcon, ModelsIcon, GameIcon } from "@/components/section-icons";
import { SectionCard } from "@/components/section-card";
import { AnimatedCounter } from "@/components/animated-counter";

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
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl font-semibold italic leading-[0.95] tracking-tight text-white sm:text-7xl">
            Can a DCF
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
      </div>

      {/* Bento grid of sections, asymmetric, each tile its own color */}
      <div className="mx-auto max-w-5xl px-4 py-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:grid-rows-2">
          <SectionCard
            href="/why-dcf"
            title="Why DCF"
            description="What this is, where professionals actually use it, and where it breaks down."
            icon={<WhyDcfIcon className="h-20 w-20" />}
            tintClassName="bg-violet-50 dark:bg-violet-950/40"
            tags={["Equity research", "M&A", "Private equity", "IPO pricing"]}
            large
            className="sm:col-span-2 sm:row-span-2"
          />
          <SectionCard
            href="/guide"
            title="Guide"
            description="A step-by-step build, with a worked example at every step."
            icon={<GuideIcon className="h-14 w-14" />}
            tintClassName="bg-indigo-50 dark:bg-indigo-950/40"
          />
          <SectionCard
            href="/models"
            title="Models"
            description="Two real DCFs on Indian listed companies."
            icon={<ModelsIcon className="h-14 w-14" />}
            tintClassName="bg-emerald-50 dark:bg-emerald-950/40"
          />
          <SectionCard
            href="/game"
            title="Game"
            description="Build your own DCF and see how close you get, with a quiz either side."
            icon={<GameIcon className="h-14 w-14" />}
            tintClassName="bg-amber-50 dark:bg-amber-950/40"
            className="sm:col-span-1"
          />
        </div>
      </div>

      {/* Pull-quote stat break: full-bleed dark band */}
      <div className="bg-slate-950 py-20 text-slate-50">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-4 sm:flex-row">
          <div className="w-full max-w-xs">
            <HeroIllustration />
          </div>
          <div>
            <p className="font-[family-name:var(--font-display)] text-7xl font-semibold italic text-emerald-400 sm:text-8xl">
              <AnimatedCounter to={200} suffix="+" />
            </p>
            <p className="mt-3 max-w-sm text-slate-300">
              people have used DCF Lab to build their own valuation so far. The Game is the
              fastest way to become one of them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
