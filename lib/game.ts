import {
  computeEnterpriseValue,
  enterpriseToEquityValue,
  impliedSharePrice,
  percentGap,
  projectUnleveredFreeCashFlow,
  terminalValueGordon,
  validateTerminalGrowth,
} from "./dcf";

export interface GameCompanyReference {
  revenueGrowth: number;
  ebitdaMargin: number;
  taxRate: number;
  daPct: number;
  capexPct: number;
  nwcPct: number;
  wacc: number;
  terminalGrowth: number;
}

export interface GameCompany {
  slug: string;
  company: string;
  ticker: string;
  exchange: string;
  currency: "INR" | "USD";
  sector: string;
  snapshotDate: string | null;
  /** True until real financials replace the placeholder numbers below. */
  dataPending: boolean;
  lastFYRevenue: number;
  ebitdaMargin: number;
  daPct: number;
  capexPct: number;
  nwcPct: number;
  taxRate: number;
  netDebt: number;
  dilutedShares: number;
  marketCapAtSnapshot: number;
  /** Trailing few quarters of revenue, for the pick-a-company sparkline. */
  revenueHistory: number[];
  reference: GameCompanyReference;
}

export interface GameAssumptions {
  revenueGrowth: number;
  ebitdaMargin: number;
  taxRate: number;
  daPct: number;
  capexPct: number;
  nwcPct: number;
  wacc: number;
  terminalGrowth: number;
}

export interface GameCalculation {
  revenue: number[];
  ebitda: number[];
  ebit: number[];
  ufcf: number[];
  presentValuesOfFcf: number[];
  terminalValue: number;
  presentValueOfTerminalValue: number;
  enterpriseValue: number;
  equityValue: number;
  impliedValuePerShare: number;
}

export interface DriverNote {
  factor: string;
  message: string;
}

export interface GameResult {
  user: GameCalculation;
  reference: GameCalculation;
  marketPricePerShare: number;
  errorVsMarket: number;
  errorVsReference: number;
  driverNotes: DriverNote[];
}

const FORECAST_YEARS = 5;

/** Runs the full UFCF → EV → equity → implied price chain for one set of assumptions. Safe to call directly from the UI (e.g. for a sensitivity grid). */
export function runCalculation(company: GameCompany, assumptions: GameAssumptions): GameCalculation {
  const projection = projectUnleveredFreeCashFlow({
    baseRevenue: company.lastFYRevenue,
    revenueGrowthRates: Array(FORECAST_YEARS).fill(assumptions.revenueGrowth),
    ebitdaMargin: assumptions.ebitdaMargin,
    depreciationPctOfRevenue: assumptions.daPct,
    capexPctOfRevenue: assumptions.capexPct,
    nwcChangePctOfRevenueDelta: assumptions.nwcPct,
    taxRate: assumptions.taxRate,
  });

  const finalUfcf = projection.ufcf[projection.ufcf.length - 1];
  const terminalValue = terminalValueGordon(finalUfcf, assumptions.wacc, assumptions.terminalGrowth);

  const { presentValuesOfFcf, presentValueOfTerminalValue, enterpriseValue } = computeEnterpriseValue({
    freeCashFlows: projection.ufcf,
    wacc: assumptions.wacc,
    terminalValue,
    convention: "end-year",
  });

  const equityValue = enterpriseToEquityValue({ enterpriseValue, netDebt: company.netDebt });
  const impliedValuePerShare = impliedSharePrice(equityValue, company.dilutedShares);

  return {
    revenue: projection.revenue,
    ebitda: projection.ebitda,
    ebit: projection.ebit,
    ufcf: projection.ufcf,
    presentValuesOfFcf,
    terminalValue,
    presentValueOfTerminalValue,
    enterpriseValue,
    equityValue,
    impliedValuePerShare,
  };
}

const PERCENTAGE_POINT_NOTE_THRESHOLD = 0.005; // 0.5 percentage points

