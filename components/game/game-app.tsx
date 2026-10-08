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
      <div className="rounded-lg border border-border bg-card p-6">
        <p className="text-foreground/90">
          You&apos;ll take a quick 5-question concept quiz, build your own DCF on a sample company, see how your
          implied value compares to the market price and a reference model, then take the same quiz again to see
          what stuck.
        </p>
        <button
          type="button"
          onClick={() => setStep("pre-quiz")}
          className="mt-4 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white dark:text-background"
        >
          Start
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
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-medium">Your learning gain</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm text-muted">Before</p>
            <p className="mt-1 font-mono text-xl">{preScore} / {QUIZ_QUESTIONS.length}</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm text-muted">After</p>
            <p className="mt-1 font-mono text-xl">{postScore} / {QUIZ_QUESTIONS.length}</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm text-muted">Change</p>
            <p
              className={`mt-1 font-mono text-xl ${
                delta > 0 ? "text-emerald-600 dark:text-emerald-400" : delta < 0 ? "text-rose-600 dark:text-rose-400" : ""
              }`}
            >
              {delta > 0 ? "+" : ""}
              {delta}
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted">
          Scores aren&apos;t saved anywhere yet. Logging to a shared leaderboard is a later build phase.
        </p>
        <button
          type="button"
          onClick={restart}
          className="mt-4 rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-accent"
        >
          Play again
        </button>
      </div>
    );
  }

  return null;
}
