"use client";

import { motion } from "motion/react";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { TiltCard } from "@/components/primitives/TiltCard";
import { EASE } from "@/lib/motion";

/** Local constants — Fremont Stories + Voices of Fremont deep detail. */
const PODCAST_FACTS = [
  { label: "Episode length", val: "~7 min", note: "+ short-form" },
  { label: "Cadence", val: "Monthly", note: "thousands of views" },
  { label: "Role", val: "Director", note: "+ editor" },
  { label: "Origin", val: "Mayor's ask", note: "via Manav Patel" },
] as const;

const FREMONT_STORIES_SUBJECTS = [
  {
    name: "Darlene",
    role: "Director · Fremont's #1 daycare",
    arc: "From fashion-aspiring college student to successful childcare entrepreneur — proof that the road less taken is often the one worth documenting.",
    ep: "Ep. 01",
  },
] as const;

const SERIES_CREW = [
  { name: "Akash Sethi", note: "Law student · co-creator", intro: "Met at City Council meeting" },
  { name: "Brittany Lu", note: "Co-creator · storytelling", intro: "Joined early production" },
  { name: "Jadon Li", note: "Director + editor", intro: "Ampersand Media" },
] as const;

export function CivicFreemontStories() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-9 md:py-24">
      {/* Section rule */}
      <Reveal>
        <div className="mb-8 flex items-baseline justify-between border-b border-[var(--fg)] pb-3 md:mb-10">
          <div className="flex items-baseline gap-4">
            <span className="font-anton text-sm uppercase tracking-widest text-[var(--accent)] md:text-base">
              Audio & Video
            </span>
            <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
              Two series · one city
            </span>
          </div>
          <span className="eyebrow hidden sm:block">Fremont,&nbsp;CA&nbsp;·&nbsp;2025</span>
        </div>
      </Reveal>

      {/* Two-column layout: Voices of Fremont left, Fremont Stories right */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">

        {/* ── Voices of Fremont ── */}
        <Reveal>
          <article className="relative flex h-full flex-col border border-[var(--line)] bg-[var(--bg-2)]">
            {/* Red accent top */}
            <div className="h-[3px] w-full bg-[var(--accent)]" />

            <div className="flex-1 p-7 md:p-9">
              {/* Label row */}
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--accent)]">
                  Podcast
                </span>
                <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
                  Fall 2025 –
                </span>
                <span className="ml-auto font-mono text-[0.58rem] text-[var(--muted)]">
                  @voices_of_fremont
                </span>
              </div>

              <KineticHeadline
                as="h2"
                text="Voices of Fremont"
                className="font-anton text-[2rem] uppercase leading-[0.94] tracking-tight md:text-[2.8rem]"
                delay={0.05}
              />

              <p className="mt-5 text-sm leading-relaxed text-[var(--muted)]">
                It started with a phone call. <strong className="text-[var(--fg)]">Manav Patel</strong>,
                the Mayor&apos;s assistant, reached out — the Mayor wanted an outlet to discuss city
                issues, solutions, and upcoming events with the public. Jadon was asked to build it.
              </p>

              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                Each episode runs approximately 7 minutes, with short-form cuts for social. The
                podcast interviews residents, highlights small businesses, and raises awareness on
                social issues — pulling thousands of views per month. Beyond the Mayor, guests range
                from community organizers to local business owners.
              </p>

              {/* Origin callout */}
              <div className="mt-6 border-l-2 border-[var(--accent)] py-1 pl-4">
                <p className="font-serif-i text-base italic leading-snug text-[var(--fg)]">
                  &ldquo;The Mayor wanted an outlet to talk to the city. Jadon was asked to build it.&rdquo;
                </p>
                <p className="mt-2 font-mono text-[0.58rem] uppercase tracking-widest text-[var(--muted)]">
                  Via Manav Patel · Mayor&apos;s assistant
                </p>
              </div>

              {/* Podcast stats grid */}
              <div className="mt-6 grid grid-cols-2 gap-0 border border-[var(--line)]">
                {PODCAST_FACTS.map((f, i) => (
                  <div
                    key={f.label}
                    className={`px-4 py-4 ${i % 2 === 0 ? "border-r border-[var(--line)]" : ""} ${i < 2 ? "border-b border-[var(--line)]" : ""}`}
                  >
                    <p className="font-mono text-[0.58rem] uppercase tracking-widest text-[var(--muted)]">
                      {f.label}
                    </p>
                    <p className="mt-1 font-grotesk text-base font-semibold text-[var(--fg)]">{f.val}</p>
                    <p className="mt-0.5 font-mono text-[0.56rem] text-[var(--accent)]">{f.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </Reveal>

        {/* ── Fremont Stories ── */}
        <Reveal delay={0.1}>
          <article className="relative flex h-full flex-col border border-[var(--line)] bg-[var(--bg)]">
            {/* Thin red rule */}
            <div className="h-[2px] w-full bg-[var(--line)]" />

            <div className="flex-1 p-7 md:p-9">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--accent)]">
                  Video Series
                </span>
                <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
                  Jun 2025 –
                </span>
              </div>

              <KineticHeadline
                as="h2"
                text="Fremont Stories"
                className="font-anton text-[2rem] uppercase leading-[0.94] tracking-tight md:text-[2.8rem]"
                delay={0.08}
              />

              <p className="mt-5 text-sm leading-relaxed text-[var(--muted)]">
                Jadon met <strong className="text-[var(--fg)]">Akash Sethi</strong> — a law student
                — at a City Council meeting. Together with{" "}
                <strong className="text-[var(--fg)]">Brittany Lu</strong>, they built a video series
                dedicated to telling the stories of interesting people in Fremont. The mission: show
                that there are many inspiring career paths beyond the conventional.
              </p>

              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                Not everyone needs to be a doctor or a lawyer. Some of the most compelling lives are
                built in places the world walks past every day.
              </p>

              {/* Episode card */}
              <div className="mt-6">
                <p className="eyebrow mb-3 text-[var(--muted)]">Featured subject</p>
                {FREMONT_STORIES_SUBJECTS.map((sub) => (
                  <TiltCard key={sub.name} max={3} className="w-full">
                    <div className="group border border-[var(--line)] bg-[var(--bg-2)] p-5 transition-colors duration-300 hover:border-[var(--accent)]">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--accent)]">
                          {sub.ep}
                        </span>
                      </div>
                      <p className="font-grotesk text-base font-semibold text-[var(--fg)]">{sub.name}</p>
                      <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
                        {sub.role}
                      </p>
                      <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">{sub.arc}</p>
                    </div>
                  </TiltCard>
                ))}
              </div>

              {/* Crew table */}
              <div className="mt-6 border-t border-[var(--line)] pt-5">
                <p className="eyebrow mb-3 text-[var(--muted)]">Production crew</p>
                <div className="flex flex-col gap-0 border border-[var(--line)]">
                  {SERIES_CREW.map((c, i) => (
                    <div
                      key={c.name}
                      className={`flex items-start justify-between gap-4 px-4 py-3 ${i !== SERIES_CREW.length - 1 ? "border-b border-[var(--line)]" : ""}`}
                    >
                      <div>
                        <p className="font-grotesk text-xs font-semibold text-[var(--fg)]">{c.name}</p>
                        <p className="font-mono text-[0.56rem] uppercase tracking-widest text-[var(--muted)]">
                          {c.note}
                        </p>
                      </div>
                      <p className="shrink-0 font-mono text-[0.56rem] text-[var(--muted)] opacity-60">
                        {c.intro}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>
        </Reveal>
      </div>

      {/* Thin bottom separator */}
      <Reveal delay={0.25}>
        <motion.div
          className="mt-14 h-[1px] bg-[var(--line)] md:mt-20"
          initial={{ scaleX: 0, originX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
        />
      </Reveal>
    </section>
  );
}
