"use client";

import { useState } from "react";
import type { GameCompany, GameAssumptions, GameResult } from "@/lib/game";
import { computeGameResult } from "@/lib/game";
import { QUIZ_QUESTIONS } from "@/lib/quiz-questions";
import { Quiz } from "./quiz";
import { CompanyPicker } from "./company-picker";
import { AssumptionForm } from "./assumption-form";
import { ResultPanel } from "./result-panel";

type Step = "intro" | "pre-quiz" | "pick-company" | "assumptions" | "result" | "post-quiz" | "summary";

export function GameApp({ companies }: { companies: GameCompany[] }) {
  const [step, setStep] = useState<Step>("intro");
  const [preScore, setPreScore] = useState<number | null>(null);
  const [postScore, setPostScore] = useState<number | null>(null);
  const [company, setCompany] = useState<GameCompany | null>(null);
  const [assumptions, setAssumptions] = useState<GameAssumptions | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);

  function handlePreQuizComplete(score: number) {
    setPreScore(score);
    setStep("pick-company");
  }

  function handleCompanyPick(picked: GameCompany) {
    setCompany(picked);
    setStep("assumptions");
  }

  function handleReveal(picked: GameAssumptions) {
    if (!company) return;
    setAssumptions(picked);
    setResult(computeGameResult(company, picked));
    setStep("result");
  }

  function handlePostQuizComplete(score: number) {
    setPostScore(score);
    setStep("summary");
  }

  function restart() {
    setStep("intro");
    setPreScore(null);
    setPostScore(null);
    setCompany(null);
    setAssumptions(null);
    setResult(null);
  }

  if (step === "intro") {
    return (
      <div className="overflow-hidden rounded-3xl bg-amber-50 p-8 dark:bg-amber-950/30">
        <p className="font-[family-name:var(--font-display)] text-2xl italic text-amber-900 dark:text-amber-200">
          Five steps, one real model.
        </p>
        <p className="mt-3 max-w-lg text-foreground/80">
          You&apos;ll take a quick 5-question concept quiz, build your own DCF on a sample company, see how your
          implied value compares to the market price and a reference model, then take the same quiz again to see
          what stuck.
        </p>
        <button
          type="button"
          onClick={() => setStep("pre-quiz")}
          className="mt-6 rounded-full bg-amber-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-amber-700"
        >
          Start →
        </button>
      </div>
    );
  }

  if (step === "pre-quiz") {
    return (
      <Quiz
        questions={QUIZ_QUESTIONS}
        heading="Before you start: concept check"
        description="Five quick questions. This is just a baseline, there's no penalty for guessing."
        onComplete={handlePreQuizComplete}
      />
    );
  }

  if (step === "pick-company") {
    return <CompanyPicker companies={companies} onPick={handleCompanyPick} />;
  }

  if (step === "assumptions" && company) {
    return <AssumptionForm company={company} onReveal={handleReveal} />;
  }

  if (step === "result" && company && assumptions && result) {
    return (
      <ResultPanel
        company={company}
        result={result}
        onContinue={() => setStep("post-quiz")}
      />
    );
  }

  if (step === "post-quiz") {
    return (
      <Quiz
        questions={QUIZ_QUESTIONS}
        heading="Same five questions, one more time"
        description="Let's see what building the model actually changed."
        onComplete={handlePostQuizComplete}
      />
    );
  }

  if (step === "summary" && preScore !== null && postScore !== null) {
    const delta = postScore - preScore;
    return (
      <div className="rounded-3xl bg-foreground/5 p-8">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold italic">Your learning gain</h2>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
          <div className="flex-1 rounded-2xl bg-background p-5">
            <p className="text-sm text-foreground/60">Before</p>
            <p className="mt-1 font-mono text-2xl">
              {preScore} <span className="text-foreground/40">/ {QUIZ_QUESTIONS.length}</span>
            </p>
          </div>
          <div className="flex-1 rounded-2xl bg-background p-5">
            <p className="text-sm text-foreground/60">After</p>
            <p className="mt-1 font-mono text-2xl">
              {postScore} <span className="text-foreground/40">/ {QUIZ_QUESTIONS.length}</span>
            </p>
          </div>
          <div
            className={`flex-1 rounded-2xl p-5 ${
              delta > 0 ? "bg-emerald-100 dark:bg-emerald-950/50" : delta < 0 ? "bg-rose-100 dark:bg-rose-950/50" : "bg-background"
            }`}
          >
            <p className="text-sm text-foreground/60">Change</p>
            <p
              className={`mt-1 font-[family-name:var(--font-display)] text-3xl italic ${
                delta > 0 ? "text-emerald-700 dark:text-emerald-400" : delta < 0 ? "text-rose-700 dark:text-rose-400" : ""
              }`}
            >
              {delta > 0 ? "+" : ""}
              {delta}
            </p>
          </div>
        </div>
        <p className="mt-6 text-sm text-foreground/60">
          Scores aren&apos;t saved anywhere yet. Logging to a shared leaderboard is a later build phase.
        </p>
        <button
          type="button"
          onClick={restart}
          className="mt-4 rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition hover:opacity-80"
        >
          Play again
        </button>
      </div>
    );
  }

  return null;
}
