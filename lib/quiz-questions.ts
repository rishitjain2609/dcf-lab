export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "wacc",
    question: "What does WACC represent in a DCF?",
    options: [
      "The company's net profit margin",
      "The return investors require for the risk of the business",
      "The government's benchmark interest rate",
      "The company's historical revenue growth rate",
    ],
    correctIndex: 1,
    explanation:
      "WACC blends the return equity investors demand (via CAPM) with the after-tax cost of debt, weighted by how the company is actually financed.",
  },
  {
    id: "terminal-growth-guard",
    question: "Why must terminal growth be less than WACC in the Gordon growth formula?",
    options: [
      "It's a regulatory requirement in India",
      "Otherwise the formula divides by zero or a negative number, giving a nonsensical value",
      "Terminal growth doesn't actually affect the formula",
      "WACC must always be lower than growth for the forecast to be accurate",
    ],
    correctIndex: 1,
    explanation:
      "TV = FCF × (1+g) / (WACC - g). If g is greater than or equal to WACC, the denominator is zero or negative. The formula breaks, it doesn't just get \"more aggressive.\"",
  },
  {
    id: "ufcf-excludes",
    question: "What does Unlevered Free Cash Flow (UFCF) exclude that levered free cash flow would include?",
    options: ["Taxes", "Depreciation", "Interest paid to lenders", "Capital expenditure"],
    correctIndex: 2,
    explanation:
      "UFCF is \"as if debt-free,\" meaning no interest expense, so it can be discounted at WACC and compared across companies regardless of how they're financed.",
  },
  {
    id: "ev-vs-equity",
    question: "What mainly causes enterprise value and equity value to differ?",
    options: [
      "Currency conversion",
      "Net debt and other claims ahead of shareholders",
      "Inflation adjustments",
      "Tax rate differences",
    ],
    correctIndex: 1,
    explanation:
      "EV values the whole business. Lenders get paid before shareholders see anything, so equity value equals EV minus net debt (plus or minus minority interest and investments).",
  },
  {
    id: "terminal-value-share",
    question: "If a DCF's terminal value makes up 70% of total enterprise value, what does that tell you?",
    options: [
      "The model is definitely wrong",
      "Most of the estimated value depends on assumptions about the distant future, which is worth stress-testing",
      "The company has too much debt",
      "The explicit forecast period should be shortened to zero",
    ],
    correctIndex: 1,
    explanation:
      "This is normal for a DCF, not a red flag by itself, but it means the terminal growth rate and WACC deserve the most scrutiny of any assumption in the model.",
  },
];
