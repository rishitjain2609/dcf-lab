import { describe, expect, it } from "vitest";
import { computeGameResult, computeTornadoData, type GameCompany } from "./game";

const company: GameCompany = {
  slug: "test-co",
  company: "Test Co Ltd",
  ticker: "TESTCO",
  exchange: "NSE",
  currency: "INR",
  sector: "Test",
  snapshotDate: "2026-01-01",
  dataPending: false,
  lastFYRevenue: 1000,
  ebitdaMargin: 0.2,
  daPct: 0.05,
  capexPct: 0.06,
  nwcPct: 0.1,
  taxRate: 0.25,
  netDebt: 200,
  dilutedShares: 40,
  marketCapAtSnapshot: 1000,
  revenueHistory: [800, 850, 900, 950, 1000],
  reference: {
    revenueGrowth: 0.1,
    ebitdaMargin: 0.2,
    taxRate: 0.25,
    daPct: 0.05,
    capexPct: 0.06,
    nwcPct: 0.1,
    wacc: 0.123,
    terminalGrowth: 0.04,
  },
};

describe("computeGameResult", () => {
  it("matches the reference calculation when the user enters the reference assumptions", () => {
    const result = computeGameResult(company, { ...company.reference });

    expect(result.user.impliedValuePerShare).toBeCloseTo(result.reference.impliedValuePerShare, 6);
    expect(result.errorVsReference).toBeCloseTo(0, 6);
    expect(result.driverNotes).toHaveLength(0);
  });

  it("computes market price per share from market cap / diluted shares", () => {
    const result = computeGameResult(company, { ...company.reference });
    expect(result.marketPricePerShare).toBe(25); // 1000 / 40
  });

  it("rejects terminal growth at or above WACC with a clear message", () => {
    expect(() =>
      computeGameResult(company, { ...company.reference, wacc: 0.1, terminalGrowth: 0.1 })
    ).toThrow(/must be less than WACC/);
  });

  it("flags a driver note when an assumption diverges from the reference", () => {
    const result = computeGameResult(company, { ...company.reference, revenueGrowth: 0.2 }); // reference is 0.1
    const growthNote = result.driverNotes.find((n) => n.factor === "Revenue growth");
    expect(growthNote).toBeDefined();
    expect(growthNote?.message).toMatch(/higher/);
    expect(result.user.impliedValuePerShare).toBeGreaterThan(result.reference.impliedValuePerShare);
  });

  it("higher WACC than reference pushes implied value down", () => {
    const result = computeGameResult(company, { ...company.reference, wacc: 0.15 }); // reference is 0.123
    expect(result.user.impliedValuePerShare).toBeLessThan(result.reference.impliedValuePerShare);
    const waccNote = result.driverNotes.find((n) => n.factor === "WACC");
    expect(waccNote?.message).toMatch(/down/);
  });
});

describe("computeTornadoData", () => {
  it("has zero delta for every factor when assumptions match the reference", () => {
    const rows = computeTornadoData(company, { ...company.reference });
    expect(rows).toHaveLength(5);
    for (const row of rows) {
      expect(row.delta).toBeCloseTo(0, 6);
    }
  });

  it("ranks factors by absolute impact, largest first", () => {
    const rows = computeTornadoData(company, { ...company.reference, terminalGrowth: 0.08 }); // reference is 0.04, large isolated move
    expect(rows[0].factor).toBe("Terminal growth");
    expect(Math.abs(rows[0].delta)).toBeGreaterThan(0);
    expect(rows.slice(1).every((r) => Math.abs(r.delta) <= Math.abs(rows[0].delta))).toBe(true);
  });

  it("falls back to the reference price instead of throwing when an isolated swap breaks the terminal-growth guard", () => {
    const rows = computeTornadoData(company, { ...company.reference, terminalGrowth: 0.5 }); // >> reference WACC, would throw if not guarded
    const row = rows.find((r) => r.factor === "Terminal growth");
    expect(row?.delta).toBe(0);
  });
});
