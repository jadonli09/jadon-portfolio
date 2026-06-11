"use client";

/* eslint-disable @next/next/no-img-element */
import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowDownRight,
  ArrowUpRight,
  FileText,
  Users,
  Mic,
  BookOpen,
  Building2,
  Scale,
} from "lucide-react";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { PosterHeading } from "@/components/ui/poster-heading";
import { asset } from "@/lib/base";
import { CIVIC } from "@/lib/data";
import { EASE } from "@/lib/motion";

/** Local detail constants — SBAI op-ed journey. */
const SBAI_STEPS = [
  {
    n: "01",
    icon: Users,
    label: "Connection",
    detail: "Tr. Sherry introduced Jadon to Luke Wu, whose family boba shop had been hit by serial ADA litigation — sued over a table a few centimeters too low.",
    tag: "Origin",
  },
  {
    n: "02",
    icon: BookOpen,
    label: "Cold Outreach",
    detail: "Jadon cold-emailed professors across Bay Area universities until Prof. Durazo at SF University agreed to advise the project.",
    tag: "Prof. Durazo · SF University",
  },
  {
    n: "03",
    icon: FileText,
    label: "Op-Ed Published",
    detail: "They co-wrote and published an op-ed in the San Mateo Daily Journal, putting the predatory ADA litigation crisis on record for the first time locally.",
    tag: "San Mateo Daily Journal",
  },
  {
    n: "04",
    icon: Building2,
    label: "Chamber Meetings",
    detail: "Met with Chamber of Commerce policy managers across the Bay to build institutional support and share the story of affected small-business owners.",
    tag: "Bay Area Chambers",
  },
  {
    n: "05",
    icon: Mic,
    label: "City Council",
    detail: "Presented the case directly to the Fremont City Council — public testimony, formal record, civic accountability.",
    tag: "Fremont City Council",
  },
  {
    n: "06",
    icon: Scale,
    label: "SB 84 Push",
    detail: "Continued the fight alongside Luke Wu and Arissa around SB 84 — hitting a roadblock in Assemblymember Ash Kalra, who was adamant against letting it pass the judiciary.",
    tag: "SB 84 · Assembly Judiciary",
  },
] as const;

const SBAI_PULLQUOTE =
  "A family's boba shop was sued over a table a few centimeters too low. That's the story that started it all.";

