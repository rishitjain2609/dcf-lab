export function TimeValueIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 100" fill="none" className={className} role="img" aria-label="A smaller circle, today, connects by a dashed arrow to a larger circle, future">
      <line x1="20" y1="70" x2="180" y2="70" stroke="var(--foreground)" strokeWidth="2" />
      <circle cx="40" cy="70" r="10" fill="var(--series-user)" />
      <circle cx="160" cy="70" r="16" fill="none" stroke="var(--muted)" strokeWidth="2" />
      <path d="M60 55 L140 40" stroke="var(--muted)" strokeWidth="2" strokeDasharray="4 4" />
      <path d="M135 35 L140 40 L135 45" stroke="var(--muted)" strokeWidth="2" fill="none" />
      <text x="24" y="92" fontSize="10" fill="var(--foreground)">
        today
      </text>
      <text x="142" y="92" fontSize="10" fill="var(--muted)">
        future
      </text>
    </svg>
  );
}
