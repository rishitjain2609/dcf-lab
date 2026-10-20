import Link from "next/link";
import { NAV_ITEMS, SITE_NAME } from "@/lib/nav";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-field text-field-ink">
      <div className="mx-auto max-w-[90rem] px-4 pt-20 pb-10 sm:px-8 sm:pt-28">
        <p className="ui text-[clamp(4rem,19vw,17rem)] font-extrabold leading-[0.8] tracking-[-0.055em]">
          {SITE_NAME}
        </p>

        <div className="mt-16 grid gap-12 sm:mt-20 lg:grid-cols-12">
          <nav aria-label="Footer" className="flex flex-col gap-1 lg:col-span-5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="t-lead w-fit font-bold tracking-[-0.02em] text-gold underline-offset-[0.2em] decoration-2 hover:underline"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <p className="t-body max-w-[40ch] lg:col-span-5 lg:col-start-8">
            Written and built by Rishit Jain. An educational site on how discounted cash flow valuation works,
            with the real models built from public filings.
          </p>
        </div>

        <div className="t-small mt-20 flex justify-between gap-6">
          <p>© {new Date().getFullYear()} {SITE_NAME}</p>
          <a href="#top" className="underline-offset-4 hover:underline">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
