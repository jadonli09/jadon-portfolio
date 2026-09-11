/**
 * Single source of truth for the page's sections. ResearchNav renders the
 * rail from it, Console resolves `open <name>` against it, and page.tsx
 * composes in this order. Adding a section means editing this file only.
 *
 * Seven stops, not fifteen: the page is an overview of two projects, and
 * everything below the overview is reachable by opening a panel in place.
 */

export type SectionId =
  | "boards"
  | "glow"
  | "bench"
  | "deeper"
  | "gout"
  | "olympiads"
  | "programs";

export type Chapter = "fusarium" | "gout" | "beyond";

export type NavGroup = {
  id: string;
  /** null renders no group heading — a hairline stands in for one. */
  label: string | null;
  chapter: Chapter;
  sections: { id: SectionId; label: string }[];
};

export const GROUPS: NavGroup[] = [
  {
    id: "boards",
    label: null,
    chapter: "fusarium",
    sections: [{ id: "boards", label: "the posters" }],
  },
  {
    id: "fusarium",
    label: "Fusarium, UMass 2026",
    chapter: "fusarium",
    sections: [
      { id: "glow", label: "the glow" },
      { id: "bench", label: "at the bench" },
      { id: "deeper", label: "the details" },
    ],
  },
  {
    id: "gout",
    label: "Gout, science fair",
    chapter: "gout",
    sections: [{ id: "gout", label: "the study" }],
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

/** Rail entries, in page order. The opening is the top of the page, not a stop. */
export const ALL_SECTIONS = GROUPS.flatMap((g) => g.sections);

/** Resolve a console argument ("glow", "the study") to a section id. */
export function resolveSection(arg: string): SectionId | null {
  const q = arg.trim().toLowerCase().replace(/[\s_]+/g, "-");
  if (!q) return null;
  const hit =
    ALL_SECTIONS.find((s) => s.id === q) ??
    ALL_SECTIONS.find((s) => s.label.replace(/^the /, "").replace(/[\s']/g, "-") === q) ??
    ALL_SECTIONS.find((s) => s.id.includes(q) || s.label.includes(arg.toLowerCase()));
  return hit ? hit.id : null;
}
