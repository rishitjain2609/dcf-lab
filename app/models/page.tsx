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
        kicker="MODELS"
        kickerClassName="text-emerald-300"
        title="Models"
        description="Two full DCFs on real Indian listed companies. Assumptions, implied value vs. market price, and version history. Currently sample data, the real models will replace these."
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
