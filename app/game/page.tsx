import { PageHeader } from "@/components/page-header";
import { PageHeroBanner } from "@/components/page-hero-banner";
import { getGameCompanies } from "@/lib/game-data";
import { GameApp } from "@/components/game/game-app";

export default function GamePage() {
  const companies = getGameCompanies();

  return (
    <div>
      <PageHeroBanner
        src="/images/stock-ticker.jpg"
        alt="A digital stock ticker display on a building at dusk"
        tintClassName="from-amber-950/70 via-amber-950/20 to-transparent"
      />
      <PageHeader
        title="The Valuation Game"
        description="Pick a real Indian company, set your own DCF assumptions, and see how your implied value compares to the market and to a reference model."
        accentClassName="bg-amber-500"
      />
      <div className="mx-auto max-w-5xl px-4 pb-16">
        <GameApp companies={companies} />
      </div>
    </div>
  );
}
