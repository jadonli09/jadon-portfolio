/** Photo map for The Climb concept — keyed by year (camp) and by TROPHIES title (summit flags). */

export type ClimbPhoto = { src: string; alt: string; pos?: string };

/** One Mission Peak summit photo per birthday climb. */
export const CAMP_PHOTOS: Record<number, ClimbPhoto> = {
  2021: { src: "/img/missionpeak-2021.jpg", alt: "Jadon, age twelve, on a fogged-in Mission Peak summit", pos: "50% 60%" },
  2022: { src: "/img/missionpeak2022.jpg", alt: "Hooded selfie on the rocks of Mission Peak", pos: "40% 40%" },
  2023: { src: "/img/missionpeak2023.jpg", alt: "Sunglasses and a yellow hood beside the summit tree", pos: "50% 35%" },
  2024: { src: "/img/missionpeak2024.jpg", alt: "Selfie beside the Mission Peak summit post at dawn", pos: "45% 40%" },
  2025: { src: "/img/missionpeak2025.jpg", alt: "Two friends on the summit as the sun comes up", pos: "50% 45%" },
  2026: { src: "/img/missionpeak2026-1.jpg", alt: "Three thumbs up at sunrise on the summit", pos: "50% 45%" },
};

/** The final summit shot — standing on top, by the tree. */
export const SUMMIT_PHOTO: ClimbPhoto = {
  src: "/img/missionpeak2026.jpg",
  alt: "Jadon standing on the Mission Peak summit rocks next to the decorated tree",
  pos: "50% 40%",
};

/** Photos for the w:5 summit flags, keyed by exact TROPHIES title. */
export const FLAG_PHOTOS: Record<string, ClimbPhoto> = {
  "ACSEF — 3rd, Computational Biology": { src: "/img/acsef-science-fair.jpg", alt: "Jadon in front of his gout RNA-seq board at ACSEF", pos: "40% 40%" },
  "AcornPrep — launched": { src: "/img/acornprep-presentation-promptengineering.jpg", alt: "Presenting AcornPrep to a room", pos: "60% 50%" },
  "Class President ×3": { src: "/img/classofficer-junior.jpg", alt: "The junior class officers with a Class of 2027 sign", pos: "50% 45%" },
  "ASB President — elected": { src: "/img/asb-officers.jpg", alt: "The ASB officers in the gym", pos: "50% 40%" },
  "NCS Basketball Champions": { src: "/img/ncs-champions.jpg", alt: "MSJ varsity with the NCS banner and plaque", pos: "50% 45%" },
  "UMass Amherst — the Ma Lab": { src: "/img/umass-01.jpg", alt: "Walking visitors through the Fusarium poster at UMass", pos: "50% 40%" },
};

