"use client";

import { useRef, useState } from "react";
import { ETHICS_POINTS, HANDBOOK } from "@/lib/pasl";
import { toISO } from "@/lib/plan";
import { sanitize } from "@/lib/state";
import { useStore } from "@/lib/store";
import { Card, PageRef, PageTitle } from "@/components/ui";

export default function AboutPage() {
  const { state, replace, reset, update, storageOk } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pasl-companion-backup-${toISO(new Date())}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMsg({ ok: true, text: "Backup downloaded. Keep it somewhere safe, like your own cloud drive." });
  };

  const importJSON = async (file: File) => {
    try {
      if (file.size > 1_000_000) throw new Error("too large");
      const parsed = sanitize(JSON.parse(await file.text()));
      if (!parsed) throw new Error("invalid");
      if (!window.confirm("Replace the progress on this device with the backup? This can't be undone.")) return;
      replace({ ...parsed, onboarded: true });
      setMsg({ ok: true, text: "Backup restored." });
    } catch {
      setMsg({ ok: false, text: "That file isn't a PASL Companion backup, so nothing was changed." });
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-8">
      <PageTitle title="About & backup" />

      <Card>
        <h2 className="font-serif text-xl font-semibold">Your progress lives on this device</h2>
        <p className="mt-2 text-ink-soft">
          Everything is saved in this browser only. It doesn&rsquo;t sync to your other devices, and clearing browser data (or Private Browsing) will erase it. Download a backup now and then, and use it to move to another device.
        </p>
        {!storageOk && (
          <p className="mt-3 rounded-xl bg-amber-soft p-3 text-sm text-amber-ink">This browser is blocking storage, so progress won&rsquo;t be kept after you close the page. Download a backup before leaving.</p>
        )}
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={exportJSON} className="min-h-12 rounded-full bg-ink px-6 font-medium text-paper">
            Download backup
          </button>
          <button type="button" onClick={() => fileRef.current?.click()} className="min-h-12 rounded-full border border-line bg-card px-6 font-medium">
            Restore from backup
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            aria-label="Choose a backup file"
            onChange={(e) => e.target.files?.[0] && importJSON(e.target.files[0])}
          />
        </div>
        <p role="status" aria-live="polite" className={`mt-3 text-sm ${msg?.ok === false ? "text-amber-ink" : "text-sage-700"}`}>{msg?.text}</p>
        <p className="mt-2 text-xs text-ink-faint">Last change: {new Date(state.updatedAt).toLocaleString("en-US")}</p>
      </Card>

      <Card>
        <h2 className="font-serif text-xl font-semibold">What this app is, and isn&rsquo;t</h2>
        <ul className="mt-3 space-y-2 text-ink-soft">
          <li>An independent planning companion. It is <strong className="text-ink">not affiliated with or endorsed by ETS</strong>, and it isn&rsquo;t the submission system.</li>
          <li>It doesn&rsquo;t write, score or certify your responses. Completing its checklists doesn&rsquo;t guarantee a passing score.</li>
          <li>Requirements marked <strong className="text-ink">Required</strong> come from the ETS handbook, with page numbers. <strong className="text-ink">Suggested</strong> items are planning tips.</li>
        </ul>
      </Card>

      <Card>
        <h2 className="font-serif text-xl font-semibold">Ethics and confidentiality</h2>
        <ul className="mt-3 space-y-3">
          {ETHICS_POINTS.map((p) => (
            <li key={p.text} className="text-ink-soft">{p.text} <PageRef page={p.page} /></li>
          ))}
        </ul>
      </Card>

      <Card>
        <h2 className="font-serif text-xl font-semibold">Sources</h2>
        <p className="mt-2 text-ink-soft">
          Official requirements cite your copy of the {HANDBOOK.title} ({HANDBOOK.edition}). &ldquo;Handbook p.&rdquo; numbers are that edition&rsquo;s printed pages.
        </p>
        <p className="mt-3 text-ink-soft">
          The handbook ETS currently links from its{" "}
          <a href={HANDBOOK.website} target="_blank" rel="noopener noreferrer" className="text-sage-700 underline underline-offset-2">PASL website</a> is the{" "}
          <a href={HANDBOOK.newerUrl} target="_blank" rel="noopener noreferrer" className="text-sage-700 underline underline-offset-2">{HANDBOOK.newerEdition} edition</a>{" "}
          (its cover reads &ldquo;Updated July 2026&rdquo;). Its task requirements match July 2025, but it adds three rules, marked in this app as &ldquo;added in the July 2026 handbook&rdquo;:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-ink-soft">
          <li>Data artifacts no older than five years before your administration window <PageRef page="2026:20–21" /></li>
          <li>At least two participants in each video segment <PageRef page="2026:32" /></li>
          <li>At least one colleague in the 10-minute reflection, or that step scores zero <PageRef page="2026:23" /></li>
        </ul>
        <p className="mt-3 text-ink-soft">
          The ETS PASL FAQ for test takers repeats the five-year and colleague rules. Confirm which requirements apply to your submission window with ETS or your program. Where this app and ETS differ, ETS wins.
        </p>
        <p className="mt-3 font-medium">Get these separately from the <a href={HANDBOOK.website} target="_blank" rel="noopener noreferrer" className="text-sage-700 underline underline-offset-2">ETS PASL website</a>:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-ink-soft">
          <li>Task directions with the guiding prompts, and the rubrics for Tasks 1–3</li>
          <li>PASL permission forms (students under 18, students over 18, colleagues/adults)</li>
          <li>Submission System User Guide and your submission window dates</li>
          <li>Optional templates: Plan Template, Walk-Through Observation Form, Post-PD Feedback Survey, Glossary</li>
        </ul>
      </Card>

      <Card>
        <h2 className="font-serif text-xl font-semibold">Start over</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <button type="button" onClick={() => update((s) => ({ ...s, onboarded: false }))} className="min-h-12 rounded-full border border-line bg-card px-6 font-medium">
            Redo the welcome questions
          </button>
          <button
            type="button"
            onClick={() => window.confirm("Erase all progress on this device? Download a backup first if you might want it.") && reset()}
            className="min-h-12 rounded-full border border-amber-ink/30 px-6 font-medium text-amber-ink"
          >
            Erase all progress
          </button>
        </div>
      </Card>
    </div>
  );
}
