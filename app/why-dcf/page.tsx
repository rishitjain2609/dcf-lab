import { PageHero } from "@/components/page-hero-banner";
import { readMdxFile, Mdx } from "@/lib/mdx";

export default function WhyDcfPage() {
  const { content, frontmatter } = readMdxFile("why-dcf.mdx");

  return (
    <div>
      <PageHero
        src="/images/skyscrapers.jpg"
        alt="Modern glass office skyscrapers in a financial district"
        kicker="WHY DCF"
        kickerClassName="text-violet-300"
        title={frontmatter.title}
        description={frontmatter.description}
      />
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-12">
        <Mdx source={content} />
      </div>
    </div>
  );
}
