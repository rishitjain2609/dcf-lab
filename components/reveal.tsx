"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Turns on the entrance motion defined in globals.css: marks the document as
 * script-capable, then adds `.is-in` to every `[data-rise]`, `.shutter` and
 * `[data-rise-group]` element as it scrolls into view (once). Re-runs on each
 * route change so new pages get the same treatment.
 */
export function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.add("js");
    const targets = document.querySelectorAll<HTMLElement>("[data-rise], .shutter, [data-rise-group]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    targets.forEach((el) => {
      if (!el.classList.contains("is-in")) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
