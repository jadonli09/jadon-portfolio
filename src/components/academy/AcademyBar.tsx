"use client";

import { ArrowUpRight } from "lucide-react";
import { useHideOnScroll } from "@/components/hooks/useHideOnScroll";

/** Wordmark, three links, and the way to the full site. Slides away while reading down, back on the way up. */
export function AcademyBar({ fullSite }: { fullSite: string }) {
  const hidden = useHideOnScroll();
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-[var(--bg)] transition-[translate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${hidden ? "-translate-y-full" : ""}`}
    >
      <div className="flex h-16 items-center justify-between gap-4 px-[var(--m)]">
        <a href="#top" className="font-anton text-[1.5rem] uppercase leading-none" data-cursor-hover>
          Jadon Li
        </a>
        <nav aria-label="Sections" className="hidden items-center gap-8 text-[1rem] md:flex">
          <a href="#work" className="transition-colors hover:text-[var(--accent)]" data-cursor-hover>Work</a>
          <a href="#civic" className="transition-colors hover:text-[var(--accent)]" data-cursor-hover>Roles</a>
          <a href="#contact" className="transition-colors hover:text-[var(--accent)]" data-cursor-hover>Contact</a>
        </nav>
        <a
          href={fullSite}
          data-cursor-hover
          className="inline-flex min-h-11 items-center gap-2 bg-[var(--accent)] px-4 text-[1rem] font-semibold text-[var(--accent-ink)] transition-[background-color,translate] duration-300 hover:-translate-y-0.5 hover:bg-white"
        >
          Full site: jadonli.com <ArrowUpRight className="size-4" aria-hidden />
        </a>
      </div>
    </header>
  );
}
