import { describe, expect, it } from "vitest";
import { computeGameResult, type GameCompany } from "./game";

const company: GameCompany = {
  slug: "test-co",
  company: "Test Co Ltd",
  ticker: "NSE: TESTCO",
  sector: "Test",
  snapshotDate: "2026-01-01",
  lastFYRevenue: 1000,
  ebitdaMargin: 0.2,
  daPct: 0.05,
  capexPct: 0.06,
  nwcPct: 0.1,
  taxRate: 0.25,
  netDebt: 200,
  dilutedShares: 40,
  marketCapAtSnapshot: 1000,
  reference: {
    revenueGrowth: 0.1,
    ebitdaMargin: 0.2,
    capexPct: 0.06,
    wacc: 0.123,
    terminalGrowth: 0.04,
  },
};

describe("computeGameResult", () => {
  it("matches the reference calculation when the user enters the reference assumptions", () => {
    const result = computeGameResult(company, {
      revenueGrowth: company.reference.revenueGrowth,
      ebitdaMargin: company.reference.ebitdaMargin,
      capexPct: company.reference.capexPct,
      wacc: company.reference.wacc,
      terminalGrowth: company.reference.terminalGrowth,
    });

    expect(result.user.impliedValuePerShare).toBeCloseTo(result.reference.impliedValuePerShare, 6);
    expect(result.errorVsReference).toBeCloseTo(0, 6);
    expect(result.driverNotes).toHaveLength(0);
  });

  it("computes market price per share from market cap / diluted shares", () => {
    const result = computeGameResult(company, {
      revenueGrowth: 0.1,
      ebitdaMargin: 0.2,
      capexPct: 0.06,
      wacc: 0.123,
      terminalGrowth: 0.04,
    });
    expect(result.marketPricePerShare).toBe(25); // 1000 / 40
  });

  it("rejects terminal growth at or above WACC with a clear message", () => {
    expect(() =>
      computeGameResult(company, {
        revenueGrowth: 0.1,
        ebitdaMargin: 0.2,
        capexPct: 0.06,
        wacc: 0.1,
        terminalGrowth: 0.1,
      })
    ).toThrow(/must be less than WACC/);
  });

  it("flags a driver note when an assumption diverges from the reference", () => {
    const result = computeGameResult(company, {
      revenueGrowth: 0.2, // reference is 0.1
      ebitdaMargin: 0.2,
      capexPct: 0.06,
      wacc: 0.123,
      terminalGrowth: 0.04,
    });
    const growthNote = result.driverNotes.find((n) => n.factor === "Revenue growth");
    expect(growthNote).toBeDefined();
    expect(growthNote?.message).toMatch(/higher/);
    expect(result.user.impliedValuePerShare).toBeGreaterThan(result.reference.impliedValuePerShare);
  });

  it("higher WACC than reference pushes implied value down", () => {
    const result = computeGameResult(company, {
      revenueGrowth: 0.1,
      ebitdaMargin: 0.2,
      capexPct: 0.06,
      wacc: 0.15, // reference is 0.123
      terminalGrowth: 0.04,
    });
    expect(result.user.impliedValuePerShare).toBeLessThan(result.reference.impliedValuePerShare);
    const waccNote = result.driverNotes.find((n) => n.factor === "WACC");
    expect(waccNote?.message).toMatch(/down/);
  });
});
