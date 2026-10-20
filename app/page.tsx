import Link from "next/link";
import { getModels } from "@/lib/data";
import { percentGap } from "@/lib/dcf";
import { formatMoneyPerShare, formatPercent } from "@/lib/format";
import { GUIDE_STEPS } from "@/lib/guide-steps";
import { DiscountPlayground } from "@/components/home/discount-playground";

const frame = "mx-auto w-full max-w-[90rem] px-4 sm:px-8";

/** The route through the site, written as four clauses that step across the page. */
const STAGES = [
  { href: "/why-dcf", line: "First, ask why.", note: "Why anyone values a company from its cash, where professionals use it, and where it breaks.", indent: "lg:col-start-1" },
  { href: "/guide", line: "Then build it.", note: "Twelve steps from historicals to a sensitivity table, each with a worked example.", indent: "lg:col-start-3" },
  { href: "/models", line: "Read a real one.", note: "Full models on listed companies, with every assumption and its source.", indent: "lg:col-start-5" },
  { href: "/game", line: "Now value your own.", note: "Pick a company, set your own inputs, and see where you land against the market.", indent: "lg:col-start-7" },
];

const BAND: { src: string; alt: string; grow: number; video?: string }[] = [
  { src: "/images/students-laptop.jpg", alt: "Students working through a model on a laptop", grow: 5 },
  { src: "/images/stock-charts-real.jpg", alt: "Stock charts moving on a trading screen", grow: 2, video: "/videos/stock-charts-motion.mp4" },
  { src: "/images/mumbai-night.jpg", alt: "Mumbai skyline at night", grow: 3 },
  { src: "/images/desk-laptop-real.jpg", alt: "A spreadsheet open on a desk", grow: 2 },
];

const STRIP = [
  { src: "/images/skyscrapers-real.jpg", alt: "Office towers seen from below" },
  { src: "/images/mumbai-night.jpg", alt: "Mumbai at night" },
  { src: "/images/stock-charts-real.jpg", alt: "Price charts on a screen" },
];

const GAME_COMPANIES = ["Nike", "Zomato", "Infosys", "Tata Motors", "Reliance"];

function shortName(company: string) {
  return company.replace(/\s*\(.*\)$/, "").replace(/ (Inc|Ltd)$/, "");
}

function Photo({ src, alt, eager = false }: { src: string; alt: string; eager?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={1600}
      height={1000}
      loading={eager ? undefined : "lazy"}
      className="print-photo h-full w-full object-cover"
    />
  );
}

