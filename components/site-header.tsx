"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_ITEMS, SITE_NAME } from "@/lib/nav";
import { UserMenu } from "@/components/auth/user-menu";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-background">
      <div className="mx-auto flex max-w-[90rem] items-center justify-between px-4 py-4 sm:px-8">
        <Link href="/" className="ui t-lead font-extrabold tracking-[-0.03em]">
          {SITE_NAME}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`t-small font-medium underline-offset-[0.35em] decoration-2 transition-colors hover:underline ${
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
            className="press t-small -mr-2 px-2 py-2 font-medium md:hidden"
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
