"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_ITEMS, SITE_NAME } from "@/lib/nav";
import { UserMenu } from "@/components/auth/user-menu";
import { StepMark } from "@/components/motif";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="motif-scope sticky top-0 z-40 bg-background">
      <div className="mx-auto flex max-w-[90rem] items-center justify-between px-4 py-4 sm:px-8">
        <Link href="/" className="t-lead flex items-center gap-2">
          <StepMark />
          {SITE_NAME}
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`t-body font-semibold underline-offset-[0.35em] decoration-2 transition-colors hover:underline ${
                  active ? "underline" : ""
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <UserMenu />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle menu"
            className="press t-body -mr-2 px-2 py-1 font-semibold md:hidden"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col bg-card px-4 py-3 sm:px-8 md:hidden">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="t-body py-2.5 font-semibold"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
