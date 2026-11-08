/**
 * Official PASL requirements, transcribed from the ETS
 * "Performance Assessment for School Leaders (PASL) Candidate and Educator
 * Handbook", Updated July 2025 (the edition supplied by the candidate).
 * Every `page` value is that edition's printed page number. A page written as
 * "2026:<n>" cites a rule that first appears in the July 2026 edition, which
 * ETS publishes as its current handbook (linked from ets.org/pasl; cover reads
 * "Updated July 2026"). The ETS PASL FAQ (July 2026) repeats those rules.
 *
 * Anything with kind "suggested" is a planning recommendation from this app,
 * not an ETS requirement. Guiding prompts and rubric criteria are NOT in the
 * handbook and are intentionally not reproduced here.
 */

export const HANDBOOK = {
  title: "PASL Candidate and Educator Handbook",
  edition: "Updated July 2025",
  /** ETS now hosts only the July 2026 edition at this address. */
  newerEdition: "July 2026",
  newerUrl: "https://www.ets.org/pdfs/pasl/pasl-candidate-educator-handbook.pdf",
  website: "https://www.ets.org/pasl.html",
};

export type TaskId = "t1" | "t2" | "t3";
export type Kind = "official" | "suggested";

export interface ChecklistItem {
  id: string;
  text: string;
  kind: Kind;
  /** Handbook page(s) for official items. */
  page?: string;
  detail?: string;
}

