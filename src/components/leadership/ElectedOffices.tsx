"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { TiltCard } from "@/components/primitives/TiltCard";
import { Photo } from "@/components/primitives/Photo";
import { LEADERSHIP } from "@/lib/data";

type Role = (typeof LEADERSHIP.roles)[number];

/**
 * Hero role card — for ASB President and Class President ×3 (highlight=true).
 * Large, dramatic, editorial. Expands to reveal the narrative note on click.
 */
function HighlightRoleCard({
  role,
  index,
}: {
  role: Role;
  index: number;
}) {
  return (
    <TiltCard max={5} className="h-full">
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 30 },
          show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
        }}
        className="relative flex h-full flex-col justify-between overflow-hidden border border-[rgba(212,175,106,0.45)] bg-[var(--bg-2)] p-7 md:p-10"
        data-cursor-hover
      >
        {/* Gold corner accent top-left */}
        <span
          aria-hidden
          className="absolute left-0 top-0 block h-8 w-8 border-l-2 border-t-2 border-[var(--accent)] opacity-50"
        />
        {/* Subtle radial glow behind the number */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(212,175,106,0.06) 0%, transparent 65%)",
          }}
        />

        {/* Index + tag row */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="font-mono text-[0.55rem] uppercase tracking-[0.3em] text-[var(--muted)] opacity-60">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="border border-[rgba(212,175,106,0.3)] px-2.5 py-1 font-mono text-[0.55rem] uppercase tracking-widest text-[var(--accent)]">
            {role.tag}
          </span>
        </div>

        {/* Title */}
        <div className="relative z-10 mt-8 md:mt-12">
          <p
            className="font-anton uppercase leading-[1] tracking-tight text-[var(--accent)]"
            style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)" }}
          >
            {role.title}
          </p>
          <p className="mt-2 font-mono text-[0.65rem] uppercase tracking-widest text-[var(--muted)]">
            {role.window}
          </p>
        </div>

        {/* Reveal note — the narrative */}
        <div className="relative z-10 mt-6 md:mt-8">
          <motion.div
            className="h-px w-12 bg-[var(--accent)] opacity-60"
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          />

          <p className="mt-4 text-sm leading-relaxed text-[var(--fg)] opacity-80 md:text-base">{role.note}</p>
          {"media" in role && role.media && (
            <div className="mt-5 grid grid-cols-3 gap-2">
              {role.media.map((m) => {
                const inner = (
                  <>
                    <div className="relative aspect-[4/3] overflow-hidden border border-[rgba(212,175,106,0.35)]">
                      <Photo src={m.src} alt={m.label} className="object-cover transition-transform duration-700 group-hover/m:scale-[1.04]" />
                      {m.kind === "reel" && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="flex size-8 items-center justify-center rounded-full bg-[rgba(12,10,8,0.7)] text-[0.6rem] text-[var(--accent)] backdrop-blur-sm">▶</span>
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 truncate font-mono text-[0.55rem] uppercase tracking-[0.18em] text-[var(--muted)] group-hover/m:text-[var(--accent)]">
                      {m.kind === "reel" ? "▶ " : ""}{m.label}
                    </p>
                  </>
                );
                return m.kind === "reel" && "url" in m ? (
                  <a key={m.label} href={m.url} target="_blank" rel="noreferrer" data-cursor-hover className="group/m block">{inner}</a>
                ) : (
                  <div key={m.label} className="group/m">{inner}</div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom-right corner accent */}
        <span
          aria-hidden
          className="absolute bottom-0 right-0 block h-6 w-6 border-b-2 border-r-2 border-[var(--accent)] opacity-30"
        />
      </motion.div>
    </TiltCard>
  );
}

/**
 * Supporting role card — the three club offices. Photo on top with the title
 * always legible; hover (or tap) dims the print and brings the note up over it.
 */
function SupportingRoleCard({ role, index }: { role: Role; index: number }) {
  const [photoHover, setPhotoHover] = useState(false);
  const [descHover, setDescHover] = useState(false);
  const [focused, setFocused] = useState(false);
  const [tapOpen, setTapOpen] = useState(false);
  const photo = "photo" in role ? role.photo : undefined;
  const photoAlt = "photoAlt" in role ? role.photoAlt : role.title;
  const crew = LEADERSHIP.crews.find((c) => role.title.startsWith(c.club) || role.title.startsWith(c.club.replace("MSJ ", "")));
  const stat = crew?.stat;

  // hovering (or tapping/focusing) the picture: saturate the original print.
  const printActive = photoHover || descHover || focused || tapOpen;
  // hovering (or tapping/focusing) the description: swap to the officer crew photo.
  const crewOpen = descHover || focused || tapOpen;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
      }}
      className="group relative flex flex-col overflow-hidden border border-[rgba(212,175,106,0.35)] bg-[var(--bg-2)] transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-[var(--accent)]"
      onClick={() => setTapOpen((v) => !v)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      tabIndex={0}
      role="button"
      aria-expanded={crewOpen}
      aria-label={`${role.title} — ${role.window}`}
      data-cursor-hover
    >
      {/* print — hover it to saturate; hover the description below to swap to the officer crew */}
      <div
        className="relative aspect-[4/3] overflow-hidden border-b border-[rgba(212,175,106,0.25)] bg-[var(--bg)]"
        onMouseEnter={() => setPhotoHover(true)}
        onMouseLeave={() => setPhotoHover(false)}
      >
        {photo && (
          <motion.div
            initial={false}
            animate={{ filter: printActive ? "grayscale(0%) sepia(0%)" : "grayscale(55%) sepia(12%)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Photo src={photo} alt={photoAlt} className="object-cover" />
          </motion.div>
        )}
        {crew?.photo && (
          <motion.div
            initial={false}
            animate={{ opacity: crewOpen ? 1 : 0, filter: crewOpen ? "blur(0px)" : "blur(16px)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-10 bg-[var(--bg)]"
            style={{ pointerEvents: "none" }}
          >
            <Photo src={crew.photo} alt={crew.photoAlt} className="object-cover" style={{ objectPosition: "50% 30%" }} />
            <motion.span
              initial={false}
              animate={{ opacity: crewOpen ? 1 : 0 }}
              transition={{ duration: 0.35, delay: crewOpen ? 0.15 : 0 }}
              className="absolute bottom-3 left-4 font-mono text-[0.52rem] uppercase tracking-[0.28em] text-[var(--accent)] [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]"
            >
              The officers
            </motion.span>
          </motion.div>
        )}
        <span aria-hidden className="absolute left-0 top-0 z-20 h-6 w-6 border-l-2 border-t-2 border-[var(--accent)] opacity-0 transition-opacity duration-300 group-hover:opacity-80" />
      </div>

      {/* slate — title always; hover the note to bring up the officer crew photo above */}
      <div className="flex flex-1 flex-col px-5 py-4">
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
          <div className="min-w-0">
            <span className="block font-mono text-[0.55rem] uppercase tracking-[0.3em] text-[var(--muted)]">{String(index + 1).padStart(2, "0")}</span>
            <p className="relative mt-1 inline-block whitespace-nowrap font-anton text-[1.4rem] uppercase leading-none tracking-tight text-[var(--fg)] transition-colors duration-300 group-hover:text-[var(--accent)] md:text-[1.45rem]">
              {role.title}
              <motion.span aria-hidden initial={false} animate={{ scaleX: printActive ? 1 : 0 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} className="absolute -bottom-1 left-0 h-px w-full origin-left bg-[var(--accent)]" />
            </p>
          </div>
          <span className="shrink-0 border border-[rgba(212,175,106,0.35)] px-2 py-1 font-mono text-[0.55rem] uppercase tracking-widest text-[var(--accent)]">
            {role.window}
          </span>
        </div>
        <div
          className="mt-4"
          onMouseEnter={() => setDescHover(true)}
          onMouseLeave={() => setDescHover(false)}
        >
          <p className="text-[0.82rem] leading-relaxed text-[var(--fg)]">{role.note}</p>
          {stat && (
            <p className="mt-3 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-[var(--accent)]">
              <span className="font-anton text-base normal-case tracking-normal">{stat.value}</span> · {stat.label}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
/**
 * The story arc callout: sophomore loss → won it back.
 * Lives between the highlight cards and the supporting roles.
 */
function SophomoreArcCallout() {
  return (
    <Reveal>
      <div className="relative flex flex-wrap items-baseline gap-x-5 gap-y-1 overflow-hidden border border-[rgba(212,175,106,0.25)] bg-[var(--bg-2)] px-6 py-4 md:px-7">
        {/* Vertical gold bar on the left */}
        <span aria-hidden className="absolute bottom-0 left-0 top-0 w-[3px] bg-[var(--accent)] opacity-70" />
        <p className="eyebrow pl-3 text-[var(--accent)]">The arc</p>
        <p className="pl-3 font-anton text-[1.3rem] uppercase leading-none tracking-tight text-[var(--fg)] md:text-[1.7rem]">
          Lost by&nbsp;~10 votes as a sophomore. <span className="text-[var(--accent)]">Ran back. Won.</span>
        </p>
      </div>
    </Reveal>
  );
}

/**
 * ElectedOffices — the editorial centerpiece of the Leadership page.
 * ASB President + Class President ×3 as large highlight cards;
 * two VP roles as supporting accordion rows below.
 */
export function ElectedOffices() {
  const { roles } = LEADERSHIP;
  const highlighted = roles.filter((r): r is Role & { highlight: true } => "highlight" in r && r.highlight === true);
  const supporting = roles.filter((r) => !("highlight" in r && r.highlight === true));

  return (
    <section
      className="mx-auto mt-14 max-w-7xl px-5 md:mt-20 md:px-9"
      aria-labelledby="elected-offices-heading"
    >
      {/* Section headline */}
      <div className="border-t border-[var(--fg)] pt-5 md:pt-6" id="elected-offices-heading">
        <KineticHeadline
          as="h2"
          text="The Offices."
          className="font-anton text-[2.8rem] uppercase leading-none tracking-tight text-[var(--fg)] md:text-[5.5rem]"
          delay={0.05}
        />
      </div>

      {/* Highlight cards — ASB President + Class President ×3 */}
      <RevealGroup
        className="mt-8 grid grid-cols-1 gap-4 md:mt-10 md:grid-cols-2 md:gap-6"
        stagger={0.1}
        delayChildren={0.05}
      >
        {highlighted.map((role, i) => (
          <HighlightRoleCard key={role.title} role={role} index={i} />
        ))}
      </RevealGroup>

      {/* The arc (bar) over the officers · the site — one row */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:mt-6 md:grid-cols-[2fr_1fr] md:gap-6">
        <div className="flex flex-col gap-4">
        <SophomoreArcCallout />

        {/* The ASB officer team — gold-framed, duotone to colour */}
        <Reveal delay={0.1} className="flex-1">
          <div className="group h-full border border-[rgba(212,175,106,0.5)] bg-[var(--bg-2)] p-1.5" data-cursor-hover>
            <div className="relative h-full min-h-[340px] overflow-hidden border border-[rgba(212,175,106,0.25)] md:min-h-[420px]">
              <div className="absolute inset-0 transition-[filter] duration-500 [filter:grayscale(50%)_sepia(12%)] group-hover:[filter:grayscale(0%)_sepia(0%)]">
                <Photo
                  src="/img/asb-officers.jpg"
                  alt="The five ASB officers, 2026–2027, in the Mission San Jose gym"
                  className="object-cover"
                  style={{ objectPosition: "50% 30%" }}
                />
              </div>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
                style={{ background: "linear-gradient(to top, rgba(12,10,8,0.85) 0%, transparent 100%)" }}
              />
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 pb-3">
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[var(--accent)]">The ASB Officers · 2026–2027</p>
                <p className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-[var(--fg)] opacity-80">L → R · {LEADERSHIP.officers}</p>
              </div>
              <span aria-hidden className="absolute left-0 top-0 h-6 w-6 border-l-2 border-t-2 border-[var(--accent)] opacity-70" />
              <span aria-hidden className="absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2 border-[var(--accent)] opacity-70" />
            </div>
          </div>
        </Reveal>
        </div>

        {/* msjhsasb.org — the site, rebuilt in office */}
        <Reveal delay={0.15}>
          <div className="flex h-full flex-col border border-[rgba(212,175,106,0.35)] bg-[var(--bg-2)]">
            <a
              href={LEADERSHIP.site.url}
              target="_blank"
              rel="noreferrer"
              data-cursor-hover
              className="group block"
            >
              <div className="relative aspect-[16/10] overflow-hidden border-b border-[rgba(212,175,106,0.25)]">
                <Photo src={LEADERSHIP.site.shot} alt="msjhsasb.org — the rebuilt MSJHS ASB website" className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]" />
              </div>
              <div className="flex items-baseline justify-between gap-3 px-5 pt-5">
                <p className="font-anton text-[1.4rem] uppercase leading-none tracking-tight text-[var(--accent)]">{LEADERSHIP.site.name}</p>
                <span className="font-mono text-[0.55rem] uppercase tracking-widest text-[var(--muted)] transition-colors group-hover:text-[var(--accent)]">Open ↗</span>
              </div>
            </a>
            <div className="flex flex-1 flex-col px-5 pb-5">
              <p className="mt-3 text-sm leading-relaxed text-[var(--fg)] opacity-75">{LEADERSHIP.site.body}</p>

              {/* Hermes — the bot behind the club schedule */}
              <div className="mt-5 flex gap-4 border-t border-[rgba(212,175,106,0.25)] pt-5">
                <div className="flex shrink-0 flex-col gap-2" style={{ width: 112 }}>
                  <div className="overflow-hidden border border-[rgba(212,175,106,0.35)]" style={{ width: 112 }}>
                    <Photo src={LEADERSHIP.hermes.shot} alt="A Hermes club-schedule story on @msjclubs — the day's meetings, room and time" className="h-auto object-contain" style={{ width: 112, maxWidth: "100%" }} />
                  </div>
                  <Link
                    href={LEADERSHIP.hermes.cta.href}
                    data-cursor-hover
                    className="inline-flex items-center justify-center whitespace-nowrap border border-[rgba(212,175,106,0.5)] px-2 py-2 font-mono text-[0.55rem] uppercase tracking-[0.1em] text-[var(--accent)] transition-colors duration-300 hover:bg-[var(--accent)] hover:text-[#0c0a08]"
                  >
                    {LEADERSHIP.hermes.cta.label}
                  </Link>
                </div>
                <div className="min-w-0">
                  <p className="font-anton text-[1.15rem] uppercase leading-none tracking-tight text-[var(--fg)]">
                    {LEADERSHIP.hermes.name} <span className="font-mono text-[0.55rem] normal-case tracking-widest text-[var(--muted)]">{LEADERSHIP.hermes.handle}</span>
                  </p>
                  <p className="mt-2 text-[0.8rem] leading-relaxed text-[var(--fg)] opacity-70">{LEADERSHIP.hermes.body}</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Supporting roles — VP accordion rows */}
      {supporting.length > 0 && (
        <div className="mt-10 md:mt-14">
          <RevealGroup
            className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6"
            stagger={0.1}
            delayChildren={0.05}
          >
            {supporting.map((role, i) => (
              <SupportingRoleCard
                key={role.title}
                role={role}
                index={highlighted.length + i}
              />
            ))}
          </RevealGroup>
        </div>
      )}
    </section>
  );
}
