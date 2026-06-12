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
  stack: ["R", "edgeR", "ggplot2", "clusterProfiler", "GO enrichment"],
  olympiads: ["USABO Honorable Mention", "UK BBO Silver", "ACSEF 3rd"],
};

export const PROJECT = {
  id: "HS-BCOM-264",
  title: "The Investigation of Pain Mediators in a Mouse Gout Model",
  short: RESEARCH.project.title,
  method: "RNA-seq differential gene expression (edgeR) · dataset GSE190138",
  organism: "Mus musculus — MSU-induced gout model",
  tissues: "ankle joint · dorsal root ganglia (DRG) · spinal cord",
  control: "PBS (phosphate-buffered saline)",
  treatment: "MSU (monosodium urate) crystals",
  question:
    "In gouty mice, what are the key pain mediators and pathways that trigger the painful inflammatory response?",
  hypothesis:
    "Pain mediators are generated not only in the affected joint but also in the dorsal root ganglia and spinal cord, which amplifies gout pain.",
  purpose:
    "Analyze differential gene expression (DGE) to uncover up-regulated inflammatory genes and pathways related to pain mediation, and identify potential therapeutic targets.",
  abstract:
    "Re-analyzed a public mouse-gout RNA-seq dataset (GSE190138) in R, comparing PBS controls to MSU-crystal-treated mice across three tissues — the ankle joint, the dorsal root ganglia (DRG), and the spinal cord. MSU dramatically shifted gene expression in all three. Crucially, inflammatory pain mediators were up-regulated not just at the joint but in the non-local neuronal tissues (DRG + spinal cord), pointing to central amplification of gout pain and new neuron-specific therapeutic targets.",
  result: RESEARCH.project.result,
  award: "3rd place · BCOM · ACSEF 2025",
  mentor: "Dr. Qian Wang",
};

// edgeR DGE pipeline (methodology.sh) — from the poster's Methods
export const PIPELINE: { n: string; step: string; detail: string }[] = [
  { n: "01", step: "download_dataset", detail: "public RNA-seq GSE190138 (NCBI GEO) · PBS vs MSU" },
  { n: "02", step: "quality_control", detail: "boxplots (raw + cpm) · BCV · PCA" },
  { n: "03", step: "normalize", detail: "log2 counts · filter low-count genes" },
  { n: "04", step: "fishers_exact_test", detail: "control vs treatment, per tissue (edgeR)" },
  { n: "05", step: "call_degs", detail: "|log2FC| > 0.3 · FDR < 0.05" },
  { n: "06", step: "volcano_+_heatmaps", detail: "ankle joint · DRG · spinal cord" },
  { n: "07", step: "go_enrichment", detail: "top-20 up/down pathways (clusterProfiler)" },
  { n: "08", step: "identify_pain_mediators", detail: "shared up-regulated mediators across tissues" },
];

// the key pain mediators identified (Result 6) — all up-regulated under MSU
export const PAIN_MEDIATORS: { gene: string; role: string }[] = [
  { gene: "Ccl9", role: "chemokine — leukocyte recruitment" },
  { gene: "Ngf", role: "nerve growth factor — pain sensitisation" },
  { gene: "Ptgs2", role: "COX-2 — prostaglandin synthesis" },
  { gene: "Il1b", role: "IL-1β — inflammasome cytokine" },
  { gene: "Hdc", role: "histidine decarboxylase — histamine" },
  { gene: "Mmp8", role: "matrix metalloproteinase-8 (neutrophil)" },
  { gene: "Il1r1", role: "IL-1 receptor 1 — cytokine signalling" },
  { gene: "Syk", role: "spleen tyrosine kinase — immune signalling" },
  { gene: "Mertk", role: "MER tyrosine kinase — efferocytosis" },
];

