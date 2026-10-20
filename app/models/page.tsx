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
        <div className="grid gap-4 sm:grid-cols-2">
          {models.map((model, i) => {
            const gap = percentGap(model.impliedValuePerShare, model.latestPrice);
            return (
              <ModelCard
                key={model.slug}
                slug={model.slug}
                ticker={model.ticker}
                company={model.company}
                currency={model.currency}
                impliedValuePerShare={model.impliedValuePerShare}
                gap={gap}
                index={i}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
