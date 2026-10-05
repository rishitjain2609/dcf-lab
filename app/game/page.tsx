import { PageHeader } from "@/components/page-header";
import { Todo } from "@/components/todo";

export default function GamePage() {
  return (
    <div>
      <PageHeader
        title="The Valuation Game"
        description="Pick a real Indian company, set your own DCF assumptions, and see how your implied value compares to the market and to the reference model."
      />
      <div className="mx-auto max-w-5xl space-y-4 px-4 pb-16">
        <Todo>
          Pre-quiz (5 questions) → pick company from /data/game-companies.json → sliders for growth, margin,
          capex %, WACC, terminal g (blocked if g ≥ WACC) → full calculation table → reveal vs. market cap and
          reference model with driver-by-driver error explanation → post-quiz → anonymous leaderboard. Works
          locally with no database first (build phase 4), then logs to Supabase (build phase 5).
        </Todo>
      </div>
    </div>
  );
}
