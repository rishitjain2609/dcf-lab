/**
 * Shared Recharts theme for the analyst-tool section. Recharts computes some
 * stroke/fill values in JS (for animation), so these are literal hex values
 * rather than CSS var() references — kept in sync by hand with the
 * `.analyst-scope` block in app/globals.css.
 */
export const CHART_COLORS = {
  ink: "#15171c",
  muted: "#6b6e77",
  border: "#e2e0db",
  user: "#2b5fd9",
  market: "#15171c",
  reference: "#8c8f99",
  up: "#1f8a5f",
  down: "#c23b3b",
} as const;

export const CHART_FONT_FAMILY = "var(--font-sans)";

export const axisTickStyle = {
  fontSize: 11,
  fill: CHART_COLORS.muted,
  fontFamily: CHART_FONT_FAMILY,
};

export const tooltipContentStyle = {
  background: "#ffffff",
  border: `1px solid ${CHART_COLORS.border}`,
  borderRadius: 8,
  fontSize: 12,
  fontFamily: CHART_FONT_FAMILY,
  padding: "8px 12px",
};

export const tooltipLabelStyle = {
  color: CHART_COLORS.ink,
  fontWeight: 600,
  marginBottom: 4,
};
