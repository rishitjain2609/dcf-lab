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

export type Currency = "INR" | "USD";

/** $ value with B/M suffixes, for aggregate figures like revenue, EV, or equity value. */
export function formatUsdLarge(value: number, decimals = 1): string {
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return `${sign}$${(abs / 1_000_000_000).toFixed(decimals)}B`;
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(decimals)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(decimals)}K`;
  return `${sign}$${abs.toFixed(decimals)}`;
}

/** $ value with no suffix, for per-share prices. */
export function formatUsdPerShare(value: number, decimals = 2): string {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value).toFixed(decimals)}`;
}

/** Aggregate-figure formatter (revenue, EV, equity value) that picks ₹ crore or $ B/M by currency. */
export function formatMoneyLarge(value: number, currency: Currency, decimals?: number): string {
  return currency === "USD" ? formatUsdLarge(value, decimals ?? 1) : formatCrore(value);
}

/** Per-share-price formatter that picks ₹ or $ by currency. */
export function formatMoneyPerShare(value: number, currency: Currency, decimals?: number): string {
  return currency === "USD" ? formatUsdPerShare(value, decimals ?? 2) : formatRupees(value, decimals ?? 2);
}

/** Renders a signed number as "(1,234)" instead of "-1,234", the convention for negatives in financial tables. */
export function toParenthetical(formatted: string, value: number): string {
  if (value >= 0) return formatted;
  return `(${formatted.replace("-", "")})`;
}
