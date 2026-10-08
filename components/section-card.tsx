"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { ReactNode } from "react";

export function SectionCard({
  href,
  title,
  description,
  icon,
  tintClassName,
  large = false,
  className = "",
}: {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
  tintClassName: string;
  large?: boolean;
  className?: string;
}) {
  return (
    <Link href={href} className={`block ${className}`}>
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ y: 0, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`group flex h-full flex-col justify-between rounded-3xl p-6 ${tintClassName} ${large ? "sm:p-9" : ""}`}
      >
        <motion.div
          whileHover={{ rotate: -6, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="w-fit"
        >
          {icon}
        </motion.div>
        <div className="mt-6">
          <h2
            className={`font-[family-name:var(--font-display)] font-semibold tracking-tight ${
              large ? "text-3xl" : "text-xl"
            }`}
          >
            {title}
          </h2>
          <p className={`mt-2 text-foreground/70 ${large ? "max-w-sm text-base" : "text-sm"}`}>{description}</p>
        </div>
      </motion.div>
    </Link>
  );
}
