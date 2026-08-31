import { ArrowUpRight } from "lucide-react";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { Magnetic } from "@/components/primitives/Magnetic";
import { Photo } from "@/components/primitives/Photo";
import { Develop } from "@/components/built/Develop";
import { LiveEmbed } from "@/components/built/LiveEmbed";
import { DecodeText, StatValue } from "@/components/built/MissionFX";
import type { Project } from "@/lib/data";

/**
 * A real photograph from the build — not a product screenshot. Photographs keep
 * the `archival` halftone; only product UI gets `Develop`'s resolve-to-colour.
 */
export type ChapterPhoto = {
  src: string;
  alt: string;
  caption: string;
};

/**
 * One tier-1 or tier-2 project, given a full chapter of the page. The slate,
 * the dossier, the screenshot, the stats, an optional behind-the-build photo
 * row, and then whatever demo the caller passes as children. Server-safe —
 * every interactive piece is a client component imported by the caller.
 *
 * `photos` is what gives tier 1 more screen real estate than tier 2: weight is
 * encoded as height, and the flagship is the only chapter with a photo record.
 */
export function Chapter({
  project,
  no,
  photos,
  children,
}: {
  project: Project;
  no: string;
  photos?: ChapterPhoto[];
  children?: React.ReactNode;
}) {
  return (
    <section
      id={project.slug}
      data-chapter={project.slug}
      className="scroll-mt-24 border-b border-[var(--line)]"
    >
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-9 md:py-32">
        {/* ── Mission slate ── */}
        <Reveal>
          <div className="mb-10 flex items-baseline gap-4">
            <span className="mission-display text-[var(--accent)]">M-{no}</span>
            <span className="h-px flex-1 bg-[var(--line)]" />
            {project.launched ? (
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-[var(--muted)]">
                {project.launched}
              </span>
            ) : null}
          </div>
        </Reveal>

        {/* ── Dossier ── */}
        <div className="max-w-3xl">
          {/* The product name is the heading: a document outline made of
              taglines names none of the projects. Visual weight is unchanged —
              the tagline still reads as the display line. */}
          <Reveal>
            <h2 className="mission-display text-2xl">{project.name}</h2>
          </Reveal>

          <Reveal delay={0.05}>
            <p className="mission-display mt-3 text-[2.4rem] md:text-[3.6rem]">
              <DecodeText text={project.tagline} duration={1.1} />
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-6 text-sm leading-[1.9] text-[var(--muted)] md:text-base">
              {project.body}
            </p>
          </Reveal>
        </div>

        {/* ── Screenshot ── */}
        {project.shot ? (
          <Reveal delay={0.15} className="mt-14">
            <div className="frame-brackets">
              <Develop>
                <LiveEmbed
                  url={project.url}
                  domain={project.domain}
                  title={project.name}
                  screenshot={project.shot}
                  aspect="1280/800"
                />
              </Develop>
            </div>
          </Reveal>
        ) : null}

        {/* ── Stats + stack + CTA ── */}
        <div
          className={
            project.stats.length
              ? "mt-16 grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20"
              : "mt-16"
          }
        >
          {/* A project with no sourced stat renders no stat column at all —
              an empty grid track would leave a hole where a fact should be. */}
          {project.stats.length ? (
            <RevealGroup
              className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:grid-cols-2"
              stagger={0.08}
              delayChildren={0.1}
            >
              {project.stats.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col gap-2 border-l-[1.5px] border-[var(--accent)] pl-5"
                >
                  <p className="mission-display text-[2.4rem] text-[var(--fg)]">
                    <StatValue value={s.value} />
                  </p>
                  <p className="font-mono text-[0.65rem] uppercase tracking-widest text-[var(--muted)]">
                    {s.label}
                  </p>
                </div>
              ))}
            </RevealGroup>
          ) : null}

          <div className="flex flex-col justify-center">
            <Reveal delay={0.2}>
              <p className="eyebrow mb-3">Stack</p>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center border border-[var(--line)] bg-[var(--bg)] px-3 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-[var(--muted)]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.3} className="mt-10">
              <Magnetic strength={0.3}>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-cursor-hover
                  className="btn-fill"
                >
                  Visit {project.domain} <ArrowUpRight className="size-3.5" />
                </a>
              </Magnetic>
            </Reveal>
          </div>
        </div>

        {/* ── Behind the build ── */}
        {photos?.length ? (
          <Reveal delay={0.1} className="mt-20">
            <p className="eyebrow mb-6">Behind the build</p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
              {photos.map((ph) => (
                <figure key={ph.src}>
                  <div className="frame-brackets">
                    {/* Photographs keep the archival halftone — `Develop` is for
                        product screenshots, which are evidence and must resolve
                        to full colour. */}
                    <div className="archival-frame aspect-[4/3] overflow-hidden">
                      <Photo src={ph.src} alt={ph.alt} className="archival" />
                    </div>
                  </div>
                  <figcaption className="mt-3 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[var(--muted)]">
                    {ph.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </Reveal>
        ) : null}

        {/* ── Demo ── */}
        {children ? <div className="mt-20">{children}</div> : null}
      </div>
    </section>
  );
}
