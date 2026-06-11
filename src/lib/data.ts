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
  | "albums"
  | "contact";

export const PROFILE = {
  name: "Jadon Li",
  roles: ["Civic Storyteller", "Bio Researcher", "Builder", "Student Leader", "Athlete"],
  tagline: "One person, locked in — documented in public.",
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
    kicker: "The Mayor's videographer",
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
    blurb: "The content feed — vlogs, study tips, and the grind, documented in public.",
    art: "content / video wall",
  },
];

/* ─────────────────── THE SENTENCE (landing doors) ─────────────────── */
/** One door per world: a bold word in the landing's one-sentence overview. */
export type SentenceDoor = {
  id: WorldId;
  /** nav index, in sentence order */
  num: string;
  /** nav display name */
  kicker: string;
  word: string;
  href: string;
  /** bright text colour on the dark landing */
  color: string;
  /** destination world accent (underline) */
  accent: string;
  /** background flood + peek-card photo */
  photo: string;
  /** one-line stat in the peek card */
  peek: string;
};

export const SENTENCE_DOORS = {
  leads: { id: "leadership", num: "01", kicker: "The Operator", word: "leads", href: "/leadership", color: "#d9a83f", accent: "#b07c1e", photo: "/img/asb-officers.jpg", peek: "3× Class President → ASB President" },
  films: { id: "civic", num: "02", kicker: "The Storyteller", word: "films", href: "/civic", color: "#e0644e", accent: "#c2402c", photo: "/img/voices-of-fremont-with-jennifersiebalnewsom.jpg", peek: "The Mayor's videographer · Voices of Fremont" },
  researches: { id: "research", num: "03", kicker: "The Scientist", word: "researches", href: "/research", color: "#2fc4ad", accent: "#0c9c86", photo: "/img/acsef-science-fair.jpg", peek: "Gout pain in the genome · 3rd at ACSEF" },
  builds: { id: "built", num: "04", kicker: "The Builder", word: "builds", href: "/built", color: "#7c89e8", accent: "#4f5fd6", photo: "/img/presenting-acornprep-at-gemini-meetup.jpg", peek: "AcornPrep · 500+ students · #1 on Google" },
  competes: { id: "court", num: "05", kicker: "The Competitor", word: "competes", href: "/court", color: "#f0703a", accent: "#e04e12", photo: "/img/ncs-champions.jpg", peek: "First NCS title in school history" },
  documents: { id: "lockedin", num: "06", kicker: "The Pursuit", word: "documents all of it", href: "/locked-in", color: "#e8689c", accent: "#d23f7c", photo: "/img/headshot1.jpg", peek: "@li_locked.in · 1.39M plays in year one" },
  person: { id: "about", num: "07", kicker: "The Person", word: "person", href: "/about", color: "#c98a5d", accent: "#a9683f", photo: "/img/missionpeak2026-1.jpg", peek: "Mission Peak every birthday · journaling since 8th grade" },
} satisfies Record<string, SentenceDoor>;

export const SENTENCE_TICKER = ["3× president", "10k views / video", "ACSEF 3rd", "500+ users", "NCS champions", "1.39M plays"] as const;

/* ─────────────────── THE PINBOARD (landing record) ─────────────────── */
export type PinKind = "letter" | "polaroid" | "plaque" | "seal" | "ticket" | "note" | "news" | "receipt" | "ribbon" | "index";
export type PinItem = {
  kind: PinKind;
  /** destination; omit for the letter */
  href?: string;
  /** hover tag, e.g. "→ the court · rafters" */
  go?: string;
  img?: string;
  caption?: string;
  value?: string;
  label?: string;
  text?: string;
  hed?: string;
  src?: string;
  lines?: string[];
  accent?: string;
  /** SENTENCE_DOORS id this pin anchors — the red thread from that word ends here */
  world?: string;
  /** desktop board placement */
  left: string;
  top: number;
  rot: number;
  z: number;
  w?: number;
};

/** Sixty-word intro, pinned on the board as a letter. */
export const PIN_LETTER_TEXT =
  "Jadon Li is a junior at Mission San Jose. Elected president every year since freshman year, films for the Mayor of Fremont, traced gout pain through the genome, built a study app 500+ students use, started on the first championship team in school history — and posted the whole journey.";

export const PINBOARD: PinItem[] = [
  { kind: "letter", left: "1%", top: 26, rot: -2, z: 2, w: 270 },
  { kind: "polaroid", world: "court", href: "/court", go: "→ the court", img: "/img/ncs-champions.jpg", caption: "first NCS title in school history!", left: "21%", top: 12, rot: 4, z: 4, w: 180 },
  { kind: "news", href: "/court", go: "→ the court · rafters", hed: "“Believe it: Mission San Jose wins first NCS title in boys basketball”", src: "The Mercury News · Feb 2026 · MSJ 46–40", left: "34%", top: 114, rot: -3.5, z: 6, w: 212 },
  { kind: "seal", world: "leadership", href: "/leadership#elected-offices-heading", go: "→ leadership · offices", text: "3× CLASS PRESIDENT · NOW ASB", left: "53%", top: 10, rot: 8, z: 5, w: 98 },
  { kind: "polaroid", href: "/leadership", go: "→ leadership", img: "/img/speaking-at-rally.jpg", caption: "rally szn", left: "61%", top: 50, rot: -5, z: 3, w: 158 },
  { kind: "plaque", world: "lockedin", href: "/locked-in#timeline", go: "→ the pursuit", value: "1.39M", label: "plays · yr one · @li_locked.in", accent: "#e8689c", left: "75%", top: 20, rot: 3, z: 6 },
  { kind: "note", href: "/about", go: "→ the person", text: "journaling since 8th grade ✎ — naps highly recommended", accent: "#ffe27a", left: "87%", top: 90, rot: -6, z: 4, w: 132 },
  { kind: "polaroid", href: "/about", go: "→ the person", img: "/img/ironchef-win.jpg", caption: "Iron Chef — W", left: "85%", top: 192, rot: 5, z: 3, w: 146 },
  { kind: "polaroid", href: "/leadership#elected-offices-heading", go: "→ leadership · offices", img: "/img/asb-officers.jpg", caption: "ASB officer team", left: "2%", top: 246, rot: 3, z: 4, w: 168 },
  { kind: "receipt", href: "/leadership#elected-offices-heading", go: "→ leadership · offices", lines: ["CLASS OF 2027", "──────────", "FUNDRAISED  $15,000", "STOLES JOB     $700", "──────────", "TOTAL        A LOT"], left: "16%", top: 208, rot: -4, z: 5, w: 132 },
  { kind: "ribbon", world: "research", href: "/research", go: "→ research", value: "3rd", label: "ACSEF · comp bio", left: "27%", top: 190, rot: 6, z: 7, w: 96 },
  { kind: "polaroid", href: "/research", go: "→ research", img: "/img/acsef-science-fair.jpg", caption: "the genomics of gout pain", left: "33%", top: 236, rot: -2, z: 4, w: 162 },
  { kind: "ticket", world: "built", href: "/built", go: "→ built", text: "ACORNPREP · ADMIT 500+", label: "six AP exams · #1 on Google", accent: "#7c89e8", left: "48%", top: 204, rot: -5, z: 6, w: 154 },
  { kind: "polaroid", href: "/built", go: "→ built", img: "/img/presenting-acornprep-at-gemini-meetup.jpg", caption: "pitching at the Gemini meetup", left: "57%", top: 242, rot: 5, z: 4, w: 168 },
  { kind: "polaroid", world: "civic", href: "/civic", go: "→ civic", img: "/img/voices-of-fremont-with-jennifersiebalnewsom.jpg", caption: "Voices of Fremont, w/ the First Partner", left: "72%", top: 232, rot: -4, z: 5, w: 178 },
  { kind: "polaroid", world: "about", href: "/about", go: "→ the person", img: "/img/missionpeak2026-1.jpg", caption: "every birthday, same mountain", left: "4%", top: 352, rot: -5, z: 3, w: 158 },
  { kind: "seal", href: "/about", go: "→ the person", value: "46:46", text: "MISSION PEAK", accent: "silver", left: "18%", top: 336, rot: 7, z: 6, w: 82 },
  { kind: "index", href: "/leadership#club-crews-heading", go: "→ leadership · clubs", text: "Also currently: MSJ Makes President · STEM-PAC Co-President · ~$4k profit shipping merch jobs", left: "26%", top: 382, rot: -3, z: 5, w: 178 },
  { kind: "ticket", href: "/civic", go: "→ civic", text: "★ 10K VIEWS", label: "per Mayor video", accent: "#e0644e", left: "41%", top: 350, rot: 4, z: 5, w: 126 },
  { kind: "note", href: "/civic", go: "→ civic", text: "saved a beloved restaurant w/ one viral push", accent: "#ffd0e2", left: "50%", top: 388, rot: -6, z: 4, w: 118 },
  { kind: "polaroid", href: "/leadership#winter-ball-title", go: "→ leadership · events", img: "/img/winterball-1.jpg", caption: "Winter Ball — sold out", left: "61%", top: 358, rot: 6, z: 4, w: 152 },
];

