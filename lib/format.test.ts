import { describe, expect, it } from "vitest";
import {
  formatCrore,
  formatIndianNumber,
  formatMoneyLarge,
  formatMoneyPerShare,
  formatPercent,
  formatRupees,
  formatUsdLarge,
  formatUsdPerShare,
  toParenthetical,
} from "./format";

describe("formatIndianNumber", () => {
  it("groups the last three digits, then pairs of two", () => {
    expect(formatIndianNumber(123456)).toBe("1,23,456");
    expect(formatIndianNumber(1234567)).toBe("12,34,567");
    expect(formatIndianNumber(1000)).toBe("1,000");
    expect(formatIndianNumber(999)).toBe("999");
  });

  it("keeps a requested number of decimal places", () => {
    expect(formatIndianNumber(1234.5, 1)).toBe("1,234.5");
    expect(formatIndianNumber(1234.567, 2)).toBe("1,234.57");
  });

  it("preserves the sign for negative values", () => {
    expect(formatIndianNumber(-1234)).toBe("-1,234");
  });
});

describe("formatCrore", () => {
  it("prefixes with ₹, groups the integer part, and keeps one decimal", () => {
    expect(formatCrore(1234.5)).toBe("₹1,234.5 cr");
    expect(formatCrore(29.34)).toBe("₹29.3 cr");
  });
});

describe("formatRupees", () => {
  it("defaults to two decimal places", () => {
    expect(formatRupees(29.34)).toBe("₹29.34");
  });
});

describe("formatPercent", () => {
  it("formats a fraction as a signed percentage", () => {
    expect(formatPercent(0.1534)).toBe("+15.3%");
    expect(formatPercent(-0.0812)).toBe("-8.1%");
    expect(formatPercent(0)).toBe("0.0%");
  });
});

describe("formatUsdLarge", () => {
  it("picks B/M/K suffixes by magnitude", () => {
    expect(formatUsdLarge(1_500_000_000)).toBe("$1.5B");
    expect(formatUsdLarge(42_300_000)).toBe("$42.3M");
    expect(formatUsdLarge(8_200)).toBe("$8.2K");
    expect(formatUsdLarge(950)).toBe("$950.0");
  });

  it("preserves the sign for negative values", () => {
    expect(formatUsdLarge(-2_000_000)).toBe("-$2.0M");
  });
});

describe("formatUsdPerShare", () => {
  it("defaults to two decimal places with no suffix", () => {
    expect(formatUsdPerShare(74.5)).toBe("$74.50");
  });
});

describe("formatMoneyLarge / formatMoneyPerShare", () => {
  it("routes to crore/rupees for INR and B-M/plain for USD", () => {
    expect(formatMoneyLarge(29.34, "INR")).toBe("₹29.3 cr");
    expect(formatMoneyLarge(42_300_000, "USD")).toBe("$42.3M");
    expect(formatMoneyPerShare(29.34, "INR")).toBe("₹29.34");
    expect(formatMoneyPerShare(74.5, "USD")).toBe("$74.50");
  });
});

describe("toParenthetical", () => {
  it("wraps negative formatted values in parentheses with no minus sign", () => {
    expect(toParenthetical("-$2.0M", -2_000_000)).toBe("($2.0M)");
    expect(toParenthetical("₹29.34", 29.34)).toBe("₹29.34");
  });
});
