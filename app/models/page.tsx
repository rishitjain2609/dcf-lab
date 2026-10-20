import { PageHero } from "@/components/page-hero-banner";
import { getModels } from "@/lib/data";
import { percentGap } from "@/lib/dcf";
import { ModelCard } from "@/components/model-card";

export default function ModelsPage() {
  const models = getModels();

  return (
    <div>
      <PageHero
        src="/images/mumbai-marine-drive.jpg"
        alt="Mumbai's Marine Drive skyline"
        video="/videos/stock-charts-motion.mp4"
        title="Models"
        description="Two full DCFs, Nike and Zomato, built from their annual filings. Each shows its assumptions, the implied value next to the market price, and what changed between versions."
      />
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-12">
        <p className="mb-8 max-w-2xl text-lg">
          Each model comes with its full Excel workbook: inputs with sources, the revenue history, the
          year-by-year build from revenue to free cash flow, the bridge to value per share, and a WACC ×
          growth sensitivity table. Every cell is a live formula, so you can change an assumption and watch
          the value move.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {models.map((model, i) => {
            const gap = percentGap(model.impliedValuePerShare, model.latestPrice);
            return (
              <div key={model.slug} className="flex flex-col">
                <ModelCard
                  slug={model.slug}
                  ticker={model.ticker}
                  company={model.company}
                  currency={model.currency}
                  impliedValuePerShare={model.impliedValuePerShare}
                  gap={gap}
                  index={i}
                  className="flex-1"
                />
                {model.excelUrl && (
                  <a
                    href={model.excelUrl}
                    download
                    className="ui mt-3 inline-flex w-fit items-center gap-2 bg-accent px-4 py-2.5 text-sm font-bold text-accent-ink transition hover:bg-field"
                  >
                    Download the Excel model
                    <span className="font-medium opacity-80">.xlsx</span>
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