/* ─────────────────────────── LOCKED IN ──────────────────────────── */
export const LOCKED = {
  intro:
    "@li_locked.in started June 6, 2025 — a promise to document the grind in public. One year later: 83 reels, 1.39 million plays, and a city-sized story or two. Study tips, campaigns, feasts, the discomfort of trying new things — the whole year is below, in order.",
  metrics: [
    { value: 368, suffix: "", label: "Days documented" },
    { value: 83, suffix: "", label: "Reels" },
    { value: 1.39, suffix: "M+", decimals: 2, label: "Plays in year one" },
    { value: 1769, suffix: "", label: "Followers" },
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

/* ─────────────────────────── THE PURSUIT ────────────────────────── */
/**
 * One year of @li_locked.in, documented — Jun 6, 2025 (Day 1) → Jun 8, 2026 (Day 368).
 * Every date, caption, view and like count below is real, pulled from the live account
 * on 2026-06-10. Keystone moments play natively from /vid/pursuit/<slug>.mp4 (+ .jpg
 * poster); log rows and quotes link out to the reel.
 */
export type PursuitVideoMoment = {
  kind: "video";
  slug: string;
  code: string;
  date: string;
  day: number;
  title: string;
  caption: string;
  views: string;
  likes: string;
  /** homecoming is the only landscape source */
  aspect?: "landscape";
};
export type PursuitLogMoment = {
  kind: "log";
  code: string;
  date: string;
  day: number;
  text: string;
  views?: string;
};
export type PursuitQuoteMoment = {
  kind: "quote";
  code: string;
  date: string;
  day: number;
  text: string;
};
export type PursuitMoment = PursuitVideoMoment | PursuitLogMoment | PursuitQuoteMoment;

export type PursuitChapter = {
  id: string;
  num: string;
  range: string;
  /** Two stacked bold headline lines. */
  title: [string, string];
  /** Per-chapter accent — the spine grades through these, season by season. */
  accent: string;
  narrative: string;
  moments: PursuitMoment[];
};

export const PURSUIT: { chapters: PursuitChapter[] } = {
  chapters: [
    {
      id: "summer-grind",
      num: "01",
      range: "June 2025",
      title: ["The summer", "grind."],
      accent: "#ffb43d",
      narrative:
        "June 6, 2025 — sophomore year ends, and the account begins with a promise: post every single day of summer. The early reels are raw — study tips, growing pains, a bulking arc, a few plot twists. But the thesis shows up fast. By week three the whole project has a name: a series called The Pursuit of Happiness, with Fremont's mayor in episode one.",
      moments: [
        {
          kind: "video",
          slug: "day1",
          code: "DKlRbevxIjA",
          date: "Jun 6, 2025",
          day: 1,
          title: "Day one.",
          caption: "junior year is not ready for us (and vice versa)",
          views: "5.9k",
          likes: "160",
        },
        {
          kind: "log",
          code: "DKvhYEox2uc",
          date: "Jun 10, 2025",
          day: 5,
          text: "the bulk begins 😬",
          views: "9.7k",
        },
        {
          kind: "log",
          code: "DK0oc0TP4fP",
          date: "Jun 12, 2025",
          day: 7,
          text: "Plot Twist Ep. 1 — “might’ve been the wrong call”",
          views: "5.9k",
        },
        {
          kind: "video",
          slug: "climbing-wall",
          code: "DLLyxnkJn6F",
          date: "Jun 21, 2025",
          day: 16,
          title: "First civic campaign.",
          caption: "vote for a climbing wall 😁 — your city, your park, your voice",
          views: "31.7k",
          likes: "637",
        },
        {
          kind: "video",
          slug: "poh-ep1",
          code: "DLRF6eHxs5T",
          date: "Jun 23, 2025",
          day: 18,
          title: "The series gets its name.",
          caption: "The Pursuit of Happiness: Ep. 1 — Introduction and Mayor Salwan",
          views: "32.5k",
          likes: "677",
        },
        {
          kind: "log",
          code: "DLbZtJpRXlR",
          date: "Jun 27, 2025",
          day: 22,
          text: "journaling is tuff",
          views: "3.5k",
        },
        {
          kind: "log",
          code: "DLjB0XSRyvT",
          date: "Jun 30, 2025",
          day: 25,
          text: "The Pursuit of Happiness Ep. 3 — “A Pivot”",
          views: "4.0k",
        },
      ],
    },
    {
      id: "road-to-1600",
      num: "02",
      range: "July 2025",
      title: ["The road", "to 1600."],
      accent: "#3df0ff",
      narrative:
        "July turns into a countdown. The Road to 1600 — a daily SAT-prep diary, T-minus days ticking down through library Khan Academy grinds, Desmos exploits, and nutrition takes. Then AP scores drop, the camera catches the reaction, and 95,000 people watch. First taste of real scale.",
      moments: [
        {
          kind: "video",
          slug: "ap-scores",
          code: "DL3npLsRB3q",
          date: "Jul 8, 2025",
          day: 33,
          title: "AP scores drop.",
          caption: "we out 🤞🫡 — #apscorereactions",
          views: "95.1k",
          likes: "1,338",
        },
        {
          kind: "log",
          code: "DMOwl8wxqXM",
          date: "Jul 17, 2025",
          day: 42,
          text: "studymaxing 🤫",
          views: "9.2k",
        },
        {
          kind: "log",
          code: "DMWd7WGJilo",
          date: "Jul 20, 2025",
          day: 45,
          text: "WE locked in — The Road to 1600: T-33",
          views: "7.2k",
        },
        {
          kind: "log",
          code: "DMeOU8aJXVp",
          date: "Jul 23, 2025",
          day: 48,
          text: "bro just e^x your way to an 800 using DESMOS 🤦‍♂️ — T-30",
          views: "5.1k",
        },
        {
          kind: "log",
          code: "DMjUae8J-8A",
          date: "Jul 25, 2025",
          day: 50,
          text: "nutrition is underrated in study strategies — T-28",
          views: "8.1k",
        },
      ],
    },
    {
      id: "sweet-tomatoes",
      num: "03",
      range: "July — August 2025",
      title: ["The Sweet", "Tomatoes saga."],
      accent: "#ff3d81",
      narrative:
        "Day 51 is supposed to be a throwaway: what if Sweet Tomatoes — Fremont's beloved, long-gone buffet — came back? 339,000 views later it's a campaign. Feasibility updates, lease-signage news from the landlord's realty, a whole city checking its mail. Half a million views in a single month — and one quiet reel to close it out.",
      moments: [
        {
          kind: "video",
          slug: "sweet-tomatoes",
          code: "DMl8ytdxtOZ",
          date: "Jul 26, 2025",
          day: 51,
          title: "The one that blew up.",
          caption: "this would lit be a dream could true",
          views: "339k",
          likes: "8,249",
        },
        {
          kind: "log",
          code: "DM9JKrQIDZp",
          date: "Aug 4, 2025",
          day: 60,
          text: "ong gotta lock in now — no time to edit today sorry 🙏",
          views: "7.7k",
        },
        {
          kind: "log",
          code: "DNE1OxhJdh9",
          date: "Aug 7, 2025",
          day: 63,
          text: "final confirmation of lease signage to RCFH was sent from Kimco. Praying that people check their mail 🙏",
          views: "15.6k",
        },
        {
          kind: "log",
          code: "DNMtbsQxaV0",
          date: "Aug 10, 2025",
          day: 66,
          text: "locked out.",
          views: "7.9k",
        },
        {
          kind: "video",
          slug: "pursuing-happiness",
          code: "DNPOJzcxZHm",
          date: "Aug 11, 2025",
          day: 67,
          title: "The thank-you.",
          caption: "Pursuing happiness. Thank you.",
          views: "10.4k",
          likes: "228",
        },
        {
          kind: "video",
          slug: "we-got-ts",
          code: "DNYWKtFR4kZ",
          date: "Aug 15, 2025",
          day: 71,
          title: "It worked.",
          caption: "we got ts",
          views: "25.8k",
          likes: "715",
        },
      ],
    },
    {
      id: "school-year",
      num: "04",
      range: "September — December 2025",
      title: ["The school", "year."],
      accent: "#ff7a3d",
      narrative:
        "Junior year starts and the daily promise relaxes — the camera doesn't. Homecoming hype reels that pull 39k between two classes, drone passes over the track, Diwali fireworks, and a three-part civic case for fixing a new park's parking plan. December closes with 41 Cursor credits left and a vibe-coding diary that turns into AcornPrep.",
      moments: [
        {
          kind: "video",
          slug: "homecoming",
          code: "DO-JJ3bjsew",
          date: "Sep 23, 2025",
          day: 110,
          title: "Homecoming season.",
          caption: "IN OUR PRIME, WE’RE 29 💙💙",
          views: "18.9k",
          likes: "386",
          aspect: "landscape",
        },
        {
          kind: "log",
          code: "DPB4xYsDkKJ",
          date: "Sep 25, 2025",
          day: 112,
          text: "28, WE DOMINATE 💛",
          views: "20.0k",
        },
        {
          kind: "log",
          code: "DPupKLEgX5m",
          date: "Oct 12, 2025",
          day: 129,
          text: "recognize and apply your strengths — drone over the track",
          views: "12.1k",
        },
        {
          kind: "log",
          code: "DQQMzyvAZvy",
          date: "Oct 25, 2025",
          day: 142,
          text: "firecrackers def AI; don’t report us — Diwali",
          views: "11.1k",
        },
        {
          kind: "log",
          code: "DRV2WHuiCa2",
          date: "Nov 21, 2025",
          day: 169,
          text: "….so we designed a better plan — Palm Park parking, part 3",
          views: "5.9k",
        },
        {
          kind: "log",
          code: "DRtKB99kT8N",
          date: "Nov 30, 2025",
          day: 178,
          text: "Aeries can wait 😌 — a reset day in SF",
          views: "8.8k",
        },
        {
          kind: "video",
          slug: "vibe-coding",
          code: "DSoI-zvEZt9",
          date: "Dec 23, 2025",
          day: 201,
          title: "The build log begins.",
          caption: "down to our last 41 — follow along to see how far our vibes can take us with vibe coding 🤙",
          views: "8.3k",
          likes: "151",
        },
      ],
    },
    {
      id: "seventeen",
      num: "05",
      range: "January — June 2026",
      title: ["Seventeen.", "Still going."],
      accent: "#b48cff",
      narrative:
        "January 2nd, before sunrise: the Mission Peak birthday tradition, on camera, at 17. The spring that follows puts the account everywhere — campus walkout coverage cut like a news package, the First Partner and then the Governor of California on mic, Iron Chef, prom in San Francisco, AP-season feasts. Day 368 is a June SAT post-mortem. The pursuit continues.",
      moments: [
        {
          kind: "video",
          slug: "mission-peak-17",
          code: "DTCCFMrEVKs",
          date: "Jan 2, 2026",
          day: 211,
          title: "The birthday climb.",
          caption: "good morning, 17 🌅",
          views: "5.9k",
          likes: "266",
        },
        {
          kind: "video",
          slug: "mundane",
          code: "DTrVWZnEd9g",
          date: "Jan 18, 2026",
          day: 227,
          title: "The thesis.",
          caption: "an attempt to create the extraordinary from the mundane",
          views: "5.8k",
          likes: "248",
        },
        {
          kind: "video",
          slug: "walkout",
          code: "DUe38VrkTCK",
          date: "Feb 7, 2026",
          day: 247,
          title: "Covering the walkout.",
          caption: "hundreds of Mission students walked out with signs, chants, and speeches that echoed across campus",
          views: "18.8k",
          likes: "567",
        },
        {
          kind: "log",
          code: "DUzijNWkRs7",
          date: "Feb 15, 2026",
          day: 255,
          text: "a deceptively simple (yet delectable) macaron recipe 😋",
          views: "5.8k",
        },
        {
          kind: "log",
          code: "DVU1pJjES8G",
          date: "Feb 28, 2026",
          day: 268,
          text: "happy questions with happy people in the happiest city in the US — with Jennifer Siebel Newsom",
          views: "3.9k",
        },
        {
          kind: "video",
          slug: "newsom",
          code: "DWDGRnzkdFA",
          date: "Mar 18, 2026",
          day: 286,
          title: "The Governor, on mic.",
          caption: "@cagovernor answers the hottest, most controversial takes in the county: milk or cereal first?",
          views: "8.3k",
          likes: "146",
        },
        {
          kind: "log",
          code: "DXk8WxzDZrg",
          date: "Apr 25, 2026",
          day: 324,
          text: "thank you to all our participants in the 2026 Iron Chef competition 🙏🙏",
          views: "15.7k",
        },
        {
          kind: "log",
          code: "DXo3at8h0NU",
          date: "Apr 27, 2026",
          day: 326,
          text: "stay tuned for Wednesday’s drop 🥹 — prom, at SF’s Cal Academy",
          views: "27.5k",
        },
        {
          kind: "log",
          code: "DYq5cONMOLs",
          date: "May 22, 2026",
          day: 351,
          text: "core boys at prom 🥹❤️‍🩹",
          views: "7.7k",
        },
        {
          kind: "video",
          slug: "june-sat",
          code: "DZWMdCUNfbd",
          date: "Jun 8, 2026",
          day: 368,
          title: "Day 368. Still posting.",
          caption: "circle with points XYZ on circumference….huh?",
          views: "9.6k",
          likes: "207",
        },
      ],
    },
  ],
};

/* ───────────────────────────── CIVIC ───────────────────────────── */
export const CIVIC = {
  intro:
    "Jadon turns a city into a story — civic video, podcasts, and campaigns that move real numbers.",
  vofInstagram: "https://www.instagram.com/voices_of_fremont/",
  vofHandle: "@voices_of_fremont",
  /** The Sweet Tomatoes saga, in order — real reels + stats from @li_locked.in (2025). */
  sweetTomatoesReels: [
    {
      url: "https://www.instagram.com/reel/DMl8ytdxtOZ/",
      caption: "this would lit be a dream could true",
      likes: "8,249",
      comments: "198",
      date: "Jul 26, 2025",
      poster: "/embeds/st-01.jpg",
    },
    {
      url: "https://www.instagram.com/reel/DMtpLnSvfcl/",
      caption: "update: still clarifying the availability of the facility",
      likes: "674",
      comments: "29",
      date: "Jul 29, 2025",
      poster: "/embeds/st-02.jpg",
    },
    {
      url: "https://www.instagram.com/reel/DM35ZM7J5gS/",
      caption: "might be feasible…",
      likes: "2,886",
      comments: "65",
      date: "Aug 2, 2025",
      poster: "/embeds/st-03.jpg",
    },
    {
      url: "https://www.instagram.com/reel/DNYWKtFR4kZ/",
      caption: "we got ts",
      likes: "715",
      comments: "198",
      date: "Aug 15, 2025",
      poster: "/embeds/st-04.jpg",
    },
  ],
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
    url: "https://www.fremont.gov/government/departments/city-clerk/boards-commissions-committees/youth-advisory-commission",
    /** The commission, off the record — real reel + stats from @li_locked.in. */
    reel: {
      url: "https://www.instagram.com/reel/DV7auLNEc2P/",
      caption: "YAC Fremont — students get a real voice in local government",
      likes: "213",
      comments: "13",
      date: "Mar 15, 2026",
      poster: "/embeds/yac-reel.jpg",
    },
  },
  /** The SBAI op-ed as published — real article metadata (San Mateo Daily Journal). */
  opEd: {
    url: "https://www.smdailyjournal.com/opinion/guest_perspectives/pragmatic-win-for-accessibility-small-businesses/article_7acc77ef-4f78-40c5-bb45-fa4218094077.html",
    title: "Pragmatic win for accessibility, small businesses",
    byline: "By Luke Wu, Arissa Cao and Jadon Li",
    outlet: "San Mateo Daily Journal",
    date: "Aug 22, 2025",
    image: "/embeds/oped-smdj.jpg",
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
        "Built MSJ STEM-PAC — Projects and Competitions — from the club Jadon founded as a 10th-grade officer into a pipeline that guides students toward real competitions: the Alameda County Science Fair (ACSEF), biology and broader STEM olympiads, and other external contests, not just in-house events. Iron Chef (23 contestants) and the egg drop (12 teams) are the community glue; the science-fair and olympiad pipeline is the point.",
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
    url: "https://msjmakes.framer.website/",
    domain: "msjmakes.framer.website",
    embeddable: true,
    shot: "/embeds/msjmakes.jpg",
    tagline: "Student merch, designed & sold.",
    stats: [
      { value: "~$4k", label: "Profit · all jobs" },
      { value: "Design", label: "Operation" },
    ],
    body: "A student merch-design operation — concept, design, and sales — servicing clubs and sports teams campus-wide (badminton and volleyball hoodies, basketball merch, DECA minicon glass, senior stoles), with around $4,000 in profit across jobs.",
    stack: ["Design", "Operations"],
  },
];

/* ─────────────────────── LEADERSHIP & EVENTS ────────────────────── */
export const LEADERSHIP = {
  intro:
    "Elected to lead, every year. Three-time Class President, now ASB President — plus President of MSJ Makes and Co-President of STEM-PAC. The office is the point; the events are the proof.",
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
        "Won the freshman race (vs. Oscar Zhang), the sophomore race (vs. Kaylin Teo), and re-election as a junior. Ran Homecoming three years straight (153 → 235 students organized) and 22 fundraisers + two years of merch — ~$11k revenue over three semesters.",
      highlight: true,
    },
    {
      title: "MSJ Makes President",
      window: "VP → President",
      tag: "Clubs",
      note:
        "The school's maker-and-merch club: a real design studio servicing clubs and sports teams across campus — MSJ badminton hoodies, volleyball hoodies, basketball merch, glass awards for DECA's minicons and the STEM clubs, stickers, tees. The headline job: 40 custom senior stoles, cut and pressed in-house ($700 revenue and $400 profit from that one commission alone). Across all jobs, the club has cleared around $4,000 in profit. Now, as President, he runs the whole operation — client intake, design pipeline, production days, and the books.",
      photo: "/img/msjmakes-stoles.jpg",
      photoAlt: "MSJ Makes officers at a work table covered in stole fabrics, vinyl lettering, and pressed designs",
      photoCaption: "Stole season — production day",
    },
    {
      title: "MSJ STEM-PAC Co-President",
      window: "Founder → Co-Pres",
      tag: "Clubs",
      note:
        "The club he founded as a 10th-grade officer, rebuilt around what members actually do: STEM Projects and Competitions — that's the PAC. Weekly posts surface upcoming competitions and deadlines; bi-weekly workshops help students start and develop projects; a staged-entry pipeline coaches them from smaller contests into ACSEF, biology and STEM olympiads, and regional research fairs. Iron Chef (23 contestants) and the egg drop (12 teams) keep students walking through the door — the competition pipeline is what they stay for. Co-President with Ashley Kang, plus 3 officers.",
      photo: "/img/stempac-meeting.jpg",
      photoAlt: "A full classroom at an MSJ STEM-PAC meeting, officers presenting slides at the front",
      photoCaption: "Full room — a STEM-PAC meeting",
    },
    {
      title: "Climbing Club VP",
      window: "Treasurer → VP",
      tag: "Clubs",
      note:
        "Started as Treasurer running the (notoriously fiddly) fundraising and reimbursement forms, then stepped up to VP. Built the club's money engine: boba fundraisers past $800, the school's first Raising Cane's fundraiser at $1,300+ revenue, and a Google Apps Script system that automated pre-orders. The capstone: a permanent climbing wall in the weight room — a first for the school, pitched, funded, and built.",
      photo: "/img/climbingclub-all1.jpg",
      photoAlt: "The full Climbing Club membership posing together",
      photoCaption: "All hands — Climbing Club",
    },
  ],
  winterBall: {
    title: "Winter Ball — Built From Scratch",
    date: "February 2026",
    body:
      "The first winter ball since before COVID — no precedent, no playbook. To set the bar, he proposed two new initiatives: a live drink bar mixing mocktails on the spot (people were gutted when it ran out) and game tables (he got MPPFA's fundraising lead to lend poker/roulette tables instead of buying new). 350 students came.",
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
  /**
   * Club officer crews — one entry per club Jadon helps lead.
   * `photo` slots render a styled placeholder until the real officer-team
   * shot lands in /public/img (drop the file in; no code change needed).
   */
  crews: [
    {
      club: "MSJ Makes",
      role: "President",
      arc: "VP → President",
      monogram: "MM",
      photo: "/img/msjmakes-officers.jpg",
      photoAlt: "MSJ Makes officer team",
      blurb:
        "The maker-and-merch club, servicing clubs and sports teams campus-wide — badminton and volleyball hoodies, basketball merch, DECA minicon glass, STEM club awards, and 40 senior stoles. Now he runs it.",
      stat: { value: "~$4k", label: "profit across all jobs" },
    },
    {
      club: "MSJ STEM-PAC",
      role: "Co-President",
      arc: "Founded it in 10th",
      monogram: "SP",
      photo: "/img/stempac-officers.jpg",
      photoAlt: "MSJ STEM-PAC officer team",
      blurb:
        "Projects and Competitions — that's the PAC. A coaching pipeline into ACSEF, biology and STEM olympiads, and external contests, with Iron Chef and the egg drop as community glue.",
      stat: { value: "50", label: "club members" },
    },
    {
      club: "Climbing Club",
      role: "Vice President",
      arc: "Treasurer → VP",
      monogram: "CC",
      photo: "/img/climbingclub-officers.jpg",
      photoAlt: "Climbing Club officer team",
      blurb:
        "Ran the fundraising machine — boba drives past $800, the first Raising Cane's fundraiser at $1,300+ — and built a permanent climbing wall in the weight room, a first for the school.",
      stat: { value: "$2.7k", label: "raised across drives" },
    },
  ],
  /**
   * The operator's event log — expanded. Notes use **bold** markers for the
   * load-bearing words (rendered gold in the ledger); `facts` are the
   * line-item cells under each note. Text-only by design — the photos live
   * in the In the Field strip.
   */
  events: [
    {
      title: "ICE Protest",
      window: "2026",
      metric: "20k+ views",
      note: "Organized a **500+-person protest** at Mission — because staying silent tells those in power they can act without accountability, and what affects our neighbors today affects us tomorrow. Then turned it into a **news-anchor-style recap video** that travelled across the district.",
      facts: [
        { value: "500+", label: "participants" },
        { value: "20k+", label: "video views" },
        { value: "500+", label: "likes, district-wide" },
      ],
      video: { url: "https://www.instagram.com/reel/DUe38VrkTCK/", label: "Watch the recap — 20k+ views" },
    },
    {
      title: "Valentine's Scavenger Hunt",
      window: "2026",
      metric: "262 players",
      note: "Hosted under **li_locked.in** with **$300 in prizes, self-funded**. Every clue was school trivia you couldn't Google — players had to **talk to teachers and classmates** to crack the puzzles. Engagement was the whole point.",
      facts: [
        { value: "262", label: "participants" },
        { value: "$300", label: "prizes · self-funded" },
        { value: "3", label: "winners" },
      ],
    },
    {
      title: "Homecoming ×3",
      window: "9th–11th",
      metric: "150+ participants",
      note: "Ran Homecoming **all three years** — recruiting and organizing **150+ participants per year** across **deco, airband, and skit**: delegating leaders, setting deadlines, supervising practices, and clearing every piece of ASB paperwork end to end.",
      facts: [
        { value: "3", label: "years running it" },
        { value: "150+", label: "participants / year" },
        { value: "3", label: "squads — deco · airband · skit" },
      ],
    },
    {
      title: "Senior Breakfast",
      window: "2026",
      metric: "$4.8k",
      note: "Sourced and compared **4 caterers**, deliberated the menu with the incoming ASB team, and placed a **$4.8k order for 500 servings** — then **saved the event** when the mailed check vanished in transit.",
      facts: [
        { value: "4", label: "caterers sourced" },
        { value: "$4.8k", label: "the order" },
        { value: "500", label: "servings" },
      ],
    },
    {
      title: "CO26 Graduation",
      window: "2026",
      metric: "500 students",
      note: "Led the planning and built the **name-card system end to end** — on site for **6am prep**, then personally **announced all 500 names** at TAK Stadium.",
      facts: [
        { value: "500", label: "names announced" },
        { value: "6am", label: "prep call" },
        { value: "TAK", label: "stadium stage" },
      ],
    },
    {
      title: "Prom @ Cal Academy of Sciences",
      window: "2026",
      metric: "600+ students",
      note: "Helped plan prom at the **California Academy of Sciences** — **600+ students** and a **$98k production** for a night in the museum. Also shot the **K-drama-style promo** in SF with the video team: the most popular MSJTV video yet.",
      facts: [
        { value: "600+", label: "students" },
        { value: "$98k", label: "production cost" },
        { value: "500+", label: "likes on the promo, day one" },
      ],
    },
    {
      title: "JP Basketball",
      window: "Founder · 2025",
      metric: "$60/hr",
      note: "**Founded** a basketball training program with 'Coach PradyFlex' — business plan to coaching, built to **ignite passion first, skills second**. Sunday sessions, **20 players** coached, and **over $2k made**.",
      facts: [
        { value: "$60/hr", label: "rate" },
        { value: "20", label: "players coached" },
        { value: "$2k+", label: "made" },
      ],
    },
    {
      title: "City of Fremont",
      window: "Summer 2024",
      metric: "Rec Director",
      note: "Part-time **Recreational Director** at the Irvington Sports Jam — coaching **5–12-year-olds** across many sports, learning to keep kids **comfortable and engaged**, and earning **~$600** doing it.",
      facts: [
        { value: "5–12", label: "ages coached" },
        { value: "~$600", label: "earned" },
        { value: "ISJ", label: "Irvington Sports Jam" },
      ],
    },
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
  douyin: {
    value: "569k",
    label: "Likes on DouYin",
    note: "At a gym in China, he played with and against a 网红 (influencer); his game drew media attention and the clip hit 569k+ likes.",
    url: "https://www.douyin.com/video/7247003661631622458",
    /** Video id for the open.douyin.com iframe player. */
    vid: "7247003661631622458",
    /** Exact counts from the DouYin share API (digg_count / comment_count), June 2026. */
    likes: "569,002",
    comments: "15,164",
    statsAsOf: "06·2026",
  },
  /** Mercury News coverage of the NCS title game (headline/deck verbatim from the article). */
  press: {
    outlet: "The Mercury News",
    section: "High School Sports",
    headline: "Believe it! Mission San Jose wins first NCS title in boys basketball",
    deck: "Joseph Standfield scores 23 points as Mission San Jose rallies from double-digit deficit to beat Rancho Cotate in North Coast Section Division IV final.",
    byline: "Darren Sabedra",
    date: "Feb 27, 2026",
    url: "https://www.mercurynews.com/2026/02/27/believe-it-mission-san-jose-wins-first-ncs-title-in-boys-basketball/",
    score: { msj: 46, opp: 40, oppName: "Rancho Cotate", venue: "NCS D-IV Final · Santa Rosa" },
  },
} as const;

/* ───────────────────────────── ABOUT ───────────────────────────── */
export type Climb = { year: string; time: string; seconds: number; pr?: boolean; note?: string };

/** Birthday-climb times by year (born Jan 2, 2009 — every climb lands in early January). */
const CLIMBS: Climb[] = [
  { year: "2021", time: "59:58", seconds: 3598, note: "the first climb, at twelve — reached the top with 2 seconds to spare" },
  { year: "2022", time: "49:46", seconds: 2986, note: "ten minutes faster — decided to make it a tradition" },
  { year: "2023", time: "59:18", seconds: 3558, note: "mispaced the start, burnt out before halfway" },
  { year: "2024", time: "47:33", seconds: 2853, note: "sub-48 — bottom to peak, Stanford Trailhead" },
  { year: "2025", time: "46:46", seconds: 2806, pr: true, note: "PR — up in time to watch the sunrise" },
  { year: "2026", time: "54:00", seconds: 3240, note: "the 7AM sunrise climb, filmed for li_locked.in — stopped chasing the PR, started noticing the view" },
];

export type TravelStop = {
  place: string;
  region: string;
  /** Longitude/latitude in degrees, for the world-map projection. */
  lon: number;
  lat: number;
  home?: boolean;
  note?: string;
};

/** Travel stops for the interactive world map. */
const TRAVEL_STOPS: TravelStop[] = [
  { place: "Fremont, CA", region: "Home base", lon: -121.99, lat: 37.55, home: true, note: "Where every trip starts and ends." },
  { place: "Xi'an", region: "China", lon: 108.94, lat: 34.34, note: "6 weeks with grandparents — street food, cities within cities" },
  { place: "Tianjin", region: "China", lon: 117.36, lat: 39.34, note: "Part of the same six-week China summer" },
  { place: "Chengdu", region: "China", lon: 104.07, lat: 30.57, note: "Part of the same six-week China summer" },
  { place: "Chongqing", region: "China", lon: 106.55, lat: 29.56, note: "Part of the same six-week China summer" },
  { place: "Tokyo", region: "Japan", lon: 139.69, lat: 35.68 },
  { place: "Kyoto · Osaka", region: "Japan", lon: 135.6, lat: 34.9 },
  { place: "Taipei", region: "Taiwan", lon: 121.57, lat: 25.03 },
  { place: "Vancouver", region: "Canada", lon: -123.12, lat: 49.28, note: "Spring-break travel vlog — chose the trip over grinding APs, and came back energized" },
  { place: "Toronto", region: "Canada", lon: -79.38, lat: 43.65 },
  { place: "Quebec City", region: "Canada", lon: -71.21, lat: 46.81 },
  { place: "Cabo San Lucas", region: "Mexico", lon: -109.91, lat: 22.89 },
  { place: "London", region: "United Kingdom", lon: -0.13, lat: 51.51 },
  { place: "Las Vegas", region: "Nevada", lon: -115.14, lat: 36.17 },
  { place: "Reno", region: "Nevada", lon: -119.81, lat: 39.53 },
];

export const ABOUT = {
  ethos:
    "li_locked.in is the documentation of a grind — basketball, cooking, study tips, and the discomfort of putting yourself in new positions for self-improvement. One year in: 83 reels, 1.39M plays.",
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
  travel: TRAVEL_STOPS,
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

/** Category labels + colours — the archive is colour-coded by domain (tuned to read on a bright gallery). */
export const CAT_META: Record<TrophyCat, { label: string; color: string }> = {
  academic: { label: "Academics", color: "#4f5fd6" },
  research: { label: "Research & STEM", color: "#0c9c86" },
  civic: { label: "Civic & Media", color: "#c2402c" },
  built: { label: "Built", color: "#5d9c1e" },
  leadership: { label: "Leadership", color: "#b07c1e" },
  court: { label: "The Court", color: "#e04e12" },
  personal: { label: "The Person", color: "#d23f7c" },
};

/**
 * The full ledger of meaningful achievements & experiences, by year. (AP exam
 * scores live in the Score Board above; one-off/irrelevant entries are omitted.)
 */
export const TROPHIES: Trophy[] = [
  // ── Middle school (Hopkins, class of 2023) ──
  { year: "2021", title: "Mission Peak tradition begins", cat: "personal", detail: "First solo birthday climb at twelve — sub-hour by two seconds." },
  { year: "2022", title: "ATDP Entrepreneurship — UC Berkeley", cat: "academic", detail: "A pre-8th summer course that sharpened presentation and critical thinking." },
  { year: "2022", title: "Began journaling", cat: "personal", detail: "At first just events, then 'releasing the truth.' Never stopped." },
  { year: "2021–23", title: "6× Academic Excellence — Hopkins", cat: "academic", detail: "Character award given to ≤2 students per class of 30." },
  { year: "2023", title: "Continental Math League — 30/30", cat: "academic", detail: "A perfect score across all six contest tests." },
  { year: "2023", title: "DECA Headstart — 2nd of 12", cat: "academic", detail: "Placed 2nd at the pre-DECA middle-school conference." },
  { year: "2023", title: "Hopkins Basketball A-Team", cat: "court", detail: "Made the A-team after a broken arm cost him 7th grade." },
  { year: "2023", title: "China gym moment — 569k likes", cat: "court", detail: "Outplayed a 网红 (influencer) at a gym in Xi'an; the clip went viral on DouYin." },
  // ── Freshman (2023–24) ──
  { year: "2023", title: "Class President — elected", cat: "leadership", detail: "Won the freshman race; organized 153 students into 6 airbands, 3 deco teams and a skit; built the class site on Wix." },
  { year: "2023", title: "JP Basketball — co-founded", cat: "leadership", detail: "Built the camp from scratch with 'Coach PradyFlex' — business plan to coaching; $400+ each in one 4-day camp." },
  { year: "2024", title: "Freshman Basketball Co-Captain", cat: "court", detail: "Kept team responsibility and motivation." },
  { year: "2024", title: "The milk-fridge crusade", cat: "civic", detail: "Emailed the principal about spoiled milk, followed up until the school bought fridges. 'The reason your milk is good now.'" },
  { year: "2024", title: "Tutoring business — founded", cat: "built", detail: "Independently created, marketed and taught a high-school-readiness program — 30+ hours in two weeks." },
  { year: "2024", title: "FAA-approved drone pilot", cat: "personal", detail: "First drone (DJI Mini 2 SE) → Avata 2 FPV → Osmo Pocket 3." },
  // ── Sophomore (2024–25) ──
  { year: "2024", title: "City of Fremont Rec Director", cat: "leadership", detail: "Coached 5–12-year-olds across many sports at Irvington Sports Jam; ~$600 earned." },
  { year: "2024", title: "Class President — re-elected", cat: "leadership", detail: "Scaled Homecoming to 235 people in 9 airbands; consolidated feedback into a 25-page report." },
  { year: "2024", title: "Link Crew Leader", cat: "leadership", detail: "Guided freshmen through their first days — summer training + orientation day." },
  { year: "2025", title: "JV Basketball Co-Captain", cat: "court", detail: "Led JV to a .500 league record; team dinners after losses." },
  { year: "2025", title: "DECA — top 10 BTDM at SVCDC", cat: "academic", detail: "Top-10 finish in Business & Tech Decision-Making; on DECA's Diamond Leadership Team." },
  { year: "2025", title: "MSJ STEM-PAC — founding officer", cat: "research", detail: "Projects-and-competitions club; launched MSJ Iron Chef." },
  { year: "2025", title: "Lost ASB President by ~10 votes", cat: "leadership", detail: "The underdog sophomore run — heartbreak that became the comeback." },
  { year: "2025", title: "Climbing Club money engine", cat: "leadership", detail: "Treasurer → VP: led the first Raising Cane's fundraiser, $1,300+ revenue, and automated pre-orders with Google Apps Script." },
  // ── Summer 2025 / Junior — research ──
  { year: "2025", title: "R + Bioinformatics training", cat: "research", detail: "Learned R (ggplot2) and the RNA-seq pipeline under Dr. Shady Younice, Stanford." },
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
  { year: "2026", title: "AcornPrep — launched", cat: "built", detail: "AI AP study tool: 500+ users, 13,000 MCQs, #1 Google result, 4 AP-teacher endorsements." },
  { year: "2025", title: "CueSheet — shipped", cat: "built", detail: "A music-supervision tool, live at cuesheet.xyz." },
  { year: "2025", title: "MSJ Makes VP", cat: "built", detail: "Led merch design; 40 senior stoles — $700 revenue, $400 profit on that job alone." },
  { year: "2026", title: "MSJ Makes President", cat: "built", detail: "VP → President; runs the maker-and-merch operation — ~$4,000 profit across club jobs." },
  { year: "2026", title: "MSJ STEM-PAC Co-President", cat: "research", detail: "Co-leads the projects-and-competitions club he founded; ACSEF + olympiad pipeline." },
  { year: "2026", title: "Hermes — in build", cat: "built", detail: "An Instagram club-info scraper; ~90% complete." },
  // ── Junior — leadership / events ──
  { year: "2025", title: "MSJ Car Meet", cat: "leadership", detail: "First in MSJ history · $35M+ in cars · a $3.5M Pagani." },
  { year: "2023–26", title: "Class President ×3", cat: "leadership", detail: "Three years running — 22 fundraisers plus two years of merch: ~$11k revenue over three semesters (yes, he once spent an entire READ period negotiating with Papa John's)." },
  { year: "2026", title: "ASB President — elected", cat: "leadership", detail: "Beat Jane Huang; led the Leadership-II selection (90 → 60 → 30)." },
  { year: "2026", title: "Winter Ball — built from scratch", cat: "leadership", detail: "First since COVID · 350 students · drink bar + borrowed game tables." },
  { year: "2026", title: "Valentine's Scavenger Hunt", cat: "leadership", detail: "262 participants · $300 in self-funded prizes." },
  { year: "2025", title: "Homecoming — 2nd place", cat: "leadership", detail: "Spirited Away, a 45-minute class performance." },
  { year: "2026", title: "Campus climbing wall — built", cat: "leadership", detail: "A first for the school; led as Climbing Club VP." },
  { year: "2026", title: "Senior Breakfast", cat: "leadership", detail: "$4.8k for 500 servings — and saved the day when the check vanished in the mail." },
  { year: "2026", title: "CO26 Graduation — led planning", cat: "leadership", detail: "Built the name-card system; announced all 500 names at TAK Stadium." },
  // ── Junior — civic (protest) & court ──
  { year: "2026", title: "ICE Protest — organized", cat: "civic", detail: "500+ participants; the recap video hit 20k+ views." },
  { year: "2026", title: "NCS Basketball Champions", cat: "court", detail: "First title in school AND district history; started in the first five." },
  { year: "2025", title: "Mission Peak PR — 46:46", cat: "personal", detail: "The fastest birthday ascent yet — up in time for the sunrise." },
];

/** Early-life texture for the timeline (from the achievements ledger). */
export const ORIGINS = [
  { year: "2021", note: "First solo Mission Peak birthday climb, at twelve — sub-hour by 2 seconds." },
  { year: "2022", note: "Began journaling — at first events, then 'the truth.' Never stopped." },
  { year: "2023", note: "AP Chinese · 5  |  ACT · 29  |  Continental Math 30/30 — all in eighth grade." },
  { year: "2023", note: "Hopkins Basketball A-team — after a broken arm cost him 7th grade." },
  { year: "2022", note: "ATDP entrepreneurship at UC Berkeley; a to-scale lit-up Colosseum model." },
];

/* ───────────────────────────── ALBUMS ───────────────────────────── */
/** A photo in /public/img, with a short factual caption. */
export type AlbumPhoto = {
  src: string;
  caption: string;
  /** "contain"-style group shots get framed; default crops to cover. */
  fit?: "cover" | "contain";
};

export type Album = {
  id: string;
  index: string;
  title: string;
  kicker: string;
  blurb: string;
  photos: AlbumPhoto[];
};

/** Every original photo, grouped into albums. Captions describe the frame only. */
export const ALBUMS: Album[] = [
  {
    id: "court",
    index: "01",
    title: "The Court",
    kicker: "Hoops, frosh to champions",
    blurb: "Four seasons of MSJ basketball — ending in the first NCS title in school and district history.",
    photos: [
      { src: "/img/ncs-champions.jpg", caption: "NCS Champions, 2026" },
      { src: "/img/var-bbal1.jpg", caption: "Varsity, in the paint" },
      { src: "/img/var-bbal2.jpg", caption: "Varsity, game night" },
      { src: "/img/ncs-champs-with-mayor.jpg", caption: "Champions, with the Mayor" },
      { src: "/img/ncs-champs-recognized-by-city.jpg", caption: "Recognized by the City of Fremont" },
      { src: "/img/jv-bbal.jpg", caption: "JV season" },
      { src: "/img/frosh-bbal.jpg", caption: "Where it started — frosh ball" },
      { src: "/img/aau-basketball.jpg", caption: "AAU ball — driving the lane" },
    ],
  },
  {
    id: "podium",
    index: "02",
    title: "The Podium",
    kicker: "ASB & class leadership",
    blurb: "Rallies, fundraisers, and the officer teams behind events run at the scale of a school.",
    photos: [
      { src: "/img/speaking-at-rally.jpg", caption: "Speaking at the rally" },
      { src: "/img/asb-officers.jpg", caption: "ASB officers", fit: "contain" },
      { src: "/img/asb-with-other-schools.jpg", caption: "With ASB teams from other schools" },
      { src: "/img/school-fundraising1.jpg", caption: "School fundraiser" },
      { src: "/img/school-fundraising2.jpg", caption: "Fundraiser, mid-rush" },
      { src: "/img/school-fundraising3.jpg", caption: "Fundraiser crew" },
      { src: "/img/highschoolpanel-wide.jpg", caption: "High-school panel, wide" },
      { src: "/img/highschoolpanel-close.jpg", caption: "On the panel" },
      { src: "/img/seniorbreakfast-baskets.jpg", caption: "Senior Breakfast — pastry baskets ($4.8k, 500 servings)" },
      { src: "/img/seniorbreakfast-bagels.jpg", caption: "Senior Breakfast — the bagel towers" },
      { src: "/img/prom-calacademy.jpg", caption: "Prom at the Cal Academy of Sciences" },
      { src: "/img/freshmenyear-speech.jpg", caption: "Freshman year — the first speech" },
      { src: "/img/classofficer-freshman.jpg", caption: "Class officers, 9th — the freshman slate" },
      { src: "/img/classofficer-sophomore.jpg", caption: "Class officers, 10th — on the rally mic" },
      { src: "/img/classofficer-junior.jpg", caption: "Class officers, 11th — never second" },
    ],
  },
  {
    id: "lens",
    index: "03",
    title: "Behind the Lens",
    kicker: "Civic shoots",
    blurb: "Podcast sets, mayoral edits, car meets, and the drone — the city as seen through the work.",
    photos: [
      { src: "/img/voices-of-fremont-with-jennifersiebalnewsom.jpg", caption: "Voices of Fremont — with Jennifer Siebel Newsom" },
      { src: "/img/editing-for-mayor-timeline.jpg", caption: "On the timeline — editing for the Mayor" },
      { src: "/img/droneshot1.jpg", caption: "Drone — over Fremont" },
      { src: "/img/carmeet1.jpg", caption: "Car meet shoot" },
      { src: "/img/droneshot2.jpg", caption: "Drone — golden hour" },
      { src: "/img/carmeet2.jpg", caption: "Car meet, detail" },
      { src: "/img/droneshot3.jpg", caption: "Drone — the grid" },
      { src: "/img/carmeet3.jpg", caption: "Car meet, lineup" },
      { src: "/img/droneshot4.jpg", caption: "Drone — hills" },
      { src: "/img/carmeet4.jpg", caption: "Car meet, night" },
      { src: "/img/droneshot5.jpg", caption: "Drone — horizon" },
    ],
  },
  {
    id: "lab",
    index: "04",
    title: "The Lab & The Launch",
    kicker: "Research, fairs, AcornPrep",
    blurb: "Science-fair boards, contest wins, and shipping AcornPrep with a co-founder.",
    photos: [
      { src: "/img/acsef-science-fair.jpg", caption: "ACSEF science fair", fit: "contain" },
      { src: "/img/presenting-acornprep-at-gemini-meetup.jpg", caption: "Presenting AcornPrep at a Gemini meetup", fit: "contain" },
      { src: "/img/acornprep-cofounders.jpg", caption: "AcornPrep co-founders" },
      { src: "/img/acwd-water-contest-1stplace.jpg", caption: "ACWD water contest — 1st place" },
      { src: "/img/ysjc-2025-summer-showcase.jpg", caption: "YSJC 2025 summer showcase" },
      { src: "/img/acwd-water-tour.jpg", caption: "ACWD water-treatment plant — the private tour" },
      { src: "/img/ironchef-win.jpg", caption: "Stoichiometry Iron Chef — 2025 winner's plaque" },
      { src: "/img/stempac-meeting.jpg", caption: "STEM-PAC meeting — full room" },
      { src: "/img/stempac-officers.jpg", caption: "MSJ STEM-PAC — the officer team" },
      { src: "/img/msjmakes-stoles.jpg", caption: "MSJ Makes — senior stole production" },
      { src: "/img/msjmakes-officers.jpg", caption: "MSJ Makes — the officer team" },
    ],
  },
  {
    id: "climb",
    index: "05",
    title: "The Climb",
    kicker: "Mission Peak & the wall",
    blurb: "Birthday sunrises on Mission Peak and the climbing club that built a campus wall.",
    photos: [
      { src: "/img/missionpeak2026-1.jpg", caption: "Mission Peak, 2026 — sunrise" },
      { src: "/img/missionpeak2026-2.jpg", caption: "Mission Peak, 2026" },
      { src: "/img/missionpeak2026.jpg", caption: "Mission Peak, 2026 — at the summit tree" },
      { src: "/img/missionpeak2025.jpg", caption: "Mission Peak, 2025" },
      { src: "/img/missionpeak2024.jpg", caption: "Mission Peak, 2024 — the sub-48 climb" },
      { src: "/img/climbingclub-all2.jpg", caption: "Climbing club, all hands" },
      { src: "/img/missionpeak2023.jpg", caption: "Mission Peak, 2023" },
      { src: "/img/climbingclub-officers.jpg", caption: "Climbing club officers" },
      { src: "/img/missionpeak2022.jpg", caption: "Mission Peak, 2022 — ten minutes faster" },
      { src: "/img/climbingclub-all1.jpg", caption: "Climbing club" },
      { src: "/img/missionpeak-2021.jpg", caption: "The first climb — twelve years old, 2021" },
    ],
  },
  {
    id: "portraits",
    index: "06",
    title: "Portraits",
    kicker: "The person in question",
    blurb: "Two headshots. The journal and the stopwatch are off-frame.",
    photos: [
      { src: "/img/headshot1.jpg", caption: "Headshot" },
      { src: "/img/headshot2.jpg", caption: "Headshot, alternate" },
      { src: "/img/hero-bridge-v2.jpg", caption: "Golden Gate — the hero frame" },
    ],
  },
];

/** The hero trail cycles one frame per album beat — variety over completeness. */
export const ALBUM_TRAIL: string[] = [
  "/img/ncs-champions.jpg",
  "/img/speaking-at-rally.jpg",
  "/img/droneshot1.jpg",
  "/img/missionpeak2026-1.jpg",
  "/img/voices-of-fremont-with-jennifersiebalnewsom.jpg",
  "/img/carmeet2.jpg",
  "/img/acornprep-cofounders.jpg",
  "/img/var-bbal1.jpg",
  "/img/climbingclub-all2.jpg",
  "/img/school-fundraising2.jpg",
  "/img/headshot1.jpg",
  "/img/droneshot4.jpg",
];
