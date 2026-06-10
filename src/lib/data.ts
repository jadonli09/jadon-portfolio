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
  | "lockedin"
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
  {
    id: "lockedin",
    index: "07",
    title: "Locked In",
    href: "/locked-in",
    kicker: "@li_locked.in",
    blurb: "The content feed — vlogs, the grind, and a gym moment that hit 569k likes in China.",
    art: "content / video wall",
  },
];

/* ───────────────────────── THE STORY SPINE ──────────────────────── */
/**
 * One cohesive narrative. Each chapter is a beat in the same story and a doorway
 * to a deeper "world" you can explore and return from. Read top to bottom, it's
 * one arc; each `href` is a place to dig deeper.
 */
export type Chapter = {
  id: string; // hash anchor on the root, e.g. "operator"
  num: string;
  kicker: string;
  headline: string;
  lede: string;
  stat?: { value: string; label: string };
  image: string;
  /** "contain" shows the whole photo (group/poster shots); "cover" fills + parallax. */
  fit?: "cover" | "contain";
  /** object-position for cover shots, e.g. "85% 40%" to feature an off-centre subject. */
  position?: string;
  world: WorldId;
  href: string;
  cta: string;
  accent: string; // hint of the destination world's colour, on the dark root
};

export const CHAPTERS: Chapter[] = [
  {
    id: "ritual",
    num: "01",
    kicker: "The Ritual",
    headline: "A stopwatch and a journal.",
    lede: "Before any of it: every birthday since he was twelve, Jadon runs Mission Peak alone — and he's journaled since the eighth grade. The grind began as a private ritual.",
    stat: { value: "47:33", label: "Mission Peak PR · age 15" },
    image: "/img/missionpeak2026-1.jpg",
    world: "about",
    href: "/about",
    cta: "Into the person",
    accent: "#c2855f",
  },
  {
    id: "operator",
    num: "02",
    kicker: "The Operator",
    headline: "Elected to lead, every year.",
    lede: "That discipline found a stage. Three-time Class President, now ASB President — he lost his way into winning, and runs events at the scale of a city.",
    stat: { value: "3×", label: "Class President" },
    image: "/img/asb-officers.jpg",
    fit: "contain",
    world: "leadership",
    href: "/leadership",
    cta: "Into leadership & events",
    accent: "#d4af6a",
  },
  {
    id: "storyteller",
    num: "03",
    kicker: "The Storyteller",
    headline: "Documenting a city, and himself.",
    lede: "Then he picked up a camera. Under Ampersand Media he tells a city's stories — directing the Voices of Fremont podcast with the Mayor, a viral push to revive a beloved restaurant, and a paid role as the Mayor's videographer.",
    stat: { value: "10k", label: "Views per Mayor video" },
    image: "/img/voices-of-fremont-with-jennifersiebalnewsom.jpg",
    world: "civic",
    href: "/civic",
    cta: "Into civic & storytelling",
    accent: "#d9533c",
  },
  {
    id: "scientist",
    num: "04",
    kicker: "The Scientist",
    headline: "Reading the genome of pain.",
    lede: "Curiosity pulled him into the lab. Trained in R by a Stanford professor, he hunted the mediators of gout pain in a mouse model — and traced them to the spinal cord.",
    stat: { value: "3rd", label: "ACSEF · Computational Bio" },
    image: "/img/acsef-science-fair.jpg",
    fit: "contain",
    world: "research",
    href: "/research",
    cta: "Into research & STEM",
    accent: "#34e0c4",
  },
  {
    id: "builder",
    num: "05",
    kicker: "The Builder",
    headline: "Ship it. Then ship the next.",
    lede: "What he learned, he shipped. AcornPrep turned six AP exams into a study tool 500+ students actually use — the #1 Google result, built on a real pipeline.",
    stat: { value: "500+", label: "AcornPrep users" },
    image: "/img/presenting-acornprep-at-gemini-meetup.jpg",
    fit: "contain",
    world: "built",
    href: "/built",
    cta: "Into the things he's built",
    accent: "#7c9cff",
  },
  {
    id: "competitor",
    num: "06",
    kicker: "The Competitor",
    headline: "First in school history.",
    lede: "And through all of it, the court. He started in the first five the year Mission San Jose won its first NCS title in school and district history.",
    stat: { value: "2026", label: "NCS Champions" },
    image: "/img/ncs-champions.jpg",
    world: "court",
    href: "/court",
    cta: "Into the court",
    accent: "#ff5b1f",
  },
  {
    id: "pursuit",
    num: "07",
    kicker: "The Pursuit",
    headline: "The pursuit of happiness.",
    lede: "Cooking with a friend, flying drones, a sunrise climb he finally stopped timing. Five pursuits, one person — all pointing the same way, and all documented under @li_locked.in.",
    stat: { value: "500k+", label: "Views in a month" },
    image: "/img/headshot1.jpg",
    position: "center 32%",
    world: "lockedin",
    href: "/locked-in",
    cta: "Into Locked In",
    accent: "#ff3d81",
  },
];

