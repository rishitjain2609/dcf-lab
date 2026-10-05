import { PageHeader } from "@/components/page-header";
import { Todo } from "@/components/todo";

export default function WhyDcfPage() {
  return (
    <div>
      <PageHeader
        title="Why DCF"
        description="What a discounted cash flow model is, where professionals actually use it, and where it breaks down."
      />
      <div className="mx-auto max-w-5xl space-y-4 px-4 pb-16">
        <Todo>
          Write: what a DCF is in plain terms; where it&apos;s used (equity research, M&amp;A, PE, IPO pricing);
          and its limits (forecast error, terminal value sensitivity, circularity with market price).
        </Todo>
      </div>
    </div>
  );
}