function buildDriverNotes(assumptions: GameAssumptions, reference: GameCompanyReference): DriverNote[] {
  const notes: DriverNote[] = [];

  const growthDelta = assumptions.revenueGrowth - reference.revenueGrowth;
  if (Math.abs(growthDelta) >= PERCENTAGE_POINT_NOTE_THRESHOLD) {
    notes.push({
      factor: "Revenue growth",
      message: `You used ${(assumptions.revenueGrowth * 100).toFixed(1)}% vs. a reference ${(
        reference.revenueGrowth * 100
      ).toFixed(1)}%. That ${growthDelta > 0 ? "higher" : "lower"} growth compounds every year, pushing value ${
        growthDelta > 0 ? "up" : "down"
      }.`,
    });
  }

  const marginDelta = assumptions.ebitdaMargin - reference.ebitdaMargin;
  if (Math.abs(marginDelta) >= PERCENTAGE_POINT_NOTE_THRESHOLD) {
    notes.push({
      factor: "EBITDA margin",
      message: `You used ${(assumptions.ebitdaMargin * 100).toFixed(1)}% vs. a reference ${(
        reference.ebitdaMargin * 100
      ).toFixed(1)}%. That ${marginDelta > 0 ? "fatter" : "thinner"} margin means more cash from the same revenue, pushing value ${
        marginDelta > 0 ? "up" : "down"
      }.`,
    });
  }

  const capexDelta = assumptions.capexPct - reference.capexPct;
  if (Math.abs(capexDelta) >= PERCENTAGE_POINT_NOTE_THRESHOLD) {
    notes.push({
      factor: "Capex",
      message: `You used ${(assumptions.capexPct * 100).toFixed(1)}% of revenue vs. a reference ${(
        reference.capexPct * 100
      ).toFixed(1)}%. Capex is cash leaving before it reaches UFCF, so ${
        capexDelta > 0 ? "more" : "less"
      } capex pushes value ${capexDelta > 0 ? "down" : "up"}.`,
    });
  }

  const waccDelta = assumptions.wacc - reference.wacc;
  if (Math.abs(waccDelta) >= PERCENTAGE_POINT_NOTE_THRESHOLD) {
    notes.push({
      factor: "WACC",
      message: `You used ${(assumptions.wacc * 100).toFixed(1)}% vs. a reference ${(reference.wacc * 100).toFixed(
        1
      )}%. A ${waccDelta > 0 ? "higher" : "lower"} discount rate shrinks the value of every future cash flow, pushing value ${
        waccDelta > 0 ? "down" : "up"
      } (it hits the terminal value hardest, since that's the furthest-out cash flow).`,
    });
  }

  const terminalGrowthDelta = assumptions.terminalGrowth - reference.terminalGrowth;
  if (Math.abs(terminalGrowthDelta) >= PERCENTAGE_POINT_NOTE_THRESHOLD) {
    notes.push({
      factor: "Terminal growth",
      message: `You used ${(assumptions.terminalGrowth * 100).toFixed(1)}% vs. a reference ${(
        reference.terminalGrowth * 100
      ).toFixed(1)}%. This is usually the single biggest lever in a DCF, since it compounds forever inside the
      terminal value. A ${terminalGrowthDelta > 0 ? "higher" : "lower"} terminal growth pushes value ${
        terminalGrowthDelta > 0 ? "up" : "down"
      }, often by more than any other single assumption here.`,
    });
  }

  return notes;
}

export function computeGameResult(company: GameCompany, assumptions: GameAssumptions): GameResult {
  const validation = validateTerminalGrowth(assumptions.terminalGrowth, assumptions.wacc);
  if (!validation.valid) {
    throw new Error(validation.message);
  }

  const user = runCalculation(company, assumptions);
  const reference = runCalculation(company, company.reference);

  const marketPricePerShare = company.marketCapAtSnapshot / company.dilutedShares;
  const errorVsMarket = percentGap(marketPricePerShare, user.impliedValuePerShare);
  const errorVsReference = percentGap(reference.impliedValuePerShare, user.impliedValuePerShare);
  const driverNotes = buildDriverNotes(assumptions, company.reference);

  return { user, reference, marketPricePerShare, errorVsMarket, errorVsReference, driverNotes };
}

export interface TornadoRow {
  factor: string;
  /** Implied price swapping in just this one user assumption, others held at reference. */
  impliedValuePerShare: number;
  /** Signed delta vs. the pure-reference implied price, the bar length a tornado chart ranks by. */
  delta: number;
}

const TORNADO_FACTORS: { key: keyof GameAssumptions; label: string }[] = [
  { key: "revenueGrowth", label: "Revenue growth" },
  { key: "ebitdaMargin", label: "EBITDA margin" },
  { key: "capexPct", label: "Capex" },
  { key: "wacc", label: "WACC" },
  { key: "terminalGrowth", label: "Terminal growth" },
];

/** One-factor-at-a-time sensitivity: for each assumption, how much of the user/reference gap it alone explains. */
export function computeTornadoData(company: GameCompany, assumptions: GameAssumptions): TornadoRow[] {
  const referenceAssumptions: GameAssumptions = company.reference;
  const referencePrice = runCalculation(company, referenceAssumptions).impliedValuePerShare;

  const rows = TORNADO_FACTORS.map(({ key, label }) => {
    const oneAtATime: GameAssumptions = { ...referenceAssumptions, [key]: assumptions[key] };
    let impliedValuePerShare: number;
    try {
      impliedValuePerShare = runCalculation(company, oneAtATime).impliedValuePerShare;
    } catch {
      impliedValuePerShare = referencePrice;
    }
    return { factor: label, impliedValuePerShare, delta: impliedValuePerShare - referencePrice };
  });

  return rows.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
}
