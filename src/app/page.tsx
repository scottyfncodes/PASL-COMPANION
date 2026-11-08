"use client";

import Link from "next/link";
import { HANDBOOK, TASKS, parseRef } from "@/lib/pasl";
import { actionQueue, daysBetween, firstSteps, formatDate, progress, taskProgress, todayISO, type Action } from "@/lib/plan";
import { useStore } from "@/lib/store";
import { Card, CheckRow, KindBadge, ProgressBar } from "@/components/ui";

const STATUS_LABEL = { not_started: "Not started", in_progress: "In progress", complete: "Complete" } as const;

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

function dueText(due?: string | null) {
  if (!due) return null;
  const d = daysBetween(todayISO(), due);
  if (d < 0) return `Target was ${formatDate(due)}. Pick a new date whenever you're ready.`;
  if (d === 0) return "Target: today";
  return `Target: ${formatDate(due)}`;
}

export default function Today() {
  const { state, toggleCheck, update } = useStore();
  const p = progress(state);
  const queue = actionQueue(state);
  const [next, ...rest] = queue;
  const upcoming = rest.slice(0, 3);
  const steps = firstSteps(state);
  const stepsLeft = steps.filter((s) => !state.checks[s.id]).length;
  const today = todayISO();
  const daysLeft = state.deadline ? daysBetween(today, state.deadline) : null;

  const complete = (a: Action) => {
    if (a.checkId) toggleCheck(a.checkId);
    else if (a.milestoneId)
      update((s) => ({ ...s, milestones: { ...s.milestones, [a.milestoneId!]: { ...s.milestones[a.milestoneId!], done: true } } }));
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">{greeting()}.</h1>
        <p className="mt-2 text-ink-soft">
          {p.done === 0
            ? "Here's where to begin. One step at a time."
            : `You've finished ${p.done} of ${p.total} things. Nice, steady progress.`}
        </p>
        <div className="mt-4 flex items-center gap-3">
          <ProgressBar pct={p.pct} label="Overall progress" />
          <span className="w-12 text-right text-sm font-medium tabular-nums text-ink-soft">{p.pct}%</span>
        </div>
        <p className="mt-3 text-sm text-ink-faint">
          {daysLeft === null ? (
            <>No deadline set yet. <Link href="/plan" className="text-sage-700 underline underline-offset-2">Add it in My Plan</Link></>
          ) : daysLeft >= 0 ? (
            <>Your deadline: {formatDate(state.deadline!, { month: "long", day: "numeric", year: "numeric" })} · {daysLeft} days away</>
          ) : (
            <>Your deadline date has passed. <Link href="/plan" className="text-sage-700 underline underline-offset-2">Update it in My Plan</Link></>
          )}
        </p>
      </header>

      {next ? (
        <section aria-labelledby="next-h" className="anim-rise rounded-3xl bg-sage-600 p-6 text-white shadow-sm sm:p-8">
          <p id="next-h" className="text-sm font-semibold uppercase tracking-wider text-sage-100">Your next step</p>
          <p className="mt-3 font-serif text-2xl font-semibold leading-snug sm:text-[28px]">{next.title}</p>
          {next.detail && <p className="mt-2 text-sage-50">{next.detail}</p>}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${next.kind === "official" ? "bg-white text-sage-700" : "bg-sage-500 text-white ring-1 ring-sage-200/50"}`}>
              {next.kind === "official" ? "Required by ETS" : "Suggested"}
            </span>
            <span className="text-sage-100">{next.label}</span>
            {next.page && <span className="text-sage-100">· {parseRef(next.page).label}</span>}
          </div>
          {next.due && <p className="mt-2 text-sm text-sage-100">{dueText(next.due)}</p>}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={next.href} className="inline-flex min-h-12 items-center rounded-full bg-white px-6 font-medium text-sage-700 hover:bg-sage-50">
              Go to it
            </Link>
            <button type="button" onClick={() => complete(next)} className="min-h-12 rounded-full border border-white/50 px-6 font-medium hover:bg-white/10">
              Mark done
            </button>
          </div>
        </section>
      ) : (
        <Card className="anim-rise text-center">
          <p className="font-serif text-2xl font-semibold">Everything on your list is checked off.</p>
          <p className="mt-2 text-ink-soft">Take a breath. Review your tasks against the official rubrics before you submit.</p>
        </Card>
      )}

      {upcoming.length > 0 && (
        <section aria-labelledby="up-h">
          <h2 id="up-h" className="font-serif text-xl font-semibold">Coming up</h2>
          <ul className="mt-3 space-y-3">
            {upcoming.map((a) => (
              <li key={a.key}>
                <Link href={a.href} className="block rounded-2xl border border-line bg-card p-4 transition-colors hover:border-sage-200">
                  <div className="flex flex-wrap items-center gap-2 text-sm text-ink-faint">
                    <KindBadge kind={a.kind} />
                    <span>{a.label}</span>
                    {a.due && <span>· {dueText(a.due)}</span>}
                  </div>
                  <p className="mt-1.5 font-medium leading-snug">{a.title}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {stepsLeft > 0 && (
        <Card>
          <h2 className="font-serif text-xl font-semibold">Getting started</h2>
          <p className="mt-1 text-sm text-ink-soft">{steps.length - stepsLeft} of {steps.length} done</p>
          <ul className="mt-2 divide-y divide-line">
            {steps.map((s) => (
              <CheckRow key={s.id} checked={!!state.checks[s.id]} onToggle={() => toggleCheck(s.id)} title={s.text} kind={s.kind} page={s.page} detail={s.detail} />
            ))}
          </ul>
        </Card>
      )}

      <section aria-labelledby="tasks-h">
        <h2 id="tasks-h" className="font-serif text-xl font-semibold">Your three tasks</h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-3">
          {TASKS.map((t) => {
            const tp = taskProgress(state, t.id);
            return (
              <li key={t.id}>
                <Link href={`/tasks#${t.id}`} className="flex h-full flex-col rounded-2xl border border-line bg-card p-4 transition-colors hover:border-sage-200">
                  <span className="text-sm text-ink-faint">Task {t.number}</span>
                  <span className="mt-0.5 font-medium leading-snug">{t.short}</span>
                  <span className="mt-auto pt-3 text-sm text-ink-soft">{STATUS_LABEL[state.taskStatus[t.id]]}</span>
                  <span className="mt-2"><ProgressBar pct={tp.pct} label={`Task ${t.number} progress`} /></span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <p className="text-sm text-ink-faint">
        Saved only in this browser on this device. Nothing syncs automatically.{" "}
        <Link href="/about" className="text-sage-700 underline underline-offset-2">Back up or move your progress</Link>. Independent tool, not affiliated with ETS. Checklists help you stay organized but don&rsquo;t guarantee a passing score. Requirements cite the ETS PASL Candidate and Educator Handbook ({HANDBOOK.edition}).
      </p>
    </div>
  );
}
