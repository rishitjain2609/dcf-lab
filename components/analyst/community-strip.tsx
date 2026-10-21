import { Users } from "lucide-react";

export function CommunityStrip() {
  // Empty state until publishing is live; then this lists recent published models.
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-foreground/5 px-6 py-10 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
        <Users className="h-5 w-5" aria-hidden="true" />
      </span>
      <p className="font-semibold">No models published yet</p>
      <p className="max-w-sm text-sm text-muted">
        When people publish their models, they appear here with their implied price next to the market
        price.
      </p>
    </div>
  );
}
