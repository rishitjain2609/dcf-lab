import fs from "node:fs";
import path from "node:path";
import { MDXRemote } from "next-mdx-remote/rsc";
import matter from "gray-matter";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import {
  DiscountingComparisonChart,
  EquityBridgeWaterfall,
  IncomeStatementChart,
  RevenueBuildChart,
  SensitivityGrid,
  UfcfBuildChart,
} from "@/components/guide-charts";
import { DcfConceptDiagram } from "@/components/dcf-concept-diagram";
import { PhotoAccent } from "@/components/photo-accent";
import { UsesGrid, LimitsBand } from "@/components/why-dcf-sections";

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface MdxFrontmatter {
  title: string;
  description?: string;
  [key: string]: unknown;
}

export function readMdxFile(relativePath: string): { content: string; frontmatter: MdxFrontmatter } {
  const fullPath = path.join(CONTENT_DIR, relativePath);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { content, data } = matter(raw);
  return { content, frontmatter: data as MdxFrontmatter };
}

export function listContentFiles(relativeDir: string): string[] {
  const fullDir = path.join(CONTENT_DIR, relativeDir);
  return fs
    .readdirSync(fullDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

const mdxComponents = {
  h1: (props: React.ComponentProps<"h1">) => (
    <h1
      className="mt-10 scroll-mt-20 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight"
      {...props}
    />
  ),
  h2: (props: React.ComponentProps<"h2">) => (
    <h2
      className="mt-10 scroll-mt-20 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight"
      {...props}
    />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3 className="mt-6 scroll-mt-20 text-lg font-medium" {...props} />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p className="mt-5 text-lg leading-8 text-foreground/90" {...props} />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="mt-5 ml-5 list-disc space-y-2 text-lg leading-8 text-foreground/90" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol className="mt-5 ml-5 list-decimal space-y-2 text-lg leading-8 text-foreground/90" {...props} />
  ),
  table: (props: React.ComponentProps<"table">) => (
    <div className="mt-5 overflow-x-auto rounded-2xl bg-foreground/5 p-2">
      <table className="w-full text-base" {...props} />
    </div>
  ),
  thead: (props: React.ComponentProps<"thead">) => <thead {...props} />,
  tr: (props: React.ComponentProps<"tr">) => <tr className="transition-colors hover:bg-foreground/5" {...props} />,
  th: (props: React.ComponentProps<"th">) => (
    <th className="border-b border-border px-4 py-3 text-left font-medium" {...props} />
  ),
  td: (props: React.ComponentProps<"td">) => (
    <td className="border-b border-border px-4 py-3 font-mono" {...props} />
  ),
  code: (props: React.ComponentProps<"code">) => (
    <code className="rounded bg-foreground/10 px-1.5 py-0.5 font-mono text-[0.85em]" {...props} />
  ),
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote className="mt-5 border-l-2 border-accent pl-5 text-lg leading-8 text-muted" {...props} />
  ),
  UfcfBuildChart,
  EquityBridgeWaterfall,
  SensitivityGrid,
  DcfConceptDiagram,
  PhotoAccent,
  RevenueBuildChart,
  IncomeStatementChart,
  DiscountingComparisonChart,
  UsesGrid,
  LimitsBand,
};

export function Mdx({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={mdxComponents}
      options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }}
    />
  );
}
