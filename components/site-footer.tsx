import Link from "next/link";
import { NAV_ITEMS, SITE_NAME } from "@/lib/nav";
import { MotifBars } from "@/components/motif";

export function SiteFooter() {
  return (
    <footer className="motif-scope mt-auto">
      <div className="mx-auto max-w-[90rem] px-4 pt-24 pb-10 sm:px-8">
        <div className="relative h-[22svh] min-h-40 sm:h-[34svh]">
          <MotifBars rate={0.12} count={12} gap={4} className="absolute inset-0" animate />
          <p className="absolute bottom-3 left-3 text-[clamp(2.5rem,9vw,8rem)] font-extrabold leading-[0.85] tracking-[-0.05em] text-accent-ink">
            {SITE_NAME}
          </p>
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-12">
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-2 t-body font-semibold sm:col-span-8 sm:grid-cols-4">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className="py-1 underline-offset-4 hover:underline">
                {item.label}
              </Link>
            ))}
          </nav>
          <p className="t-body sm:col-span-4">
            Written and built by Rishit Jain. Educational content on how discounted cash flow valuation
            works.
          </p>
        </div>

        <p className="t-small mt-12 text-muted">© {new Date().getFullYear()} {SITE_NAME}</p>
      </div>
    </footer>
  );
}
