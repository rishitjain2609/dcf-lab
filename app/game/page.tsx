import type { Metadata } from "next";
import { getGameCompanies } from "@/lib/game-data";
import { GameApp } from "@/components/analyst/game-app";

export const metadata: Metadata = {
  title: "DCF builder | DCF Lab",
  description:
    "Pick Nike or Zomato, build your own DCF, and compare your implied price with the market and a reference model.",
};

export default function GamePage() {
  const companies = getGameCompanies();

  return (
    <div className="analyst-scope bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-12">
        <h1 className="text-3xl font-semibold sm:text-4xl">DCF builder</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Pick Nike or Zomato, set every assumption yourself, and put your implied price next to the market price
          and the reference model.
        </p>
        <div className="mt-10">
          <GameApp companies={companies} />
        </div>
      </div>
    </div>
  );
}
