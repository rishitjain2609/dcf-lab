"use client";

import { motion } from "motion/react";

const YEARS = ["Yr 1", "Yr 2", "Yr 3", "Yr 4", "Yr 5"];
const NOMINAL_HEIGHT = 55;
// Each year's cash flow is worth a little less once discounted back to today.
const DISCOUNTED_HEIGHTS = [50, 44, 39, 34, 30];
const BAR_WIDTH = 46;
const COL_GAP = 92;
const START_X = 40;
const TOP_BAR_Y = 34;
const BASELINE_Y = 210;

export function DcfConceptDiagram() {
  return (
    <div className="my-6 rounded-md border border-border bg-card p-4">
      <svg viewBox="0 0 650 250" className="w-full" style={{ aspectRatio: "650 / 250" }}>
        <text x={START_X} y={20} className="fill-muted" style={{ fontSize: 12 }}>
          Cash the business will generate each year
        </text>

        {YEARS.map((year, i) => {
          const x = START_X + i * COL_GAP;
          const discountedHeight = DISCOUNTED_HEIGHTS[i];
          const delay = i * 0.3;
          return (
            <g key={year}>
              {/* nominal cash flow that year, grows down from the top */}
              <motion.rect
                x={x}
                y={TOP_BAR_Y}
                width={BAR_WIDTH}
                height={NOMINAL_HEIGHT}
                rx={3}
                className="fill-violet-500 dark:fill-violet-400"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay }}
                style={{ transformOrigin: `${x + BAR_WIDTH / 2}px ${TOP_BAR_Y}px` }}
              />
              {/* arrow down: "discounted back to today", drawn in */}
              <motion.line
                x1={x + BAR_WIDTH / 2}
                y1={TOP_BAR_Y + NOMINAL_HEIGHT + 6}
                x2={x + BAR_WIDTH / 2}
                y2={BASELINE_Y - discountedHeight - 8}
                className="stroke-muted"
                strokeWidth={1.5}
                markerEnd="url(#dcf-arrow)"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: delay + 0.4 }}
              />
              {/* present value of that year's cash flow, grows up from the baseline */}
              <motion.rect
                x={x}
                y={BASELINE_Y - discountedHeight}
                width={BAR_WIDTH}
                height={discountedHeight}
                rx={3}
                className="fill-violet-300 dark:fill-violet-600"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: delay + 0.7 }}
                style={{ transformOrigin: `${x + BAR_WIDTH / 2}px ${BASELINE_Y}px` }}
              />
              <text x={x + BAR_WIDTH / 2} y={BASELINE_Y + 20} textAnchor="middle" className="fill-muted" style={{ fontSize: 12 }}>
                {year}
              </text>
              {i < YEARS.length - 1 && (
                <motion.text
                  x={x + (BAR_WIDTH + COL_GAP) / 2}
                  y={BASELINE_Y - 12}
                  textAnchor="middle"
                  className="fill-muted"
                  style={{ fontSize: 16 }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: delay + 1 }}
                >
                  +
                </motion.text>
              )}
            </g>
          );
        })}

        <defs>
          <marker id="dcf-arrow" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" className="fill-muted" />
          </marker>
        </defs>

        <motion.text
          x={START_X + 4 * COL_GAP + BAR_WIDTH + 24}
          y={BASELINE_Y - 12}
          className="fill-muted"
          style={{ fontSize: 16 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.8 }}
        >
          =
        </motion.text>

        {/* sum of all discounted cash flows = value today, grows up last */}
        <motion.rect
          x={START_X + 4 * COL_GAP + BAR_WIDTH + 54}
          y={BASELINE_Y - (NOMINAL_HEIGHT + 55)}
          width={58}
          height={NOMINAL_HEIGHT + 55}
          rx={3}
          className="fill-emerald-500 dark:fill-emerald-400"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 2 }}
          style={{ transformOrigin: `${START_X + 4 * COL_GAP + BAR_WIDTH + 54 + 29}px ${BASELINE_Y}px` }}
        />
        <motion.text
          x={START_X + 4 * COL_GAP + BAR_WIDTH + 54 + 29}
          y={BASELINE_Y + 20}
          textAnchor="middle"
          className="fill-foreground"
          style={{ fontSize: 12, fontWeight: 600 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 2.4 }}
        >
          Value today
        </motion.text>

        <text x={START_X} y={TOP_BAR_Y + NOMINAL_HEIGHT + 30} className="fill-muted" style={{ fontSize: 11 }}>
          discounted to present value ↓
        </text>
      </svg>
    </div>
  );
}
