/**
 * Structured source data for the research IDE. Everything the terminal renders
 * (JSON files, tables, markdown, gene results) reads from here so the outputs
 * stay terminal-native and granular (one award / one program at a time).
 */
import { RESEARCH } from "@/lib/data";

export const PROFILE = {
  user: "jadon",
  name: "Jadon Li",
  role: "bio researcher · builder · student leader",
  school: "Mission San Jose HS, Fremont",
  class_of: 2027,
  focus: "RNA-seq · differential expression · pain biology",
  stack: ["R", "DESeq2", "limma", "ggplot2", "GSEA"],
  olympiads: ["USABO Honorable Mention", "UK BBO Silver", "ACSEF 3rd"],
};

export const PROJECT = {
  title: RESEARCH.project.title,
  method: RESEARCH.project.method,
  organism: "Mus musculus (gout model)",
  model: "monosodium urate (MSU) crystal-induced arthritis",
  abstract:
    "Ran RNA-seq on a mouse gout model in R to surface the genes that drive the pain. The pivotal result: key inflammatory mediators were up-regulated not only at the joint but in non-localized tissue including the spinal cord — a signature of central sensitisation that opens a window for non-invasive, systemic treatment upstream of the joint.",
  result: RESEARCH.project.result,
  award: "3rd place · BCOM · ACSEF 2025",
};

// 8-step pipeline (methodology.sh)
export const PIPELINE: { n: string; step: string; detail: string }[] = [
  { n: "01", step: "mouse_gout_model", detail: "MSU crystal injection · ankle joint" },
  { n: "02", step: "tissue_harvest", detail: "joint + spinal cord — the key comparison" },
  { n: "03", step: "rna_extraction", detail: "total RNA · RIN >= 7" },
  { n: "04", step: "rna_seq", detail: "Illumina paired-end · stored as FASTQ" },
  { n: "05", step: "differential_expr", detail: "DESeq2 · limma · padj<0.05, |log2FC|>1.5" },
  { n: "06", step: "pain_mediators", detail: "NLRP3 · IL-1B · TNF · Ptgs2 · CXCL1/2" },
  { n: "07", step: "spinal_cord_signal", detail: "mediators replicated outside the joint" },
  { n: "08", step: "therapeutic_window", detail: "non-invasive, systemic intervention routes" },
];

// DESeq2 top hits (deg-results.tsv) — illustrative values
export const GENES: { gene: string; log2fc: number; padj: string; dir: "up" | "down"; note: string }[] = [
  { gene: "S100a9", log2fc: 4.1, padj: "1.2e-9", dir: "up", note: "neutrophil chemoattractant (DAMP)" },
  { gene: "Nfkb1", log2fc: 3.7, padj: "7.4e-9", dir: "up", note: "master inflammatory transcription factor" },
  { gene: "Ptgs2", log2fc: 2.6, padj: "4.5e-8", dir: "up", note: "COX-2 · prostaglandin synthesis (pain)" },
  { gene: "Il1b", log2fc: 2.0, padj: "3.1e-6", dir: "up", note: "inflammasome cytokine · NLRP3-dependent" },
  { gene: "Nlrp3", log2fc: 1.7, padj: "8.0e-4", dir: "up", note: "urate-crystal sensor — gout-specific" },
  { gene: "Sirt1", log2fc: -3.0, padj: "2.0e-7", dir: "down", note: "anti-inflammatory brake, suppressed" },
  { gene: "Socs1", log2fc: -2.4, padj: "1.1e-5", dir: "down", note: "JAK/STAT brake — loss amplifies cascade" },
];

export type Award = {
  id: string;
  file: string;
  name: string;
  result: string;
  year: number;
  fields: Record<string, string>;
  summary: string;
  detail: string;
};

export const AWARDS: Award[] = [
  {
    id: "usabo",
    file: "usabo.json",
    name: "USABO",
    result: "Honorable Mention",
    year: 2025,
    fields: {
      exam: "USA Biology Olympiad — Open Exam",
      score: "26 / 50",
      cutoff: "28 / 50 (semifinalist)",
      tier: "top ~15% nationally",
      prep: "Campbell Biology + past papers",
    },
    summary: "Score 26/50 — two points from the semifinalist cutoff. Top ~15% nationally.",
    detail:
      "Taken by thousands of strong biology students nationwide; scoring in the top 15% without a dedicated olympiad coach reflects the depth of self-directed study. A springboard, not a ceiling.",
  },
  {
    id: "bbo",
    file: "uk-bbo.json",
    name: "UK Biology Olympiad",
    result: "Silver",
    year: 2025,
    fields: {
      medal: "Silver",
      tier: "top 10% of the international field",
      prep: "none — coursework baseline",
      scope: "all of A-level biology, single sitting",
    },
    summary: "Silver — top 10% internationally, taken with no explicit prep.",
    detail:
      "The BBO draws students across the UK and internationally; a Silver in the top decile without targeted preparation is a signal about the baseline, not the ceiling.",
  },
  {
    id: "acsef",
    file: "acsef.json",
    name: "ACSEF — Computational Biology",
    result: "3rd Place",
    year: 2025,
    fields: {
      fair: "Alameda County Science & Engineering Fair",
      category: "BCOM — Computational Biology",
      method: "RNA-seq · DESeq2 · R",
      key_finding: "spinal-cord pain signal",
    },
    summary: "3rd place, BCOM category — a self-built RNA-seq pipeline + a novel therapeutic insight.",
    detail:
      "ACSEF is the county-level qualifier for CSEF and ultimately Intel ISEF. Placing 3rd as a first-time entrant with a self-built pipeline is a research result, not a class project.",
  },
];

