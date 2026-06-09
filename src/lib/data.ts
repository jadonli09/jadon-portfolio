/**
 * Single source of truth. Every fact here is drawn from the two reference
 * documents (SpringLight student profile + List of Achievements ledger).
 * No invented or inflated numbers.
 */

export type WorldId =
  | "civic"
  | "research"
  | "built"
  | "leadership"
  | "court"
  | "about"
  | "achievements"
  | "contact";

export const PROFILE = {
  name: "Jadon Li",
  roles: ["Civic Storyteller", "Bio Researcher", "Builder", "Student Leader", "Athlete"],
  tagline: "Documenting the grind across five worlds.",
  school: "Mission San Jose High School",
  city: "Fremont, California",
  gradeNote: "Class of 2027",
  ethos: "li_locked.in",
  email: "jadonli2020@gmail.com",
  links: {
    instagram: "https://instagram.com/li_locked.in",
    instagramHandle: "@li_locked.in",
    linkedin: "https://www.linkedin.com/in/jadon-li-b03174286/",
    github: "https://github.com/jadonli09",
    githubUser: "jadonli09",
  },
} as const;

export type WorldMeta = {
  id: WorldId;
  index: string;
  title: string;
  href: string;
  kicker: string;
  blurb: string;
  art: string; // one-line art direction
};

/** The navigable worlds, in the editorial order they should be explored. */
export const WORLDS: WorldMeta[] = [
  {
    id: "civic",
    index: "01",
    title: "Civic & Storytelling",
    href: "/civic",
    kicker: "Ampersand Media",
    blurb: "A city, documented. Mayors, podcasts, and a viral fight to bring back a restaurant.",
    art: "documentary / newsprint",
  },
  {
    id: "research",
    index: "02",
    title: "Research & STEM",
    href: "/research",
    kicker: "Wet lab to RNA-seq",
    blurb: "Hunting pain mediators in a gout model — and the awards that followed.",
    art: "scientific / data-as-art",
  },
  {
    id: "built",
    index: "03",
    title: "Things I've Built",
    href: "/built",
    kicker: "Ship it",
    blurb: "AcornPrep, CueSheet, Hermes — real products with real users.",
    art: "product launch / tech",
  },
  {
    id: "leadership",
    index: "04",
    title: "Leadership & Events",
    href: "/leadership",
    kicker: "ASB President",
    blurb: "$35M of cars in a parking lot. A winter ball rebuilt from nothing.",
    art: "luxury event poster",
  },
  {
    id: "court",
    index: "05",
    title: "The Court",
    href: "/court",
    kicker: "NCS Champions",
    blurb: "First title in school and district history. Started in the first five.",
    art: "kinetic sports magazine",
  },
  {
    id: "about",
    index: "06",
    title: "About",
    href: "/about",
    kicker: "The person",
    blurb: "A solo run up Mission Peak every birthday. A journal kept since eighth grade.",
    art: "quiet editorial",
  },
];

/* ───────────────────────────── CIVIC ───────────────────────────── */
export const CIVIC = {
  intro:
    "Under the banner of Ampersand Media, Jadon turns a city into a story — civic video, podcasts, and campaigns that move real numbers.",
  metrics: [
    { value: 10, suffix: "k", label: "Views per mayor video", note: "grown from ~1k" },
    { value: 500, suffix: "k+", label: "Views in under a month", note: "@li_locked.in" },
    { value: 18, suffix: "k", label: "Palm Ave Park promo views", note: "700+ shares" },
    { value: 32000, suffix: "", label: "FUSD families reached", note: "Car Meet email blast" },
  ],
  stories: [
    {
      title: "The Mayor's Videographer",
      handle: "Mayor Salwan Intern Program · paid videographer",
      window: "Jun 2025 – Oct 2025",
      body:
        "Surveyed Fremont residents (50 calls/week from the mayor's call sheet), drafted policy, and produced ~1-minute civic videos. Grew the mayor's per-video reach from roughly 1k to 10k. Paid at $50/video; first invoice $600.",
    },
    {
      title: "Voices of Fremont",
      handle: "@voices_of_fremont · Director",
      window: "Fall 2025 –",
      body:
        "Directs a podcast featuring the Mayor of Fremont on policy, operations, and the future of the city. Leads a team of 8 across three sections — script writing, editing, and hosting — and cuts the short-form content.",
    },
    {
      title: "Reviving Sweet Tomatoes",
      handle: "The viral origin",
      window: "2025",
      body:
        "Sat down with the current owners of the old Fremont location to make the case for re-opening Sweet Tomatoes instead of another restaurant — the campaign that put @li_locked.in on the map.",
    },
    {
      title: "Stories of Fremont",
      handle: "Civic video series",
      window: "Jun 2025 –",
      body:
        "Cold-emails and connections turned into an official video series: interviewing Fremont business owners, teachers, and community leaders about what the city means to them. First subject — an immigrant salon owner in Niles.",
    },
    {
      title: "Small Business Accessibility",
      handle: "Op-ed · SB 84 advocacy",
      window: "2025",
      body:
        "Advocacy work on small-business accessibility, including an op-ed published in the San Mateo Daily Journal and support for SB 84, mentored by Prof. Durazo.",
    },
    {
      title: "HG Nguyen for D7",
      handle: "Social Media Manager",
      window: "Jun 2025 –",
      body:
        "Lead videographer and editor for a San Jose D7 City Council campaign — intro and donation videos, event coverage, and website design help.",
    },
  ],
  commission: {
    title: "Fremont Youth Advisory Commission",
    window: "Nov 2025 – present",
    detail:
      "One of 13 commissioners selected from ~100 applicants for a single open seat. Plans youth-issue events (mental-wellness workshops) and meets council-style the first Monday of every month.",
  },
  awards: [
    "ACWD Water Clip Contest 2025 — 1st & 3rd place (100+ contestants, two submissions) · $600",
    "ACWD Water Clips 2026 — 3rd place · $100",
    "Met the Governor & First Partner — California Love, California Strong",
  ],
} as const;

