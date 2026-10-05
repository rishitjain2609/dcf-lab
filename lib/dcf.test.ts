import { describe, expect, it } from "vitest";
import {
  buildSensitivityTable,
  computeEnterpriseValue,
  costOfEquityCapm,
  discountCashFlows,
  enterpriseToEquityValue,
  impliedSharePrice,
  presentValue,
  projectUnleveredFreeCashFlow,
  terminalValueExitMultiple,
  terminalValueGordon,
  validateTerminalGrowth,
  wacc,
} from "./dcf";

describe("presentValue", () => {
  it("discounts end-year by the full period", () => {
    expect(presentValue(110, 0.1, 1, "end-year")).toBeCloseTo(100, 6);
  });

  it("discounts mid-year by half a period less", () => {
    const endYear = presentValue(100, 0.1, 1, "end-year");
    const midYear = presentValue(100, 0.1, 1, "mid-year");
    expect(midYear).toBeGreaterThan(endYear);
    expect(midYear).toBeCloseTo(100 / Math.pow(1.1, 0.5), 6);
  });
});

describe("the brief's reference case: UFCF 100,110,121,133,146; WACC 10%; g 4%; end-year", () => {
  const freeCashFlows = [100, 110, 121, 133, 146];
  const waccRate = 0.1;
  const terminalGrowth = 0.04;

  it("produces a Gordon terminal value off the final year FCF", () => {
    const tv = terminalValueGordon(146, waccRate, terminalGrowth);
    expect(tv).toBeCloseTo(2530.6667, 2);
  });

  it("produces EV ≈ 2025.6", () => {
    const terminalValue = terminalValueGordon(146, waccRate, terminalGrowth);
    const result = computeEnterpriseValue({
      freeCashFlows,
      wacc: waccRate,
      terminalValue,
      convention: "end-year",
    });
    expect(result.enterpriseValue).toBeCloseTo(2025.6, 1);
  });
});

describe("terminalValueGordon", () => {
  it("throws when terminal growth is not below WACC", () => {
    expect(() => terminalValueGordon(100, 0.08, 0.08)).toThrow();
    expect(() => terminalValueGordon(100, 0.08, 0.09)).toThrow();
  });
});

describe("terminalValueExitMultiple", () => {
  it("multiplies the exit-year metric by the multiple", () => {
    expect(terminalValueExitMultiple(500, 12)).toBe(6000);
  });
});

describe("validateTerminalGrowth", () => {
  it("flags growth at or above WACC", () => {
    expect(validateTerminalGrowth(0.1, 0.1).valid).toBe(false);
    expect(validateTerminalGrowth(0.11, 0.1).valid).toBe(false);
  });

  it("passes growth below WACC", () => {
    expect(validateTerminalGrowth(0.04, 0.1).valid).toBe(true);
  });
});

describe("discountCashFlows", () => {
  it("sums the present values of each cash flow", () => {
    const { presentValues, sum } = discountCashFlows([100, 100], 0.1, "end-year");
    expect(presentValues).toHaveLength(2);
    expect(sum).toBeCloseTo(presentValues[0] + presentValues[1], 10);
  });
});

describe("enterpriseToEquityValue / impliedSharePrice", () => {
  it("subtracts net debt and minority interest, adds back investments", () => {
    const equityValue = enterpriseToEquityValue({
      enterpriseValue: 1000,
      netDebt: 200,
      minorityInterest: 50,
      investments: 30,
    });
    expect(equityValue).toBe(780);
  });

  it("divides equity value by diluted shares", () => {
    expect(impliedSharePrice(780, 100)).toBe(7.8);
  });

  it("rejects non-positive share counts", () => {
    expect(() => impliedSharePrice(780, 0)).toThrow();
  });
});

describe("costOfEquityCapm / wacc", () => {
  it("computes CAPM cost of equity", () => {
    expect(costOfEquityCapm({ riskFreeRate: 0.07, beta: 1.2, equityRiskPremium: 0.06 })).toBeCloseTo(0.142, 6);
  });

  it("weights cost of equity and after-tax cost of debt by capital structure", () => {
    const rate = wacc({
      marketCapEquity: 800,
      totalDebt: 200,
      costOfEquity: 0.14,
      costOfDebt: 0.08,
      taxRate: 0.25,
    });
    // we = 0.8, wd = 0.2, after-tax kd = 0.06
    expect(rate).toBeCloseTo(0.8 * 0.14 + 0.2 * 0.06, 10);
  });
});

describe("projectUnleveredFreeCashFlow", () => {
  it("builds revenue, EBIT, NOPAT and UFCF from flat assumptions", () => {
    const result = projectUnleveredFreeCashFlow({
      baseRevenue: 1000,
      revenueGrowthRates: [0.1, 0.1],
      ebitdaMargin: 0.2,
      depreciationPctOfRevenue: 0.05,
      capexPctOfRevenue: 0.06,
      nwcChangePctOfRevenueDelta: 0.1,
      taxRate: 0.25,
    });

    expect(result.revenue[0]).toBeCloseTo(1100, 6);
    expect(result.revenue[1]).toBeCloseTo(1210, 6);

    const ebitdaYear1 = 1100 * 0.2;
    const daYear1 = 1100 * 0.05;
    const ebitYear1 = ebitdaYear1 - daYear1;
    const nopatYear1 = ebitYear1 * 0.75;
    const capexYear1 = 1100 * 0.06;
    const nwcYear1 = (1100 - 1000) * 0.1;
    const ufcfYear1 = nopatYear1 + daYear1 - capexYear1 - nwcYear1;

    expect(result.ebit[0]).toBeCloseTo(ebitYear1, 6);
    expect(result.nopat[0]).toBeCloseTo(nopatYear1, 6);
    expect(result.ufcf[0]).toBeCloseTo(ufcfYear1, 6);
  });

  it("accepts per-year arrays instead of flat assumptions", () => {
    const result = projectUnleveredFreeCashFlow({
      baseRevenue: 100,
      revenueGrowthRates: [0.1, 0.05],
      ebitdaMargin: [0.3, 0.32],
      depreciationPctOfRevenue: [0.04, 0.04],
      capexPctOfRevenue: [0.05, 0.05],
      nwcChangePctOfRevenueDelta: [0.1, 0.1],
      taxRate: [0.25, 0.25],
    });
    expect(result.revenue).toHaveLength(2);
    expect(result.ebitda[1]).toBeCloseTo(result.revenue[1] * 0.32, 6);
  });
});

describe("buildSensitivityTable", () => {
  it("computes a value for every row/column combination", () => {
    const table = buildSensitivityTable([1, 2], [10, 20], (row, col) => row * col);
    expect(table).toEqual([
      [10, 20],
      [20, 40],
    ]);
  });
});
