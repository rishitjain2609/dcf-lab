export function TerminalValueIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 100" fill="none" className={className} role="img" aria-label="Five growing bars for the explicit forecast, then a bracket opening into forever for the terminal value">
      <rect x="20" y="60" width="14" height="20" fill="var(--series-user)" />
      <rect x="40" y="52" width="14" height="28" fill="var(--series-user)" />
      <rect x="60" y="44" width="14" height="36" fill="var(--series-user)" />
      <rect x="80" y="36" width="14" height="44" fill="var(--series-user)" />
      <rect x="100" y="28" width="14" height="52" fill="var(--series-user)" />
      <path d="M124 80 L180 80" stroke="var(--muted)" strokeWidth="2" />
      <path d="M124 20 L180 20" stroke="var(--muted)" strokeWidth="2" />
      <path d="M124 80 L124 20" stroke="var(--muted)" strokeWidth="2" strokeDasharray="4 4" />
      <text x="128" y="53" fontSize="9" fill="var(--muted)">
        forever
      </text>
    </svg>
  );
}