/* ──────────────────────────── RESEARCH ──────────────────────────── */
export const RESEARCH = {
  intro:
    "Trained in R and bioinformatics, then put to work on a question with a real clinical edge: what drives the pain of gout?",
  project: {
    title: "Pain Mediators in a Mouse Gout Model",
    method: "RNA-seq · differential expression in R",
    summary:
      "Analyzed a mouse gout model with RNA-seq in R to surface up-regulated genes and pathways and identify key mediators of gout pain. Built the R + bioinformatics training first, then ran the pipeline.",
    result: "3rd place — Computational Biology (BCOM), Alameda County Science & Engineering Fair 2025",
  },
  awards: [
    { name: "USABO", result: "Honorable Mention", note: "Score 26 · semifinalist cutoff 28", year: "2025" },
    { name: "UK Biology Olympiad", result: "Silver", note: "Top 10%", year: "2025" },
    { name: "ACSEF — Computational Biology", result: "3rd Place", note: "BCOM category", year: "2025" },
  ],
  programs: [
    {
      title: "Youth STEM Journal Club",
      role: "Founder — Biology Department",
      site: "youthstemjournal.org",
      detail:
        "A summer program teaching middle-schoolers to read research papers — what to read first, what to skip, how to annotate and discuss. 30 students total; worked hands-on with a group of 8, two hour-long classes a week, ending in a capstone presented to parents.",
    },
    {
      title: "PRISM",
      role: "Promoting Representation in Science & Medicine",
      site: "with Arav",
      detail: "A project focused on representation in science and medicine, scoping one treatment/disease in depth.",
    },
    {
      title: "MSJ STEM-PAC",
      role: "Co-President (renamed from HOSA)",
      site: "Iron Chef · 21 participants",
      detail:
        "Negotiated liability waivers and cooking checkpoints with admin so students could connect STEM to cooking — bringing dishes to school for teacher judges. Founded the predecessor HOSA chapter in 10th grade.",
    },
    {
      title: "UMass Research Intensive",
      role: "Incoming · 6-week residential",
      site: "pre-college",
      detail: "Selected for an upcoming residential research intensive.",
    },
  ],
  /** Stylized volcano-plot points (illustrative of the RNA-seq motif, not real expression values). */
  classes: ["AP Biology · 5", "AP Chemistry", "AP Statistics · 5", "USABO Semifinal track"],
} as const;

/* ───────────────────────────── BUILT ───────────────────────────── */
export type Project = {
  name: string;
  url: string;
  domain: string;
  embeddable: boolean; // attempt iframe first; fall back to mockup
  /** Captured screenshot of the live site (in /public/embeds), shown in the device mockup. */
  shot?: string;
  tagline: string;
  stats: { value: string; label: string }[];
  body: string;
  stack: string[];
};

