import { Users } from "lucide-react";

export function CommunityStrip() {
  // TODO(Rishit): once publishing is live (Phase 5), replace this empty state
  // with the 4-6 most recently published models (company, implied price vs.
  // market, comment count).
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-foreground/5 px-6 py-10 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
        <Users className="h-5 w-5" aria-hidden="true" />
      </span>
      <p className="font-semibold">No models published yet</p>
      <p className="max-w-sm text-sm text-muted">
        Once people start publishing, their models show up here, company, implied price vs. the market, and how
        much discussion it got. Build one below to be the first.
      </p>
    </div>
  );
}
