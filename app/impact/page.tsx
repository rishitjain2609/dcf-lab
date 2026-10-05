import { PageHeader } from "@/components/page-header";
import { Todo } from "@/components/todo";

export default function ImpactPage() {
  return (
    <div>
      <PageHeader
        title="Impact"
        description="Who has used DCF Lab, what they learned, and what they said about it."
      />
      <div className="mx-auto max-w-5xl space-y-4 px-4 pb-16">
        <Todo>
          Live counts (users, schools, countries), a pre- vs. post-quiz learning-gain chart, testimonials, and
          reviewer credits. Pulls live data once Supabase and Vercel Analytics are on (build phase 6).
        </Todo>
      </div>
    </div>
  );
}
