# PASL Companion

A private, mobile-first planner for one school leadership candidate working through the ETS **Performance Assessment for School Leaders (PASL)**. It answers three questions: *What do I need to do? What should I do next? What am I missing?*

Independent tool, not affiliated with ETS. It does not write, score or submit responses.

## Screens
- **Today**: greeting, overall progress, one recommended next step, up to three upcoming priorities, first-steps checklist.
- **Tasks**: the three official tasks with steps, limits, plain-English summaries, expandable checklists, handbook page references and status.
- **Evidence**: the 19 required artifacts with page limits, status (Needed / Planned / Collected / Ready), non-sensitive notes and permission reminders. No uploads.
- **My Plan**: the candidate's own deadline and suggested milestones counted back from it, with editable dates.
- **About & backup**: JSON export/import, local-storage notice, ethics, sources.

## Source of requirements
Official requirements live in `src/lib/pasl.ts` and cite the *PASL Candidate and Educator Handbook, Updated July 2025* (the candidate's copy) by printed page. Three stricter rules from the July 2026 edition are kept and labelled as newer ETS rules (page refs written `2026:<n>`). Items are tagged `official` (from the handbook) or `suggested` (planning tips). Guiding prompts and rubric criteria are not in the handbook and are not reproduced.

## Data
No backend, login, database or AI calls. Progress lives in `localStorage` (`pasl-companion:v1`) on one device; use the backup file to move it.

## Develop
```bash
npm install
npm run dev     # http://localhost:3000
npm run lint && npx tsc --noEmit && npm run build
```

## Environments
- **Development**: `npm run dev` locally.
- **Preview**: Vercel preview deployment for each pull request / branch.
- **Production**: Vercel production deployment from `main`.