/** Map a world to the story chapter it belongs to (for "back to the story"). */
export const WORLD_TO_CHAPTER: Record<WorldId, string> = {
  about: "ritual",
  leadership: "operator",
  civic: "storyteller",
  research: "scientist",
  built: "builder",
  court: "competitor",
  lockedin: "pursuit",
  achievements: "pursuit",
  contact: "pursuit",
};

/* ─────────────────────────── LOCKED IN ──────────────────────────── */
export const LOCKED = {
  intro:
    "@li_locked.in is the documentation of a grind — basketball, cooking, study tips, and the discomfort of putting yourself in new positions. 1,400+ followers, 500k+ views in under a month.",
  metrics: [
    { value: 1400, suffix: "+", label: "Followers" },
    { value: 500, suffix: "k+", label: "Views in a month" },
    { value: 569, suffix: "k", label: "Likes · one DouYin clip" },
  ],
  /** Real li_locked.in reels — Instagram blocks third-party iframe embeds, so each
   *  card links to the live reel. */
  reels: [
    "DLRF6eHxs5T",
    "DZWMdCUNfbd",
    "DYq5cONMOLs",
    "DYoHKfPtu3v",
    "DYdgPNBJN_X",
    "DX5kwLDRK_G",
    "DX27M67tZjT",
    "DXqPCxtjfdx",
    "DXo3at8h0NU",
    "DXk8WxzDZrg",
  ].map((code) => ({ code, url: `https://www.instagram.com/reel/${code}/` })),
  /** Native video files (the cooking / "feasts" content). */
  videos: [
    { src: "/vid/cookingfeasts-2.mp4", poster: "/vid/cookingfeasts-2.jpg", label: "In the kitchen" },
    { src: "/vid/cooking-feast1.mp4", poster: "/vid/cooking-feast1.jpg", label: "Feast night" },
    { src: "/vid/cookingfeasts-3.mp4", poster: "/vid/cookingfeasts-3.jpg", label: "Plating up" },
  ],
  douyin: {
    url: "https://www.iesdouyin.com/share/video/7247003661631622458/",
    likes: "569k",
    comments: "15k",
    shares: "36k",
    creator: "野球帝 / courtman network",
    note: "A gym moment in China, reposted by a 3.7M-follower hoops account — 569k likes.",
  },
} as const;

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
      role: "Co-President — competition pipeline",
      site: "science fairs · olympiads",
      detail:
        "Built STEM-PAC (from the HOSA chapter Jadon founded in 10th) into a club that guides students toward real competitions — coaching them into the Alameda County Science Fair (ACSEF), biology and broader STEM olympiads, and other external contests, not just in-house events. Iron Chef (23 contestants) and the egg drop (12 teams) are the community glue; the science-fair and olympiad pipeline is the point.",
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
      "Built by a 6-AP veteran for a high-stress school with no centralized study materials. AcornPrep packages AP prep into modes that fit how people actually study — unlimited MCQ practice, graded FRQ practice, flashcards, podcasts, mind maps, and study guides, with AI tutor guidance. Released to Mission San Jose on 04/11/2026; 100 users in the first 24 hours, 500+ across the season, 13,000 MCQs practiced. Endorsed by 4 AP teachers, #1 Google result, and rebuilt from scratch with Claude Code on a real dev pipeline. Next: SAT prep. Partner: Pradyun Kanuparthi.",
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
    "Elected to lead, every year. Three-time Class President, now ASB President — plus VP of two clubs. The office is the point; the events are the proof.",
  /** THE HEADLINE — the elected offices, front and centre. */
  roles: [
    {
      title: "ASB President",
      window: "2026–2027",
      tag: "Student body",
      note:
        "Beat Jane Huang (who'd run against him — and lost — every year). Lost the race as a sophomore by ~10 votes, ran back, and won. Led the Leadership II selection: 90+ applicants → 60 (written) → 30 (interviews).",
      highlight: true,
    },
    {
      title: "Class President ×3",
      window: "9th · 10th · 11th",
      tag: "Class of 2027",
      note:
        "Won the freshman race (vs. Oscar Zhang), the sophomore race (vs. Kaylin Teo), and re-election as a junior. Ran Homecoming three years straight and 13 fundraisers worth $5,520.40.",
      highlight: true,
    },
    {
      title: "Climbing Club VP",
      window: "Treasurer → VP",
      tag: "Clubs",
      note:
        "Ran the (notoriously fiddly) fundraising and reimbursement forms, led boba fundraisers past $800, and built a permanent climbing wall in the weight room — a first for the school.",
    },
    {
      title: "MSJ Makes VP",
      window: "Merch design",
      tag: "Clubs",
      note:
        "Led merch design for clubs and teams — hoodies, tees, glass awards, stickers, and 40 senior stoles. ~$700 revenue, ~$400 profit, 8 clients.",
    },
  ],
  winterBall: {
    title: "Winter Ball — Built From Scratch",
    date: "February 2026",
    body:
      "The first winter ball since before COVID — no precedent, no playbook. To set the bar, he proposed two new initiatives: a live drink bar (his freshman/JV coach, Coach Ed, bartended mocktails on the spot — people were gutted when it ran out) and game tables (he got MPPFA's fundraising lead to lend poker/roulette tables instead of buying new). 350 students came.",
    stat: { value: "350", label: "Students" },
  },
  /** Car Meet — a notable event, no longer the headline. */
  carMeet: {
    title: "MSJ Car Meet",
    date: "November 8, 2025",
    pitch: "Co-led the first car meet in Mission San Jose history — a city-wide event, not just a school one.",
    stats: [
      { value: "$35M+", label: "In cars on the lot" },
      { value: "60+", label: "Cars" },
      { value: "$3.5M", label: "One Pagani" },
      { value: "~200", label: "Attendees" },
    ],
    body:
      "One of five seniors leading it; Jadon ran the media side — promotion and coverage (@msjmeets) — and brought in City Council and the Mayor to speak. The team door-knocked the neighborhood so all of Fremont, not just MSJ, was invited.",
  },
  /** The operator's event log — expanded. */
  events: [
    { title: "ICE Protest", window: "2026", metric: "20k+ views", note: "Organized a 500+-person protest at Mission, then made a news-anchor-style video about it that reached 20k+ views across the district." },
    { title: "Valentine's Scavenger Hunt", window: "2026", metric: "262 players", note: "Hosted under li_locked.in ($300 in prizes, self-funded). School-trivia clues you couldn't Google — you had to talk to people. 262 participants." },
    { title: "Homecoming ×3", window: "9th–11th", metric: "2nd place", note: "Tangled (hour-long), Spirited Away (45 min — 2nd place), Legend of Korra. Delegated deco / airband / skit, set deadlines, supervised practices." },
    { title: "Senior Breakfast", window: "2026", metric: "$4.8k · 500", note: "Sourced 4 caterers, deliberated with the incoming ASB team, ordered $4.8k for 500 servings — and saved the day when the mailed check vanished in transit." },
    { title: "CO26 Graduation", window: "2026", metric: "500 names", note: "Led the planning, built the name-card system end to end, and personally announced all 500 names at TAK Stadium (one missed syllable, out of 500)." },
    { title: "Prom @ Cal Academy of Sciences", window: "2026", metric: "—", note: "Helped plan prom at the California Academy of Sciences." },
    { title: "JP Basketball", window: "Founder · 2025", metric: "$60/hr", note: "Founded a coaching program for grades 4–8 — Sundays, ~$60/hr, 6 students, 2 coaches." },
    { title: "City of Fremont", window: "Summer 2024", metric: "Rec Director", note: "Coached 5–12-year-olds across many sports at the Irvington Sports Jam — learning to keep kids engaged and comfortable." },
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
    { period: "Grades 3–9", role: "AAU Basketball", note: "Hoopsphere · Trust · Mambas — local and national tournaments. (Made the Hopkins A-team in 8th after a broken arm sidelined 7th grade.)" },
    { period: "9th", role: "Freshman Co-Captain", note: "Kept team responsibility and motivation as a freshman co-captain." },
    { period: "10th", role: "JV Co-Captain", note: "Led JV to a .500 league record — and learned the team played better on the court when they were close off it (team dinners, bonding)." },
    { period: "Summer '25", role: "Varsity Summer League", note: "Graduated to Varsity. 3-day-a-week summer trainings, 3 tournaments. Shooting + lifting at Bay Club with Coach Ed." },
    { period: "11th", role: "Varsity · started first 5", note: "Started in the opening five while better players were injured early; took fewer minutes as they returned, and learned how much bench energy drives team synergy." },
    { period: "2026", role: "NCS Champion", note: "Won the NCS title — the first in both school and Fremont district history. Recognized by the Mayor and the City." },
  ],
  douyin: { value: "569k", label: "Likes on DouYin", note: "At a gym in China, he played with and against a 网红 (influencer); his game drew media attention and the clip hit 569k+ likes." },
} as const;

