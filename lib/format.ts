function indianDigitGroups(integerDigits: string): string {
  if (integerDigits.length <= 3) return integerDigits;
  const lastThree = integerDigits.slice(-3);
  let rest = integerDigits.slice(0, -3);
  const groups: string[] = [];
  while (rest.length > 2) {
    groups.unshift(rest.slice(-2));
    rest = rest.slice(0, -2);
  }
  if (rest.length > 0) groups.unshift(rest);
  return [...groups, lastThree].join(",");
}

export function formatIndianNumber(value: number, decimals = 0): string {
  const sign = value < 0 ? "-" : "";
  const fixed = Math.abs(value).toFixed(decimals);
  const [integerPart, decimalPart] = fixed.split(".");
  const grouped = indianDigitGroups(integerPart);
  return decimalPart ? `${sign}${grouped}.${decimalPart}` : `${sign}${grouped}`;
}

/** ₹ value with Indian grouping and 1 decimal place, for figures already in crore. */
export function formatCrore(value: number): string {
  return `₹${formatIndianNumber(value, 1)} cr`;
}

/** ₹ value with Indian grouping and no decimals, for whole-rupee figures (e.g. share price-ish amounts). */
export function formatRupees(value: number, decimals = 2): string {
  return `₹${formatIndianNumber(value, decimals)}`;
}

export function formatPercent(value: number, decimals = 1): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${(value * 100).toFixed(decimals)}%`;
}