export default function Home() {
  const models = getModels().filter((m) => !m.placeholder);
  const zomato = models.find((m) => m.slug === "zomato");

  return (
    <div className="overflow-x-clip">
      {/* Hero: narrow talk on the left, wide headline on the right */}
      <section className={`${frame} grid min-h-[calc(100svh-4.5rem)] gap-10 pt-10 lg:grid-cols-12 lg:gap-8 lg:pt-16`}>
        <div className="order-2 lg:order-1 lg:col-span-4 lg:pt-[22svh]">
          <p className="after-mask t-lead max-w-[26ch]">
            DCF Lab teaches discounted cash flow valuation from zero: why it works, how to build one, and real
            models of real companies.
          </p>
          <Link
            href="/why-dcf"
            className="after-mask press ui mt-8 inline-flex h-14 items-center bg-accent px-7 font-bold text-accent-ink hover:bg-field"
          >
            Start with why
          </Link>
        </div>

        <div className="order-1 lg:order-2 lg:col-span-8">
          <h1 className="t-display uppercase">
            <span className="mask-line">
              <span>What&rsquo;s it</span>
            </span>
            <span className="mask-line" style={{ ["--i" as string]: 1 }}>
              <span>worth?</span>
            </span>
          </h1>

          <div className="relative mt-24 hidden h-[36svh] lg:block">
            <Photo src="/images/mumbai-marine-drive.jpg" alt="Marine Drive in Mumbai at dusk" eager />
            {zomato && (
              <Link
                href="/models/zomato"
                className="press absolute top-0 left-0 w-[260px] -translate-y-1/3 bg-gold p-5 text-foreground hover:brightness-95"
              >
                <span className="t-head block tabular-nums">
                  {formatMoneyPerShare(zomato.impliedValuePerShare, zomato.currency)}
                </span>
                <span className="t-small mt-2 block">
                  Zomato&rsquo;s implied value per share, against a market price of{" "}
                  {formatMoneyPerShare(zomato.priceAtPublish, zomato.currency, 0)}.
                </span>
              </Link>
            )}
          </div>
        </div>

        <div className="order-3 -mx-4 aspect-[4/3] sm:-mx-8 lg:hidden">
          <Photo src="/images/mumbai-marine-drive.jpg" alt="Marine Drive in Mumbai at dusk" />
        </div>
      </section>

      {/* Statement tiles */}
      <section className="px-4 pt-24 sm:px-8 sm:pt-32">
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-12 lg:grid-rows-[38svh_38svh]">
          <div data-rise className="col-span-2 flex min-h-[46svh] items-end bg-field p-5 text-field-ink lg:col-span-8 lg:row-span-2 lg:min-h-0">
            <h2 className="t-display uppercase">
              Later is
              <br />
              less.
            </h2>
          </div>
          <div
            data-rise
            style={{ ["--i" as string]: 1 }}
            className="flex aspect-square items-end overflow-hidden bg-gold p-5 lg:col-span-4 lg:aspect-auto"
          >
            <p className="t-display tabular-nums">₹100</p>
          </div>
          <div data-rise style={{ ["--i" as string]: 2 }} className="aspect-square overflow-hidden lg:col-span-4 lg:aspect-auto">
            <Photo src="/images/skyscrapers-real.jpg" alt="Office towers seen from below" />
          </div>
        </div>
        <div className="mx-auto grid max-w-[86rem] py-16 lg:grid-cols-12 lg:py-24">
          <p data-rise className="t-lead lg:col-span-6 lg:col-start-7">
            ₹100 handed to you today is worth more than ₹100 promised in five years. You could invest today&rsquo;s
            money, and the promise might not be kept. A discounted cash flow model takes that idea seriously. It
            estimates the cash a company will produce in each future year, shrinks every year&rsquo;s cash for the
            wait and the risk, and adds up what is left. The total is what the business is worth today. Every
            number in it is an assumption you can argue with, which is exactly what makes it worth learning.
          </p>
        </div>
      </section>

      {/* The live thing */}
      <section className={`${frame} pb-32 sm:pb-48`}>
        <h2 data-rise className="t-head mb-10">
          Watch ₹100 shrink
        </h2>
        <DiscountPlayground />
      </section>

      {/* Lines that step across */}
      <section className={`${frame} pb-32 sm:pb-48`}>
        <ol className="grid gap-14 lg:grid-cols-12">
          {STAGES.map((s, i) => {
            const Line = i === 0 ? "h2" : "p";
            return (
              <li key={s.href} data-rise style={{ ["--i" as string]: i }} className={`lg:col-span-6 ${s.indent}`}>
                <Line className={`t-head ${i === STAGES.length - 1 ? "text-accent" : ""}`}>
                  <Link href={s.href} className="underline-offset-[0.12em] decoration-[3px] hover:underline">
                    {s.line}
                  </Link>
                </Line>
                <p className="t-body mt-3 max-w-[34ch] text-muted">{s.note}</p>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Showcase: a band of unequal panels, then the models as a real table */}
      <section className="pb-32 sm:pb-48">
        <div className={frame}>
          <h2 data-rise className="t-head mb-14 lg:ml-[16.66%]">
            Real models, from filings
          </h2>
        </div>
        <div className="grid h-[84svh] grid-cols-[64fr_36fr] grid-rows-2 lg:flex lg:h-[68svh]">
          {BAND.map((b, i) => (
            <div
              key={b.src}
              style={{ flexGrow: b.grow }}
              className={`relative min-w-0 basis-0 overflow-hidden transition-[flex-grow] duration-500 lg:hover:grow-[6]! ${
                i === 2 ? "max-lg:order-4" : i === 3 ? "max-lg:order-3" : ""
              }`}
            >
              {b.video ? (
                <video autoPlay muted loop playsInline poster={b.src} aria-label={b.alt} className="print-photo h-full w-full object-cover">
                  <source src={b.video} type="video/mp4" />
                </video>
              ) : (
                <Photo src={b.src} alt={b.alt} />
              )}
              {i === 0 && (
                <p className="t-lead ui absolute top-0 left-0 bg-black/60 p-6 font-bold text-white">
                  Two companies,
                  <br />
                  valued from their filings
                </p>
              )}
            </div>
          ))}
        </div>

        <div className={`${frame} mt-16 lg:grid lg:grid-cols-12`}>
          <div className="lg:col-span-10 lg:col-start-3">
            <table className="ui w-full text-left">
              <thead className="t-small text-muted">
                <tr className="border-b-2 border-foreground">
                  <th className="py-3 pr-4 font-medium">Company</th>
                  <th className="py-3 pr-4 text-right font-medium">Implied value</th>
                  <th className="py-3 pr-4 text-right font-medium">Price at publish</th>
                  <th className="hidden py-3 text-right font-medium sm:table-cell">Price vs implied</th>
                </tr>
              </thead>
              <tbody className="t-lead tabular-nums">
                {models.map((m) => (
                  <tr /* taste-skill-ignore: row rule in a real table */ key={m.slug} className="border-b border-border">
                    <td className="py-5 pr-4">
                      <Link href={`/models/${m.slug}`} className="font-bold underline-offset-[0.2em] decoration-2 hover:underline">
                        {shortName(m.company)}
                      </Link>
                    </td>
                    <td className="py-5 pr-4 text-right">{formatMoneyPerShare(m.impliedValuePerShare, m.currency)}</td>
                    <td className="py-5 pr-4 text-right">{formatMoneyPerShare(m.priceAtPublish, m.currency)}</td>
                    <td className="hidden py-5 text-right sm:table-cell">
                      {formatPercent(percentGap(m.impliedValuePerShare, m.priceAtPublish))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="t-body mt-6 max-w-[60ch] text-muted">
              Neither number is a call on the stock. The gap is the interesting part: it shows how much more, or
              less, the market expects than the model assumes.
            </p>
          </div>
        </div>
      </section>

      {/* Plain names in columns */}
      <section className={`${frame} grid gap-10 pb-32 sm:pb-48 lg:grid-cols-12`}>
        <h2 data-rise className="t-head lg:col-span-3">
          What&rsquo;s inside
        </h2>
        <div data-rise style={{ ["--i" as string]: 1 }} className="t-lead ui columns-2 gap-8 sm:columns-3 lg:col-span-8 lg:col-start-5">
          <p className="text-muted">Full models</p>
          {models.map((m) => (
            <p key={m.slug}>
              <Link href={`/models/${m.slug}`} className="hover:underline">
                {shortName(m.company)}
              </Link>
            </p>
          ))}
          <p className="mt-8 text-muted">In the game</p>
          {GAME_COMPANIES.map((n) => (
            <p key={n}>{n}</p>
          ))}
          <p className="mt-8 break-before-column text-muted">Guide steps</p>
          {GUIDE_STEPS.map((s) => (
            <p key={s.slug}>
              <Link href={`/guide/${s.slug}`} className="hover:underline">
                {s.title}
              </Link>
            </p>
          ))}
        </div>
      </section>

      {/* CTA: three photographs, then a field */}
      <section aria-labelledby="build-cta">
        <div className="grid grid-cols-2 sm:grid-cols-3">
          {STRIP.map((p, i) => (
            <div key={p.src} className={`h-[40svh] overflow-hidden ${i === 0 ? "col-span-2 sm:col-span-1" : ""}`}>
              <Photo src={p.src} alt={p.alt} />
            </div>
          ))}
        </div>
        <div className="bg-accent text-accent-ink">
          <div className={`${frame} grid min-h-[44svh] items-center py-16 lg:grid-cols-12`}>
            <div className="lg:col-span-7">
              <h2 id="build-cta" className="t-lead ui font-bold">
                You&rsquo;ve seen how it works. Pick a company, choose your own growth, margins and discount rate,
                and{" "}
                <Link href="/game" className="underline decoration-4 underline-offset-[6px] hover:text-gold">
                  build your own DCF
                </Link>
                .
              </h2>
              <p className="t-body mt-8">About twenty minutes, with a short quiz before and after.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