export function CivicSBAIFlow() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-9 md:py-20">
      {/* Poster section heading */}
      <PosterHeading
        label="Deep Dive"
        title="Small Business Accessibility"
        meta="2025 – present"
        className="mb-10 md:mb-16"
      />

      {/* Headline + inciting pull-quote — full-width intro above the columns */}
      <div className="mb-10 md:mb-12">
        <KineticHeadline
          as="h2"
          text="From a Boba Shop to City Council."
          className="font-grotesk text-[2rem] font-bold uppercase leading-[0.94] tracking-[-2px] md:text-[3.2rem] md:tracking-[-3px]"
          delay={0.05}
        />
        <Reveal delay={0.15}>
          <div className="mt-6 max-w-3xl border-l-2 border-[var(--accent)] pl-5">
            <p className="font-serif-i text-lg italic leading-relaxed text-[var(--fg)] md:text-xl">
              &ldquo;{SBAI_PULLQUOTE}&rdquo;
            </p>
            <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
              — Luke Wu&apos;s story · the inciting case
            </p>
          </div>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_380px] md:gap-16">
        {/* Left — the flow, with the published artifact embedded at step 03 */}
        <div>
          {/* Step flow */}
          <RevealGroup stagger={0.09} delayChildren={0.08} className="flex flex-col">
            {SBAI_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.n}
                  variants={{
                    hidden: { opacity: 0, x: -16 },
                    show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
                  }}
                  className="group relative flex gap-5 border-l-2 border-[var(--line)] pb-8 pl-6 last:border-transparent last:pb-0 hover:border-[var(--accent)]"
                >
                  {/* Step dot */}
                  <span className="absolute -left-[9px] top-0 flex h-4 w-4 items-center justify-center bg-[var(--bg)] ring-2 ring-[var(--line)] transition-colors duration-300 group-hover:ring-[var(--accent)]">
                    <span className="h-1.5 w-1.5 bg-[var(--accent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </span>

                  {/* Icon */}
                  <div className="mt-0.5 shrink-0 text-[var(--muted)] transition-colors duration-300 group-hover:text-[var(--accent)]">
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  </div>

                  <div className="flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-3">
                      <span className="font-mono text-[0.6rem] text-[var(--accent)]">{step.n}</span>
                      <span className="font-grotesk text-sm font-semibold uppercase tracking-wide text-[var(--fg)]">
                        {step.label}
                      </span>
                      <span className="ml-auto font-mono text-[0.58rem] uppercase tracking-widest text-[var(--muted)]">
                        {step.tag}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-[var(--muted)]">{step.detail}</p>

                    {/* The receipt — the published op-ed, embedded where it happened */}
                    {step.n === "03" && (
                      <div className="mt-4 max-w-md">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-[var(--accent)]">
                            As published
                          </span>
                          <ArrowDownRight className="size-3 text-[var(--accent)]" />
                          <span className="font-mono text-[0.58rem] uppercase tracking-widest text-[var(--muted)]">
                            {CIVIC.opEd.date}
                          </span>
                        </div>
                        <a
                          href={CIVIC.opEd.url}
                          target="_blank"
                          rel="noreferrer"
                          data-cursor-hover
                          className="group/clip relative block overflow-hidden rounded-md border bg-white shadow-lg transition-transform duration-500 ease-[var(--ease-cine)] hover:-translate-y-1"
                        >
                          <img
                            src={asset(CIVIC.opEd.image)}
                            alt={`${CIVIC.opEd.title} — ${CIVIC.opEd.byline}, ${CIVIC.opEd.outlet}`}
                            loading="lazy"
                            className="w-full transition-transform duration-700 ease-[var(--ease-cine)] group-hover/clip:scale-[1.02]"
                          />
                          <div className="flex items-center justify-between gap-3 border-t border-[var(--line)] bg-[var(--fg)] px-3 py-2">
                            <p className="truncate font-mono text-[0.56rem] uppercase tracking-widest text-[var(--bg)]">
                              {CIVIC.opEd.byline}
                            </p>
                            <p className="flex shrink-0 items-center gap-1.5 font-mono text-[0.56rem] uppercase tracking-widest text-[var(--bg)]">
                              Read it
                              <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover/clip:translate-x-0.5 group-hover/clip:-translate-y-0.5" />
                            </p>
                          </div>
                        </a>
                      </div>
                    )}

                    {/* Arrow connector — not on last */}
                    {i < SBAI_STEPS.length - 1 && (
                      <ArrowRight
                        className="mt-3 h-3 w-3 rotate-90 text-[var(--line)]"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </RevealGroup>
        </div>

        {/* Right — credential rail (sticky so it tracks the longer flow) */}
        <div className="flex flex-col gap-6 md:sticky md:top-28 md:self-start">
          {/* Key people card */}
          <Reveal delay={0.22}>
            <div className="border border-[var(--line)] bg-[var(--bg)]">
              <div className="border-b border-[var(--line)] px-5 py-3">
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--accent)]">
                  People involved
                </p>
              </div>
              {[
                { name: "Luke Wu", role: "Co-advocate · boba shop owner" },
                { name: "Arissa", role: "Co-advocate · Year 2" },
                { name: "Prof. Durazo", role: "Faculty advisor · SF University" },
                { name: "Tr. Sherry", role: "Connector · original introduction" },
                { name: "Ash Kalra", role: "Assemblymember · opposed SB 84" },
              ].map((p, i) => (
                <div
                  key={p.name}
                  className={`flex items-start justify-between gap-4 px-5 py-3 ${i !== 4 ? "border-b border-[var(--line)]" : ""}`}
                >
                  <div>
                    <p className="font-grotesk text-sm font-medium text-[var(--fg)]">{p.name}</p>
                    <p className="font-mono text-[0.58rem] uppercase tracking-widest text-[var(--muted)]">
                      {p.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Outcome stat block */}
          <Reveal delay={0.28}>
            <div className="grid grid-cols-2 border border-[var(--line)]">
              {[
                { label: "Op-Ed", note: "San Mateo Daily Journal", val: "Published" },
                { label: "Chambers", note: "Bay Area outreach", val: "Multiple" },
                { label: "SB 84", note: "Assembly judiciary", val: "Ongoing" },
                { label: "City Council", note: "Public testimony", val: "Presented" },
              ].map((s, i) => (
                <div
                  key={s.label}
                  className={`px-4 py-5 ${i % 2 === 0 ? "border-r border-[var(--line)]" : ""} ${i < 2 ? "border-b border-[var(--line)]" : ""}`}
                >
                  <p className="font-anton text-2xl leading-none text-[var(--accent)]">{s.val}</p>
                  <p className="mt-1 font-grotesk text-xs font-semibold text-[var(--fg)]">{s.label}</p>
                  <p className="mt-0.5 font-mono text-[0.56rem] uppercase tracking-widest text-[var(--muted)]">
                    {s.note}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* Bottom closing rule */}
      <Reveal delay={0.3}>
        <motion.div
          className="mt-10 h-[1px] bg-[var(--line)] md:mt-14"
          initial={{ scaleX: 0, originX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
        />
      </Reveal>
    </section>
  );
}