export const PROJECTS: Project[] = [
  {
    name: "AcornPrep",
    url: "https://acornprep.com",
    domain: "acornprep.com",
    embeddable: true,
    shot: "/embeds/acornprep.jpg",
    tagline: "Unconventionally productive AP study tools.",
    stats: [
      { value: "500+", label: "Users · 2026 AP season" },
      { value: "13,000", label: "MCQs practiced" },
      { value: "10", label: "AP courses" },
      { value: "#1", label: "Google result" },
    ],
    body:
      "An AI-powered AP study platform — unlimited MCQ practice, graded FRQ practice, and AI tutor guidance. Released to Mission San Jose on 04/11/2026; 100 users in the first 24 hours. Endorsed by 4 AP teachers. Rebuilt from scratch with Claude Code after an earlier draft, with a real dev pipeline. Partner: Pradyun Kanuparthi.",
    stack: ["React", "TypeScript", "AI grading"],
  },
  {
    name: "CueSheet",
    url: "https://cuesheet.xyz",
    domain: "cuesheet.xyz",
    embeddable: true,
    shot: "/embeds/cuesheet.jpg",
    tagline: "Music supervision, organized.",
    stats: [
      { value: "Live", label: "cuesheet.xyz" },
      { value: "Tool", label: "Music supervision" },
    ],
    body: "A tool for music supervision workflows — built and shipped live.",
    stack: ["TypeScript", "Web"],
  },
  {
    name: "Hermes",
    url: "https://github.com/jadonli09",
    domain: "github.com/jadonli09",
    embeddable: false,
    tagline: "Instagram club-info scraper.",
    stats: [
      { value: "90%", label: "Complete by 03/26" },
      { value: "Aug '26", label: "Target release" },
    ],
    body:
      "A scraper that pulls club info from Instagram for the 2026–2027 school year. 90% of the system finished by March 2026, with the remainder and polish coming over the summer.",
    stack: ["Automation", "Scraping"],
  },
  {
    name: "Youth STEM Journal",
    url: "https://youthstemjournal.org",
    domain: "youthstemjournal.org",
    embeddable: true,
    shot: "/embeds/youthstemjournal.jpg",
    tagline: "Reading research, made teachable.",
    stats: [
      { value: "Live", label: "youthstemjournal.org" },
      { value: "30", label: "Students served" },
    ],
    body: "The home for the Youth STEM Journal Club — curriculum, literature reviews, and the program Jadon founded.",
    stack: ["Web", "Education"],
  },
  {
    name: "MSJ Makes",
    url: "https://instagram.com/li_locked.in",
    domain: "Merch design",
    embeddable: false,
    tagline: "Student merch, designed & sold.",
    stats: [
      { value: "~$700", label: "Revenue" },
      { value: "Design", label: "Operation" },
    ],
    body: "A student merch-design operation — concept, design, and sales — generating roughly $700 in revenue.",
    stack: ["Design", "Operations"],
  },
];

/* ─────────────────────── LEADERSHIP & EVENTS ────────────────────── */
export const LEADERSHIP = {
  intro:
    "Class President three years running, now ASB President — running events at the scale of a small city.",
  carMeet: {
    title: "MSJ Car Meet",
    date: "November 8, 2025",
    pitch: "The first car meet in Mission San Jose history — a city-wide event in the school lot.",
    stats: [
      { value: "$35M+", label: "In cars on the lot" },
      { value: "60+", label: "Cars" },
      { value: "$3.5M", label: "One Pagani" },
      { value: "~200", label: "Attendees" },
      { value: "50+", label: "Volunteers" },
      { value: "32,000", label: "FUSD families emailed" },
    ],
    body:
      "Co-led a city-wide event from 7AM setup to 5PM cleanup after two months of preparation — contacting car enthusiasts, lining up small-business booths and food vendors, and running videography and photography (@msjmeets). Backed by 6 students, 2 faculty, and the parent foundation, which bought car ramps to protect low cars over speed bumps.",
  },
  winterBall: {
    title: "Winter Ball — Built From Scratch",
    date: "February 2026",
    body:
      "The first winter ball since before COVID — no precedent, no playbook. Convinced wary admin with a plan and student-interest poll, then engineered the night: a non-alcoholic drink bar, borrowed PTA game tables (poker, roulette) instead of buying new, and a gym-floor mat lent by Newark Memorial. 350 students came.",
    stat: { value: "350", label: "Students" },
  },
  events: [
    { title: "ASB President", window: "2026–2027", note: "Selected a 30-student leadership class; helped lead a ~250-student, 7-school interdistrict conference." },
    { title: "Class President", window: "9th · 10th · 11th", note: "Three years running. Led an hour-long Homecoming performance (theme: Tangled)." },
    { title: "Prom @ Cal Academy of Sciences", window: "2026", note: "Helped plan prom at the California Academy of Sciences." },
    { title: "JP Basketball", window: "Founder · Nov 2025", note: "Founded a coaching program for grades 4–8 — Sundays, ~$60/hr, 6 students, 2 coaches." },
    { title: "City of Fremont", window: "Summer 2024", note: "Recreation Director." },
  ],
} as const;

