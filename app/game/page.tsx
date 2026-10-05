import { PageHeader } from "@/components/page-header";
import { getGameCompanies } from "@/lib/game-data";
import { GameApp } from "@/components/game/game-app";

export default function GamePage() {
  const companies = getGameCompanies();

  return (
    <div>
      <PageHeader
        title="The Valuation Game"
        description="Pick a real Indian company, set your own DCF assumptions, and see how your implied value compares to the market and to a reference model."
      />
      <div className="mx-auto max-w-5xl px-4 pb-16">
        <GameApp companies={companies} />
      </div>
    </div>
  );
}
