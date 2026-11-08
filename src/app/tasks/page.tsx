"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ARTIFACTS, HANDBOOK, TASKS, type PaslTask } from "@/lib/pasl";
import { taskProgress } from "@/lib/plan";
import type { TaskStatus } from "@/lib/state";
import { useStore } from "@/lib/store";
import { CheckRow, PageRef, PageTitle, ProgressBar } from "@/components/ui";

const STATUSES: { value: TaskStatus; label: string }[] = [
  { value: "not_started", label: "Not started" },
  { value: "in_progress", label: "In progress" },
  { value: "complete", label: "Complete" },
];

const ART_LABEL = { needed: "Needed", planned: "Planned", collected: "Collected", ready: "Ready" } as const;

function TaskSection({ task }: { task: PaslTask }) {
  const { state, update, toggleCheck } = useStore();
  const status = state.taskStatus[task.id];
  const tp = taskProgress(state, task.id);
  const arts = ARTIFACTS.filter((a) => a.task === task.id);

  return (
    <section id={task.id} aria-labelledby={`${task.id}-h`} className="scroll-mt-24 rounded-3xl border border-line bg-card">
      <div className="p-5 sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-sage-700">Task {task.number}{task.id === "t3" && " · counts double"}</p>
            <h2 id={`${task.id}-h`} className="mt-1 font-serif text-2xl font-semibold leading-tight">{task.title}</h2>
          </div>
          {status === "complete" && (
            <span className="anim-pop flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage-600 text-white" aria-hidden="true">
              <svg viewBox="0 0 20 20" className="h-5 w-5"><path d="M5 10.5l3.2 3.2L15 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          )}
        </div>

        <fieldset className="mt-4">
          <legend className="sr-only">Status for Task {task.number}</legend>
          <div className="inline-flex flex-wrap rounded-full border border-line bg-paper p-1">
            {STATUSES.map((s) => (
              <label
                key={s.value}
                className={`cursor-pointer rounded-full px-3.5 py-2 text-sm font-medium transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-sage-600 ${
                  status === s.value ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
                }`}
              >
                <input
                  type="radio"
                  name={`status-${task.id}`}
                  value={s.value}
                  checked={status === s.value}
                  onChange={() => update((st) => ({ ...st, taskStatus: { ...st.taskStatus, [task.id]: s.value } }))}
                  className="sr-only"
                />
                {s.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-4 flex items-center gap-3">
          <ProgressBar pct={tp.pct} label={`Task ${task.number} checklist progress`} />
          <span className="whitespace-nowrap text-sm tabular-nums text-ink-soft">{tp.done}/{tp.total}</span>
        </div>

        <p className="mt-5 text-[17px]"><span className="font-semibold">In plain English: </span>{task.plain}</p>

        {task.special?.map((s) => (
          <div
            key={s.title}
            role={task.id === "t3" ? "note" : undefined}
            className={`mt-4 rounded-2xl p-4 ${task.id === "t3" ? "border-2 border-amber-ink/30 bg-amber-soft" : "bg-sage-50"}`}
          >
            <p className={`font-semibold ${task.id === "t3" ? "text-amber-ink" : "text-sage-700"}`}>{s.title}</p>
            <p className="mt-1 text-[15px] text-ink">{s.text}</p>
            <p className="mt-1 text-sm"><PageRef page={s.page} /></p>
          </div>
        ))}
      </div>

      <details className="group border-t border-line">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between px-5 font-semibold sm:px-7">
          Official requirements
          <Chevron />
        </summary>
        <div className="space-y-5 px-5 pb-6 sm:px-7">
          <p className="text-[15px] text-ink-soft">{task.summary} <PageRef page={task.page} /></p>
          <dl className="grid gap-3 sm:grid-cols-3">
            <Fact label="Written commentary" value={`Up to ${task.commentaryLimit.toLocaleString("en-US")} characters`} sub={task.commentaryPages} />
            <Fact label="Artifacts" value={`${task.artifactCount} required`} sub={task.id === "t3" ? "5 documents + 1 video" : "all different"} />
            <Fact label="Artifact pages" value={`${task.artifactPageMax} pages max`} sub="across all documents" />
          </dl>
          <div>
            <h3 className="font-semibold">{task.steps.length} steps</h3>
            <ol className="mt-2 space-y-3">
              {task.steps.map((s) => (
                <li key={s.n} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sm font-semibold text-sage-700">{s.n}</span>
                  <div>
                    <p className="font-medium leading-snug">{s.title}</p>
                    <p className="text-[15px] text-ink-soft">{s.gloss} <PageRef page={s.page} /></p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <p className="rounded-xl bg-paper p-3 text-sm text-ink-soft">
            The guiding prompts and rubric criteria for each step are in the official task directions and rubrics on the{" "}
            <a href={HANDBOOK.website} target="_blank" rel="noopener noreferrer" className="text-sage-700 underline underline-offset-2">ETS PASL website</a>. They&rsquo;re not in the handbook, so this app doesn&rsquo;t reproduce them.
          </p>
        </div>
      </details>

      <details className="group border-t border-line">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between px-5 font-semibold sm:px-7">
          <span>Required artifacts <span className="font-normal text-ink-faint">({arts.filter((a) => state.artifacts[a.id]?.status === "ready").length}/{arts.length} ready)</span></span>
          <Chevron />
        </summary>
        <ul className="divide-y divide-line px-5 pb-4 sm:px-7">
          {arts.map((a) => (
            <li key={a.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="font-medium leading-snug">{a.name}</p>
                <p className="text-sm text-ink-faint">{a.pages}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${state.artifacts[a.id]?.status === "ready" ? "bg-sage-600 text-white" : "bg-sage-50 text-sage-700"}`}>
                {ART_LABEL[state.artifacts[a.id]?.status ?? "needed"]}
              </span>
            </li>
          ))}
          <li className="pt-3">
            <Link href={`/evidence#${task.id}`} className="inline-flex min-h-11 items-center font-medium text-sage-700 underline underline-offset-2">
              Track these in Evidence
            </Link>
          </li>
        </ul>
      </details>

      {task.checklist.map((g) => {
        const done = g.items.filter((i) => state.checks[i.id]).length;
        return (
          <details key={g.id} className="group border-t border-line">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between px-5 font-semibold sm:px-7">
              <span>{g.title} <span className="font-normal text-ink-faint">({done}/{g.items.length})</span></span>
              <Chevron />
            </summary>
            <ul className="divide-y divide-line px-5 pb-3 sm:px-7">
              {g.items.map((i) => (
                <CheckRow key={i.id} checked={!!state.checks[i.id]} onToggle={() => toggleCheck(i.id)} title={i.text} kind={i.kind} page={i.page} detail={i.detail} />
              ))}
            </ul>
          </details>
        );
      })}
    </section>
  );
}

function Fact({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl bg-paper p-3">
      <dt className="text-sm text-ink-faint">{label}</dt>
      <dd className="font-semibold">{value}</dd>
      <dd className="text-sm text-ink-soft">{sub}</dd>
    </div>
  );
}

function Chevron() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-ink-faint transition-transform group-open:rotate-180" aria-hidden="true">
      <path d="M5 8l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function TasksPage() {
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView();
  }, []);

  return (
    <div>
      <PageTitle
        title="Tasks"
        intro={<>Three tasks, all submitted together. Items marked <strong>Required</strong> come from the ETS handbook; <strong>Suggested</strong> items are planning tips from this app.</>}
      />
      <div className="space-y-6">
        {TASKS.map((t) => (
          <TaskSection key={t.id} task={t} />
        ))}
      </div>
      <p className="mt-8 text-sm text-ink-faint">
        Scores come from ETS raters using the official rubrics (<PageRef page="30" />). This app doesn&rsquo;t score your work, and completing checklists doesn&rsquo;t guarantee a passing score.
      </p>
    </div>
  );
}