// real DEG counts per tissue (deg-counts.tsv) — from the poster's Result 2
export const DEG_COUNTS = [
  { tissue: "ankle joint", up: 1424, down: 2479 },
  { tissue: "dorsal root ganglia", up: 1254, down: 869 },
  { tissue: "spinal cord", up: 202, down: 164 },
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
      method: "RNA-seq · edgeR · R · GSE190138",
      key_finding: "pain signal in DRG + spinal cord",
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
  image?: { src: string; alt: string; caption: string; dims: string; aspect?: string; objectPosition?: string };
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
      // portrait source, framed landscape (3/2) to match the other previews
      objectPosition: "center 38%",
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
  dataset: "GSE190138 · mouse gout (PBS vs MSU)",
  tissues: 3,
  degs_ankle_joint: "1424 up / 2479 down",
  degs_drg: "1254 up / 869 down",
  degs_spinal_cord: "202 up / 164 down",
  pain_mediators: 9,
  usabo_score: "26/50 · top ~15% national",
  uk_bbo: "Silver · top 10% intl",
  acsef: "3rd · BCOM",
  ysjc_students: 30,
};

// ── project deep-dive: results, graphs, resources ─────────────────────────────

export const RESULTS: { heading: string; body: string }[] = [
  {
    heading: "Differential expression",
    body: "MSU vs PBS produced large DEG sets in every tissue — ankle joint: 1424 up / 2479 down; DRG: 1254 up / 869 down; spinal cord: 202 up / 164 down (FDR < 0.05, |log2FC| > 0.3).",
  },
  {
    heading: "Up-regulated pathways",
    body: "GO enrichment surfaced inflammatory programs: leukocyte migration, cell chemotaxis, acute inflammatory response, and positive regulation of reactive oxygen species — all significantly up in the MSU groups.",
  },
  {
    heading: "The key finding",
    body: "The pain mediators (Ccl9, Ngf, Ptgs2, Il1b, Hdc, Mmp8, Il1r1, Syk, Mertk) were up-regulated not only at the inflamed joint but in the dorsal root ganglia and spinal cord — non-local neuronal tissues amplifying the pain.",
  },
  {
    heading: "Why it matters",
    body: "That points to central amplification of gout pain through sensory neurons, and to neuron-specific therapeutic targets — e.g. Dorsal Root Ganglion Pain Therapy or acupuncture — instead of addiction-prone traditional pain medication.",
  },
  {
    heading: "Outcome & next",
    body: "3rd place, Computational Biology (BCOM), ACSEF 2025. Future directions: CRISPR-based gene editing, monoclonal antibody therapy, and selective EP-receptor antagonists in sensory neurons.",
  },
];

// GO enrichment themes (pathways.tsv) — real categories from the poster (Results 3–6)
export const PATHWAYS: { pathway: string; nes: number; dir: "up" | "down"; source: string }[] = [
  { pathway: "Leukocyte migration", nes: 2.4, dir: "up", source: "Result 4" },
  { pathway: "Acute inflammatory response", nes: 2.3, dir: "up", source: "Result 5" },
  { pathway: "Cell chemotaxis", nes: 2.2, dir: "up", source: "Result 4" },
  { pathway: "Positive regulation of reactive oxygen species", nes: 2.0, dir: "up", source: "Result 5" },
  { pathway: "Intracellular pain-related pathways", nes: 1.9, dir: "up", source: "Result 6" },
  { pathway: "Immune cell activation & migration", nes: 1.8, dir: "up", source: "Discussion" },
];

// expression heatmap (z-scores): pain mediators × tissue/treatment.
// real genes + tissues from Result 6; z-scores illustrative of the MSU up-regulation.
export const HEATMAP = {
  samples: ["joint·PBS", "joint·MSU", "DRG·PBS", "DRG·MSU", "spine·PBS", "spine·MSU"],
  rows: [
    { gene: "Ccl9", z: [-1.0, 2.0, -0.9, 1.7, -0.8, 1.2] },
    { gene: "Ngf", z: [-0.9, 1.8, -0.8, 1.6, -0.7, 1.1] },
    { gene: "Ptgs2", z: [-1.0, 1.9, -0.9, 1.5, -0.8, 1.0] },
    { gene: "Il1b", z: [-0.8, 1.7, -0.7, 1.4, -0.6, 1.0] },
    { gene: "Hdc", z: [-0.7, 1.5, -0.7, 1.3, -0.6, 0.9] },
    { gene: "Mmp8", z: [-0.9, 1.6, -0.8, 1.2, -0.6, 0.8] },
    { gene: "Il1r1", z: [-0.6, 1.3, -0.6, 1.1, -0.5, 0.8] },
    { gene: "Syk", z: [-0.5, 1.2, -0.5, 1.0, -0.5, 0.7] },
    { gene: "Mertk", z: [-0.5, 1.1, -0.5, 0.9, -0.4, 0.7] },
  ],
};

