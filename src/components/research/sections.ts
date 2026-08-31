/**
 * Single source of truth for the page's sections. ResearchNav renders the
 * rail from it, Console resolves `open <name>` against it, and page.tsx
 * composes in this order. Adding a section means editing this file only.
 */

export type SectionId =
  | "hero"
  | "question" | "strains" | "plasmid" | "bench" | "protocol"
  | "evidence" | "went-wrong" | "next" | "poster"
  | "gout-question" | "pipeline" | "volcano" | "mediators"
  | "olympiads" | "programs";

export type Chapter = "fusarium" | "gout" | "beyond";

export type NavGroup = {
  id: string;
  /** null renders no group heading — "Beyond" named nothing and was cut. */
  label: string | null;
  chapter: Chapter;
  sections: { id: SectionId; label: string }[];
};

export const GROUPS: NavGroup[] = [
  {
    id: "fusarium",
    label: "Fusarium · UMass 2026",
    chapter: "fusarium",
    sections: [
      { id: "question", label: "the question" },
      { id: "strains", label: "the strains" },
      { id: "plasmid", label: "the plasmid" },
      { id: "bench", label: "at the bench" },
      { id: "protocol", label: "the protocol" },
      { id: "evidence", label: "the evidence" },
      { id: "went-wrong", label: "what went wrong" },
      { id: "next", label: "what's next" },
      { id: "poster", label: "the poster" },
    ],
  },
  {
    id: "gout",
    label: "Gout · RNA-seq",
    chapter: "gout",
    sections: [
      { id: "gout-question", label: "the question" },
      { id: "pipeline", label: "the pipeline" },
      { id: "volcano", label: "the volcano" },
      { id: "mediators", label: "the mediators" },
    ],
  },
  {
    id: "beyond",
    label: null,
    chapter: "beyond",
    sections: [
      { id: "olympiads", label: "olympiads" },
      { id: "programs", label: "programs" },
    ],
  },
];

/** Rail entries, in page order. The hero is the top of the page, not a stop. */
export const ALL_SECTIONS = GROUPS.flatMap((g) => g.sections);

/** Resolve a console argument ("plasmid", "went wrong") to a section id. */
export function resolveSection(arg: string): SectionId | null {
  const q = arg.trim().toLowerCase().replace(/[\s_]+/g, "-");
  if (!q) return null;
  const hit =
    ALL_SECTIONS.find((s) => s.id === q) ??
    ALL_SECTIONS.find((s) => s.label.replace(/^the /, "").replace(/[\s']/g, "-") === q) ??
    ALL_SECTIONS.find((s) => s.id.includes(q) || s.label.includes(arg.toLowerCase()));
  return hit ? hit.id : null;
}
