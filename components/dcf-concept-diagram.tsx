const YEARS = ["Yr 1", "Yr 2", "Yr 3", "Yr 4", "Yr 5"];

export function DcfConceptDiagram() {
  const barX = [260, 340, 420, 500, 580];
  const barTopY = 40;
  const barBottomY = 100;
  const todayX = 90;
  const todayTopY = 55;

  return (
    <div className="my-6 rounded-md border border-border bg-card p-4">
      <svg viewBox="0 0 650 230" className="w-full" style={{ aspectRatio: "650 / 230" }}>
        {/* future cash flow bars, equal size -- what the business will actually generate */}
        {barX.map((x, i) => (
          <g key={x}>
            <rect
              x={x}
              y={barTopY}
              width={44}
              height={barBottomY - barTopY}
              rx={3}
              className="fill-violet-500 dark:fill-violet-400"
              opacity={0.9}
            />
            <text x={x + 22} y={barBottomY + 16} textAnchor="middle" className="fill-muted" style={{ fontSize: 12 }}>
              {YEARS[i]}
            </text>
            {/* discount arrow curving down-left, shrinking to represent present value */}
            <path
              d={`M ${x + 22} ${barBottomY + 4} C ${x - 20} ${140}, ${todayX + 60 - i * 8} ${150}, ${todayX + 40} ${todayTopY + 30}`}
              fill="none"
              className="stroke-muted"
              strokeWidth={1.3}
              strokeDasharray="3 3"
              markerEnd="url(#arrow)"
              opacity={0.7}
            />
          </g>
        ))}

        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" className="fill-muted" />
          </marker>
        </defs>

        {/* value today: the sum of all discounted cash flows */}
        <rect
          x={todayX}
          y={todayTopY}
          width={54}
          height={135}
          rx={3}
          className="fill-emerald-500 dark:fill-emerald-400"
        />
        <text x={todayX + 27} y={todayTopY + 135 + 20} textAnchor="middle" className="fill-foreground" style={{ fontSize: 13, fontWeight: 600 }}>
          Value today
        </text>

        <line x1={todayX - 20} y1={todayTopY - 12} x2={620} y2={todayTopY - 12} className="stroke-border" strokeWidth={1} />
        <text x={(todayX + 620) / 2} y={todayTopY - 20} textAnchor="middle" className="fill-muted" style={{ fontSize: 11 }}>
          each year&apos;s cash, discounted back and added up
        </text>
      </svg>
    </div>
  );
}
