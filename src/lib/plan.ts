import { ARTIFACTS, TASKS, type ChecklistItem, type TaskId } from "./pasl";
import type { AppState } from "./state";

/* ---------- dates (local, day precision) ---------- */

export function todayISO(): string {
  const d = new Date();
  return toISO(d);
}
export function toISO(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
export function parseISO(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
export function addDays(s: string, n: number): string {
  const d = parseISO(s);
  d.setDate(d.getDate() + n);
  return toISO(d);
}
export function daysBetween(a: string, b: string): number {
  return Math.round((parseISO(b).getTime() - parseISO(a).getTime()) / 86_400_000);
}
export function formatDate(s: string, opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }): string {
  return parseISO(s).toLocaleDateString("en-US", opts);
}

/* ---------- first steps (personalised from onboarding) ---------- */

export interface FirstStep extends ChecklistItem {
  href: string;
}

export function firstSteps(s: AppState): FirstStep[] {
  const steps: FirstStep[] = [];
  steps.push(
    s.deadline
      ? {
          id: "start-deadline",
          kind: "official",
          page: "14",
          href: "/plan",
          text: "Double-check your submission deadline against the official ETS submission window",
          detail: "This app never sets ETS dates. Confirm yours on the PASL website or with your program.",
        }
      : {
          id: "start-deadline",
          kind: "official",
          page: "14",
          href: "/plan",
          text: "Confirm your submission deadline and add it to My Plan",
          detail: "The handbook suggests working backward from your deadline. Find your submission window on the PASL website or ask your program.",
        },
  );
  if (s.hasDirections !== "yes") {
    steps.push({
      id: "start-directions",
      kind: "official",
      page: "6, 14",
      href: "/tasks",
      text: "Get the official task directions and rubrics for Tasks 1, 2 and 3",
      detail: "They're on the ETS PASL website. The guiding prompts and rubric criteria aren't in the handbook or in this app.",
    });
  }
  steps.push(
    {
      id: "start-forms",
      kind: "official",
      page: "5, 24, 36",
      href: "/evidence",
      text: "Download the official PASL permission forms (students under 18, over 18, and colleagues/adults)",
      detail: "District or school forms aren't accepted. You keep the signed forms; you don't send them to ETS.",
    },
    {
      id: "start-account",
      kind: "official",
      page: "14",
      href: "/tasks",
      text: "Create your account in the ETS registration system",
      detail: "You build and submit all three tasks from that account.",
    },
  );
  if (s.started === "yes" || s.started === "unsure") {
    steps.push({
      id: "start-map",
      kind: "suggested",
      href: "/evidence",
      text: "Mark any evidence you already have in Evidence",
      detail: "Only record descriptions, never student names or school details.",
    });
  }
  steps.push(
    {
      id: "start-activities",
      kind: "suggested",
      href: "/tasks",
      text: "Pick a leadership activity for each task: a school problem, a PD focus, and a collaborative team",
      detail: "Choose things you can actually lead during your internship before your deadline.",
    },
    {
      id: "start-evidence-plan",
      kind: "suggested",
      href: "/plan",
      text: "Plan when you'll collect evidence and permissions, starting with the slow parts",
      detail: "Longitudinal data, three Task 2 participants, your Task 3 team, and video permissions take the longest.",
    },
  );
  return steps;
}

/* ---------- milestones (suggestions, working back from the deadline) ---------- */

export interface MilestoneDef {
  id: string;
  title: string;
  why: string;
  task?: TaskId;
  weeksBefore: number;
  dependency?: boolean;
  href: string;
}

export const MILESTONES: MilestoneDef[] = [
  { id: "m-materials", title: "Get directions, rubrics and permission forms", why: "Everything else depends on the official materials.", weeksBefore: 22, href: "/tasks" },
  { id: "m-activities", title: "Choose the leadership activity for each task", why: "Pick projects you can lead and finish in time.", weeksBefore: 20, href: "/tasks" },
  { id: "m-data", title: "Gather Task 1 longitudinal data", why: "Needs several dated data points (ETS now limits data to the last five years).", task: "t1", weeksBefore: 19, dependency: true, href: "/evidence" },
  { id: "m-team", title: "Recruit your Task 3 collaborative team", why: "Colleagues' schedules take time to line up.", task: "t3", weeksBefore: 18, dependency: true, href: "/tasks#t3" },
  { id: "m-participants", title: "Select three Task 2 participants", why: "They need different experience levels and must agree to be observed.", task: "t2", weeksBefore: 18, dependency: true, href: "/tasks#t2" },
  { id: "m-permissions", title: "Collect signed permission forms", why: "Required before recording video and before using anyone's work.", weeksBefore: 17, dependency: true, href: "/evidence" },
  { id: "m-t1-implement", title: "Start implementing your Task 1 plan", why: "Leave time to make and document adjustments.", task: "t1", weeksBefore: 15, href: "/tasks#t1" },
  { id: "m-t2-deliver", title: "Lead the Task 2 professional development", why: "Observations come after, so impact has time to show.", task: "t2", weeksBefore: 14, href: "/tasks#t2" },
  { id: "m-video-practice", title: "Record practice videos (at least two sessions)", why: "Gets everyone comfortable on camera.", task: "t3", weeksBefore: 13, dependency: true, href: "/tasks#t3" },
  { id: "m-t2-observe", title: "Observe your three Task 2 participants", why: "Use walk-throughs to see the PD's impact.", task: "t2", weeksBefore: 11, dependency: true, href: "/tasks#t2" },
  { id: "m-video-final", title: "Record final Task 3 video segments", why: "Unedited 5-minute and 10-minute segments, with a buffer to re-record.", task: "t3", weeksBefore: 9, dependency: true, href: "/tasks#t3" },
  { id: "m-draft", title: "Draft all three commentaries", why: "Write, then set it aside a day before revising.", weeksBefore: 7, href: "/tasks" },
  { id: "m-review", title: "Peer read against the rubrics", why: "Someone outside your school reads for gaps.", weeksBefore: 4, href: "/tasks" },
  { id: "m-final-checks", title: "Final checks: identifiers, page and character limits", why: "Quick to fix early, stressful at the last minute.", weeksBefore: 3, href: "/evidence" },
  { id: "m-upload", title: "Combine and upload the video, link all artifacts", why: "Allow at least an hour for the video upload and review.", task: "t3", weeksBefore: 2, href: "/tasks#t3" },
  { id: "m-submit", title: "Submit all three tasks", why: "A week of buffer for technical problems.", weeksBefore: 1, href: "/plan" },
];

const FULL_PLAN_DAYS = 22 * 7;

export interface Milestone extends MilestoneDef {
  suggested: string | null;
  date: string | null;
  done: boolean;
  edited: boolean;
}

/** Suggested dates count back from the candidate's own deadline; compressed if time is short. */
export function buildMilestones(s: AppState, today = todayISO()): { items: Milestone[]; compressed: boolean } {
  const deadline = s.deadline;
  const available = deadline ? daysBetween(today, deadline) : 0;
  const compressed = !!deadline && available < FULL_PLAN_DAYS && available > 0;
  const items = MILESTONES.map((m) => {
    let suggested: string | null = null;
    if (deadline) {
      const offset = m.weeksBefore * 7;
      const scaled = compressed ? Math.round((offset / FULL_PLAN_DAYS) * available) : offset;
      suggested = addDays(deadline, -Math.max(scaled, compressed ? 1 : 0));
      if (compressed && suggested < today) suggested = today;
    }
    const o = s.milestones[m.id] ?? {};
    return { ...m, suggested, date: o.date ?? suggested, done: !!o.done, edited: !!o.date };
  });
  items.sort((a, b) => (a.date && b.date ? a.date.localeCompare(b.date) : b.weeksBefore - a.weeksBefore));
  return { items, compressed };
}

/* ---------- progress & next action ---------- */

export function allTaskItems(): (ChecklistItem & { task: TaskId; group: string })[] {
  return TASKS.flatMap((t) => t.checklist.flatMap((g) => g.items.map((i) => ({ ...i, task: t.id, group: g.title }))));
}

export function progress(s: AppState) {
  const steps = firstSteps(s);
  const items = allTaskItems();
  const ids = [...steps.map((x) => x.id), ...items.map((x) => x.id)];
  const done = ids.filter((id) => s.checks[id]).length + ARTIFACTS.filter((a) => s.artifacts[a.id]?.status === "ready").length;
  const total = ids.length + ARTIFACTS.length;
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

export function taskProgress(s: AppState, task: TaskId) {
  const items = allTaskItems().filter((i) => i.task === task);
  const arts = ARTIFACTS.filter((a) => a.task === task);
  const done = items.filter((i) => s.checks[i.id]).length + arts.filter((a) => s.artifacts[a.id]?.status === "ready").length;
  const total = items.length + arts.length;
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

export interface Action {
  key: string;
  title: string;
  detail?: string;
  kind: "official" | "suggested";
  page?: string;
  href: string;
  checkId?: string;
  milestoneId?: string;
  due?: string | null;
  label: string;
}

/** Ordered list of things to do next: first steps, then dated milestones, then task checklists. */
export function actionQueue(s: AppState, today = todayISO()): Action[] {
  const out: Action[] = [];
  for (const f of firstSteps(s)) {
    if (s.checks[f.id]) continue;
    out.push({ key: f.id, title: f.text, detail: f.detail, kind: f.kind, page: f.page, href: f.href, checkId: f.id, label: "Getting started" });
  }
  const { items } = buildMilestones(s, today);
  for (const m of items) {
    if (m.done) continue;
    if (s.deadline && m.date && daysBetween(today, m.date) > 21) continue; // only near-term milestones
    if (!s.deadline && !m.dependency) continue;
    out.push({ key: m.id, title: m.title, detail: m.why, kind: "suggested", href: m.href, milestoneId: m.id, due: m.date, label: m.dependency ? "Plan ahead" : "Plan" });
  }
  for (const t of TASKS) {
    const next = t.checklist.flatMap((g) => g.items).find((i) => !s.checks[i.id]);
    if (next) {
      out.push({ key: next.id, title: next.text, detail: next.detail, kind: next.kind, page: next.page, href: `/tasks#${t.id}`, checkId: next.id, label: `Task ${t.number}` });
    }
  }
  return out;
}
