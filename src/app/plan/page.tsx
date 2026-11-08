"use client";

import Link from "next/link";
import { buildMilestones, daysBetween, formatDate, todayISO, type Milestone } from "@/lib/plan";
import { useStore } from "@/lib/store";
import { Card, PageRef, PageTitle } from "@/components/ui";

function MilestoneRow({ m, today }: { m: Milestone; today: string }) {
  const { update } = useStore();
  const setM = (patch: { date?: string; done?: boolean }) =>
    update((s) => ({ ...s, milestones: { ...s.milestones, [m.id]: { ...s.milestones[m.id], ...patch } } }));
  const d = m.date ? daysBetween(today, m.date) : null;
  const past = !m.done && d !== null && d < 0;

  return (
    <li className="flex gap-3 py-4">
      <button
        type="button"
        role="checkbox"
        aria-checked={m.done}
        aria-label={m.title}
        onClick={() => setM({ done: !m.done })}
        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          m.done ? "border-sage-600 bg-sage-600 text-white" : "border-sage-200 bg-card hover:border-sage-500"
        }`}
      >
        {m.done && (
          <svg viewBox="0 0 20 20" className="anim-pop h-4 w-4" aria-hidden="true">
            <path d="M5 10.5l3.2 3.2L15 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className={`font-medium leading-snug ${m.done ? "text-ink-faint line-through decoration-sage-200" : ""}`}>{m.title}</p>
          {m.dependency && !m.done && (
            <span className="rounded-full bg-amber-soft px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-ink">Start early</span>
          )}
        </div>
        <p className="mt-0.5 text-sm text-ink-soft">{m.why}</p>
        {m.date !== null && (
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
            <label className="flex items-center gap-2">
              <span className="text-ink-faint">Target</span>
              <input
                type="date"
                value={m.date ?? ""}
                onChange={(e) => e.target.value && setM({ date: e.target.value })}
                className="min-h-10 rounded-lg border border-line bg-paper px-2 text-[16px]"
                aria-label={`Target date for ${m.title}`}
              />
            </label>
            {m.edited && (
              <button type="button" onClick={() => setM({ date: undefined })} className="min-h-10 text-sage-700 underline underline-offset-2">
                Use suggested ({formatDate(m.suggested!)})
              </button>
            )}
            {past && <span className="text-amber-ink">This date has passed. Pick a new date that works.</span>}
            {!m.done && d !== null && d >= 0 && d <= 14 && <span className="text-sage-700">{d === 0 ? "Today" : `In ${d} day${d === 1 ? "" : "s"}`}</span>}
          </div>
        )}
      </div>
    </li>
  );
}

export default function PlanPage() {
  const { state, update } = useStore();
  const today = todayISO();
  const { items, compressed } = buildMilestones(state, today);
  const open = items.filter((m) => !m.done);
  const past = open.filter((m) => m.date && m.date < today);
  const soon = open.filter((m) => !m.date || (m.date >= today && daysBetween(today, m.date) <= 30));
  const later = open.filter((m) => m.date && daysBetween(today, m.date) > 30);
  const done = items.filter((m) => m.done);

  const groups = [
    { key: "past", title: "Ready for a new date", items: past, note: "No problem. Plans change. Choose new dates that fit." },
    { key: "soon", title: state.deadline ? "Next 30 days" : "Milestones", items: soon },
    { key: "later", title: "Later", items: later },
    { key: "done", title: "Done", items: done },
  ].filter((g) => g.items.length);

  return (
    <div>
      <PageTitle
        title="My Plan"
        intro="Suggested milestones, worked back from your deadline. Change any date to fit your internship. Things marked Start early depend on other people or take time."
      />

      <Card className="mb-8">
        <label htmlFor="deadline" className="font-semibold">Your submission deadline</label>
        <p className="mt-1 text-sm text-ink-soft">
          Enter the date from ETS or your program. This app never sets official ETS dates. The handbook suggests working backward from your deadline. <PageRef page="13" />
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <input
            id="deadline"
            type="date"
            value={state.deadline ?? ""}
            onChange={(e) => update((s) => ({ ...s, deadline: e.target.value || null }))}
            className="min-h-12 rounded-xl border border-line bg-paper px-3 text-[17px]"
          />
          {state.deadline && (
            <button type="button" onClick={() => update((s) => ({ ...s, deadline: null }))} className="min-h-11 text-sm text-sage-700 underline underline-offset-2">
              Clear
            </button>
          )}
        </div>
        {state.deadline && state.deadline >= today && (
          <p className="mt-3 text-sm text-ink-soft">{daysBetween(today, state.deadline)} days from today, {formatDate(state.deadline, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}.</p>
        )}
        {state.deadline && state.deadline < today && (
          <p className="mt-3 text-sm text-amber-ink">This date has passed. If you&rsquo;re working toward a new submission or resubmission window, enter that date.</p>
        )}
        {compressed && (
          <p className="mt-3 rounded-xl bg-amber-soft p-3 text-sm text-amber-ink">
            Your timeline is shorter than the full plan, so the suggestions are spaced closer together. Focus on the Start early items first.
          </p>
        )}
        {!state.deadline && (
          <p className="mt-3 rounded-xl bg-sage-50 p-3 text-sm text-sage-700">Add your deadline to see suggested dates. Until then, here is the order that usually works.</p>
        )}
      </Card>

      <div className="space-y-8">
        {groups.map((g) => (
          <section key={g.key} aria-labelledby={`g-${g.key}`}>
            <h2 id={`g-${g.key}`} className="font-serif text-xl font-semibold">{g.title}</h2>
            {g.note && <p className="mt-1 text-sm text-ink-soft">{g.note}</p>}
            <ul className="mt-1 divide-y divide-line rounded-2xl border border-line bg-card px-4 sm:px-5">
              {g.items.map((m) => (
                <MilestoneRow key={m.id} m={m} today={today} />
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-8 text-sm text-ink-faint">
        Milestones are suggestions, not ETS requirements. Resubmission windows and fees are set by ETS (<PageRef page="32" />). Your plan is saved only on this device.{" "}
        <Link href="/about" className="text-sage-700 underline underline-offset-2">Back up your progress</Link>.
      </p>
    </div>
  );
}
