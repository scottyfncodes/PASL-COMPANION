"use client";

import type { ReactNode } from "react";
import { HANDBOOK, parseRef, type Kind } from "@/lib/pasl";

export function PageRef({ page }: { page?: string }) {
  if (!page) return null;
  const ref = parseRef(page);
  if (!ref.newer) {
    return <span className="whitespace-nowrap text-ink-faint">{ref.label}</span>;
  }
  return (
    <a
      href={`${HANDBOOK.newerUrl}#page=${parseInt(ref.pages, 10)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="whitespace-nowrap text-amber-ink underline decoration-amber-ink/30 underline-offset-2"
      aria-label={`${ref.label} (opens the ETS PDF)`}
    >
      {ref.label}
    </a>
  );
}

export function KindBadge({ kind }: { kind: Kind }) {
  return kind === "official" ? (
    <span className="inline-flex items-center rounded-full bg-ink px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-paper">
      Required
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full border border-sage-200 bg-sage-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-sage-700">
      Suggested
    </span>
  );
}

export function CheckRow({
  checked,
  onToggle,
  title,
  kind,
  page,
  detail,
  children,
}: {
  checked: boolean;
  onToggle: () => void;
  title: string;
  kind?: Kind;
  page?: string;
  detail?: string;
  children?: ReactNode;
}) {
  return (
    <li className="flex gap-3 py-3">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-label={title}
        onClick={onToggle}
        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          checked ? "border-sage-600 bg-sage-600 text-white" : "border-sage-200 bg-card hover:border-sage-500"
        }`}
      >
        {checked && (
          <svg key="tick" viewBox="0 0 20 20" className="anim-pop h-4 w-4" aria-hidden="true">
            <path d="M5 10.5l3.2 3.2L15 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      <div className="min-w-0 flex-1">
        <p className={`transition-colors ${checked ? "text-ink-faint line-through decoration-sage-200" : ""}`}>{title}</p>
        {(kind || page) && (
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            {kind && <KindBadge kind={kind} />}
            <PageRef page={page} />
          </div>
        )}
        {detail && <p className="mt-1 text-sm text-ink-soft">{detail}</p>}
        {children}
      </div>
    </li>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-line bg-card p-5 sm:p-6 ${className}`}>{children}</section>;
}

export function ProgressBar({ pct, label }: { pct: number; label: string }) {
  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className="h-2 w-full overflow-hidden rounded-full bg-sage-100"
    >
      <div className="h-full rounded-full bg-sage-500 transition-[width] duration-500 ease-out" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function PageTitle({ title, intro }: { title: string; intro?: ReactNode }) {
  return (
    <header className="mb-6">
      <h1 className="font-serif text-3xl font-semibold tracking-tight">{title}</h1>
      {intro && <p className="mt-2 max-w-prose text-ink-soft">{intro}</p>}
    </header>
  );
}
