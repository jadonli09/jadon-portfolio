/**
 * A real paragraph from the UMass poster "RFP Transformation of Human Strains
 * of Fusarium oxysporum" (Li, Zhang, Wu, Truncer, Ma · UMass Pre-College 2026)
 * — its abstract followed by its result, both verbatim from
 * `src/components/research/lab/content.ts` (`FUS.abstract`, `FUS.result`) —
 * with the terms NotebookLI defines in place and two questions it answers by
 * citation.
 */

export type Term = { term: string; definition: string };

export type CitedAnswer = {
  question: string;
  answer: string;
  /** Index into `sentences` — the sentence the answer cites and highlights. */
  citesSentence: number;
};

export const PAPER: {
  title: string;
  sentences: string[];
  terms: Term[];
  asks: CitedAnswer[];
} = {
  title: "RFP Transformation of Human Strains of Fusarium oxysporum",
  sentences: [
    "Fusarium oxysporum is a cross-kingdom fungal pathogen capable of opportunistic infection in both humans and plants — invasive keratitis on one side, Panama wilt on the other.",
    "Its human clinical strains are more efficient at evading the mammalian host immune system than the plant strains.",
    "To study the interaction of human pathogenic strains with our immune system, we engineered an mRFP fluorescent protein into these strains using the pCT74 plasmid and protoplast-mediated fungal transformation.",
    "Linearized the plasmid and transformed it into F. oxysporum; hygromycin selection suggests putative RFP-positive transformants.",
    "Confocal microscopy shows red fluorescence in the transformed MRL8996 strain alongside the Fo47-RFP positive control; gel electrophoresis confirms HygR and mRFP bands at the expected sizes.",
  ],
  terms: [
    {
      term: "cross-kingdom",
      definition:
        "Able to infect hosts across more than one biological kingdom. Fusarium oxysporum — itself a fungus — infects both plants (kingdom Plantae) and animals (kingdom Animalia), rather than sticking to one host lineage.",
    },
    {
      term: "keratitis",
      definition:
        "Inflammation or infection of the cornea, the eye's clear outer layer. Fusarium keratitis is a serious, sight-threatening infection typically seeded by contact-lens contamination or corneal injury.",
    },
    {
      term: "mRFP",
      definition:
        "Monomeric red fluorescent protein — a fluorescent tag derived from coral pigment (DsRed) that glows red under the right wavelength of light, letting researchers see and track individual cells under a microscope.",
    },
    {
      term: "protoplast",
      definition:
        "A fungal cell with its rigid outer cell wall enzymatically stripped away, leaving just the plasma membrane. Removing the wall makes the cell permeable enough that foreign DNA — like a plasmid — can be introduced directly.",
    },
    {
      term: "hygromycin",
      definition:
        "An antibiotic used here as a selectable marker: only cells that successfully took up the plasmid's resistance gene survive exposure to it, which is how researchers identify which cells were actually transformed.",
    },
    {
      term: "confocal microscopy",
      definition:
        "An imaging technique that uses a focused laser and a pinhole aperture to capture a sharp, single focal-plane image, rejecting out-of-focus light — well suited to picking out a faint fluorescent signal inside a cell.",
    },
  ],
  asks: [
    {
      question: "Why does this project care about human strains specifically?",
      answer:
        "Because human clinical strains evade the mammalian immune system more efficiently than the plant strains do — that's the interaction the underlying research set out to observe directly, which is why it needed to make the fungus glow.",
      citesSentence: 1,
    },
    {
      question: "What evidence shows the transformation actually worked?",
      answer:
        "Confocal microscopy showed red fluorescence in the transformed MRL8996 strain, matching the Fo47-RFP positive control, and gel electrophoresis confirmed the HygR and mRFP bands at their expected sizes.",
      citesSentence: 4,
    },
  ],
};
