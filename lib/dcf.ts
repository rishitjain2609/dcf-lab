export type DiscountConvention = "end-year" | "mid-year";

function periodExponent(period: number, convention: DiscountConvention): number {
  return convention === "mid-year" ? period - 0.5 : period;
}

export function presentValue(
  cashFlow: number,
  rate: number,
  period: number,
  convention: DiscountConvention = "end-year"
): number {
  return cashFlow / Math.pow(1 + rate, periodExponent(period, convention));
}

export function discountCashFlows(
  cashFlows: number[],
  rate: number,
  convention: DiscountConvention = "end-year"
): { presentValues: number[]; sum: number } {
  const presentValues = cashFlows.map((cf, i) => presentValue(cf, rate, i + 1, convention));
  return { presentValues, sum: presentValues.reduce((a, b) => a + b, 0) };
}

export function terminalValueGordon(finalCashFlow: number, wacc: number, terminalGrowth: number): number {
  if (terminalGrowth >= wacc) {
    throw new Error("Terminal growth rate must be less than WACC.");
  }
  return (finalCashFlow * (1 + terminalGrowth)) / (wacc - terminalGrowth);
}

export function terminalValueExitMultiple(finalMetric: number, multiple: number): number {
  return finalMetric * multiple;
}

export function validateTerminalGrowth(
  terminalGrowth: number,
  wacc: number
): { valid: boolean; message?: string } {
  if (terminalGrowth >= wacc) {
    return {
      valid: false,
      message: `Terminal growth (${(terminalGrowth * 100).toFixed(1)}%) must be less than WACC (${(
        wacc * 100
      ).toFixed(1)}%).`,
    };
  }
  return { valid: true };
}

export interface EnterpriseValueInputs {
  freeCashFlows: number[];
  wacc: number;
  terminalValue: number;
  convention?: DiscountConvention;
}

export interface EnterpriseValueResult {
  presentValuesOfFcf: number[];
  sumPresentValueOfFcf: number;
  presentValueOfTerminalValue: number;
  enterpriseValue: number;
}

export function computeEnterpriseValue({
  freeCashFlows,
  wacc,
  terminalValue,
  convention = "end-year",
}: EnterpriseValueInputs): EnterpriseValueResult {
  const { presentValues, sum } = discountCashFlows(freeCashFlows, wacc, convention);
  const presentValueOfTerminalValue = presentValue(terminalValue, wacc, freeCashFlows.length, convention);
  return {
    presentValuesOfFcf: presentValues,
    sumPresentValueOfFcf: sum,
    presentValueOfTerminalValue,
    enterpriseValue: sum + presentValueOfTerminalValue,
  };
}

export interface EquityBridgeInputs {
  enterpriseValue: number;
  netDebt: number;
  minorityInterest?: number;
  investments?: number;
}

export function enterpriseToEquityValue({
  enterpriseValue,
  netDebt,
  minorityInterest = 0,
  investments = 0,
}: EquityBridgeInputs): number {
  return enterpriseValue - netDebt - minorityInterest + investments;
}

export function impliedSharePrice(equityValue: number, dilutedShares: number): number {
  if (dilutedShares <= 0) {
    throw new Error("Diluted shares must be positive.");
  }
  return equityValue / dilutedShares;
}

export interface CapmInputs {
  riskFreeRate: number;
  beta: number;
  equityRiskPremium: number;
}

export function costOfEquityCapm({ riskFreeRate, beta, equityRiskPremium }: CapmInputs): number {
  return riskFreeRate + beta * equityRiskPremium;
}

export interface WaccInputs {
  marketCapEquity: number;
  totalDebt: number;
  costOfEquity: number;
  costOfDebt: number;
  taxRate: number;
}

export function wacc({ marketCapEquity, totalDebt, costOfEquity, costOfDebt, taxRate }: WaccInputs): number {
  const total = marketCapEquity + totalDebt;
  if (total <= 0) {
    throw new Error("Market cap equity plus total debt must be positive.");
  }
  const weightOfEquity = marketCapEquity / total;
  const weightOfDebt = totalDebt / total;
  return costOfEquity * weightOfEquity + costOfDebt * (1 - taxRate) * weightOfDebt;
}

type RateInput = number | number[];

function toArray(value: RateInput, length: number): number[] {
  return Array.isArray(value) ? value : Array(length).fill(value);
}

export interface UfcfProjectionInputs {
  baseRevenue: number;
  revenueGrowthRates: number[];
  ebitdaMargin: RateInput;
  depreciationPctOfRevenue: RateInput;
  capexPctOfRevenue: RateInput;
  nwcChangePctOfRevenueDelta: RateInput;
  taxRate: RateInput;
}

export interface UfcfProjectionResult {
  revenue: number[];
  ebitda: number[];
  ebit: number[];
  nopat: number[];
  ufcf: number[];
}

export function projectUnleveredFreeCashFlow({
  baseRevenue,
  revenueGrowthRates,
  ebitdaMargin,
  depreciationPctOfRevenue,
  capexPctOfRevenue,
  nwcChangePctOfRevenueDelta,
  taxRate,
}: UfcfProjectionInputs): UfcfProjectionResult {
  const n = revenueGrowthRates.length;
  const ebitdaMargins = toArray(ebitdaMargin, n);
  const daPcts = toArray(depreciationPctOfRevenue, n);
  const capexPcts = toArray(capexPctOfRevenue, n);
  const nwcPcts = toArray(nwcChangePctOfRevenueDelta, n);
  const taxRates = toArray(taxRate, n);

  const revenue: number[] = [];
  let previousRevenue = baseRevenue;
  for (let i = 0; i < n; i++) {
    const revenueForYear = previousRevenue * (1 + revenueGrowthRates[i]);
    revenue.push(revenueForYear);
    previousRevenue = revenueForYear;
  }

  const ebitda = revenue.map((r, i) => r * ebitdaMargins[i]);
  const depreciation = revenue.map((r, i) => r * daPcts[i]);
  const ebit = ebitda.map((e, i) => e - depreciation[i]);
  const nopat = ebit.map((e, i) => e * (1 - taxRates[i]));
  const capex = revenue.map((r, i) => r * capexPcts[i]);
  const nwcChange = revenue.map((r, i, arr) => {
    const previous = i === 0 ? baseRevenue : arr[i - 1];
    return (r - previous) * nwcPcts[i];
  });
  const ufcf = nopat.map((np, i) => np + depreciation[i] - capex[i] - nwcChange[i]);

  return { revenue, ebitda, ebit, nopat, ufcf };
}

export function buildSensitivityTable<T>(
  rows: number[],
  cols: number[],
  compute: (row: number, col: number) => T
): T[][] {
  return rows.map((row) => cols.map((col) => compute(row, col)));
}
