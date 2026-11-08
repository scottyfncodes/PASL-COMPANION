"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useStore } from "@/lib/store";
import Onboarding from "./Onboarding";

const NAV = [
  { href: "/", label: "Today", icon: "M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z" },
  { href: "/tasks", label: "Tasks", icon: "M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2" },
  { href: "/evidence", label: "Evidence", icon: "M4 7a2 2 0 012-2h4l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2z" },
  { href: "/plan", label: "My Plan", icon: "M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z" },
];

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  const { state, ready } = useStore();
  const path = usePathname();
  const isActive = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  if (!ready) {
    return <div className="min-h-dvh" aria-busy="true" />;
  }
  if (!state.onboarded) {
    return <Onboarding />;
  }

  return (
    <div className="min-h-dvh">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-card focus:px-4 focus:py-2">
        Skip to content
      </a>
      <header className="sticky top-0 z-20 border-b border-line/70 bg-paper/90 pt-[env(safe-area-inset-top)] backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-serif text-lg font-semibold">
            <span aria-hidden="true" className="inline-block h-6 w-6 rounded-full bg-sage-500 ring-4 ring-sage-100" />
            PASL Companion
          </Link>
          <nav aria-label="Main" className="hidden gap-1 sm:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={isActive(n.href) ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-[15px] font-medium transition-colors ${
                  isActive(n.href) ? "bg-sage-100 text-sage-700" : "text-ink-soft hover:bg-sage-50 hover:text-ink"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/about"
            aria-current={path === "/about" ? "page" : undefined}
            className="rounded-full px-3 py-2 text-[15px] text-ink-soft hover:bg-sage-50 hover:text-ink sm:ml-2"
          >
            About &amp; backup
          </Link>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-3xl px-4 pb-32 pt-6 sm:px-6 sm:pb-16 sm:pt-10">
        {children}
      </main>

      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden"
      >
        <ul className="mx-auto grid max-w-md grid-cols-4">
          {NAV.map((n) => {
            const active = isActive(n.href);
            return (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-[60px] flex-col items-center justify-center gap-0.5 text-[12px] font-medium ${
                    active ? "text-sage-700" : "text-ink-faint"
                  }`}
                >
                  <span className={`rounded-full px-4 py-1 transition-colors ${active ? "bg-sage-100" : ""}`}>
                    <Icon d={n.icon} />
                  </span>
                  {n.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
