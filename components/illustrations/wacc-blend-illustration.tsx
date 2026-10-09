export function WaccBlendIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 100" fill="none" className={className} role="img" aria-label="An equity bar and a debt bar merge into one WACC box">
      <rect x="20" y="30" width="60" height="16" fill="var(--series-user)" />
      <rect x="20" y="54" width="36" height="16" fill="var(--muted)" />
      <path d="M90 46 L130 50" stroke="var(--foreground)" strokeWidth="2" />
      <path d="M125 45 L130 50 L125 55" stroke="var(--foreground)" strokeWidth="2" fill="none" />
      <rect x="140" y="38" width="40" height="24" fill="none" stroke="var(--foreground)" strokeWidth="2" />
      <text x="20" y="26" fontSize="9" fill="var(--series-user)">
        equity
      </text>
      <text x="20" y="84" fontSize="9" fill="var(--muted)">
        debt
      </text>
      <text x="145" y="53" fontSize="9" fill="var(--foreground)">
        WACC
      </text>
    </svg>
  );
}
