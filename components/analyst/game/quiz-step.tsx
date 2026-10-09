"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/lib/quiz-questions";

export interface QuizAnswerV2 {
  questionId: string;
  concept: string;
  selectedIndex: number;
  correct: boolean;
}

export function QuizStep({
  questions,
  heading,
  description,
  onComplete,
}: {
  questions: QuizQuestion[];
  heading: string;
  description: string;
  onComplete: (score: number, answers: QuizAnswerV2[]) => void;
}) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<QuizAnswerV2[]>([]);

  const question = questions[index];
  const isLast = index === questions.length - 1;

  function next() {
    if (selected === null) return;
    const answer: QuizAnswerV2 = {
      questionId: question.id,
      concept: question.concept,
      selectedIndex: selected,
      correct: selected === question.correctIndex,
    };
    const nextAnswers = [...answers, answer];

    if (isLast) {
      onComplete(nextAnswers.filter((a) => a.correct).length, nextAnswers);
      return;
    }
    setAnswers(nextAnswers);
    setIndex(index + 1);
    setSelected(null);
  }

  return (
    <div>
      <h2 className="text-xl font-semibold">{heading}</h2>
      <p className="mt-1 text-sm text-muted">{description}</p>

      <div className="mt-6 flex gap-1.5" aria-hidden="true">
        {questions.map((q, i) => (
          <span
            key={q.id}
            className={`h-1.5 flex-1 rounded-full ${i < index ? "bg-accent" : i === index ? "bg-accent/50" : "bg-border"}`}
          />
        ))}
      </div>
      <p className="mt-2 text-xs tabular-nums text-muted">
        Question {index + 1} of {questions.length}
      </p>

      <div className="mt-4 rounded-2xl bg-card p-6 ring-1 ring-border">
        <p className="text-lg font-medium">{question.question}</p>
        <div className="mt-4 space-y-2" role="radiogroup" aria-label={question.question}>
          {question.options.map((option, i) => (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected === i}
              onClick={() => setSelected(i)}
              className={`w-full rounded-xl px-4 py-3 text-left text-sm transition ${
                selected === i ? "bg-accent text-white" : "bg-background ring-1 ring-border hover:ring-accent"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={next}
            disabled={selected === null}
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            {isLast ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
