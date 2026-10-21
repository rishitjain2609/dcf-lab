export interface QuizQuestion {
  id: string;
  concept: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "wacc",
    concept: "WACC",
    question: "What does WACC represent in a DCF?",
    options: [
      "The company's net profit margin",
      "The return investors require for the risk of the business",
      "The government's benchmark interest rate",
      "The company's historical revenue growth rate",
    ],
    correctIndex: 1,
    explanation:
      "WACC blends the return equity investors demand (via CAPM) with the after-tax cost of debt, weighted by how the company is financed.",
  },
  {
    id: "terminal-growth-guard",
    concept: "Terminal growth",
    question: "Why must terminal growth be less than WACC in the Gordon growth formula?",
    options: [
      "It's a regulatory requirement in India",
      "Otherwise the formula divides by zero or a negative number",
      "Terminal growth doesn't affect the formula",
      "WACC must always be lower than growth for the forecast to be accurate",
    ],
    correctIndex: 1,
    explanation:
      "TV = FCF × (1+g) / (WACC - g). If g is equal to or above WACC, the bottom of the fraction is zero or negative and the formula gives no usable answer.",
  },
  {
    id: "ufcf-excludes",
    concept: "Unlevered FCF",
    question: "What does Unlevered Free Cash Flow (UFCF) exclude that levered free cash flow would include?",
    options: ["Taxes", "Depreciation", "Interest paid to lenders", "Capital expenditure"],
    correctIndex: 2,
    explanation:
      "UFCF leaves out interest, as if the company had no debt. That lets you discount it at WACC and compare companies however they're financed.",
  },
  {
    id: "ev-vs-equity",
    concept: "EV vs. equity",
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
    concept: "Terminal value",
    question: "If a DCF's terminal value makes up 70% of total enterprise value, what does that tell you?",
    options: [
      "The model is definitely wrong",
      "Most of the value depends on what you assume happens after the forecast years",
      "The company has too much debt",
      "The explicit forecast period should be shortened to zero",
    ],
    correctIndex: 1,
    explanation:
      "That's common in a DCF. It means terminal growth and WACC are the two inputs to check hardest, since small changes in them move the price the most.",
  },
];
