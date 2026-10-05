import { PageHeader } from "@/components/page-header";
import { DISCLAIMER } from "@/lib/nav";
import { Todo } from "@/components/todo";

export default function AboutPage() {
  return (
    <div>
      <PageHeader title="About" description="Who built this, how, and why it should be trusted no more than it's earned." />
      <div className="mx-auto max-w-5xl space-y-4 px-4 pb-16">
        <Todo>
          Who built this and why; methodology and sources; how reviewer feedback was incorporated; full
          disclaimer.
        </Todo>
        <p className="rounded-md border border-border bg-card px-4 py-3 text-sm text-muted">{DISCLAIMER}</p>
      </div>
    </div>
  );
}
