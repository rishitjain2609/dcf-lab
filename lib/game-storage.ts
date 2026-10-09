import type { GameAssumptions } from "./game";
import type { QuizAnswerV2 } from "@/components/analyst/game/quiz-step";

export type GameStep = "intro" | "pre-quiz" | "pick-company" | "build" | "result" | "post-quiz" | "summary" | "publish";

export interface PersistedGameState {
  step: GameStep;
  companySlug: string | null;
  assumptions: GameAssumptions | null;
  preAnswers: QuizAnswerV2[] | null;
  postAnswers: QuizAnswerV2[] | null;
}

const STORAGE_KEY = "dcf-lab-game-state-v1";

export function loadGameState(): PersistedGameState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedGameState;
  } catch {
    return null;
  }
}

export function saveGameState(state: PersistedGameState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage can fail (private browsing, quota) — losing in-progress persistence isn't fatal.
  }
}

export function clearGameState(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Same as above: non-fatal.
  }
}