/* ───────────────────────────── COURT ───────────────────────────── */
export const COURT = {
  intro: "First in school and district history. Started in the first five early in the season.",
  banner: {
    title: "NCS Champions",
    year: "2026",
    sub: "MSJ Varsity Basketball — first NCS title in school and Fremont district history.",
  },
  timeline: [
    { period: "Grades 3–9", role: "AAU Basketball", note: "Hoopsphere · Trust · Mambas — local and national tournaments." },
    { period: "9th · 10th", role: "Frosh / JV Co-Captain", note: "Kept team morale, organized team dinners and bonding." },
    { period: "11th", role: "Varsity", note: "Started in the first five early in the season." },
    { period: "2026", role: "NCS Champion", note: "First title in school and district history." },
  ],
  douyin: { value: "500k+", label: "Likes on DouYin", note: "a gym moment in China" },
} as const;

/* ───────────────────────────── ABOUT ───────────────────────────── */
export type Climb = { year: string; time: string; seconds: number; pr?: boolean; note?: string };

/** Year-by-year birthday-climb times, as journaled. 2024 sunrise climb was filmed. PR = 47:33. */
const CLIMBS: Climb[] = [
  { year: "Yr 1", time: "59:58", seconds: 3598 },
  { year: "Yr 2", time: "49:46", seconds: 2986 },
  { year: "Yr 3", time: "59:18", seconds: 3558 },
  { year: "Yr 4", time: "47:33", seconds: 2853, pr: true },
  { year: "Yr 5", time: "54:00", seconds: 3240, note: "sunrise climb, filmed" },
];

export const ABOUT = {
  ethos:
    "li_locked.in is the documentation of a grind — basketball, cooking, study tips, and the discomfort of putting yourself in new positions for self-improvement. 1,400+ followers, 500k+ views in under a month.",
  missionPeak: {
    title: "Mission Peak",
    ritual: "Every birthday, a solo run to the summit — a reflection ritual, journaled since 8th grade.",
    climbs: CLIMBS,
  },
  threads: [
    {
      title: "The Kitchen",
      body: "Cooking and baking with Samay — perfected macarons and a Beef Ragu; currently chasing a Hojicha Basque cheesecake.",
    },
    {
      title: "The Camera",
      body: "FAA-approved drone pilot — DJI Mini 2 SE, DJI Avata 2 FPV, Osmo Pocket 3. The craft behind every clip.",
    },
    {
      title: "The Map",
      body: "A Vancouver travel vlog, and trips through Japan, China, and Taiwan.",
    },
    {
      title: "The Shelf",
      body: "The Three-Body Problem (Liu Cixin), Sunrise on the Reaping (Collins), The Circle & The Every (Eggers).",
    },
  ],
  close: "It all points one direction — the pursuit of happiness.",
} as const;

/* ─────────────────────── ACHIEVEMENTS / SCORES ──────────────────── */
export const SCORES = [
  { label: "SAT", value: "1530", note: "EBRW 740 · Math 790 · Aug 2025" },
  { label: "PSAT", value: "1490", note: "Math 760 · ERW 730" },
  { label: "ACT", value: "29", note: "taken in 8th grade" },
];

export const AP_FIVES = [
  "AP Chinese Language",
  "AP Biology",
  "AP Macroeconomics",
  "AP World History",
  "AP Statistics",
  "AP Computer Science A",
];

export type Trophy = { year: string; title: string; cat: WorldId | "academic"; detail: string };

export const TROPHIES: Trophy[] = [
  { year: "2019", title: "Continental Math League — 30/30", cat: "academic", detail: "Perfect score across 6 tests." },
  { year: "2019", title: "6× Academic Excellence (Hopkins)", cat: "academic", detail: "≤2 students per class of 30." },
  { year: "2025", title: "USABO — Honorable Mention", cat: "research", detail: "Score 26 · cutoff 28." },
  { year: "2025", title: "UK Biology Olympiad — Silver", cat: "research", detail: "Top 10%." },
  { year: "2025", title: "ACSEF — 3rd, Computational Biology", cat: "research", detail: "Gout RNA-seq, BCOM category." },
  { year: "2025", title: "ACWD Water Clips — 1st & 3rd", cat: "civic", detail: "100+ contestants · $600." },
  { year: "2025", title: "MSJ Car Meet", cat: "leadership", detail: "$35M+ in cars · first in MSJ history." },
  { year: "2026", title: "Winter Ball", cat: "leadership", detail: "350 students · built from scratch." },
  { year: "2026", title: "ACWD Water Clips — 3rd", cat: "civic", detail: "$100." },
  { year: "2026", title: "NCS Basketball Champions", cat: "court", detail: "First in school & district history." },
];

/** Early-life texture for the timeline (from the achievements ledger). */
export const ORIGINS = [
  { year: "8th grade", note: "Began journaling — and never stopped." },
  { year: "8th grade", note: "AP Chinese · 5  |  ACT · 29." },
  { year: "8th grade", note: "Hopkins Basketball A-team (after a broken arm the year before)." },
];