export interface ChecklistGroup {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface Artifact {
  id: string;
  task: TaskId;
  name: string;
  description: string;
  pages: string;
  page: string;
  permission: string;
  isVideo?: boolean;
}

export interface TaskStep {
  n: number;
  title: string;
  gloss: string;
  page: string;
}

export interface PaslTask {
  id: TaskId;
  number: number;
  title: string;
  short: string;
  summary: string;
  plain: string;
  commentaryLimit: number;
  commentaryPages: string;
  artifactCount: number;
  artifactPageMax: number;
  page: string;
  steps: TaskStep[];
  special?: { title: string; text: string; page: string }[];
  checklist: ChecklistGroup[];
}

const IDENTIFIERS_PAGE = "18";

const PERMISSION_STUDENT =
  "Signed PASL Student Permission Form for each student whose work is submitted (forms for students under and over 18). Black out names on the artifact itself. Keep forms yourself; don't send them to ETS.";
const PERMISSION_ADULT_IF =
  "If it includes a colleague's or other adult's work, get a signed PASL Colleagues/Adult Permission Form. Remove names of people, schools and districts.";
const PERMISSION_NONE =
  "Usually no permission form needed unless it shows another person's work or a photograph. Remove names of people, schools and districts.";

export const ARTIFACTS: Artifact[] = [
  // Task 1, handbook pp. 6–7
  {
    id: "t1-longitudinal",
    task: "t1",
    name: "Longitudinal data",
    description:
      "The same type of information on the same subject observed at multiple points in time, showing the problem you identified. ETS's July 2026 handbook adds that the data's date must be visible and every data point no older than five years before the administration window you submit in.",
    pages: "1 page",
    page: "6, 21",
    permission: PERMISSION_NONE,
  },
  {
    id: "t1-research",
    task: "t1",
    name: "Research materials and resources",
    description: "The research you used to inform the development of your plan.",
    pages: "1 page",
    page: "6",
    permission: PERMISSION_NONE,
  },
  {
    id: "t1-plan",
    task: "t1",
    name: "The plan",
    description: "Representative pages of your plan. ETS offers a sample template, but you can use your own format.",
    pages: "Up to 2 pages",
    page: "6",
    permission: PERMISSION_NONE,
  },
  {
    id: "t1-timeline",
    task: "t1",
    name: "Timeline and steps",
    description: "Your timeline and the steps for carrying out the plan.",
    pages: "1 page",
    page: "7",
    permission: PERMISSION_NONE,
  },
  {
    id: "t1-communication",
    task: "t1",
    name: "Communication with stakeholders",
    description: "An example of how you communicated with stakeholders.",
    pages: "1 page",
    page: "7",
    permission: PERMISSION_ADULT_IF,
  },
  {
    id: "t1-adjustments",
    task: "t1",
    name: "Implementation adjustments (your choice)",
    description:
      "An artifact you choose that shows adjustments made while implementing the plan, for example meeting notes or emails to stakeholders.",
    pages: "1 page",
    page: "7",
    permission: PERMISSION_ADULT_IF,
  },
  {
    id: "t1-student-work",
    task: "t1",
    name: "Student work",
    description: "A representative page of student work.",
    pages: "1 page",
    page: "7",
    permission: PERMISSION_STUDENT,
  },
  // Task 2, handbook p. 8
  {
    id: "t2-prioritized",
    task: "t2",
    name: "Prioritized list",
    description: "A representative page from your prioritized list.",
    pages: "1 page",
    page: "8",
    permission: PERMISSION_NONE,
  },
  {
    id: "t2-pd-plan",
    task: "t2",
    name: "Professional development plan",
    description: "Representative pages from your PD plan. ETS offers a sample template, but you can use your own.",
    pages: "Up to 2 pages",
    page: "8",
    permission: PERMISSION_NONE,
  },
  {
    id: "t2-research",
    task: "t2",
    name: "Research",
    description: "A page from your research, such as a bibliography, a specific online resource or a district source.",
    pages: "1 page",
    page: "8",
    permission: PERMISSION_NONE,
  },
  {
    id: "t2-assignment",
    task: "t2",
    name: "Assignment to teachers and/or students",
    description: "A representative page of an assignment given to teachers and/or students.",
    pages: "1 page",
    page: "8",
    permission: PERMISSION_ADULT_IF,
  },
  {
    id: "t2-walkthrough",
    task: "t2",
    name: "Walk-through observation form",
    description:
      "A page from a walk-through observation form completed for one teacher during a lesson related to the PD topic. ETS offers a sample form; your own is fine if it stays focused on the PD.",
    pages: "1 page",
    page: "8, 21",
    permission: PERMISSION_ADULT_IF,
  },
  {
    id: "t2-student-work",
    task: "t2",
    name: "Student work sample (one student)",
    description: "A representative page of a work sample from one student.",
    pages: "1 page",
    page: "8",
    permission: PERMISSION_STUDENT,
  },
  {
    id: "t2-survey",
    task: "t2",
    name: "Post-PD feedback survey",
    description:
      "A page from a feedback survey completed after the professional development. ETS offers a sample survey, or design your own.",
    pages: "1 page",
    page: "8, 21",
    permission: PERMISSION_ADULT_IF,
  },
  // Task 3, handbook pp. 9–10
  {
    id: "t3-team",
    task: "t3",
    name: "Team members chart",
    description: "A page of the spreadsheet, table or chart describing the members of your collaborative team.",
    pages: "1 page",
    page: "9",
    permission: "Refer to people as Colleague 1, Colleague 2 and so on, never by name.",
  },
  {
    id: "t3-data-tool",
    task: "t3",
    name: "Data-collecting tool",
    description: "A representative page from the data-collecting tool.",
    pages: "1 page",
    page: "9",
    permission: PERMISSION_NONE,
  },
  {
    id: "t3-pd-plan",
    task: "t3",
    name: "Professional development plan",
    description: "Representative pages from your PD plan. ETS offers a sample template, but you can use your own.",
    pages: "Up to 2 pages",
    page: "9",
    permission: PERMISSION_NONE,
  },
  {
    id: "t3-feedback",
    task: "t3",
    name: "Feedback from colleagues",
    description: "A page that provides feedback from the targeted audience of colleagues.",
    pages: "1 page",
    page: "9",
    permission: PERMISSION_ADULT_IF,
  },
  {
    id: "t3-student-learning",
    task: "t3",
    name: "Evidence of student learning",
    description: "A page of evidence that reflects student learning.",
    pages: "1 page",
    page: "9",
    permission: PERMISSION_STUDENT,
  },
  {
    id: "t3-video",
    task: "t3",
    name: "15-minute video",
    description:
      "One video file with one continuous, unedited 5-minute segment (planning, textbox 3.2.2, or implementation, textbox 3.3.1) and one continuous, unedited 10-minute segment (self-reflection/feedback, textbox 3.4.1).",
    pages: "Video, not counted in pages",
    page: "10, 23–29",
    permission:
      "Signed PASL Colleagues/Adult Permission Form for every adult seen or heard, collected BEFORE you record. District or school forms are not accepted.",
    isVideo: true,
  },
];

const finalChecks = (task: TaskId, limit: number, pageMax: number): ChecklistItem[] => [
  { id: `${task}-final-prompts`, kind: "official", page: "15", text: "Every part of every guiding prompt is addressed" },
  {
    id: `${task}-final-limit`,
    kind: "official",
    page: task === "t1" ? "6" : "8–9",
    text: `Commentary is at or under ${limit.toLocaleString("en-US")} characters, typed or pasted into the textboxes (a linked standalone document won't be scored)`,
  },
  {
    id: `${task}-final-pages`,
    kind: "official",
    page: "20, 22",
    text: `Artifacts total ${pageMax} pages or fewer and each is readable, not blurry`,
  },
  {
    id: `${task}-final-links`,
    kind: "official",
    page: "22",
    text: "Each required artifact is linked once, in the right textbox, with no extra artifacts and no third-party links",
  },
  {
    id: `${task}-final-identifiers`,
    kind: "official",
    page: IDENTIFIERS_PAGE,
    text: "No names of teachers, colleagues, students, schools, districts or your town",
  },
  {
    id: `${task}-final-data-age`,
    kind: "official",
    page: "2026:20–21",
    text: "Any data shows its date and is no older than five years before your administration window (added in the July 2026 handbook)",
  },
  {
    id: `${task}-final-permissions`,
    kind: "official",
    page: "24, 36",
    text: "Signed PASL permission forms are kept on file for everyone whose work or image is included",
  },
  { id: `${task}-final-copy`, kind: "official", page: "15", text: "A copy of all final documents is saved" },
  {
    id: `${task}-final-peer`,
    kind: "suggested",
    text: "A trusted colleague has read the response against the rubric",
    detail: "The handbook recommends this (p. 17–18). Choose someone who won't fill in gaps from knowing your school.",
  },
];

export const TASKS: PaslTask[] = [
  {
    id: "t1",
    number: 1,
    title: "Problem Solving in the Field",
    short: "Problem Solving",
    summary:
      "Show your ability to address and resolve a significant problem or challenge in your school that influences instructional practice and student learning.",
    plain:
      "Find a real problem in your school that affects teaching and learning, show it with data over time, research it, make and carry out a plan, then reflect on what happened.",
    commentaryLimit: 25500,
    commentaryPages: "about 8 typed pages",
    artifactCount: 7,
    artifactPageMax: 8,
    page: "6–7",
    steps: [
      { n: 1, title: "Identifying a Problem/Challenge", gloss: "Name a significant problem in your school, supported by longitudinal data.", page: "7, 21" },
      { n: 2, title: "Researching and Developing a Plan", gloss: "Use research to build a plan to address it.", page: "7" },
      { n: 3, title: "Implementing the Plan", gloss: "Carry out the plan and note any adjustments you make.", page: "7" },
      { n: 4, title: "Reflecting on the Plan and the Resolution", gloss: "Look back on what worked and what you'd do next time.", page: "7" },
    ],
    special: [
      {
        title: "Longitudinal data is required",
        text: "Your data must show the same kind of information on the same subject at multiple points in time, and your commentary describes those data points and why they're appropriate.",
        page: "21",
      },
      {
        title: "Added in the July 2026 handbook: data within five years",
        text: "Any data submitted as an artifact must be no older than five years prior to the administration window in which you submit, with its date visible. Older data may make that artifact unscorable.",
        page: "2026:20–21",
      },
    ],
    checklist: [
      {
        id: "t1-prepare",
        title: "Get ready",
        items: [
          { id: "t1-read-directions", kind: "official", page: "14–15", text: "Read the full Task 1 directions and rubric (from the ETS PASL website)" },
          { id: "t1-choose-problem", kind: "suggested", text: "Choose a significant problem that affects instruction and student learning" },
          { id: "t1-find-data", kind: "suggested", text: "Confirm you can get longitudinal data (multiple dated points, within five years)" },
        ],
      },
      {
        id: "t1-steps",
        title: "Steps",
        items: [
          { id: "t1-step1", kind: "official", page: "7", text: "Step 1: Identifying a Problem/Challenge, drafted" },
          { id: "t1-step2", kind: "official", page: "7", text: "Step 2: Researching and Developing a Plan, drafted" },
          { id: "t1-step3", kind: "official", page: "7", text: "Step 3: Implementing the Plan, drafted" },
          { id: "t1-step4", kind: "official", page: "7", text: "Step 4: Reflecting on the Plan and the Resolution, drafted" },
        ],
      },
      { id: "t1-final", title: "Before you submit", items: finalChecks("t1", 25500, 8) },
    ],
  },
  {
    id: "t2",
    number: 2,
    title: "Supporting Continuous Professional Development",
    short: "Professional Development",
    summary:
      "Show your skills in establishing and supporting effective, continuous professional development with your assigned staff to improve instruction and student learning.",
    plain:
      "Design and lead professional development for staff, then observe three teachers with different levels of experience to see how it changed their teaching and their students' learning.",
    commentaryLimit: 28500,
    commentaryPages: "about 9 typed pages",
    artifactCount: 7,
    artifactPageMax: 8,
    page: "7–9",
    steps: [
      { n: 1, title: "Designing Building-level Professional Development", gloss: "Plan the PD for your assigned staff.", page: "9" },
      { n: 2, title: "Implementing Building-level Professional Development", gloss: "Lead the PD.", page: "9" },
      { n: 3, title: "Analyzing Three Participants' Responses", gloss: "Observe three participants with different experience levels and look at the impact on teaching and learning.", page: "8–9" },
      { n: 4, title: "Reflecting on Building-level Professional Development", gloss: "Look back on how the PD went and what comes next.", page: "9" },
    ],
    special: [
      {
        title: "Three participants, different experience levels",
        text: "You'll select three participants with different levels of experience, observe them teaching, and determine the impact of the PD on their teaching and their students' learning.",
        page: "8",
      },
    ],
    checklist: [
      {
        id: "t2-prepare",
        title: "Get ready",
        items: [
          { id: "t2-read-directions", kind: "official", page: "14–15", text: "Read the full Task 2 directions and rubric (from the ETS PASL website)" },
          { id: "t2-ancillary", kind: "suggested", text: "Download the optional Plan Template, Walk-Through Observation Form and Feedback Survey", detail: "Ancillary materials on the PASL website (p. 35–36). Using them is optional." },
          { id: "t2-participants", kind: "official", page: "8", text: "Identify three participants with different levels of experience" },
          { id: "t2-schedule", kind: "suggested", text: "Schedule the PD and the follow-up observations with enough time between them to see an impact" },
        ],
      },
      {
        id: "t2-steps",
        title: "Steps",
        items: [
          { id: "t2-step1", kind: "official", page: "9", text: "Step 1: Designing Building-level Professional Development, drafted" },
          { id: "t2-step2", kind: "official", page: "9", text: "Step 2: Implementing Building-level Professional Development, drafted" },
          { id: "t2-step3", kind: "official", page: "9", text: "Step 3: Analyzing Three Participants' Responses, drafted" },
          { id: "t2-step4", kind: "official", page: "9", text: "Step 4: Reflecting on Building-level Professional Development, drafted" },
        ],
      },
      { id: "t2-final", title: "Before you submit", items: finalChecks("t2", 28500, 8) },
    ],
  },
  {
    id: "t3",
    number: 3,
    title: "Creating a Collaborative Culture",
    short: "Collaborative Culture",
    summary:
      "Show your ability to facilitate stakeholders' efforts to build a collaborative team within the school to improve instruction, student achievement and the school culture.",
    plain:
      "Build and lead a collaborative team of colleagues to improve teaching, learning and school culture, record yourself working with them on video, then reflect together. Task 3 counts double.",
    commentaryLimit: 28500,
    commentaryPages: "about 9 typed pages",
    artifactCount: 6,
    artifactPageMax: 6,
    page: "9–10",
    steps: [
      { n: 1, title: "Identifying the Collaborative Team", gloss: "Form the team and describe its members (without names).", page: "10" },
      { n: 2, title: "Developing a Plan to Improve Instruction, Student Learning, and the School Culture", gloss: "Plan with the team. The 5-minute video may come from this planning (textbox 3.2.2).", page: "10" },
      { n: 3, title: "Implementing the Plan to Improve Instruction, Student Learning, and the School Culture", gloss: "Carry out the plan. Or the 5-minute video may come from implementation (textbox 3.3.1).", page: "10" },
      { n: 4, title: "Reflecting on the Collaborative Team and the School Culture", gloss: "Reflect on the collaborative team and culture. The 10-minute video focuses on this self-reflection and feedback (textbox 3.4.1).", page: "10" },
      { n: 5, title: "Uploading the Video", gloss: "Upload the single 15-minute video file here, not to the Library of Artifacts.", page: "10, 28" },
    ],
    special: [
      {
        title: "Video continuity: an edited segment scores zero for all of Task 3",
        text: "Submit one 15-minute file: one continuous, unedited 5-minute segment and one continuous, unedited 10-minute segment. No cuts, fades, added footage or outside audio, no blurring faces or name tags, and no second camera. Joining the two segments into one file is allowed.",
        page: "23, 28",
      },
      {
        title: "Language",
        text: "Video segments must not be in a foreign language, even with a translated transcript.",
        page: "22",
      },
      {
        title: "Added in the July 2026 handbook: people on camera",
        text: "At least two participants must be present in each video segment, and the 10-minute Step 4 reflection must include at least one colleague engaged in the discussion. Otherwise the step scores zero.",
        page: "2026:23, 32",
      },
    ],
    checklist: [
      {
        id: "t3-prepare",
        title: "Get ready",
        items: [
          { id: "t3-read-directions", kind: "official", page: "14–15", text: "Read the full Task 3 directions and rubric (from the ETS PASL website)" },
          { id: "t3-team-formed", kind: "suggested", text: "Invite colleagues to form the collaborative team and agree on meeting times" },
          { id: "t3-forms-before", kind: "official", page: "24", text: "Signed PASL Colleagues/Adult Permission Forms collected from everyone who'll be seen or heard, before recording" },
          { id: "t3-equipment", kind: "official", page: "24–25", text: "Video equipment checked and adequate before recording", detail: "The handbook suggests considering a camera or phone, a tripod, an external microphone near the group, and an extension cord." },
        ],
      },
      {
        id: "t3-video",
        title: "Video",
        items: [
          { id: "t3-practice", kind: "suggested", text: "Practice by recording at least two different sessions", detail: "The handbook recommends this to get the most from practice (p. 26). Each final segment must still be continuous and unedited." },
          { id: "t3-seg5", kind: "official", page: "10, 26", text: "5-minute continuous segment recorded: planning (3.2.2) or implementation (3.3.1)" },
          { id: "t3-seg10", kind: "official", page: "10, 26", text: "10-minute continuous segment recorded: self-reflection/feedback (3.4.1)" },
          { id: "t3-participants", kind: "official", page: "2026:23, 32", text: "Each segment shows at least two participants, and the reflection includes at least one colleague (added in the July 2026 handbook)" },
          { id: "t3-noedit", kind: "official", page: "23, 28", text: "Both segments unedited: no cuts, fades, blurring, added audio or second camera" },
          { id: "t3-combined", kind: "official", page: "28–29", text: "Segments combined into one file that meets the upload size limits" },
          { id: "t3-timestamps", kind: "suggested", text: "Note time stamps of key moments to cite in your commentary", detail: "The handbook recommends time stamps such as “at 2:12 minutes” (p. 21)." },
          { id: "t3-upload", kind: "official", page: "28–29", text: "Uploaded in Step 5 and played back to check sound and picture", detail: "ETS recommends allowing at least an hour for the upload and review (p. 29)." },
        ],
      },
      {
        id: "t3-steps",
        title: "Steps",
        items: [
          { id: "t3-step1", kind: "official", page: "10", text: "Step 1: Identifying the Collaborative Team, drafted" },
          { id: "t3-step2", kind: "official", page: "10", text: "Step 2: Developing a Plan, drafted" },
          { id: "t3-step3", kind: "official", page: "10", text: "Step 3: Implementing the Plan, drafted" },
          { id: "t3-step4", kind: "official", page: "10", text: "Step 4: Reflecting on the Collaborative Team and the School Culture, drafted" },
        ],
      },
      { id: "t3-final", title: "Before you submit", items: finalChecks("t3", 28500, 6) },
    ],
  },
];

export const taskById = (id: TaskId) => TASKS.find((t) => t.id === id)!;

export const ETHICS_POINTS: { text: string; page: string }[] = [
  { text: "Your commentary, artifacts and video must be your own work.", page: "11" },
  { text: "Mentors and instructors shouldn't make choices for you, correct your responses or score them with the PASL rubrics.", page: "11" },
  { text: "Text copied from other responses, the Library of Examples, or uncredited sources can cancel your scores.", page: "12" },
  { text: "ETS software scans every response for overlap with other submissions and the Library of Examples.", page: "13" },
  { text: "Never name teachers, colleagues, students, schools, districts or your town. Use “Colleague 1” and “my school”.", page: "18" },
  { text: "Use only the official PASL permission forms. Keep them yourself; don't send them to ETS.", page: "5, 24, 36" },
];

/** "2026:20–21" → newer-edition reference; anything else is a July 2025 page. */
export function parseRef(page: string): { newer: boolean; pages: string; label: string } {
  const newer = page.startsWith("2026:");
  const pages = newer ? page.slice(5) : page;
  return { newer, pages, label: newer ? `July 2026 handbook p. ${pages}` : `Handbook p. ${pages}` };
}
