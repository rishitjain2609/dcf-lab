"use client";

import type { QuizAnswerV2 } from "./quiz-step";

export function SummaryStep({
  preAnswers,
  postAnswers,
  onContinue,
  onRestart,
}: {
  preAnswers: QuizAnswerV2[];
  postAnswers: QuizAnswerV2[];
  onContinue: () => void;
  onRestart: () => void;
}) {
  const concepts = preAnswers.map((a) => a.concept);
  const preScore = preAnswers.filter((a) => a.correct).length;
  const postScore = postAnswers.filter((a) => a.correct).length;
  const delta = postScore - preScore;

  return (
    <div>
      <h2 className="text-xl font-semibold">Your learning gain</h2>
      <p className="mt-1 text-sm text-muted">Same 5 questions, before and after building the model.</p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row">
        <div className="flex-1 rounded-2xl bg-card p-5 text-center ring-1 ring-border">
          <p className="text-xs text-muted">Before</p>
          <p className="text-3xl font-semibold tabular-nums">
            {preScore}
            <span className="text-foreground/40">/{preAnswers.length}</span>
          </p>
        </div>
        <div className="flex-1 rounded-2xl bg-card p-5 text-center ring-1 ring-border">
          <p className="text-xs text-muted">After</p>
          <p className="text-3xl font-semibold tabular-nums">
            {postScore}
            <span className="text-foreground/40">/{postAnswers.length}</span>
          </p>
        </div>
        <div className="flex-1 rounded-2xl bg-card p-5 text-center ring-1 ring-border">
          <p className="text-xs text-muted">Change</p>
          <p className={`text-3xl font-semibold tabular-nums ${delta > 0 ? "text-series-up" : delta < 0 ? "text-series-down" : ""}`}>
            {delta > 0 ? "+" : ""}
            {delta}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <p className="text-sm font-medium">By concept</p>
        {concepts.map((concept, i) => {
          const before = preAnswers[i].correct;
          const after = postAnswers[i]?.correct ?? false;
          return (
            <div key={concept} className="flex items-center justify-between rounded-xl bg-foreground/5 px-4 py-3 text-sm">
              <span>{concept}</span>
              <div className="flex items-center gap-3">
                <span className={before ? "text-series-up" : "text-series-down"}>{before ? "Correct" : "Missed"}</span>
                <span className="text-muted">→</span>
                <span className={after ? "text-series-up" : "text-series-down"}>{after ? "Correct" : "Missed"}</span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-sm text-muted">Scores aren&apos;t saved yet, that lands with accounts.</p>

      <div className="mt-4 flex justify-end gap-3">
        <button type="button" onClick={onRestart} className="rounded-full bg-foreground/10 px-5 py-2 text-sm font-medium hover:bg-foreground/15">
          Play again
        </button>
        <button type="button" onClick={onContinue} className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white">
          Continue to publish
        </button>
      </div>
    </div>
  );
}
