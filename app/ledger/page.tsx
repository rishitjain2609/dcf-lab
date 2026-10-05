import { PageHeader } from "@/components/page-header";
import { Todo } from "@/components/todo";

export default function LedgerPage() {
  return (
    <div>
      <PageHeader
        title="Ledger"
        description="Every implied value published on this site, tracked against what the market actually did next — including post-mortems when a model was wrong."
      />
      <div className="mx-auto max-w-5xl space-y-4 px-4 pb-16">
        <Todo>
          Table: company, date, implied value, price at publish, latest price, gap %. Reads from
          /data/ledger.json, plus a post-mortem write-up where a model missed (build phase 3).
        </Todo>
      </div>
    </div>
  );
}
