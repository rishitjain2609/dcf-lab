import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { readMdxFile, Mdx } from "@/lib/mdx";
import { GUIDE_STEPS } from "@/lib/guide-steps";

export function generateStaticParams() {
  return GUIDE_STEPS.map((step) => ({ slug: step.slug }));
}

export default async function GuideStepPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = GUIDE_STEPS.findIndex((step) => step.slug === slug);
  if (index === -1) {
    notFound();
  }

  const { content, frontmatter } = readMdxFile(`guide/${slug}.mdx`);
  const prev = GUIDE_STEPS[index - 1];
  const next = GUIDE_STEPS[index + 1];

  return (
    <div>
      <PageHeader title={frontmatter.title} description={frontmatter.description} accentClassName="bg-indigo-500" />
      <div className="mx-auto max-w-5xl px-4 pb-16">
        <p className="font-mono text-sm text-muted">
          Step {index + 1} of {GUIDE_STEPS.length}
        </p>
        <Mdx source={content} />
        <div className="mt-10 flex items-center justify-between border-t border-border pt-6 text-sm">
          {prev ? (
            <Link href={`/guide/${prev.slug}`} className="hover:text-accent">
              ← {prev.title}
            </Link>
          ) : (
            <Link href="/guide" className="hover:text-accent">
              ← Back to guide
            </Link>
          )}
          {next ? (
            <Link href={`/guide/${next.slug}`} className="hover:text-accent">
              {next.title} →
            </Link>
          ) : (
            <Link href="/guide" className="hover:text-accent">
              Back to guide →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
