/**
 * Two honest, independently-verifiable pieces of Hermes evidence:
 *
 * 1. WATCHED_HANDLES + RUN_STATS — the real account roster and real
 *    telemetry from one actual scraping run (Hermes's own progress.json /
 *    run-log.json, run timestamped 2026-08-28). Facts about the system.
 *
 * 2. EXTRACTIONS — real rows copied verbatim from a CSV export of Hermes's
 *    live output Google Sheet (.superpowers/sdd/2026-08-30-built-world-redesign/hermes-sheet.csv,
 *    86 rows across 43 real clubs). Each row is Claude's actual structured
 *    extraction from a real Instagram post by that account, plus the
 *    confidence Claude assigned itself and a link to the source post so any
 *    claim here is one click from verification. The two low-confidence rows
 *    are genuine — posts that were never meeting announcements, where the
 *    model correctly left date/time/location blank and scored itself low
 *    rather than guessing. Fields are empty strings, not invented values,
 *    exactly as the sheet has them.
 */

export type Extraction = {
  club: string;
  date: string;
  time: string;
  type: string;
  location: string;
  confidence: number;
  description: string;
  postUrl: string;
};

export const EXTRACTIONS: Extraction[] = [
  {
    club: "msjmocktrial",
    date: "08/17/2026",
    time: "After School",
    type: "Club Meeting",
    location: "C120",
    confidence: 0.95,
    description:
      "MSJ Mock Trial introductory meeting to learn about auditions, meet officers, and discover how the team operates.",
    postUrl: "https://www.instagram.com/p/DcAOXIFPpmq/",
  },
  {
    club: "msjclubs",
    date: "08/19/2026",
    time: "Lunch",
    type: "Club Meeting",
    location: "C120",
    confidence: 0.95,
    description:
      "The first ever council meeting, mandatory for all clubs, will be held during lunch on Wednesday 8/19 in C120 next to the chemistry building.",
    postUrl: "https://www.instagram.com/p/DcMuBxRvvNz/",
  },
  {
    club: "msjwarriors",
    date: "08/14/2026",
    time: "Lunch",
    type: "Competition",
    location: "BTQ",
    confidence: 0.95,
    description:
      "A-Team hosts the Mission Man Competition, a 3-challenge tournament at the BTQ during lunch on Friday, August 14th.",
    postUrl: "https://www.instagram.com/p/Db-CsGVMisO/",
  },
  {
    club: "msjgreenclub",
    date: "",
    time: "",
    type: "Event",
    location: "",
    confidence: 0.4,
    description:
      "MSJ Green Club hosted a photo booth at their booth during Maze Day, thanking attendees and inviting them to their upcoming intro meeting.",
    postUrl: "https://www.instagram.com/p/Db3uz8svDp8/",
  },
  {
    club: "msj.futurephysicians",
    date: "",
    time: "",
    type: "Announcement",
    location: "",
    confidence: 0.4,
    description:
      "MSJ Future Physicians club thanks attendees for visiting their booth at Maze Day and looks forward to the upcoming school year.",
    postUrl: "https://www.instagram.com/p/Db4LXTTvmdo/",
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