/* ───────────────────────────── ABOUT ───────────────────────────── */
export type Climb = { year: string; time: string; seconds: number; pr?: boolean; note?: string };

/** Birthday-climb times by age, as journaled since age 12. PR = 47:33 at 15. */
const CLIMBS: Climb[] = [
  { year: "12", time: "59:58", seconds: 3598, note: "the first climb — reached the top with 2 seconds to spare" },
  { year: "13", time: "49:46", seconds: 2986, note: "ten minutes faster — decided to make it a tradition" },
  { year: "14", time: "59:18", seconds: 3558, note: "mispaced the start, burnt out before halfway" },
  { year: "15", time: "47:33", seconds: 2853, pr: true, note: "PR — bottom to peak, Stanford Trailhead" },
  { year: "16", time: "54:00", seconds: 3240, note: "a 7AM sunrise climb, filmed for li_locked.in — stopped chasing the PR, started noticing the view" },
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
      body: "Biweekly cooking with Samay — a shared outlet from rigorous courses, 'immersed in sound, taste, and smell.' Perfected macarons, Beef Ragu, and grilled chicken; chasing a Hojicha Basque cheesecake. Feasts for friends at Thanksgiving, New Year's, and Lunar New Year.",
    },
    {
      title: "The Camera",
      body: "Filming since a kid on his mom's iPhone 6. Now an FAA-approved pilot flying 'the areas I could only see when I dreamed to fly' — DJI Mini 2 SE → DJI Avata 2 (FPV) → Osmo Pocket 3.",
    },
    {
      title: "The Journal",
      body: "Kept since the start of 8th grade — at first just summarizing events, then releasing the truth and going deeper. At least once a month: trivial events, motivations, purpose, feelings.",
    },
    {
      title: "The Shelf",
      body: "The Three-Body Problem (Liu Cixin), Sunrise on the Reaping (Collins), The Circle & The Every (Eggers).",
    },
  ],
  /** Drone / camera gear progression, for a graphical timeline. */
  gear: [
    { name: "iPhone 6", note: "where it started — his mom's phone" },
    { name: "DJI Mini 2 SE", note: "first drone — exploring the skies" },
    { name: "DJI Avata 2", note: "FPV — bought with saved + earned money" },
    { name: "Osmo Pocket 3", note: "the everyday cinema rig" },
  ],
  /** Travel map, for graphical rendering. */
  travel: [
    { place: "Xi'an, China", note: "6 weeks with grandparents — Tianjin, Chengdu, Chongqing too" },
    { place: "Japan", note: "Kyoto · Tokyo · Osaka" },
    { place: "Taiwan", note: "Taipei" },
    { place: "Vancouver", note: "Spring-break travel vlog — chose the trip over grinding APs, and came back energized" },
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

export type TrophyCat = "academic" | "research" | "civic" | "built" | "leadership" | "court" | "personal";
export type Trophy = { year: string; title: string; cat: TrophyCat; detail: string };

/** Category labels + colours — the trophy case is colour-coded by domain. */
export const CAT_META: Record<TrophyCat, { label: string; color: string }> = {
  academic: { label: "Academics", color: "#8f9bff" },
  research: { label: "Research & STEM", color: "#34e0c4" },
  civic: { label: "Civic & Media", color: "#e0563f" },
  built: { label: "Built", color: "#b9ff66" },
  leadership: { label: "Leadership", color: "#d4af6a" },
  court: { label: "The Court", color: "#ff5b1f" },
  personal: { label: "The Person", color: "#ff5da2" },
};

/**
 * The full ledger of meaningful achievements & experiences, by year. (AP exam
 * scores live in the Score Board above; one-off/irrelevant entries are omitted.)
 */
export const TROPHIES: Trophy[] = [
  // ── Pre-high school / 8th grade ──
  { year: "Pre-HS", title: "ATDP Entrepreneurship — UC Berkeley", cat: "academic", detail: "A pre-8th summer course that sharpened presentation and critical thinking." },
  { year: "8th", title: "Continental Math League — 30/30", cat: "academic", detail: "A perfect score across all six contest tests." },
  { year: "7–8th", title: "6× Academic Excellence — Hopkins", cat: "academic", detail: "Character award given to ≤2 students per class of 30." },
  { year: "8th", title: "DECA Headstart — 2nd of 12", cat: "academic", detail: "Placed 2nd at the pre-DECA middle-school conference." },
  { year: "8th", title: "Began journaling", cat: "personal", detail: "At first just events, then 'releasing the truth.' Never stopped." },
  { year: "8th", title: "The Milk Issue", cat: "civic", detail: "Noticed spoiled school milk, pressured the principal — the school bought refrigerators." },
  { year: "8th", title: "Hopkins Basketball A-Team", cat: "court", detail: "Made the A-team after a broken arm cost him 7th grade." },
  { year: "Age 12", title: "Mission Peak tradition begins", cat: "personal", detail: "First solo birthday climb — sub-hour by two seconds." },
  // ── Freshman ──
  { year: "9th", title: "Class President — elected (FCO)", cat: "leadership", detail: "Won the freshman race vs. Oscar Zhang." },
  { year: "9th", title: "Freshman Basketball Co-Captain", cat: "court", detail: "Kept team responsibility and motivation." },
  { year: "9th", title: "JP Basketball — founded", cat: "leadership", detail: "A summer training program to make skill-learning fun." },
  // ── Sophomore ──
  { year: "Summer '24", title: "City of Fremont Rec Director", cat: "leadership", detail: "Coached 5–12-year-olds across many sports; ~$600 earned." },
  { year: "10th", title: "Class President — re-elected (SOCO)", cat: "leadership", detail: "Won the sophomore race vs. Kaylin Teo." },
  { year: "10th", title: "JV Basketball Co-Captain", cat: "court", detail: "Led JV to a .500 league record; team dinners after losses." },
  { year: "10th", title: "MSJ HOSA — founding officer", cat: "research", detail: "Health-science club; launched MSJ Iron Chef." },
  { year: "10th", title: "Lost ASB President by ~10 votes", cat: "leadership", detail: "The underdog sophomore run — heartbreak that became the comeback." },
  // ── Summer '25 / Junior — research ──
  { year: "Summer '25", title: "R + Bioinformatics training", cat: "research", detail: "Learned R (ggplot2) and the RNA-seq pipeline under Dr. Shady Younice, Stanford." },
  { year: "2025", title: "ACSEF — 3rd, Computational Biology", cat: "research", detail: "Gout RNA-seq; pain mediators traced to the spinal cord → new therapeutic targets." },
  { year: "2025", title: "USABO — Honorable Mention", cat: "research", detail: "26/50, top ~15% (semifinalist cutoff 28)." },
  { year: "2025", title: "UK Biology Olympiad — Silver", cat: "research", detail: "Top 10%, taken with no explicit prep." },
  { year: "2025", title: "Youth STEM Journal Club — founder", cat: "research", detail: "Taught 8 middle-schoolers to dissect research papers at the Fremont Library." },
  { year: "2025", title: "PRISM — co-founder", cat: "research", detail: "Promoting representation in clinical trials, with partner Arav." },
  { year: "2025", title: "Varian tour", cat: "research", detail: "Studied TrueBeam & Halcyon radiation-therapy machines." },
  { year: "2025", title: "ACWD Water-Plant tour — led 10", cat: "research", detail: "Organized a private treatment-plant tour with outreach director Renee Gonzales." },
  // ── Junior — civic / media ──
  { year: "2025", title: "li_locked.in launched", cat: "civic", detail: "0 → 1,000 followers in a summer; 500k+ views." },
  { year: "2025", title: "Mayor's Intern Program", cat: "civic", detail: "Surveyed residents and worked city events." },
  { year: "2025", title: "Mayor's Videographer (paid)", cat: "civic", detail: "Grew the Mayor's per-video reach ~1k → 10k; $50/video." },
  { year: "2025", title: "Voices of Fremont — director", cat: "civic", detail: "Directs & edits the Mayor's ~7-minute podcast; thousands of views monthly." },
  { year: "2025", title: "Sweet Tomatoes revival", cat: "civic", detail: "The viral origin — pitched reviving the restaurant; emailed Tucson with the Mayor." },
  { year: "2025", title: "Fremont Stories", cat: "civic", detail: "A video series on unconventional career paths (with Akash Sethi & Brittany Lu)." },
  { year: "2025", title: "Small Business Accessibility Initiative", cat: "civic", detail: "Op-ed in the San Mateo Daily Journal; backed SB 84 with Prof. Durazo; presented at City Council." },
  { year: "2025", title: "HG Nguyen for D7 — social media", cat: "civic", detail: "Lead videographer/editor for a San Jose council campaign." },
  { year: "2025", title: "Fremont Youth Advisory Commission", cat: "civic", detail: "1 of 13 commissioners from ~100 applicants." },
  { year: "2025", title: "ACWD Water Clips — 1st", cat: "civic", detail: "1st of 100+ entries · $500 (with Pradyun)." },
  { year: "2025", title: "ACWD Water Clips — 3rd", cat: "civic", detail: "A second entry placed 3rd · $100." },
  { year: "2025", title: "Met the Governor & First Partner", cat: "civic", detail: "At a California Love, California Strong event." },
  // ── Junior — built ──
  { year: "2025", title: "AcornPrep — launched", cat: "built", detail: "AI AP study tool: 500+ users, 13,000 MCQs, #1 Google result, 4 AP-teacher endorsements." },
  { year: "2025", title: "CueSheet — shipped", cat: "built", detail: "A music-supervision tool, live at cuesheet.xyz." },
  { year: "2025", title: "MSJ Makes VP", cat: "built", detail: "Led merch design; 40 senior stoles; ~$700 revenue, ~$400 profit." },
  { year: "2026", title: "Hermes — in build", cat: "built", detail: "An Instagram club-info scraper; ~90% complete." },
  // ── Junior — leadership / events ──
  { year: "2025", title: "MSJ Car Meet", cat: "leadership", detail: "First in MSJ history · $35M+ in cars · a $3.5M Pagani." },
  { year: "2025–26", title: "Class President ×3", cat: "leadership", detail: "Three years running; ran Homecoming and 13 fundraisers worth $5,520.40." },
  { year: "2026", title: "ASB President — elected", cat: "leadership", detail: "Beat Jane Huang; led the Leadership-II selection (90 → 60 → 30)." },
  { year: "2026", title: "Winter Ball — built from scratch", cat: "leadership", detail: "First since COVID · 350 students · drink bar + borrowed game tables." },
  { year: "2026", title: "Valentine's Scavenger Hunt", cat: "leadership", detail: "262 participants · $300 in self-funded prizes." },
  { year: "2026", title: "Homecoming — 2nd place", cat: "leadership", detail: "Spirited Away, a 45-minute class performance." },
  { year: "2026", title: "Campus climbing wall — built", cat: "leadership", detail: "A first for the school; led as Climbing Club VP." },
  { year: "2026", title: "Senior Breakfast", cat: "leadership", detail: "$4.8k for 500 servings — and saved the day when the check vanished in the mail." },
  { year: "2026", title: "CO26 Graduation — led planning", cat: "leadership", detail: "Built the name-card system; announced all 500 names at TAK Stadium." },
  // ── Junior — civic (protest) & court ──
  { year: "2026", title: "ICE Protest — organized", cat: "civic", detail: "500+ participants; the recap video hit 20k+ views." },
  { year: "2025", title: "China gym moment — 569k likes", cat: "court", detail: "Outplayed a 网红 (influencer); the clip went viral on DouYin." },
  { year: "2026", title: "NCS Basketball Champions", cat: "court", detail: "First title in school AND district history; started in the first five." },
  // ── Ongoing / personal ──
  { year: "Ongoing", title: "FAA-approved drone pilot", cat: "personal", detail: "DJI Mini 2 SE → Avata 2 (FPV) → Osmo Pocket 3." },
  { year: "Ongoing", title: "Mission Peak PR — 47:33", cat: "personal", detail: "The fastest birthday ascent, at age 15." },
];

/** Early-life texture for the timeline (from the achievements ledger). */
export const ORIGINS = [
  { year: "Age 12", note: "First solo Mission Peak birthday climb — sub-hour by 2 seconds." },
  { year: "8th grade", note: "Began journaling — at first events, then 'the truth.' Never stopped." },
  { year: "8th grade", note: "AP Chinese · 5  |  ACT · 29  |  Continental Math 30/30." },
  { year: "8th grade", note: "Hopkins Basketball A-team — after a broken arm cost him 7th grade." },
  { year: "Pre-HS", note: "ATDP entrepreneurship at UC Berkeley; a to-scale lit-up Colosseum model." },
];
