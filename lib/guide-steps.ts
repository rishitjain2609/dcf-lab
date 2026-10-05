export interface GuideStep {
  slug: string;
  title: string;
}

export const GUIDE_STEPS: GuideStep[] = [
  { slug: "setup-and-conventions", title: "Setup & conventions" },
  { slug: "historicals", title: "Historicals" },
  { slug: "assumptions", title: "Assumptions" },
  { slug: "revenue-build", title: "Revenue build" },
  { slug: "income-statement-to-ebit", title: "Income statement to EBIT" },
  { slug: "ufcf", title: "Unlevered free cash flow" },
  { slug: "wacc", title: "WACC" },
  { slug: "discounting-mid-year", title: "Discounting (mid-year)" },
  { slug: "terminal-value", title: "Terminal value (Gordon + exit multiple)" },
  { slug: "ev-to-equity-bridge", title: "EV-to-equity bridge" },
  { slug: "sensitivity-tables", title: "Sensitivity tables" },
  { slug: "checks", title: "Checks" },
];
