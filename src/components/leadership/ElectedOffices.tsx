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
function HighlightRoleCard({ role }: { role: Role }) {
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

        {/* Title */}
        <div className="relative z-10">
          <p
            className="font-anton uppercase leading-[1] tracking-tight text-[var(--accent)]"
            style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)" }}
          >
            {role.title}
          </p>
          <p className="mt-3 text-base text-[var(--muted)]">{role.window}</p>
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
                          <span aria-hidden className="flex size-9 items-center justify-center rounded-full bg-[rgba(12,10,8,0.7)] text-sm text-[var(--accent)] backdrop-blur-sm">▶</span>
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-sm leading-snug text-[var(--muted)] group-hover/m:text-[var(--accent)]">
                      {m.label}
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
function SupportingRoleCard({ role }: { role: Role }) {
  const [photoHover, setPhotoHover] = useState(false);
  const [descHover, setDescHover] = useState(false);
  const [focused, setFocused] = useState(false);
  const [tapOpen, setTapOpen] = useState(false);
  const photo = "photo" in role ? role.photo : undefined;
  const photoAlt = "photoAlt" in role ? role.photoAlt : role.title;
  const crew = LEADERSHIP.crews.find((c) => role.title.startsWith(c.club) || role.title.startsWith(c.club.replace("MSJ ", "")));

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
          </motion.div>
        )}
        <span aria-hidden className="absolute left-0 top-0 z-20 h-6 w-6 border-l-2 border-t-2 border-[var(--accent)] opacity-0 transition-opacity duration-300 group-hover:opacity-80" />
      </div>

      {/* slate — title always; hover the note to bring up the officer crew photo above */}
      <div className="flex flex-1 flex-col px-5 py-4">
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
          <div className="min-w-0">
            <p className="relative inline-block whitespace-nowrap font-anton text-[1.4rem] uppercase leading-none tracking-tight text-[var(--fg)] transition-colors duration-300 group-hover:text-[var(--accent)] md:text-[1.45rem]">
              {role.title}
              <motion.span aria-hidden initial={false} animate={{ scaleX: printActive ? 1 : 0 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} className="absolute -bottom-1 left-0 h-px w-full origin-left bg-[var(--accent)]" />
            </p>
          </div>
          <span className="shrink-0 border border-[rgba(212,175,106,0.35)] px-2 py-1 text-sm leading-tight text-[var(--accent)]">
            {role.window}
          </span>
        </div>
        <div
          className="mt-4"
          onMouseEnter={() => setDescHover(true)}
          onMouseLeave={() => setDescHover(false)}
        >
          <p className="text-sm leading-relaxed text-[var(--fg)]">{role.note}</p>
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
      <div className="relative overflow-hidden border border-[rgba(212,175,106,0.25)] bg-[var(--bg-2)] px-6 py-4 md:px-7">
        {/* Vertical gold bar on the left */}
        <span aria-hidden className="absolute bottom-0 left-0 top-0 w-[3px] bg-[var(--accent)] opacity-70" />
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
        {highlighted.map((role) => (
          <HighlightRoleCard key={role.title} role={role} />
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
              <p className="absolute inset-x-0 bottom-0 px-4 pb-3 text-sm leading-snug text-[var(--fg)]">
                <span className="text-[var(--accent)]">The ASB officers</span>, left to right: {LEADERSHIP.officers}
              </p>
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
              <p className="px-5 pt-5 font-anton text-[1.4rem] uppercase leading-none tracking-tight text-[var(--accent)]">
                {LEADERSHIP.site.name}
                <span aria-hidden className="ml-2 text-[var(--muted)] transition-colors group-hover:text-[var(--accent)]">↗</span>
              </p>
            </a>
            <div className="flex flex-1 flex-col px-5 pb-5">
              <p className="mt-3 text-sm leading-relaxed text-[var(--fg)] opacity-75">{LEADERSHIP.site.body}</p>

              {/* Hermes — the bot behind the club schedule */}
              <div className="mt-5 flex gap-4 border-t border-[rgba(212,175,106,0.25)] pt-5">
                <div className="shrink-0 self-start overflow-hidden border border-[rgba(212,175,106,0.35)]" style={{ width: 112 }}>
                  <Photo src={LEADERSHIP.hermes.shot} alt="A Hermes club-schedule story on @msjclubs — the day's meetings, room and time" className="h-auto object-contain" style={{ width: 112, maxWidth: "100%" }} />
                </div>
                <div className="min-w-0">
                  <p className="font-anton text-[1.15rem] uppercase leading-none tracking-tight text-[var(--fg)]">
                    {LEADERSHIP.hermes.name}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--fg)] opacity-70">{LEADERSHIP.hermes.body}</p>
                  <Link
                    href={LEADERSHIP.hermes.cta.href}
                    data-cursor-hover
                    className="mt-4 inline-flex items-center justify-center border border-[rgba(212,175,106,0.5)] px-4 py-2 text-base text-[var(--accent)] transition-colors duration-300 hover:bg-[var(--accent)] hover:text-[#0c0a08]"
                  >
                    {LEADERSHIP.hermes.cta.label}
                  </Link>
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
            {supporting.map((role) => (
              <SupportingRoleCard key={role.title} role={role} />
            ))}
          </RevealGroup>
        </div>
      )}
    </section>
  );
}
