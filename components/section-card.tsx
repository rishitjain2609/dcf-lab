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
  tags,
}: {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
  tintClassName: string;
  large?: boolean;
  className?: string;
  tags?: string[];
}) {
  return (
    <Link href={href} className={`block ${className}`}>
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ y: 0, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`group flex h-full flex-col justify-between rounded-3xl p-6 ${tintClassName} ${large ? "sm:p-10" : ""}`}
      >
        <motion.div
          whileHover={{ rotate: -6, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="w-fit"
        >
          {icon}
        </motion.div>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-background/40 px-4 py-1.5 text-sm font-medium text-foreground/80"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="mt-6">
          <h2
            className={`font-[family-name:var(--font-display)] font-semibold tracking-tight ${
              large ? "text-4xl" : "text-2xl"
            }`}
          >
            {title}
          </h2>
          <p className={`mt-3 text-foreground/70 ${large ? "max-w-sm text-lg" : "text-base"}`}>{description}</p>
        </div>
      </motion.div>
    </Link>
  );
}
