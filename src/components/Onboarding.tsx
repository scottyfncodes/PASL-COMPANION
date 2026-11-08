"use client";

import { useState } from "react";
import { firstSteps, formatDate, todayISO } from "@/lib/plan";
import type { Answer } from "@/lib/state";
import { useStore } from "@/lib/store";
import { KindBadge } from "./ui";

type Step = 0 | 1 | 2 | 3 | 4;

function Choice({
  options,
  value,
  onChange,
  name,
}: {
  options: { value: Answer; label: string; hint?: string }[];
  value: Answer | null;
  onChange: (v: Answer) => void;
  name: string;
}) {
  return (
    <div role="radiogroup" aria-label={name} className="mt-6 grid gap-3">
      {options.map((o) => {
        const on = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={`rounded-2xl border-2 px-5 py-4 text-left transition-colors ${
              on ? "border-sage-500 bg-sage-50" : "border-line bg-card hover:border-sage-200"
            }`}
          >
            <span className="block font-medium">{o.label}</span>
            {o.hint && <span className="mt-0.5 block text-sm text-ink-soft">{o.hint}</span>}
          </button>
        );
      })}
    </div>
  );
}

export default function Onboarding() {
  const { state, update } = useStore();
  const [step, setStep] = useState<Step>(0);
  const [deadline, setDeadline] = useState(state.deadline ?? "");
  const [started, setStarted] = useState<Answer | null>(state.started);
  const [dirs, setDirs] = useState<Answer | null>(state.hasDirections);

  const preview = firstSteps({ ...state, deadline: deadline || null, started, hasDirections: dirs });
  const pastDeadline = deadline && deadline < todayISO();

  const finish = () =>
    update((s) => ({ ...s, onboarded: true, deadline: deadline || null, started, hasDirections: dirs }));

  const next = () => setStep((s) => Math.min(4, s + 1) as Step);
  const back = () => setStep((s) => Math.max(0, s - 1) as Step);

  const canContinue = step === 0 || (step === 1 && !pastDeadline) || (step === 2 && started) || (step === 3 && dirs) || step === 4;

  return (
    <div className="flex min-h-dvh flex-col bg-paper px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 font-serif text-lg font-semibold">
            <span aria-hidden="true" className="inline-block h-6 w-6 rounded-full bg-sage-500 ring-4 ring-sage-100" />
            PASL Companion
          </span>
          {step > 0 && (
            <span className="text-sm text-ink-faint" aria-live="polite">
              {Math.min(step, 3)} of 3
            </span>
          )}
        </div>

        <div key={step} className="anim-rise flex-1 pt-10 sm:pt-16">
          {step === 0 && (
            <>
              <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight">Let&rsquo;s make PASL feel manageable.</h1>
              <p className="mt-4 text-lg text-ink-soft">
                A calm guide to the ETS Performance Assessment for School Leaders. It shows what&rsquo;s required, what to do next, and what&rsquo;s still missing.
              </p>
              <ul className="mt-8 space-y-3 text-[15px] text-ink-soft">
                <li className="flex gap-3"><span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage-500" />It won&rsquo;t write, score or submit your responses. Your work stays yours.</li>
                <li className="flex gap-3"><span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage-500" />Independent tool, not affiliated with ETS. Requirements cite the July 2025 handbook.</li>
                <li className="flex gap-3"><span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage-500" />Progress is saved only in this browser on this device. Use a backup file to move it.</li>
              </ul>
            </>
          )}

          {step === 1 && (
            <>
              <h1 className="font-serif text-3xl font-semibold tracking-tight">What is your submission deadline?</h1>
              <p className="mt-3 text-ink-soft">
                Use the date from ETS or your program. We&rsquo;ll suggest milestones working back from it. You can change it any time.
              </p>
              <label htmlFor="ob-deadline" className="mt-6 block text-sm font-medium">Submission deadline</label>
              <input
                id="ob-deadline"
                type="date"
                min={todayISO()}
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="mt-2 block min-h-12 w-full rounded-xl border border-line bg-card px-4 text-lg"
                aria-describedby="ob-deadline-help"
              />
              <p id="ob-deadline-help" className="mt-2 text-sm text-ink-faint">
                {pastDeadline ? "That date has passed. Pick a future date, or leave it blank for now." : deadline ? `Saved as ${formatDate(deadline, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}.` : "Not sure yet? Leave it blank. Confirming it will be your first step."}
              </p>
              {deadline && (
                <button type="button" onClick={() => setDeadline("")} className="mt-3 text-sm text-sage-700 underline underline-offset-2">
                  I don&rsquo;t know it yet
                </button>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="font-serif text-3xl font-semibold tracking-tight">Have you started any PASL activities?</h1>
              <p className="mt-3 text-ink-soft">For example, a school-improvement project, a PD session or a team you&rsquo;re leading.</p>
              <Choice
                name="Have you started any PASL activities?"
                value={started}
                onChange={setStarted}
                options={[
                  { value: "no", label: "Not yet", hint: "Starting fresh is perfectly fine." },
                  { value: "yes", label: "Yes, some", hint: "We'll help you note what you have." },
                  { value: "unsure", label: "Not sure", hint: "Some internship work may count." },
                ]}
              />
            </>
          )}

          {step === 3 && (
            <>
              <h1 className="font-serif text-3xl font-semibold tracking-tight">Do you have the official task directions and rubrics?</h1>
              <p className="mt-3 text-ink-soft">
                ETS publishes the detailed directions, guiding prompts and rubrics separately from the handbook, on the PASL website.
              </p>
              <Choice
                name="Do you have the official task directions and rubrics?"
                value={dirs}
                onChange={setDirs}
                options={[
                  { value: "yes", label: "Yes, I have them" },
                  { value: "no", label: "Not yet" },
                  { value: "unsure", label: "Not sure" },
                ]}
              />
            </>
          )}

          {step === 4 && (
            <>
              <h1 className="font-serif text-3xl font-semibold tracking-tight">Your first steps</h1>
              <p className="mt-3 text-ink-soft">A short list to get you going. It&rsquo;ll be waiting on your Today screen.</p>
              <ol className="mt-6 space-y-3">
                {preview.map((f, i) => (
                  <li key={f.id} className="flex gap-4 rounded-2xl border border-line bg-card p-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sm font-semibold text-sage-700">{i + 1}</span>
                    <div>
                      <p className="font-medium leading-snug">{f.text}</p>
                      <div className="mt-1.5"><KindBadge kind={f.kind} /></div>
                    </div>
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>

        <div className="sticky bottom-0 flex gap-3 bg-paper pt-6">
          {step > 0 && (
            <button type="button" onClick={back} className="min-h-12 rounded-full border border-line bg-card px-6 font-medium">
              Back
            </button>
          )}
          <button
            type="button"
            disabled={!canContinue}
            onClick={step === 4 ? finish : next}
            className="min-h-12 flex-1 rounded-full bg-ink px-6 font-medium text-paper transition-opacity disabled:opacity-40"
          >
            {step === 0 ? "Get started" : step === 4 ? "Start with step 1" : step === 1 && !deadline ? "Skip for now" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
