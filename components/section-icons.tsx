type IconProps = { className?: string };

export function WhyDcfIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none">
      <circle cx="18" cy="17" r="11" className="stroke-violet-500 dark:stroke-violet-400" strokeWidth="2.5" />
      <path d="M26 25l9 9" className="stroke-violet-500 dark:stroke-violet-400" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M13 19l3.5 3.5L23 15"
        className="stroke-violet-500 dark:stroke-violet-400"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GuideIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none">
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={6 + i * 6}
          y={28 - i * 8}
          width="9"
          height={6 + i * 8}
          rx="1.5"
          className="fill-indigo-500 dark:fill-indigo-400"
          opacity={0.4 + i * 0.3}
        />
      ))}
      <path d="M8 12l6-6 6 6" className="stroke-indigo-500 dark:stroke-indigo-400" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 7v9" className="stroke-indigo-500 dark:stroke-indigo-400" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function ModelsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none">
      <rect x="7" y="18" width="7" height="15" rx="1" className="fill-emerald-500 dark:fill-emerald-400" opacity="0.6" />
      <rect x="17" y="10" width="7" height="23" rx="1" className="fill-emerald-500 dark:fill-emerald-400" />
      <rect x="27" y="22" width="7" height="11" rx="1" className="fill-emerald-500 dark:fill-emerald-400" opacity="0.6" />
      <path d="M6 33h28" className="stroke-emerald-600 dark:stroke-emerald-300" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function GameIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none">
      <circle cx="20" cy="20" r="13" className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="2.5" />
      <circle cx="20" cy="20" r="7.5" className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="2.2" />
      <circle cx="20" cy="20" r="2.2" className="fill-amber-500 dark:fill-amber-400" />
    </svg>
  );
}
