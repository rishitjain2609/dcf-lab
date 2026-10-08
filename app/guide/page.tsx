import { PageHero } from "@/components/page-hero-banner";
import { GUIDE_STEPS } from "@/lib/guide-steps";
import { GuideStepRow } from "@/components/guide-step-row";

export default function GuidePage() {
  return (
    <div>
      <PageHero
        src="/images/desk-laptop-real.jpg"
        alt="A desk with a laptop showing financial charts"
        video="/videos/laptop-spreadsheet.mp4"
        kicker="GUIDE"
        kickerClassName="text-indigo-300"
        title="Guide"
        description="A step-by-step build of a full DCF model, each step with a worked numeric example."
      />
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-12">
        <div>
          {GUIDE_STEPS.map((step, i) => (
            <GuideStepRow
              key={step.slug}
              href={`/guide/${step.slug}`}
              index={i}
              title={step.title}
              isLast={i === GUIDE_STEPS.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
