/**
 * Threads — achievements that grew over years rather than happening once.
 * Each one is drawn as a glowing line through the mountain under the trail,
 * with a node per stage. Titles must match TROPHIES exactly (checked in layout.ts).
 */

export type ThreadDef = {
  id: string;
  name: string;
  color: string;
  stages: { title: string; label: string }[];
  /** For a single entry that itself spans years: the camp year its line starts at. */
  spanFrom?: number;
};

export const THREAD_DEFS: ThreadDef[] = [
  {
    id: "gov",
    name: "Student government",
    color: "#ffc94d",
    stages: [
      { title: "Class President — elected", label: "Freshman class president" },
      { title: "Class President — re-elected", label: "Sophomore class president" },
      { title: "Lost ASB President by ~10 votes", label: "Lost ASB by ~10 votes" },
      { title: "Class President ×3", label: "Class president, third term" },
      { title: "ASB President — elected", label: "ASB President" },
      { title: "Green & White Assembly", label: "First rally as ASB President" },
    ],
  },
  {
    id: "court",
    name: "Basketball",
    color: "#ff8a5c",
    stages: [
      { title: "Hopkins Basketball A-Team", label: "Middle-school A-team" },
      { title: "Freshman Basketball Co-Captain", label: "Freshman co-captain" },
      { title: "JV Basketball Co-Captain", label: "JV co-captain" },
      { title: "NCS Basketball Champions", label: "NCS champions" },
    ],
  },
  {
    id: "research",
    name: "Research",
    color: "#7fe0c2",
    stages: [
      { title: "R + Bioinformatics training", label: "Learned R and RNA-seq" },
      { title: "ACSEF — 3rd, Computational Biology", label: "ACSEF, 3rd place" },
      { title: "USABO — Honorable Mention", label: "USABO honorable mention" },
      { title: "UMass Amherst — the Ma Lab", label: "UMass lab" },
    ],
  },
  {
    id: "built",
    name: "Building things",
    color: "#a8d86b",
    stages: [
      { title: "Tutoring business — founded", label: "Tutoring business" },
      { title: "CueSheet — shipped", label: "CueSheet" },
      { title: "AcornPrep — launched", label: "AcornPrep" },
      { title: "YBVC finalist — pitched at Stanford", label: "Pitched at Stanford" },
    ],
  },
  {
    id: "media",
    name: "Filmmaking",
    color: "#ff8fb1",
    stages: [
      { title: "li_locked.in launched", label: "li_locked.in" },
      { title: "Mayor's Intern Program", label: "Mayor's intern" },
      { title: "Mayor's Videographer (paid)", label: "Mayor's videographer" },
      { title: "Voices of Fremont — director", label: "Podcast director" },
      { title: "Ro Khanna on @li_locked.in", label: "Ro Khanna reel" },
    ],
  },
  {
    id: "advising",
    name: "Advising",
    color: "#7cc4ff",
    stages: [
      { title: "Fremont Youth Advisory Commission", label: "Youth Advisory Commission" },
      { title: "CommonApp Student Advisory Commission", label: "Common App commission" },
      { title: "Youth Advisory Commission Chair", label: "Commission Chair" },
    ],
  },
  {
    id: "stempac",
    name: "STEM-PAC",
    color: "#b9a6ff",
    stages: [
      { title: "MSJ STEM-PAC — founding officer", label: "Founding officer" },
      { title: "MSJ STEM-PAC Co-President", label: "Co-president" },
    ],
  },
  {
    id: "ysjc",
    name: "Youth STEM Journal Club",
    color: "#ffd98a",
    stages: [
      { title: "Youth STEM Journal Club — founder", label: "Founded it" },
      { title: "YSJC 2026 — led a team of 4 mentors", label: "60 students, 6 cohorts" },
    ],
  },
  {
    id: "makes",
    name: "MSJ Makes",
    color: "#ffb36b",
    stages: [
      { title: "MSJ Makes VP", label: "Vice president" },
      { title: "MSJ Makes President", label: "President" },
    ],
  },
  {
    id: "hopkins",
    name: "Academic Excellence ×6",
    color: "#9fb7ff",
    spanFrom: 2021,
    stages: [{ title: "6× Academic Excellence — Hopkins", label: "Six awards at Hopkins" }],
  },
];
