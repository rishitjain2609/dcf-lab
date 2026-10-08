"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { ReactNode } from "react";

export function SectionCard({
  href,
  title,
  description,
  icon,
  borderClass,
}: {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
  borderClass: string;
}) {
  return (
    <Link href={href} className="block">
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ y: 0, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`group flex gap-4 rounded-lg border border-border bg-card p-5 transition-colors ${borderClass}`}
      >
        <motion.div whileHover={{ rotate: -6, scale: 1.08 }} transition={{ type: "spring", stiffness: 300 }}>
          {icon}
        </motion.div>
        <div>
          <h2 className="font-medium group-hover:text-accent">{title}</h2>
          <p className="mt-1 text-sm text-muted">{description}</p>
        </div>
      </motion.div>
    </Link>
  );
}
