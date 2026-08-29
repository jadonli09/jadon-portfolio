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
  focus: "RNA-seq · differential expression · fungal transformation · host–pathogen",
  stack: ["R", "edgeR", "ggplot2", "clusterProfiler", "PCR", "miniprep", "protoplasting", "confocal"],
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
    meta: { "2025": "30 students · 8 hands-on · Fremont Library", "2026": "60 students · 6 cohorts · led 4 mentors", site: "youthstemjournal.org" },
    body: [
      "A summer program teaching middle-schoolers to read research papers — what to read first, what to skip, how to annotate and discuss. Two hour-long classes a week, ending in a capstone presented to parents.",
      "2026 season: led a team of four mentors (recruited and interviewed underclassmen to replace the graduating ones), publicized over WhatsApp/WeChat and through Hopkins Junior High. One general meeting on Mondays, one cohort meeting on another weekday. Taught the 20-student biology cohort on the tardigrade's DNA-repair mechanism — debates, role-plays, research activities, Kahoots.",
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
    meta: { partner: "Arav Bhise", site: "theprismproject.blog", cadence: "weekly posts · site + Instagram" },
    body: [
      "Problem: many clinical trials underrepresent Asian, Hispanic, and Black populations — skewing safety/efficacy data and hiding side-effect profiles in those groups.",
      "Mission: raise awareness of the representation gap and connect underrepresented community members to open clinical trials seeking participants. Field work: interviews at the Ohlone Flea Market on how residents see clinical research (theprismproject.blog/articles/ohlone-flea-market).",
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
    name: "UMass Amherst — Ma Lab",
    role: "Research intensive · 6-week residential · Summer 2026",
    meta: { lab: "Ma Lab · Biochemistry & Molecular Biology", mentors: "Siyuan Wu (PhD) · Will Truncer · Dr. Li-Jun Ma", partner: "Jerry Zhang", branch: "umass-2026" },
    body: [
      "Six weeks at the bench, 9 to 4 every weekday, under a PhD mentor: host–pathogen interactions between Fusarium oxysporum and mammals (keratitis, blood infections). The project — engineering a red-fluorescent human clinical strain — lives on its own branch of this console: run `git checkout umass-2026`, or open fusarium/.",
      "Also: read six papers on Fusarium as a plant and animal pathogen (and built NotebookLI to get through them), kept the lab notebook, organized the lab's ice-rink team bonding, and co-planned a Lab Olympics.",
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
  ysjc_students: "30 (2025) · 60 (2026)",
  fusarium_strains: 3,
  plasmid: "pCT74-mRFP · 5774 bp",
  transformants: "putative RFP+ · hygromycin-selected",
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

/* ═══════════════════ branch: umass-2026 — Fusarium RFP ═══════════════════ */
// Every fact below is from the poster "RFP Transformation of Human Strains of
// Fusarium Oxysporum" (Li, Zhang, Wu, Truncer, Ma · UMass Pre-College 2026).

export const FUS = {
  id: "UMASS-PC-2026",
  title: "RFP Transformation of Human Strains of Fusarium oxysporum",
  authors: "Jadon Li¹, Jerry Zhang¹, Siyuan Wu², Will Truncer², Li-Jun Ma²",
  affiliations: "¹UMass Pre-College · ²Biochemistry & Molecular Biology, UMass Amherst",
  organism: "Fusarium oxysporum — cross-kingdom fungal pathogen",
  disease: "keratitis (eye) · bloodstream infection · Panama wilt (banana)",
  plasmid: "pCT74-mRFP · 5774 bp · mRFP + HygR",
  method: "protoplast-mediated, PEG transformation · hygromycin selection",
  question:
    "Human clinical strains of F. oxysporum evade the mammalian immune system better than plant strains. To watch that interaction live, the fungus needs to glow — so: can we put a red fluorescent protein into three human strains?",
  abstract:
    "Fusarium oxysporum is a cross-kingdom fungal pathogen capable of opportunistic infection in both humans and plants — invasive keratitis on one side, Panama wilt on the other. Its human clinical strains are more efficient at evading the mammalian host immune system than the plant strains. To study the interaction of human pathogenic strains with our immune system, we engineered an mRFP fluorescent protein into these strains using the pCT74 plasmid and protoplast-mediated fungal transformation.",
  result:
    "Linearized the plasmid and transformed it into F. oxysporum; hygromycin selection suggests putative RFP-positive transformants. Confocal microscopy shows red fluorescence in the transformed MRL8996 strain alongside the Fo47-RFP positive control; gel electrophoresis confirms HygR and mRFP bands at the expected sizes.",
  mentor: "Siyuan (Melanie) Wu, PhD student · Will Truncer · Dr. Li-Jun Ma",
};

export const FUS_PROTOCOL: { n: string; step: string; title: string; detail: string[] }[] = [
  { n: "I", step: "plasmid_extraction", title: "Plasmid extraction", detail: [
    "miniprep CT74-mRFP plasmids from RFP E. coli (Zymopure MiniPrep kit)",
    "PCR: confirm HygR-resistance + mRFP genes are present",
    "gel: Hygromycin 563 bp · RFP 372 bp — expected bands, extraction confirmed",
    "linearize the plasmid with the Psp-OMI restriction enzyme",
  ]},
  { n: "II", step: "protoplast_generation", title: "Protoplast generation", detail: [
    "germinate spores at 28 °C, 140 rpm, 6–7 h until germ tubes form",
    "enzyme-digestion solution degrades the cell wall",
    "filter digested mycelia to separate protoplasts from hyphae",
    "wash in 1.2 M KCl, centrifuge, resuspend in STC buffer + DMSO, store < −80 °C",
  ]},
  { n: "III", step: "peg_transformation", title: "PEG-mediated transformation", detail: [
    "combine linearized plasmid with thawed protoplasts, on ice",
    "add STC/PEG solution, incubate at room temperature",
    "transfer to TB3 media, shake 12–16 h",
    "embed in molten TB3 + 0.7 % LMP agarose plates",
  ]},
  { n: "IV", step: "selection", title: "Selection of transformants", detail: [
    "apply hygromycin (150 µg/mL) to the TB3 agarose culture",
    "incubate at 28 °C for 4–5 days",
    "multi-round selection: replate resistant colonies on PDA + Hygr (250 µg/mL)",
    "confocal microscope → check for RFP expression",
  ]},
];

export const FUS_STRAINS: { id: string; source: string; note: string }[] = [
  { id: "NRRL32931", source: "blood isolate · leukemia patient", note: "human clinical strain" },
  { id: "MRL8996", source: "keratitis isolate (infectious eye disease)", note: "human clinical strain · the transformed RFP strain" },
  { id: "II5", source: "plant pathogen · Panama wilt (banana)", note: "plant strain, for comparison" },
];

/** pCT74-mRFP feature map (5774 bp) — positions from the poster's plasmid diagram. */
export const FUS_PLASMID = {
  name: "pCT74-mRFP",
  bp: 5774,
  features: [
    { name: "mRFP", start: 4150, end: 4850, kind: "reporter" as const, note: "red fluorescent protein — the glow" },
    { name: "HygR (hph)", start: 3050, end: 3900, kind: "marker" as const, note: "hygromycin resistance — the selection handle" },
    { name: "AmpR", start: 300, end: 1150, kind: "marker" as const, note: "ampicillin resistance (E. coli)" },
    { name: "ori", start: 1250, end: 1900, kind: "backbone" as const, note: "origin of replication" },
    { name: "trpC promoter", start: 3950, end: 4150, kind: "backbone" as const, note: "drives expression in Fusarium" },
    { name: "lacZα (fragment)", start: 2100, end: 2350, kind: "backbone" as const, note: "" },
    { name: "GFP (fragment)", start: 5100, end: 5500, kind: "backbone" as const, note: "" },
  ],
  cut: { name: "Psp-OMI", pos: 5560, note: "linearization site" },
};

export const FUS_RESULTS: { heading: string; body: string }[] = [
  { heading: "Plasmid extracted, verified", body: "PCR on the miniprepped CT74-mRFP plasmid produced single bands at the predicted sizes — Hygromycin 563 bp, RFP 372 bp — against a 100 bp ladder and controls (Figure 1). The plasmid was then linearized with Psp-OMI." },
  { heading: "Transformation → selection", body: "Protoplasts of the three strains were transformed with the linearized plasmid via PEG, embedded in TB3 agarose, and put under hygromycin. Two rounds of selection grew pure, resistant colonies without bacterial contamination." },
  { heading: "The glow", body: "Under the confocal microscope, the transformed MRL8996 strain fluoresces red — alongside the Fo47-RFP positive control and a dark NRRL32931 negative control (Figure 2a). Gel electrophoresis of plasmid and fungal DNA shows HygR and RFP bands at the expected sizes against a 1 kb ladder (Figure 2b)." },
  { heading: "What it establishes", body: "Feasibility of the whole pipeline in a human clinical strain: plasmid extraction → digestion/linearization → PCR verification → transformation → selection." },
  { heading: "Future applications", body: "Use the mRFP-tagged strains to track real-time engulfment by GFP macrophages under confocal imaging — how the interaction changes with temperature and pH — and, downstream, to test RNA (hpRNA/siRNA) delivered into protoplasts to block infection." },
];

export const FUS_LOG: { hash: string; date: string; msg: string; tag?: string }[] = [
  { hash: "a1c0de", date: "Jun 29", msg: "init: join the Ma Lab — Fusarium host–pathogen interactions", tag: "umass-2026" },
  { hash: "b2f7e1", date: "Jul 01", msg: "feat: NCBI BLAST primers for HygR + mRFP on the plasmid" },
  { hash: "c3d9a4", date: "Jul 03", msg: "feat: PCR + gel — both genes present in the E. coli culture" },
  { hash: "d4e2b8", date: "Jul 08", msg: "feat: miniprep CT74-mRFP; linearize with Psp-OMI" },
  { hash: "e5f6c2", date: "Jul 10", msg: "feat: protoplast F. oxysporum — germ tubes at 6–7 h, enzyme digest, KCl wash" },
  { hash: "f6a1d7", date: "Jul 12", msg: "docs: six Fusarium papers read (built NotebookLI to survive them)" },
  { hash: "0717ab", date: "Jul 15", msg: "feat: PEG-mediated transformation, embed in TB3 + 0.7% LMP agarose" },
  { hash: "18b3cc", date: "Jul 20", msg: "chore: organize the lab's ice-rink team bonding (5 lab members + 7 pre-college)" },
  { hash: "29c4dd", date: "Jul 22", msg: "feat: hygromycin selection, round 1 → round 2 on PDA + Hygr" },
  { hash: "3ad5ee", date: "Jul 29", msg: "result: RFP fluorescence in transformed MRL8996 under confocal ✓" },
  { hash: "4be6ff", date: "Aug 04", msg: "docs: poster — RFP Transformation of Human Strains of Fusarium oxysporum", tag: "poster" },
];

export const FUS_RESOURCES: { label: string; kind: string; detail: string }[] = [
  { label: "Ma Lab", kind: "lab", detail: "umassfusariumlab.wixsite.com/ma-lab — Fusarium biology, UMass Amherst" },
  { label: "pCT74-mRFP", kind: "data", detail: "5774 bp plasmid · mRFP reporter + hph (hygromycin) marker" },
  { label: "Zymopure MiniPrep", kind: "tool", detail: "plasmid extraction from RFP E. coli" },
  { label: "Psp-OMI", kind: "tool", detail: "restriction enzyme — linearizes the plasmid" },
  { label: "confocal microscope", kind: "tool", detail: "RFP detection in transformed strains" },
  { label: "NotebookLI", kind: "tool", detail: "notebookli.vercel.app — the paper reader built during the program" },
  { label: "Siyuan (Melanie) Wu", kind: "mentor", detail: "4th-year PhD student — daily mentor" },
  { label: "Will Truncer · Dr. Li-Jun Ma", kind: "mentor", detail: "undergrad researcher · principal investigator" },
  { label: "Xie L. et al. 2022", kind: "text", detail: "Micromorphology of Fusarium keratitis — BMC Ophthalmology 22:194" },
];

export const FUS_CITATION = `@misc{li2026fusarium,
  author   = {Li, Jadon and Zhang, Jerry and Wu, Siyuan and Truncer, Will and Ma, Li-Jun},
  title    = {RFP Transformation of Human Strains of Fusarium oxysporum},
  year     = {2026},
  venue    = {UMass Amherst Pre-College Programs — research poster session},
  lab      = {Ma Lab, Biochemistry and Molecular Biology, UMass Amherst},
  plasmid  = {pCT74-mRFP (5774 bp)},
  methods  = {miniprep, PCR, protoplasting, PEG transformation, hygromycin selection, confocal},
  finding  = {RFP fluorescence in transformed MRL8996 -> visualize host-pathogen interactions}
}`;

export const FUS_IMAGES = {
  poster: { src: "/img/umass-poster.jpg", alt: "UMass Amherst research poster: RFP Transformation of Human Strains of Fusarium oxysporum", caption: "The full poster — UMass Pre-College research session, August 2026.", dims: "2400×1800" },
  confocal: { src: "/img/umass-confocal.jpg", alt: "Confocal microscopy panels: NRRL32931 negative control (dark), Fo47-RFP positive control (red), transformed MRL8996 RFP strain (red)", caption: "Figure 2a — confocal: negative control · Fo47-RFP positive control · the transformed 8996 RFP strain, glowing.", dims: "828×643" },
  gel: { src: "/img/umass-gel-confirm.jpg", alt: "Agarose gel confirming hygromycin-resistance and RFP bands in plasmid and fungal DNA", caption: "Figure 2b — gel confirmation: HygR + RFP bands in plasmid and fungal DNA vs the 1 kb ladder.", dims: "880×643" },
  pcrGel: { src: "/img/umass-pcr-gel.jpg", alt: "Figure 1: agarose gel of PCR products — 100 bp ladder, HygR, positive control, mRFP", caption: "Figure 1 — PCR products: Hygromycin 563 bp · RFP 372 bp. The plasmid is real.", dims: "965×441" },
  plasmid: { src: "/img/umass-plasmid.jpg", alt: "pCT74-mRFP plasmid map, 5774 bp, with restriction sites, mRFP, HygR and AmpR features", caption: "pCT74-mRFP (5774 bp) — the plasmid, from E. coli.", dims: "1032×936" },
  strains: { src: "/img/umass-strains.jpg", alt: "Plated Fusarium oxysporum and the three strains used: NRRL32931, MRL8996, II5", caption: "The strains — a blood isolate, a keratitis isolate, and a banana pathogen.", dims: "1032×528" },
  protoplast: { src: "/img/umass-protoplast.jpg", alt: "Protoplast generation: germ tubes, enzyme digestion, filtering, washing", caption: "II — protoplast generation: germ tube → digested cell wall → protoplast.", dims: "1600×574" },
  transformation: { src: "/img/umass-transformation.jpg", alt: "PEG-mediated transformation steps: plasmid + protoplasts, STC/PEG, TB3, agarose plates", caption: "III — PEG-mediated transformation, step by step.", dims: "1600×452" },
  macrophage: { src: "/img/umass-macrophage.jpg", alt: "Time-lapse frames of a macrophage engulfing Fusarium (Schäfer et al. 2014)", caption: "Where it goes next — macrophage (red) meets Fusarium (green), 99 → 103 min (Schäfer et al. 2014).", dims: "1017×321" },
};
