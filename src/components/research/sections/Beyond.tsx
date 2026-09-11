"use client";

import Link from "next/link";
import { useState } from "react";
import { Photo } from "@/components/primitives/Photo";
import { RESEARCH } from "@/lib/data";
import { cn } from "@/lib/cn";
import { Section } from "./Section";

/**
 * Three programs, as photographs you open rather than three paragraphs you
 * skip. Closed, a card is a picture and a name; hovering lifts the frame and
 * focusing or clicking it slides the detail up over the image. The Ma Lab
 * program is the whole page above, so it is not listed again.
 */
const OMIT_PROGRAM = "UMass Amherst — Ma Lab";

const PHOTOS: Record<string, { src: string; alt: string }> = {
  "Youth STEM Journal Club": {
    src: "/img/ysjc-2025-summer-showcase.jpg",
    alt: "The Youth STEM Journal Club summer cohort and mentors after the capstone showcase",
  },
  PRISM: {
    src: "/img/prism-project-with-mayor.jpg",
    alt: "The PRISM Project board at a community event, with the mayor of Fremont and two student organisers",
  },
  "MSJ STEM-PAC": {
    src: "/img/stempac-meeting.jpg",
    alt: "A full classroom at an MSJ STEM-PAC meeting",
  },
};

/** One line each — the long version lives in the card's detail. */
const BLURBS: Record<string, string> = {
  "Youth STEM Journal Club": "Teaching middle-schoolers to read a research paper.",
  PRISM: "Arguing for representation in clinical trials.",
  "MSJ STEM-PAC": "A pipeline from club meeting to science fair.",
};

function ProgramCard({
  title,
  role,
  detail,
}: {
  title: string;
  role: string;
  detail: string;
}) {
  const [open, setOpen] = useState(false);
  const photo = PHOTOS[title];

  return (
    <article className="group relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden border border-[var(--line)] bg-[var(--bg-2)] transition-colors duration-300 group-hover:border-[var(--accent)]">
          {photo ? (
            <Photo
              src={photo.src}
              alt={photo.alt}
              className="transition-[transform,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [filter:grayscale(45%)] group-hover:scale-[1.05] group-hover:[filter:grayscale(0%)]"
            />
          ) : null}

          {/* One plate at the foot of the card. It grows to fit the detail on
              hover, and the scrim grows with it — the photograph above the
              text is never dimmed, so opening a card reveals rather than
              covers. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(7,8,11,0.97)_0%,rgba(7,8,11,0.95)_58%,rgba(7,8,11,0.72)_82%,transparent_100%)] px-5 pb-5 pt-14">
            <h3 className="font-serif text-[1.42rem] leading-[1.15] text-[var(--fg)]">{title}</h3>
            <p className="mt-1.5 text-[1rem] leading-[1.4] text-[var(--muted)]">
              {BLURBS[title] ?? role}
            </p>
            <div
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                open
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100",
              )}
            >
              <div className="overflow-hidden">
                <p className="pt-3 text-[0.98rem] leading-[1.45] text-[var(--accent)]">{role}</p>
                <p className="pt-2.5 text-[0.98rem] leading-[1.55] text-[var(--muted)]">
                  {detail}
                </p>
              </div>
            </div>
          </div>
        </div>
      </button>
    </article>
  );
}

export function Beyond() {
  const programs = RESEARCH.programs.filter((p) => p.title !== OMIT_PROGRAM);

  return (
    <div data-chapter="beyond" className="bg-[var(--bg)]">
      <Section id="olympiads" heading="Externally checked.">
        <ul className="flex list-none flex-col gap-px border border-[var(--line)] bg-[var(--line)] p-0">
          {RESEARCH.awards.map((a) => (
            <li
              key={a.name}
              className="flex flex-wrap items-baseline gap-x-5 gap-y-1.5 bg-[var(--bg-2)] px-6 py-5 transition-colors duration-300 hover:bg-[var(--bg-3)]"
            >
              <span className="font-mono text-[0.95rem] tabular-nums text-[var(--muted)]">
                {a.year}
              </span>
              <span className="text-[1.1rem] text-[var(--fg)]">{a.name}</span>
              <span className="text-[1.05rem] text-[var(--accent)]">{a.result}</span>
              <span className="text-[0.98rem] text-[var(--muted)]">{a.note}</span>
            </li>
          ))}
        </ul>
        <p className="mt-7">
          <Link
            href="/achievements"
            className="text-[1.05rem] text-[var(--muted)] underline decoration-[var(--line)] underline-offset-[6px] transition-colors hover:text-[var(--fg)] hover:decoration-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            The full record
          </Link>
        </p>
      </Section>

      <Section id="programs" heading="Teaching it forward." width="figure">
        <div className="grid gap-5 sm:grid-cols-3">
          {programs.map((p) => (
            <ProgramCard key={p.title} title={p.title} role={p.role} detail={p.detail} />
          ))}
        </div>
      </Section>
    </div>
  );
}
