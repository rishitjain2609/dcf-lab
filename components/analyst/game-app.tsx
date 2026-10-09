"use client";

import { useEffect, useState } from "react";
import { computeGameResult, computeTornadoData, type GameAssumptions, type GameCompany } from "@/lib/game";
import { QUIZ_QUESTIONS } from "@/lib/quiz-questions";
import { clearGameState, loadGameState, saveGameState, type GameStep } from "@/lib/game-storage";
import { QuizStep, type QuizAnswerV2 } from "./game/quiz-step";
import { CompanyPickerStep } from "./game/company-picker-step";
import { BuilderStep } from "./game/builder-step";
import { ResultStep } from "./game/result-step";
import { SummaryStep } from "./game/summary-step";
import { PublishStep } from "./game/publish-step";
import { MiniDcfHero } from "./mini-dcf-hero";
import { JourneyDiagram } from "./journey-diagram";
import { CommunityStrip } from "./community-strip";

const DEFAULT_ASSUMPTIONS: GameAssumptions = {
  revenueGrowth: 0.1,
  ebitdaMargin: 0.2,
  taxRate: 0.25,
  daPct: 0.05,
  capexPct: 0.06,
  nwcPct: 0.05,
  wacc: 0.12,
  terminalGrowth: 0.04,
};

export function GameApp({ companies }: { companies: GameCompany[] }) {
  const [step, setStep] = useState<GameStep>("intro");
  const [company, setCompany] = useState<GameCompany | null>(null);
  const [assumptions, setAssumptions] = useState<GameAssumptions>(DEFAULT_ASSUMPTIONS);
  const [preAnswers, setPreAnswers] = useState<QuizAnswerV2[] | null>(null);
  const [postAnswers, setPostAnswers] = useState<QuizAnswerV2[] | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Reading localStorage and setting state here (rather than in a lazy useState
  // initializer) is deliberate: it keeps the server-rendered and first-client-render
  // markup identical (both "intro"), then resumes from a save only after hydration,
  // avoiding a hydration mismatch.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const saved = loadGameState();
    if (saved && saved.step !== "intro") {
      setStep(saved.step);
      setCompany(companies.find((c) => c.slug === saved.companySlug) ?? null);
      if (saved.assumptions) setAssumptions(saved.assumptions);
      if (saved.preAnswers) setPreAnswers(saved.preAnswers);
      if (saved.postAnswers) setPostAnswers(saved.postAnswers);
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!hydrated) return;
    saveGameState({
      step,
      companySlug: company?.slug ?? null,
      assumptions,
      preAnswers,
      postAnswers,
    });
  }, [hydrated, step, company, assumptions, preAnswers, postAnswers]);

  function restart() {
    clearGameState();
    setStep("intro");
    setCompany(null);
    setAssumptions(DEFAULT_ASSUMPTIONS);
    setPreAnswers(null);
    setPostAnswers(null);
  }

  if (!hydrated) return null;

  if (step === "intro") {
    return (
      <div className="space-y-10">
        <MiniDcfHero />
        <JourneyDiagram />
        <CommunityStrip />
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setStep("pre-quiz")}
            className="rounded-full bg-accent px-8 py-3 text-sm font-semibold text-white"
          >
            Start building
          </button>
        </div>
      </div>
    );
  }

  if (step === "pre-quiz") {
    return (
      <QuizStep
        questions={QUIZ_QUESTIONS}
        heading="A quick concept check before you start"
        description="Five questions, one at a time. No feedback yet, that comes later."
        onComplete={(_score, answers) => {
          setPreAnswers(answers);
          setStep("pick-company");
        }}
      />
    );
  }

  if (step === "pick-company") {
    return (
      <CompanyPickerStep
        companies={companies}
        onPick={(picked) => {
          setCompany(picked);
          setStep("build");
        }}
      />
    );
  }

  if (step === "build" && company) {
    return (
      <BuilderStep
        company={company}
        initialAssumptions={assumptions}
        onContinue={(finalAssumptions) => {
          setAssumptions(finalAssumptions);
          setStep("result");
        }}
      />
    );
  }

  if (step === "result" && company) {
    const result = computeGameResult(company, assumptions);
    const tornado = computeTornadoData(company, assumptions);
    return <ResultStep company={company} result={result} tornado={tornado} onContinue={() => setStep("post-quiz")} />;
  }

  if (step === "post-quiz") {
    return (
      <QuizStep
        questions={QUIZ_QUESTIONS}
        heading="Same five questions, one more time"
        description="Let's see what building the model actually changed."
        onComplete={(_score, answers) => {
          setPostAnswers(answers);
          setStep("summary");
        }}
      />
    );
  }

  if (step === "summary" && preAnswers && postAnswers) {
    return (
      <SummaryStep
        preAnswers={preAnswers}
        postAnswers={postAnswers}
        onContinue={() => setStep("publish")}
        onRestart={restart}
      />
    );
  }

  if (step === "publish" && company) {
    return <PublishStep company={company} onRestart={restart} />;
  }

  return null;
}