/** Photos for every flag on the trail (w ≥ 4), keyed by exact TROPHIES title. */
export const TRAIL_PHOTOS: Record<string, ClimbPhoto> = {
  ...FLAG_PHOTOS,
  "UMass Amherst — the Ma Lab": { src: "/img/umass-02.jpg", alt: "Jadon at the bench in a lab coat at UMass", pos: "45% 40%" },
  "Class President — elected": { src: "/img/classofficer-freshman.jpg", alt: "The freshman class officers", pos: "50% 40%" },
  "Class President — re-elected": { src: "/img/classofficer-sophomore.jpg", alt: "The sophomore class officers", pos: "50% 40%" },
  "Mayor's Videographer (paid)": { src: "/img/editing-for-mayor-timeline.jpg", alt: "Editing a video for the Mayor", pos: "50% 50%" },
  "Voices of Fremont — director": { src: "/img/voices-of-fremont-cover.jpg", alt: "Voices of Fremont podcast cover", pos: "50% 50%" },
  "Small Business Accessibility Initiative": { src: "/embeds/oped-smdj.jpg", alt: "The op-ed in the San Mateo Daily Journal", pos: "50% 20%" },
  "MSJ Makes President": { src: "/img/msjmakes-officers.jpg", alt: "The MSJ Makes officers", pos: "50% 40%" },
  "MSJ STEM-PAC Co-President": { src: "/img/stempac-officers-2026.jpg", alt: "The STEM-PAC officers", pos: "50% 40%" },
  "Winter Ball — built from scratch": { src: "/img/winterball-1.jpg", alt: "The Winter Ball dance floor", pos: "50% 50%" },
  "YBVC finalist — pitched at Stanford": { src: "/img/ybvc-01.jpg", alt: "Pitching AcornPrep at Stanford", pos: "50% 40%" },

  // every other entry that has a real photo somewhere on the site
  "USABO — Honorable Mention": { src: "/img/usabo-2025.png", alt: "2025 USA Biolympiad Open Exam Honorable Mention certificate", pos: "50% 50%" },
  "Mission Peak tradition begins": { src: "/img/missionpeak-2021.jpg", alt: "Jadon at twelve on a foggy Mission Peak summit", pos: "50% 60%" },
  "Freshman Basketball Co-Captain": { src: "/img/frosh-bbal.jpg", alt: "The freshman basketball team", pos: "50% 45%" },
  "FAA-approved drone pilot": { src: "/img/droneshot1.jpg", alt: "Drone shot over Fremont", pos: "50% 50%" },
  "JV Basketball Co-Captain": { src: "/img/jv-bbal.jpg", alt: "The JV basketball team", pos: "50% 45%" },
  "MSJ STEM-PAC — founding officer": { src: "/img/stempac-officers.jpg", alt: "The founding STEM-PAC officer team", pos: "50% 45%" },
  "Climbing Club money engine": { src: "/img/climbingclub-officers.jpg", alt: "The Climbing Club officers", pos: "50% 45%" },
  "R + Bioinformatics training": { src: "/img/poster-volcanos.png", alt: "Volcano plots from the gout RNA-seq analysis", pos: "50% 50%" },
  "Youth STEM Journal Club — founder": { src: "/img/ysjc-2025-summer-showcase.jpg", alt: "The Youth STEM Journal Club summer showcase", pos: "50% 45%" },
  "PRISM — co-founder": { src: "/img/prism-project-with-mayor.jpg", alt: "Presenting PRISM with the Mayor", pos: "50% 45%" },
  "ACWD Water-Plant tour — led 10": { src: "/img/acwd-water-tour.jpg", alt: "The private ACWD water-treatment plant tour", pos: "50% 45%" },
  "li_locked.in launched": { src: "/vid/pursuit/poh-ep1.jpg", alt: "The Pursuit of Happiness, episode 1 — the first li_locked.in series", pos: "50% 40%" },
  "Mayor's Intern Program": { src: "/img/mayor-intern-leads.jpg", alt: "The three lead interns with Mayor Raj Salwan", pos: "50% 35%" },
  "Sweet Tomatoes revival": { src: "/vid/pursuit/we-got-ts.jpg", alt: "The Sweet Tomatoes revival reel", pos: "50% 45%" },
  "Fremont Youth Advisory Commission": { src: "/embeds/yac-reel.jpg", alt: "The Youth Advisory Commission reel", pos: "50% 40%" },
  "Youth Advisory Commission Chair": { src: "/img/yac-chair.jpg", alt: "Jadon with fellow Youth Advisory Commission members", pos: "50% 50%" },
  "ACWD Water Clips — 1st": { src: "/img/acwd-water-contest-1stplace.jpg", alt: "First place at the ACWD water video contest", pos: "50% 45%" },
  "ACWD Water Clips — 3rd": { src: "/img/acwd-water-contest-1stplace.jpg", alt: "At the ACWD water video contest", pos: "50% 45%" },
  "Met the Governor & First Partner": { src: "/img/voices-of-fremont-with-jennifersiebalnewsom.jpg", alt: "With First Partner Jennifer Siebel Newsom", pos: "50% 40%" },
  "CueSheet — shipped": { src: "/embeds/cuesheet.jpg", alt: "CueSheet, live at cuesheet.xyz", pos: "50% 0%" },
  "MSJ Makes VP": { src: "/img/msjmakes-stoles.jpg", alt: "Senior stoles made by MSJ Makes", pos: "50% 50%" },
  "Hermes — live on @msjclubs": { src: "/embeds/hermes-story-card.jpg", alt: "A Hermes daily club-schedule story", pos: "50% 30%" },
  "msjhsasb.org — rebuilt the ASB site": { src: "/embeds/msjhsasb.jpg", alt: "The rebuilt msjhsasb.org", pos: "50% 0%" },
  "MSJ Car Meet": { src: "/img/carmeet1.jpg", alt: "The MSJ car meet", pos: "50% 50%" },
  "Homecoming — 2nd place": { src: "/img/homecoming-mic-hero.jpg", alt: "On the mic at Homecoming", pos: "50% 40%" },
  "Campus climbing wall — built": { src: "/vid/pursuit/climbing-wall.jpg", alt: "The new campus climbing wall", pos: "50% 45%" },
  "Senior Breakfast": { src: "/img/seniorbreakfast-spread.jpg", alt: "The Senior Breakfast spread", pos: "50% 50%" },
  "ICE Protest — organized": { src: "/vid/pursuit/walkout.jpg", alt: "The ICE walkout at Mission San Jose High", pos: "50% 30%" },
  "Mission Peak PR — 46:46": { src: "/img/missionpeak2025.jpg", alt: "Mission Peak summit at sunrise, 2025", pos: "50% 45%" },
  "The kitchen — feasts by design": { src: "/vid/cooking-feast1.jpg", alt: "A designed-menu feast night", pos: "50% 50%" },
  "Vancouver over the APs": { src: "/vid/pursuit/vancouver.jpg", alt: "The Vancouver spring-break vlog", pos: "50% 40%" },
  "Mission Peak — the sunrise climb": { src: "/img/missionpeak2026-1.jpg", alt: "Sunrise on the Mission Peak summit, 2026", pos: "50% 45%" },
  "Five more AP 5s — eleven total": { src: "/vid/pursuit/war-is-over.jpg", alt: "2026 AP score reactions", pos: "50% 35%" },
  "NotebookLI — shipped": { src: "/embeds/notebookli.jpg", alt: "NotebookLI, a research-paper reader", pos: "50% 0%" },
  "CommonApp Student Advisory Commission": { src: "/img/commonapp-01.jpg", alt: "A Common App Student Advisory Commission session", pos: "40% 50%" },
  "FIRE Free Speech Forum — DC": { src: "/img/fire-01.jpg", alt: "The FIRE Free Speech Forum cohort", pos: "50% 45%" },
  "Ro Khanna on @li_locked.in": { src: "/vid/pursuit/ro-khanna.jpg", alt: "With Congressman Ro Khanna", pos: "50% 40%" },
  "YSJC 2026 — led a team of 4 mentors": { src: "/embeds/youthstemjournal.jpg", alt: "The Youth STEM Journal Club site", pos: "50% 0%" },
  "Green & White Assembly": { src: "/img/gw-01.jpg", alt: "On the mic at the Green & White Assembly", pos: "50% 40%" },
  "Head of L2 Video": { src: "/img/l2-vid-team.jpg", alt: "The Leadership II video team", pos: "50% 40%" },
  "East Coast — DC, Boston, New York": { src: "/img/ny-01.jpg", alt: "The Brooklyn Bridge at night", pos: "50% 50%" },
};
