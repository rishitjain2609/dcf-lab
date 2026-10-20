import Link from "next/link";
import { getModels } from "@/lib/data";
import { MotifBars, StepMark, stepClip } from "@/components/motif";
import { DiscountPlayground } from "@/components/home/discount-playground";
import { ModelShowcase, type ShowcaseModel } from "@/components/home/model-showcase";

const frame = "mx-auto w-full max-w-[90rem] px-4 sm:px-8";

/** One-line restatements of each real model's thesis, for the homepage tabs. */
const LEDES: Record<string, { shortName: string; lede: string }> = {
  nike: {
    shortName: "Nike",
    lede: "Holds margins flat at FY2025's depressed 9.7% with 3% growth, no turnaround assumed, and still lands above the market price.",
  },
  zomato: {
    shortName: "Zomato",
    lede: "Lets growth slow from 30% to 15% while margins widen to 14%, and lands near a tenth of the market price. That gap is the finding.",
  },
};

/** The route through the site, sized by roughly how long each stop takes. */
const STAGES = [
  { href: "/why-dcf", name: "Why DCF", time: "Ten minutes", minutes: 10, text: "First, why anyone values a company this way, and where it breaks.", tone: "bg-accent text-accent-ink" },
  { href: "/guide", name: "Guide", time: "About two hours", minutes: 120, text: "Then the twelve-step build, with a worked example at every step.", tone: "bg-[#fcd3e1] text-accent-ink" },
  { href: "/models", name: "Models", time: "Fifteen minutes", minutes: 15, text: "Next, read a full model on a real listed company.", tone: "bg-card-strong text-foreground" },
  { href: "/game", name: "Game", time: "Twenty minutes", minutes: 20, text: "Last, build your own DCF and see how far you land from the market.", tone: "bg-[#3a4470] text-foreground" },
];

const BENCH = [
  { name: "Nike", note: "Full model", href: "/models/nike" },
  { name: "Zomato", note: "Full model", href: "/models/zomato" },
  { name: "Infosys", note: "In the game", href: "/game" },
  { name: "Tata Motors", note: "In the game", href: "/game" },
  { name: "Reliance", note: "In the game", href: "/game" },
  { name: "Your pick", note: "Build one in the game", href: "/game" },
];

function Thumb({ src, alt }: { src: string; alt: string }) {
  return (
    <span
      className="mx-[0.12em] inline-block h-[0.85em] w-[1.3em] overflow-hidden align-[-0.1em]"
      style={{ clipPath: stepClip(3, 0.12) }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} width={160} height={110} loading="lazy" className="h-full w-full object-cover" />
    </span>
  );
}

