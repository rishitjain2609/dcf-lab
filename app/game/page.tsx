import { PageHero } from "@/components/page-hero-banner";
import { getGameCompanies } from "@/lib/game-data";
import { GameApp } from "@/components/game/game-app";

export default function GamePage() {
  const companies = getGameCompanies();

  return (
    <div>
      <PageHero
        src="/images/stock-charts-real.jpg"
        alt="Stock market candlestick charts on multiple screens"
        video="/videos/team-collaboration.mp4"
        kicker="GAME"
        kickerClassName="text-amber-300"
        title="The Valuation Game"
        description="Pick a real Indian company, set your own DCF assumptions, and see how your implied value compares to the market and to a reference model."
      />
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-12">
        <GameApp companies={companies} />
      </div>
    </div>
  );
}