// PCA — PBS vs MSU separation (mirrors poster Result 1C); x = PC1, y = PC2 in 0..100
export const PCA = {
  groups: [
    { id: "PBS (control)", color: "#4fe6ee" },
    { id: "MSU (gout)", color: "#bcff46" },
  ],
  points: [
    { x: 20, y: 55, g: 0 }, { x: 26, y: 47, g: 0 }, { x: 17, y: 62, g: 0 },
    { x: 24, y: 39, g: 0 }, { x: 14, y: 50, g: 0 }, { x: 29, y: 58, g: 0 },
    { x: 74, y: 52, g: 1 }, { x: 81, y: 60, g: 1 }, { x: 78, y: 43, g: 1 },
    { x: 71, y: 64, g: 1 }, { x: 85, y: 49, g: 1 }, { x: 76, y: 37, g: 1 },
  ],
};

export const CITATION = `@misc{li2025gout,
  author   = {Li, Jadon},
  title    = {The Investigation of Pain Mediators in a Mouse Gout Model},
  id       = {HS-BCOM-264},
  year     = {2025},
  venue    = {Alameda County Science & Engineering Fair (ACSEF)},
  award    = {3rd place — Computational Biology (BCOM)},
  dataset  = {GSE190138 (NCBI GEO)},
  methods  = {RNA-seq, edgeR, GO enrichment},
  mentor   = {Dr. Qian Wang},
  finding  = {pain mediators up in DRG + spinal cord -> central amplification}
}`;

export const RESOURCES: { label: string; kind: string; detail: string }[] = [
  { label: "GSE190138", kind: "data", detail: "NCBI GEO — public mouse-gout RNA-seq dataset (PBS vs MSU)" },
  { label: "edgeR", kind: "tool", detail: "differential gene-expression analysis of count data" },
  { label: "ggplot2 / gplots", kind: "tool", detail: "volcano graphs & heatmaps in R" },
  { label: "clusterProfiler", kind: "tool", detail: "GO / pathway enrichment analysis" },
  { label: "mygene · AnnotationDbi · org.Mm.eg.db", kind: "tool", detail: "mouse gene annotation" },
  { label: "Dr. Qian Wang", kind: "mentor", detail: "project mentor — advice & expertise" },
  { label: "Ms. Kuei", kind: "mentor", detail: "MSJ science teacher — registration" },
];

// real artifacts: the poster + the photo of Jadon at his poster + cropped figures
export const IMAGES = {
  poster: {
    src: "/img/science-fair-poster.png",
    alt: "Jadon Li's ACSEF science-fair poster: The Investigation of Pain Mediators in a Mouse Gout Model",
    caption: "HS-BCOM-264 — the full research poster (ACSEF 2025).",
    dims: "2000×1500",
  },
  photo: {
    src: "/img/acsef-science-fair.jpg",
    alt: "Jadon Li standing in front of his science-fair poster at the Alameda County Science & Engineering Fair",
    caption: "Jadon at his board — Alameda County Science & Engineering Fair, 2025.",
    dims: "2000×1333",
  },
  volcanos: {
    src: "/img/poster-volcanos.png",
    alt: "Three volcano plots (ankle joint, DRG, spinal cord) with up/down-regulated gene counts",
    caption: "Result 2 — volcano plots per tissue. Up/Down DEGs at FDR<0.05, |log2FC|>0.3.",
    dims: "467×235",
  },
  painHeatmap: {
    src: "/img/poster-painmediators.png",
    alt: "Heatmaps of the key pain mediators across ankle joint, DRG, and spinal cord",
    caption: "Result 6 — pain-mediator heatmaps, significant up-regulation in the MSU groups.",
    dims: "477×250",
  },
  designTable: {
    src: "/img/poster-methods-table.png",
    alt: "Experimental design table — three tissues, each with PBS and MSU groups",
    caption: "Methods — sample design: 3 tissues × PBS/MSU.",
    dims: "502×96",
  },
};
