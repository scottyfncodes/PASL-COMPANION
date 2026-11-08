import { ARTIFACTS, TASKS, type TaskId } from "./pasl";

export type TaskStatus = "not_started" | "in_progress" | "complete";
export type ArtifactStatus = "needed" | "planned" | "collected" | "ready";
export type Answer = "yes" | "no" | "unsure";

export interface ArtifactState {
  status: ArtifactStatus;
  notes: string;
}

export interface MilestoneState {
  date?: string; // yyyy-mm-dd override
  done?: boolean;
}

export interface AppState {
  version: 1;
  onboarded: boolean;
  deadline: string | null; // yyyy-mm-dd, entered by the candidate
  started: Answer | null;
  hasDirections: Answer | null;
  checks: Record<string, boolean>;
  taskStatus: Record<TaskId, TaskStatus>;
  artifacts: Record<string, ArtifactState>;
  milestones: Record<string, MilestoneState>;
  updatedAt: string;
}

export const STORAGE_KEY = "pasl-companion:v1";

export function initialState(): AppState {
  return {
    version: 1,
    onboarded: false,
    deadline: null,
    started: null,
    hasDirections: null,
    checks: {},
    taskStatus: { t1: "not_started", t2: "not_started", t3: "not_started" },
    artifacts: Object.fromEntries(ARTIFACTS.map((a) => [a.id, { status: "needed", notes: "" }])),
    milestones: {},
    updatedAt: new Date().toISOString(),
  };
}

const TASK_STATUSES: TaskStatus[] = ["not_started", "in_progress", "complete"];
const ARTIFACT_STATUSES: ArtifactStatus[] = ["needed", "planned", "collected", "ready"];
const ANSWERS: Answer[] = ["yes", "no", "unsure"];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Validate untrusted JSON (local storage or an imported backup) into a safe AppState. */
export function sanitize(raw: unknown): AppState | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (r.version !== 1) return null;
  const base = initialState();
  const str = (v: unknown, max = 2000) => (typeof v === "string" ? v.slice(0, max) : "");

  if (typeof r.onboarded === "boolean") base.onboarded = r.onboarded;
  if (typeof r.deadline === "string" && DATE_RE.test(r.deadline)) base.deadline = r.deadline;
  if (ANSWERS.includes(r.started as Answer)) base.started = r.started as Answer;
  if (ANSWERS.includes(r.hasDirections as Answer)) base.hasDirections = r.hasDirections as Answer;

  if (r.checks && typeof r.checks === "object") {
    for (const [k, v] of Object.entries(r.checks as Record<string, unknown>)) {
      if (v === true) base.checks[k.slice(0, 80)] = true;
    }
  }
  if (r.taskStatus && typeof r.taskStatus === "object") {
    for (const t of TASKS) {
      const v = (r.taskStatus as Record<string, unknown>)[t.id];
      if (TASK_STATUSES.includes(v as TaskStatus)) base.taskStatus[t.id] = v as TaskStatus;
    }
  }
  if (r.artifacts && typeof r.artifacts === "object") {
    for (const a of ARTIFACTS) {
      const v = (r.artifacts as Record<string, unknown>)[a.id] as Record<string, unknown> | undefined;
      if (!v || typeof v !== "object") continue;
      base.artifacts[a.id] = {
        status: ARTIFACT_STATUSES.includes(v.status as ArtifactStatus) ? (v.status as ArtifactStatus) : "needed",
        notes: str(v.notes),
      };
    }
  }
  if (r.milestones && typeof r.milestones === "object") {
    for (const [k, v] of Object.entries(r.milestones as Record<string, unknown>)) {
      if (!v || typeof v !== "object") continue;
      const m = v as Record<string, unknown>;
      base.milestones[k.slice(0, 80)] = {
        date: typeof m.date === "string" && DATE_RE.test(m.date) ? m.date : undefined,
        done: m.done === true,
      };
    }
  }
  base.updatedAt = typeof r.updatedAt === "string" ? r.updatedAt : base.updatedAt;
  return base;
}
