/* ────────────────────────────────────────────────────────────────────
   Story copy for /built.

   Separate from `data.ts` on purpose. `data.ts` is the record — every figure
   in it is sourced from the SpringLight profile, the achievements ledger or
   the poster, and nothing may be invented there. This file holds only the
   PRESENTATION of that record: which real product screen goes with which
   feature, and the short line that names it.

   Rule for every line below: it must be a compression of the project's own
   `body` in `data.ts`, never a new claim. Numbers live in `stats`, are
   rendered once, and are not repeated here.
   ──────────────────────────────────────────────────────────────────── */

export type Beat = {
  /** 1–2 words. The feature's name, not a sentence. */
  label: string;
  /** One short line. Under ~9 words, or it stops being scannable. */
  line: string;
  /** A real screen from the live product. */
  shot: string;
  /** Portrait screens need a taller frame than a 16:10 web capture. */
  aspect?: string;
  /** Keep the important product detail in view when filling the shared frame. */
  position?: string;
  zoom?: number;
  origin?: string;
};

export type Story = {
  /** The one-line reason this exists. Replaces the wall-of-text body. */
  lede: string;
  beats: Beat[];
};

export const STORIES: Record<string, Story> = {
  /**
   * Four real screens from the live public site, captured 2026-11-17. The
   * staff side sits behind Google sign-in with residents' data in it, so the
   * session photographs under the chapter carry that half of the story.
   */
  "salwan-central": {
    lede: "Ideas from coffee with the Mayor used to end when the coffee did. Now they have somewhere to go.",
    beats: [
      {
        label: "Meet",
        line: "Residents sign up with a name and an email.",
        shot: "/embeds/salwan-central/home.jpg",
      },
      {
        label: "Apply",
        line: "Students pitch the topic they want to bring.",
        shot: "/embeds/salwan-central/apply.jpg",
      },
      {
        label: "Programs",
        line: "Sips, Matcha and the internship in one hub.",
        shot: "/embeds/salwan-central/programs.jpg",
      },
      {
        label: "Follow up",
        line: "Each idea gets a private workspace with the team.",
        shot: "/embeds/salwan-central/follow-up.jpg",
      },
    ],
  },

  /** Four screens from tryrung.today, captured 2026-11-17. */
  rung: {
    lede: "AI that keeps people off hold, so the human on the other end can actually help.",
    beats: [
      {
        label: "Pick up",
        line: "An AI agent answers on the first ring.",
        shot: "/embeds/rung/hero.jpg",
      },
      {
        label: "Verify",
        line: "A texted code proves who is calling.",
        shot: "/embeds/rung/verify.jpg",
      },
      {
        label: "Remember",
        line: "Call back and it already knows you.",
        shot: "/embeds/rung/returning.jpg",
      },
      {
        label: "Rank",
        line: "Reps call back the most urgent first, briefed.",
        shot: "/embeds/rung/queue.jpg",
      },
    ],
  },

  /**
   * Four real screens, published by AcornPrep itself at
   * acornprep.com/landing/*-preview.png — the practice, grading, tutor and
   * study-mode surfaces. The product proper sits behind a sign-up wall, so
   * these are the genuine article rather than a reconstruction of it.
   */
  acornprep: {
    lede: "Co-built with Pradyun Kanuparthi for a school with no shared study materials.",
    beats: [
      {
        label: "Practice",
        line: "Unlimited multiple choice, every unit, every course.",
        shot: "/embeds/acornprep/mcq.jpg",
      },
      {
        label: "Grade",
        line: "Free response, marked against the real AP rubric.",
        shot: "/embeds/acornprep/frq.jpg",
      },
      {
        label: "Tutor",
        line: "Sprout explains the miss, not just the answer.",
        // Fill the shared frame from the right, keeping Sprout visible and
        // trimming the capture's black left edge.
        shot: "/embeds/acornprep/tutor-live.jpg",
        position: "right center",
        zoom: 1.5,
        origin: "80% 60%",
      },
      {
        label: "Study",
        line: "Flashcards, podcasts, guides, worked examples, mind maps.",
        shot: "/embeds/acornprep/tips.jpg",
      },
    ],
  },

  /**
   * Hermes has no interface — it is a nightly job whose only surface is the
   * story it posts. So the "screen" is that story, captured from @msjclubs.
   */
  hermes: {
    lede: "Ninety-three accounts, and no one knew what was happening at lunch.",
    beats: [
      {
        label: "Publish",
        line: "One clean schedule story to @msjclubs, every weekday.",
        shot: "/embeds/hermes-story.jpg",
        aspect: "9/16",
      },
    ],
  },

  notebookli: {
    lede: "Built mid-research at UMass, when six dense papers were the reading list.",
    beats: [
      {
        label: "Read",
        line: "Define any term without leaving the paragraph.",
        shot: "/embeds/notebookli/reader.jpg",
        aspect: "898/628",
      },
    ],
  },
};

/* ────────────────────────────────────────────────────────────────────
   The fleet strip.

   `title` breaks on the newline, one reveal line each. `facts` are the short
   form of that project's own `stats` in `data.ts` — the figures are the same
   figures, trimmed to fit a filmstrip caption, and no new ones are invented
   here. `accent` is a colour taken from the card's own screenshot, because
   the backdrop grades to it and a hue that is not in the picture reads as a
   filter laid over the product rather than as the product's own light.
   ──────────────────────────────────────────────────────────────────── */

export type FleetCard = {
  title: string;
  facts: string[];
  accent: string;
  /**
   * When it was built, for the strip's hover caption.
   *
   * `data.ts` carries a `launched` date for the three flagships only — none of
   * these five has one on the record, so this is left blank rather than
   * guessed at, and the caption falls back to the domain. Fill a real date in
   * here and it appears; that is the only change needed.
   */
  when?: string;
};

export const FLEET_CARDS: Record<string, FleetCard> = {
  "msjhs-asb": {
    title: "MSJHS\nASB",
    facts: ["87 CLUBS", "⌘K SEARCH"],
    accent: "#2f6d4f",
  },
  notebookli: {
    title: "Notebook\nLI",
    facts: ["READ AT UMASS", "CLAUDE API"],
    accent: "#3b5bdb",
    when: "Summer 2026",
  },
  "youth-stem-journal": {
    title: "Youth STEM\nJournal",
    facts: ["60 STUDENTS", "6 COHORTS"],
    accent: "#1f6f8b",
  },
  cuesheet: {
    title: "Cue\nSheet",
    facts: ["PICKS FROM A CLIP", "CLAUDE API"],
    accent: "#c8781f",
  },
  "msj-makes": {
    title: "MSJ\nMakes",
    facts: ["DESIGN", "OPERATIONS"],
    accent: "#b3402c",
  },
  "jadonli-com": {
    title: "jadonli.com",
    facts: ["7 DOORS", "ONE PERSON"],
    accent: "#c47b3a",
  },
};
