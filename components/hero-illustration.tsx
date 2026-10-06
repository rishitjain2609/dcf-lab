export function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 400 300"
      className="h-full w-full"
      aria-hidden
      role="presentation"
    >
      <defs>
        <linearGradient id="bar1" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#4338ca" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#4338ca" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="bar2" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#059669" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#059669" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="bar3" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#d97706" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* bars: revenue growing */}
      {[
        { x: 40, h: 60, fill: "url(#bar1)" },
        { x: 95, h: 90, fill: "url(#bar1)" },
        { x: 150, h: 120, fill: "url(#bar1)" },
        { x: 205, h: 150, fill: "url(#bar1)" },
        { x: 260, h: 185, fill: "url(#bar1)" },
      ].map((bar) => (
        <rect
          key={bar.x}
          x={bar.x}
          y={240 - bar.h}
          width={36}
          height={bar.h}
          rx={4}
          fill={bar.fill}
        />
      ))}

      {/* implied-value line trending up, in emerald */}
      <polyline
        points="58,210 113,185 168,150 223,115 278,70"
        fill="none"
        stroke="#059669"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {[
        [58, 210],
        [113, 185],
        [168, 150],
        [223, 115],
        [278, 70],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={5} fill="#059669" />
      ))}

      {/* a dashed "market price" line for contrast, in amber */}
      <polyline
        points="40,230 320,120"
        fill="none"
        stroke="#d97706"
        strokeWidth={2.5}
        strokeDasharray="6 6"
        strokeLinecap="round"
      />

      {/* baseline */}
      <line x1="20" y1="240" x2="340" y2="240" stroke="currentColor" strokeOpacity="0.15" strokeWidth={1.5} />
    </svg>
  );
}
