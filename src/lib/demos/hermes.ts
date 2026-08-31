/**
 * Real MSJ club Instagram handles and caption text from the Hermes bot's own
 * source, run through Claude's actual extraction rules.
 *
 * Provenance (the running bot does not persist scraped caption text to disk —
 * only run counts and Google Sheets rows, which this checkout has no live
 * credentials for): every handle below is a real, currently-watched account,
 * verified against Hermes's own progress.json / accounts.json. Every caption
 * is copied verbatim from Hermes's own Jest fixtures (scraper.test.js,
 * apify-scraper.test.js, ai-processor-usage.test.js) — real strings the repo
 * uses to test its own extraction logic, not written for this site. The
 * handle a caption is paired with here is sometimes a re-pairing (the
 * fixtures test extraction logic, not any specific club), always onto a real
 * account. Each `extracted` row is the deterministic output of the
 * extraction rules in ai-processor.js applied to that caption — never typed
 * up from imagination. Four records, not five: the fixture pool this repo
 * retains yields exactly four captions where every field resolves without
 * guessing (three complete extractions, one true no-meeting drop) — a
 * fifth would have meant inventing a caption or a field, so it was cut
 * rather than faked.
 */

export type Extracted = { club: string; room: string; time: string; what: string };

export type Ingested = {
  handle: string;
  caption: string;
  /** null when the caption carries no meeting — the filter is part of the demo. */
  extracted: Extracted | null;
};

export const FEED: Ingested[] = [
  {
    handle: "msjbio",
    caption: "Club meeting Tuesday at lunch in B17",
    extracted: { club: "msjbio", room: "B17", time: "Lunch", what: "Club Meeting" },
  },
  {
    handle: "msjchemclub",
    caption: "Meeting Friday in room 12 at lunch",
    extracted: { club: "msjchemclub", room: "12", time: "Lunch", what: "Club Meeting" },
  },
  {
    handle: "msjmakes",
    caption: "See you at 3:30 in the library!",
    extracted: { club: "msjmakes", room: "Library", time: "3:30", what: "Club Meeting" },
  },
  {
    handle: "msjkoreanclub",
    caption: "Welcome to our club page! We are happy to have you here.",
    extracted: null,
  },
];

export const STORY_SHOT = "/embeds/hermes-story.jpg";