export default function Home() {
  const models: ShowcaseModel[] = getModels()
    .filter((m) => !m.placeholder && LEDES[m.slug])
    .map((m) => ({
      slug: m.slug,
      company: m.company,
      ticker: m.ticker,
      currency: m.currency,
      impliedValuePerShare: m.impliedValuePerShare,
      priceAtPublish: m.priceAtPublish,
      ...LEDES[m.slug],
    }));

  const totalMinutes = STAGES.reduce((a, s) => a + s.minutes, 0);

  return (
    <div className="motif-scope overflow-x-clip">
      {/* Hero: the motif, cropped huge */}
      <section className="relative flex min-h-[calc(100svh-4.5rem)] items-start overflow-hidden lg:items-center">
        <MotifBars
          rate={0.15}
          count={7}
          gap={10}
          animate
          className="absolute -bottom-px left-[-4vw] right-[-8vw] h-[38svh] lg:left-[60%] lg:top-[-12svh] lg:bottom-0 lg:h-auto"
        />
        <div className={`${frame} relative pt-[12svh] pb-[44svh] lg:py-24`}>
          <div className="lg:max-w-[56%]">
            <h1 data-rise className="t-display">
              What is a company worth?
            </h1>
            <p data-rise style={{ ["--i" as string]: 1 }} className="t-body mt-8 max-w-[42ch]">
              DCF Lab teaches discounted cash flow valuation from zero: why it works, a twelve-step guide,
              real models of Nike and Zomato, and a game where you build your own.
            </p>
            <Link
              data-rise
              style={{ ["--i" as string]: 2 }}
              href="/why-dcf"
              className="press mt-10 inline-flex h-14 items-center bg-accent px-7 t-body font-semibold text-accent-ink hover:bg-foreground/85"
            >
              Start with why
            </Link>
          </div>
        </div>
      </section>

      {/* Statement: what a DCF does, with pictures inline */}
      <section className={`${frame} py-32 sm:py-48`}>
        <h2 className="sr-only">What a DCF does</h2>
        <p data-rise className="t-lead mx-auto max-w-[26ch] font-semibold! sm:max-w-[36ch]">
          A DCF adds up the cash <Thumb src="/images/mumbai-night.jpg" alt="Mumbai skyline at night" /> a
          company will make, then shrinks every future rupee{" "}
          <Thumb src="/images/stock-charts-real.jpg" alt="Stock charts on a screen" /> for the wait and the
          risk <Thumb src="/images/skyscrapers-real.jpg" alt="Office towers from below" />.
        </p>
      </section>

      {/* The live thing */}
      <section className={`${frame} pb-32 sm:pb-48`}>
        <h2 data-rise className="t-head mb-14">
          Watch ₹100 shrink
        </h2>
        <DiscountPlayground />
      </section>

      {/* The band that splits the page, stepped like the bars */}
      <section aria-label="Markets in motion" className="relative h-[60svh] min-h-80 w-full overflow-hidden" style={{ clipPath: stepClip(6, 0.035) }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/stock-charts-real.jpg"
          className="h-full w-full object-cover"
        >
          <source src="/videos/stock-charts-motion.mp4" type="video/mp4" />
        </video>
      </section>

      {/* How it works: the route through the site as one bar */}
      <section className={`${frame} py-32 sm:py-48`}>
        <h2 data-rise className="t-head mb-16">
          Zero to your own model
        </h2>
        <ol data-ui className="flex flex-col gap-1.5 lg:flex-row">
          {STAGES.map((s, i) => (
            <li
              key={s.href}
              data-rise
              style={{ flexGrow: Math.max(s.minutes / totalMinutes, 0.14), flexBasis: 0, ["--i" as string]: i }}
              className="min-w-0"
            >
              <Link
                href={s.href}
                className={`press flex min-h-24 flex-col justify-between p-5 hover:brightness-110 lg:h-[22svh] ${s.tone}`}
              >
                <span className="t-lead">
                  {s.time}
                </span>
                <span className="t-body font-semibold">{s.name}</span>
              </Link>
              <p className="t-body mt-4 mb-6 max-w-[24ch] lg:mb-0">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Showcase: the real models */}
      <section className={`${frame} pb-32 sm:pb-48`}>
        <ModelShowcase models={models} image={{ src: "/images/students-laptop.jpg", alt: "Students working through a spreadsheet on a laptop" }} />
      </section>

      {/* Proof: what is actually on the bench */}
      <section className={`${frame} pb-32 sm:pb-48`}>
        <ul className="grid grid-cols-2 gap-1.5 lg:grid-cols-4 lg:gap-2">
          <li className="col-span-2 flex min-h-32 items-start bg-accent p-6 text-accent-ink lg:aspect-[3/1] lg:min-h-0">
            <h2 className="t-head">
              Companies on the bench
            </h2>
          </li>
          {BENCH.map((b, i) => (
            <li key={b.name} data-rise style={{ ["--i" as string]: i }}>
              <Link href={b.href} className="press flex h-full min-h-32 flex-col justify-between bg-card p-6 hover:bg-card-strong lg:aspect-[3/2]">
                <span className="t-lead">
                  {b.name}
                </span>
                <span className="t-body flex items-center gap-2">
                  <StepMark className="text-accent" />
                  {b.note}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA: one word is the button */}
      <section aria-label="Build your own DCF">
        <Link
          href="/game"
          className="group relative flex h-[46svh] flex-col justify-between bg-accent px-4 pt-5 pb-6 text-accent-ink transition-colors duration-0 hover:bg-[#fcd3e1] focus-visible:bg-[#fcd3e1] sm:h-[60svh] sm:px-8"
          style={{ clipPath: stepClip(6, 0.03) }}
        >
          <span className="flex items-start justify-between gap-6 pt-6">
            <span className="t-body max-w-[34ch] font-semibold">
              Pick a company, set your own growth, margins and discount rate, and see where your number lands
              against the market.
            </span>
            <svg aria-hidden viewBox="0 0 48 48" className="h-8 w-8 shrink-0 sm:h-12 sm:w-12" fill="none" stroke="currentColor" strokeWidth="4">
              <path d="M12 36 36 12M16 12h20v20" />
            </svg>
          </span>
          <span className="block text-[clamp(6rem,27vw,26rem)] font-extrabold leading-[0.78] tracking-[-0.06em]">
            Build
          </span>
        </Link>
      </section>
    </div>
  );
}