export type Program = {
  id: string;
  file: string;
  name: string;
  role: string;
  meta: Record<string, string>;
  body: string[];
  list?: { label: string; text: string }[];
  image?: { src: string; alt: string; caption: string; dims: string; aspect?: string };
};

export const PROGRAMS: Program[] = [
  {
    id: "ysjc",
    file: "ysjc.md",
    name: "Youth STEM Journal Club",
    role: "Founder — Biology Department",
    meta: { venue: "Fremont Library · 4 weeks", students: "8 (hands-on) · 30 total", site: "youthstemjournal.org" },
    body: [
      "A summer program teaching middle-schoolers to read research papers — what to read first, what to skip, how to annotate and discuss. Two hour-long classes a week, ending in a capstone presented to parents.",
    ],
    list: [
      { label: "Fig. A — Ecosystem Resilience", text: "keystone species, trophic cascades, biodiversity buffers." },
      { label: "Fig. B — Llama-derived Nanobodies", text: "VHH single-domain antibodies in diagnostics & therapeutics." },
    ],
    image: {
      src: "/img/ysjc-2025-summer-showcase.jpg",
      alt: "Youth STEM Journal Club 2025 Summer Showcase at Fremont Library",
      caption: "Summer showcase, 2025 — 8 students · Biology dept · capstones to parents.",
      dims: "2000×1333",
    },
  },
  {
    id: "prism",
    file: "prism.md",
    name: "PRISM",
    role: "Promoting Representation in Science & Medicine",
    meta: { partner: "Arav Bhise", approach: "outreach + trial matching + education" },
    body: [
      "Problem: many clinical trials underrepresent Asian, Hispanic, and Black populations — skewing safety/efficacy data and hiding side-effect profiles in those groups.",
      "Mission: raise awareness of the representation gap and connect underrepresented community members to open clinical trials seeking participants.",
    ],
    image: {
      src: "/img/prism-project-with-mayor.jpg",
      alt: "PRISM booth at the Ohlone Flea Market — the Mayor of Fremont with co-founders Jadon Li and Arav Bhise",
      caption: "Tabling at the Ohlone Flea Market — the Mayor of Fremont stopped by the booth.",
      dims: "1600×1067",
    },
  },
  {
    id: "stempac",
    file: "stem-pac.md",
    name: "MSJ STEM-PAC",
    role: "Co-President — competition pipeline",
    meta: { full_name: "STEM Projects and Competitions", co_president: "with Ashley Kang", officers: "3" },
    body: [
      "Founded by Jadon as a 10th-grade officer, then rebuilt and renamed around what members actually do: STEM Projects and Competitions.",
      "The egg drop (12 teams) and Iron Chef (23 contestants) keep students walking through the door. The science-fair + olympiad pipeline is what they stay for.",
    ],
    list: [
      { label: "weekly posts", text: "competitions, conferences & deadlines across STEM" },
      { label: "bi-weekly workshops", text: "idea generation, methodology, write-ups" },
      { label: "staged entry", text: "smaller contests first, then ACSEF / olympiads" },
      { label: "external comps", text: "ACSEF (county → CSEF → ISEF), bio/STEM olympiads" },
    ],
    image: {
      src: "/img/stempac-meeting.jpg",
      alt: "MSJ STEM-PAC club meeting — members gathered for a session",
      caption: "A STEM-PAC meeting — the room the science-fair pipeline runs out of.",
      dims: "1200×1600",
      aspect: "3 / 4",
    },
  },
  {
    id: "umass",
    file: "umass.md",
    name: "UMass Research Intensive",
    role: "Incoming · 6-week residential",
    meta: { program: "UMass Amherst pre-college", when: "Summer 2026", track: "scientific research methods" },
    body: [
      "Selected for the UMass pre-college research intensive — a 6-week residential program. The pipeline from ACSEF and club-level STEM work feeds directly into this: the next level of formal bench research.",
    ],
  },
];

// ASCII-meter scorecards rendered under each award's JSON (terminal graphics)
export const AWARD_VIZ: Record<string, { label: string; frac: number; caption: string }[]> = {
  bbo: [
    { label: "intl field", frac: 0.9, caption: "top 10%" },
    { label: "medal", frac: 0.66, caption: "SILVER" },
  ],
  acsef: [
    { label: "placement", frac: 0.78, caption: "3rd place" },
    { label: "category", frac: 1, caption: "BCOM · comp-bio" },
  ],
};

// ASCII medal art shown under usabo.json (instead of a score bar)
export const USABO_MEDAL = [
  "      .-~~-.",
  "     /  ✦   \\",
  "    |  USABO |",
  "    |  ·HM·  |",
  "     \\  ✦   /",
  "      '-..-'",
  "       |  |",
  "      /|  |\\",
  "     '_|  |_'",
];

export const USABO_MEDAL_INFO: [string, string][] = [
  ["award", "Honorable Mention"],
  ["exam", "USABO Open Exam"],
  ["score", "26 / 50 · cutoff 28"],
  ["rank", "top ~15% national"],
];

// standing-across-competitions bars for stats.json
export const STAT_BARS = [
  { label: "USABO", frac: 0.85, caption: "top ~15% national" },
  { label: "UK BBO", frac: 0.9, caption: "Silver · top 10% intl" },
  { label: "ACSEF", frac: 0.78, caption: "3rd · BCOM" },
];

export const STATS = {
  usabo_score: "26/50",
  usabo_tier: "top ~15% national",
  uk_bbo: "Silver · top 10% intl",
  acsef: "3rd · BCOM",
  ysjc_students: 8,
  r_training: "1 week · Dr. Younice (Stanford)",
  ap_fives: ["AP Biology", "AP Statistics"],
  degs_surfaced: 312,
  genes_analyzed: 12847,
};
