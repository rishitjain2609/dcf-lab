import { PageHeader } from "@/components/page-header";
import { readMdxFile, Mdx } from "@/lib/mdx";

export default function WhyDcfPage() {
  const { content, frontmatter } = readMdxFile("why-dcf.mdx");

  return (
    <div>
      <PageHeader title={frontmatter.title} description={frontmatter.description} accentClassName="bg-violet-500" />
      <div className="mx-auto max-w-5xl px-4 pb-16">
        <Mdx source={content} />
      </div>
    </div>
  );
}
