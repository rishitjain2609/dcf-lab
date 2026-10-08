"use client";

import Link from "next/link";
import { motion } from "motion/react";

export function GuideStepRow({ href, index, title }: { href: string; index: number; title: string }) {
  return (
    <Link href={href} className="block">
      <motion.div
        whileHover={{ x: 6 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="group flex items-center gap-3 rounded-md border border-border bg-card px-4 py-3 transition-colors hover:border-accent"
      >
        <span className="font-mono text-sm text-muted transition-colors group-hover:text-accent">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="group-hover:text-accent">{title}</span>
      </motion.div>
    </Link>
  );
}
