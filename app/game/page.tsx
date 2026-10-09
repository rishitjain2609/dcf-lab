import type { Metadata } from "next";
import { getGameCompanies } from "@/lib/game-data";
import { GameApp } from "@/components/analyst/game-app";

export const metadata: Metadata = {
  title: "The Valuation Game — DCF Lab",
  description:
    "Pick a real company, build your own DCF, and see how your implied price compares to the market, a reference model, and the community.",
};

export default function GamePage() {
  const companies = getGameCompanies();

  return (
    <div className="analyst-scope bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-12">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">The Valuation Game</p>
        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Build a DCF, then see how it holds up</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Pick a real company, set every assumption yourself, and see your implied price next to the market, a
          reference model, and the community.
        </p>
        <div className="mt-10">
          <GameApp companies={companies} />
        </div>
      </div>
    </div>
  );
}
