export type NavItem = {
  href: string;
  label: string;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/why-dcf", label: "Why DCF" },
  { href: "/guide", label: "Guide" },
  { href: "/models", label: "Models" },
  { href: "/ledger", label: "Ledger" },
  { href: "/game", label: "Game" },
  { href: "/impact", label: "Impact" },
  { href: "/about", label: "About" },
];

export const SITE_NAME = "DCF Lab";

export const DISCLAIMER =
  "Educational content only. Not investment advice. Not a SEBI-registered research analyst.";
