"use client";

import { useEffect, useState } from "react";
import { ARTIFACTS, HANDBOOK, TASKS, type Artifact } from "@/lib/pasl";
import type { ArtifactStatus } from "@/lib/state";
import { useStore } from "@/lib/store";
import { PageRef, PageTitle } from "@/components/ui";

const STATUSES: { value: ArtifactStatus; label: string }[] = [
  { value: "needed", label: "Needed" },
  { value: "planned", label: "Planned" },
  { value: "collected", label: "Collected" },
  { value: "ready", label: "Ready" },
];

function ArtifactCard({ a }: { a: Artifact }) {
  const { state, update } = useStore();
  const cur = state.artifacts[a.id] ?? { status: "needed" as ArtifactStatus, notes: "" };
  const [notes, setNotes] = useState(cur.notes);
  const set = (patch: Partial<typeof cur>) =>
    update((s) => ({ ...s, artifacts: { ...s.artifacts, [a.id]: { ...cur, ...s.artifacts[a.id], ...patch } } }));

  return (
    <li className={`rounded-2xl border bg-card p-4 transition-colors sm:p-5 ${cur.status === "ready" ? "border-sage-200" : "border-line"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold leading-snug">{a.name}</h3>
          <p className="mt-0.5 text-sm text-ink-faint">{a.pages} · <PageRef page={a.page} /></p>
        </div>
        {cur.status === "ready" && (
          <span className="anim-pop flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sage-600 text-white" aria-hidden="true">
            <svg viewBox="0 0 20 20" className="h-4 w-4"><path d="M5 10.5l3.2 3.2L15 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        )}
      </div>
      <p className="mt-2 text-[15px] text-ink-soft">{a.description}</p>

      <fieldset className="mt-3">
        <legend className="sr-only">Status for {a.name}</legend>
        <div className="grid grid-cols-4 gap-1 rounded-xl bg-paper p-1">
          {STATUSES.map((s) => (
            <label
              key={s.value}
              className={`flex min-h-10 cursor-pointer items-center justify-center rounded-lg text-[13px] font-medium transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-sage-600 sm:text-sm ${
                cur.status === s.value ? (s.value === "ready" ? "bg-sage-600 text-white" : "bg-ink text-paper") : "text-ink-soft hover:text-ink"
              }`}
            >
              <input type="radio" name={`st-${a.id}`} value={s.value} checked={cur.status === s.value} onChange={() => set({ status: s.value })} className="sr-only" />
              {s.label}
            </label>
          ))}
        </div>
      </fieldset>

      <p className={`mt-3 rounded-xl p-3 text-sm ${a.isVideo ? "bg-amber-soft text-amber-ink" : "bg-sage-50 text-sage-700"}`}>
        <span className="font-semibold">Permissions: </span>{a.permission}
      </p>

      <details className="group mt-2">
        <summary className="flex min-h-11 cursor-pointer list-none items-center text-sm font-medium text-sage-700">
          {cur.notes ? "Edit note" : "Add a note"}
        </summary>
        <label htmlFor={`n-${a.id}`} className="sr-only">Note for {a.name}</label>
        <textarea
          id={`n-${a.id}`}
          rows={3}
          maxLength={2000}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => notes !== cur.notes && set({ notes })}
          placeholder="e.g. Use spring benchmark summary; ask Colleague 2 for the meeting notes"
          className="mt-1 block w-full rounded-xl border border-line bg-paper p-3 text-[16px]"
        />
        <p className="mt-1 text-xs text-ink-faint">Keep notes non-sensitive: no student, colleague or school names, and no confidential records.</p>
      </details>
      {cur.notes && <p className="mt-1 whitespace-pre-line text-sm text-ink-soft">{cur.notes}</p>}
    </li>
  );
}

export default function EvidencePage() {
  const { state } = useStore();
  const ready = ARTIFACTS.filter((a) => state.artifacts[a.id]?.status === "ready").length;
  const missing = ARTIFACTS.filter((a) => state.artifacts[a.id]?.status === "needed").length;

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(`ev-${id}`)?.scrollIntoView();
  }, []);

  return (
    <div>
      <PageTitle
        title="Evidence"
        intro={<>All {ARTIFACTS.length} required artifacts in one place. {ready} ready, {missing} not started yet. Track status here; you&rsquo;ll upload the real files in the ETS submission system.</>}
      />

      <div className="mb-8 space-y-3 rounded-2xl border border-line bg-card p-5 text-[15px]">
        <p className="font-semibold">Keep it private</p>
        <ul className="space-y-2 text-ink-soft">
          <li>This app doesn&rsquo;t store files. Never type student information, school names or confidential records here.</li>
          <li>On submitted artifacts, cross out names of teachers, students, schools, districts and your town. Use &ldquo;Colleague 1&rdquo; and &ldquo;my school&rdquo;. <PageRef page="17" /></li>
          <li>Use only the official PASL permission forms from the{" "}
            <a href={HANDBOOK.website} target="_blank" rel="noopener noreferrer" className="text-sage-700 underline underline-offset-2">ETS PASL website</a>.
            Keep the signed forms yourself; don&rsquo;t send them to ETS. <PageRef page="24, 35" /></li>
          <li>Data must be dated and no older than five years before your submission window. <PageRef page="20" /></li>
        </ul>
      </div>

      <div className="space-y-10">
        {TASKS.map((t) => (
          <section key={t.id} id={`ev-${t.id}`} aria-labelledby={`ev-${t.id}-h`} className="scroll-mt-24">
            <h2 id={`ev-${t.id}-h`} className="font-serif text-xl font-semibold">Task {t.number}: {t.title}</h2>
            <p className="mt-1 text-sm text-ink-soft">
              {t.artifactCount} different artifacts · {t.artifactPageMax} pages maximum in total · each linked once <PageRef page={t.page} />
            </p>
            <ul className="mt-4 space-y-3">
              {ARTIFACTS.filter((a) => a.task === t.id).map((a) => (
                <ArtifactCard key={a.id} a={a} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
