import { PageHeader } from "@/components/page-header";
import { PageHeroBanner } from "@/components/page-hero-banner";
import { readMdxFile, Mdx } from "@/lib/mdx";

export default function WhyDcfPage() {
  const { content, frontmatter } = readMdxFile("why-dcf.mdx");

  return (
    <div>
      <PageHeroBanner
        src="/images/skyscrapers.jpg"
        alt="Modern glass office skyscrapers in a financial district"
        tintClassName="from-violet-950/70 via-violet-950/20 to-transparent"
      />
      <PageHeader title={frontmatter.title} description={frontmatter.description} accentClassName="bg-violet-500" />
      <div className="mx-auto max-w-5xl px-4 pb-16">
        <Mdx source={content} />
      </div>
    </div>
  );
}
