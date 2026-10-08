"use client";

import Link from "next/link";
import { motion } from "motion/react";

const TINTS = [
  "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
  "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
  "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300",
];

export function GuideStepRow({
  href,
  index,
  title,
  isLast = false,
}: {
  href: string;
  index: number;
  title: string;
  isLast?: boolean;
}) {
  return (
    <div className="relative flex gap-4">
      <div className="flex flex-col items-center">
        <span
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full font-mono text-sm font-semibold ${TINTS[index % TINTS.length]}`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        {!isLast && <span className="mt-1 w-px flex-1 bg-border" />}
      </div>
      <Link href={href} className="block flex-1 pb-6">
        <motion.div
          whileHover={{ x: 6 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="group flex items-center justify-between rounded-2xl bg-foreground/5 px-5 py-4 transition-colors group-hover:bg-foreground/10"
        >
          <span className="text-lg font-medium group-hover:text-accent">{title}</span>
          <span className="text-foreground/40 transition group-hover:translate-x-1 group-hover:text-accent">
            →
          </span>
        </motion.div>
      </Link>
    </div>
  );
}
