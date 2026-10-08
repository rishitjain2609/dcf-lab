"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/lib/quiz-questions";

export interface QuizAnswer {
  questionId: string;
  selectedIndex: number;
  correct: boolean;
}

export function Quiz({
  questions,
  heading,
  description,
  onComplete,
}: {
  questions: QuizQuestion[];
  heading: string;
  description: string;
  onComplete: (score: number, answers: QuizAnswer[]) => void;
}) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);

  const question = questions[index];
  const isLast = index === questions.length - 1;

  function submitAnswer() {
    if (selected === null) return;
    setShowExplanation(true);
  }

  function next() {
    if (selected === null) return;
    const answer: QuizAnswer = {
      questionId: question.id,
      selectedIndex: selected,
      correct: selected === question.correctIndex,
    };
    const nextAnswers = [...answers, answer];

    if (isLast) {
      const score = nextAnswers.filter((a) => a.correct).length;
      onComplete(score, nextAnswers);
      return;
    }

    setAnswers(nextAnswers);
    setIndex(index + 1);
    setSelected(null);
    setShowExplanation(false);
  }

  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold italic">{heading}</h2>
      <p className="mt-1 text-sm text-foreground/60">{description}</p>

      <div className="mt-6 rounded-3xl bg-violet-50 p-6 dark:bg-violet-950/30">
        <p className="font-mono text-xs text-violet-700 dark:text-violet-400">
          Question {index + 1} of {questions.length}
        </p>
        <p className="mt-2 text-lg font-medium">{question.question}</p>

        <div className="mt-4 space-y-2">
          {question.options.map((option, i) => {
            const isSelected = selected === i;
            const isCorrectOption = i === question.correctIndex;
            let stateClasses = "bg-background hover:bg-violet-100 dark:hover:bg-violet-900/40";
            if (showExplanation) {
              if (isCorrectOption) stateClasses = "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-200";
              else if (isSelected) stateClasses = "bg-rose-100 text-rose-900 dark:bg-rose-900/50 dark:text-rose-200";
            } else if (isSelected) {
              stateClasses = "bg-violet-600 text-white";
            }
            return (
              <button
                key={option}
                type="button"
                disabled={showExplanation}
                onClick={() => setSelected(i)}
                className={`w-full rounded-2xl px-4 py-3 text-left text-sm transition ${stateClasses}`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <p className="mt-4 rounded-2xl bg-background p-4 text-sm text-foreground/90">{question.explanation}</p>
        )}

        <div className="mt-5 flex justify-end">
          {!showExplanation ? (
            <button
              type="button"
              onClick={submitAnswer}
              disabled={selected === null}
              className="rounded-full bg-violet-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-40"
            >
              Check answer
            </button>
          ) : (
            <button
              type="button"
              onClick={next}
              className="rounded-full bg-violet-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
            >
              {isLast ? "Finish" : "Next question"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
