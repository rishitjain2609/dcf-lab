import { describe, expect, it } from "vitest";
import { formatCrore, formatIndianNumber, formatPercent, formatRupees } from "./format";

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
