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
      <h2 className="text-lg font-medium">{heading}</h2>
      <p className="mt-1 text-sm text-muted">{description}</p>

      <div className="mt-6 rounded-lg border border-border bg-card p-5">
        <p className="font-mono text-xs text-muted">
          Question {index + 1} of {questions.length}
        </p>
        <p className="mt-2 font-medium">{question.question}</p>

        <div className="mt-4 space-y-2">
          {question.options.map((option, i) => {
            const isSelected = selected === i;
            const isCorrectOption = i === question.correctIndex;
            let stateClasses = "border-border hover:border-accent";
            if (showExplanation) {
              if (isCorrectOption) stateClasses = "border-emerald-500 bg-emerald-500/10";
              else if (isSelected) stateClasses = "border-rose-500 bg-rose-500/10";
            } else if (isSelected) {
              stateClasses = "border-accent";
            }
            return (
              <button
                key={option}
                type="button"
                disabled={showExplanation}
                onClick={() => setSelected(i)}
                className={`w-full rounded-md border px-3 py-2 text-left text-sm transition ${stateClasses}`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <p className="mt-4 rounded-md bg-foreground/5 p-3 text-sm text-foreground/90">{question.explanation}</p>
        )}

        <div className="mt-4 flex justify-end">
          {!showExplanation ? (
            <button
              type="button"
              onClick={submitAnswer}
              disabled={selected === null}
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-40 dark:text-background"
            >
              Check answer
            </button>
          ) : (
            <button
              type="button"
              onClick={next}
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white dark:text-background"
            >
              {isLast ? "Finish" : "Next question"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
