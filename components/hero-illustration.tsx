"use client";

import { motion } from "motion/react";

const BARS = [
  { x: 40, h: 60 },
  { x: 95, h: 90 },
  { x: 150, h: 120 },
  { x: 205, h: 150 },
  { x: 260, h: 185 },
];

const LINE_POINTS: [number, number][] = [
  [58, 210],
  [113, 185],
  [168, 150],
  [223, 115],
  [278, 70],
];

export function HeroIllustration() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden role="presentation">
      <defs>
        <linearGradient id="bar1" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#4338ca" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#4338ca" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* bars: revenue growing, each scales up from the baseline */}
      {BARS.map((bar, i) => (
        <motion.rect
          key={bar.x}
          x={bar.x}
          width={36}
          height={bar.h}
          y={240 - bar.h}
          rx={4}
          fill="url(#bar1)"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
          style={{ transformOrigin: `${bar.x + 18}px 240px` }}
        />
      ))}

      {/* implied-value line trending up, drawn in */}
      <motion.polyline
        points={LINE_POINTS.map((p) => p.join(",")).join(" ")}
        fill="none"
        stroke="#059669"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
      />
      {LINE_POINTS.map(([cx, cy], i) => (
        <motion.circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r={5}
          fill="#059669"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.5 + i * 0.2 }}
        />
      ))}

      {/* a dashed "market price" line for contrast, drawn in */}
      <motion.polyline
        points="40,230 320,120"
        fill="none"
        stroke="#d97706"
        strokeWidth={2.5}
        strokeDasharray="6 6"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 0.8 }}
      />

      <line x1="20" y1="240" x2="340" y2="240" stroke="currentColor" strokeOpacity="0.15" strokeWidth={1.5} />
    </svg>
  );
}
