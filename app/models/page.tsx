import { PageHeader } from "@/components/page-header";
import { Todo } from "@/components/todo";

export default function ModelsPage() {
  return (
    <div>
      <PageHeader
        title="Models"
        description="Two full DCFs on real Indian listed companies, with the full assumptions, implied value vs. market price, and version history."
      />
      <div className="mx-auto max-w-5xl space-y-4 px-4 pb-16">
        <Todo>
          Each model page: summary, key assumptions table, implied value vs. price on publish date, downloadable
          Excel, version history (v1 → v2 changelog crediting feedback), links to the ValuePickr thread and
          Substack post. Reads from /data (build phase 3).
        </Todo>
      </div>
    </div>
  );
}
