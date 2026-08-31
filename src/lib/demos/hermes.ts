/**
 * Two honest, independently-verifiable pieces of Hermes evidence, kept
 * deliberately separate:
 *
 * 1. WATCHED_HANDLES + RUN_STATS — the real account roster and real
 *    telemetry from one actual scraping run (Hermes's own progress.json /
 *    run-log.json, run timestamped 2026-08-28). These are facts about the
 *    system, not about any single post.
 *
 * 2. FEED — caption text copied verbatim from Hermes's own Jest test suite
 *    (scraper.test.js, apify-scraper.test.js, ai-processor-usage.test.js),
 *    run through the extraction rules documented in ai-processor.js's
 *    prompt. The running bot does not retain real scraped caption text
 *    anywhere on disk, and Hermes was never asked to read these accounts'
 *    actual posts — so no caption here is attributed to a handle. `handle`
 *    is optional and unset for every record below on purpose: it exists so
 *    real {handle, caption} pairs can be dropped straight in later without
 *    changing the shape, the moment real captions are available.
 */

export type Extracted = { room: string; time: string; what: string };

export type FeedItem = {
  /** Only ever set once a caption is a verified real post from this account. */
  handle?: string;
  caption: string;
  /** null when the caption carries no meeting — the filter is part of the demo. */
  extracted: Extracted | null;
};

export const FEED: FeedItem[] = [
  {
    caption: "Club meeting Tuesday at lunch in B17",
    extracted: { room: "B17", time: "Lunch", what: "Club Meeting" },
  },
  {
    caption: "Meeting Friday in room 12 at lunch",
    extracted: { room: "12", time: "Lunch", what: "Club Meeting" },
  },
  {
    caption: "See you at 3:30 in the library!",
    extracted: { room: "Library", time: "3:30", what: "Club Meeting" },
  },
  {
    caption: "Welcome to our club page! We are happy to have you here.",
    extracted: null,
  },
];

/** Real accounts Hermes polled in its 2026-08-28 run — progress.json, processedClubs. */
export const WATCHED_HANDLES: string[] = [
  "msjkoreanclub", "msjmakes", "msj2027", "phoenixmsj", "msjleoclub", "msjmocktrial",
  "msjphilosophy", "msj.fcsn", "msj.futurephysicians", "msjexitzine", "msjfilm",
  "msjchemclub", "msjdatascience", "msjcivicsclub", "msjchineseculture",
  "msjchineseinstrumentclub", "msjmathclub", "msjpolaris", "msjrelayforlife",
  "tedxmsjhs", "msj.isa", "msj.tsa", "msjhs2029", "msjgreenclub", "msjquantum",
  "msjneuroscience", "msjwistem", "msjgirlswhocode", "msjpaws", "msj.mun",
  "msjmedcorps", "iknitmsjhs", "msjclubs", "msjrcc", "msj.pickleball",
  "msjathenaproject", "msjcompsci", "msjcordance", "msjhs2028", "msjrobotics",
  "msj.amwa", "msjenpassant", "msjseromed", "msjbeautification", "msjmissionjapan",
  "msj.geography", "msjclimbingclub", "msjinvestmentclub", "msjphotographyclub",
  "msjliftingclub", "universalperformers", "msj.csf", "msjphysicsclub", "msjvams",
  "missionxanime", "msjyoungmentors", "msjnaadam_", "msjwarriors", "msjwritersblock",
  "msj.aviation", "msjspanishsociety", "msj.vsa", "msjyouthalive", "msjstempac",
  "msjspeechanddebate", "msjinteract", "msjbestbuddies", "msjhsnahs", "msjkeyclub",
  "msjeagleclub", "msj.gamedev", "msj_artificialintelligence", "msjpovertypatchup",
  "shss.missionsj", "msjhsac", "msjpsychology", "msjdeca", "msjy4c", "msjcamnesty",
  "msjfashionforward", "msjpredictivemodeling", "msjmusicimpromptu",
  "msjcloset4colombia", "msjbio", "msjhseconomics", "msj.gsa", "msjrocketry",
  "msjhs_2030", "msj_msa", "msj.ce", "msjtradingcardgameclub", "msj.swenext",
  "msj_arc",
];

/** Real telemetry from that same run — run-log.json. */
export const RUN_STATS = {
  clubsProcessed: 93,
  postsScraped: 55,
  newPosts: 6,
  duplicatesSkipped: 14,
  extractionFailures: 0,
  durationSeconds: 80,
};

export const STORY_SHOT = "/embeds/hermes-story.jpg";
