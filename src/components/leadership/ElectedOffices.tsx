"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Counter } from "@/components/primitives/Counter";
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
  const [open, setOpen] = useState(false);

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

          <AnimatePresence initial={false}>
            {open && (
              <motion.p
                key="note"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="mt-4 overflow-hidden text-sm leading-relaxed text-[var(--fg)] opacity-80 md:text-base"
              >
                {role.note}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="mt-4 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--accent)] underline-offset-2 transition-opacity duration-200 hover:opacity-70 focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]"
          >
            {open ? "— less" : "+ the story"}
          </button>
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

/** Supporting role row — for VP roles (highlight=false). Smaller, horizontal layout. */
function SupportingRoleRow({ role, index }: { role: Role; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: -16 },
        show: { opacity: 1, x: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
      }}
      className="group border-b border-[var(--line)]"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full cursor-pointer py-5 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] md:py-6"
        data-cursor-hover
      >
        <div className="flex items-center gap-5">
          <span className="w-7 shrink-0 font-mono text-[0.55rem] uppercase tracking-widest text-[var(--muted)] opacity-50">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="flex-1 font-anton text-[1.5rem] uppercase leading-none tracking-tight text-[var(--fg)] transition-colors duration-300 group-hover:text-[var(--accent)] md:text-[2rem]">
            {role.title}
          </span>
          <span className="hidden shrink-0 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)] sm:block">
            {role.window}
          </span>
          <motion.span
            aria-hidden
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="shrink-0 font-mono text-lg text-[var(--accent)]"
          >
            +
          </motion.span>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="note"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6 pl-12 pt-1">
              <div className="mb-3 h-px w-8 bg-[var(--accent)] opacity-50" />
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-8">
                <p className="max-w-2xl flex-1 text-sm leading-relaxed text-[var(--fg)] opacity-75 md:text-base">
                  {role.note}
                </p>
                {/* Club photo — gold-framed evidence card */}
                {"photo" in role && role.photo && (
                  <div className="w-full max-w-[320px] shrink-0 border border-[rgba(212,175,106,0.45)] bg-[var(--bg-2)] p-1 md:w-72">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Photo src={role.photo} alt={role.photoAlt} className="object-cover" />
                    </div>
                    <p className="px-1 pb-0.5 pt-1.5 font-mono text-[0.5rem] uppercase tracking-[0.25em] text-[var(--muted)]">
                      {role.photoCaption}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
      <div className="relative overflow-hidden border border-[rgba(212,175,106,0.25)] bg-[var(--bg-2)] px-7 py-6 md:px-10 md:py-8">
        {/* Vertical gold bar on the left */}
        <span
          aria-hidden
          className="absolute bottom-0 left-0 top-0 w-[3px] bg-[var(--accent)] opacity-70"
        />
        <p className="eyebrow mb-3 pl-4 text-[var(--accent)]">The arc</p>
        <p className="pl-4 font-anton text-[1.6rem] uppercase leading-[1.1] tracking-tight text-[var(--fg)] md:text-[2.6rem]">
          Lost by&nbsp;~10 votes as a sophomore.
          <br />
          <span className="text-[var(--accent)]">Ran back. Won.</span>
        </p>
        <p className="mt-4 pl-4 max-w-2xl text-sm leading-relaxed text-[var(--fg)] opacity-70 md:text-base">
          Leadership II selection: 90+ applicants → written round → 60 → interviews → 30. Every step owned.
        </p>
      </div>
    </Reveal>
  );
}

/** Animated stat pill used in the counters strip. */
function StatPill({
  value,
  label,
  isCounter = false,
  counterTo,
  prefix = "",
  suffix = "",
}: {
  value?: string;
  label: string;
  isCounter?: boolean;
  counterTo?: number;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div className="group relative flex flex-col justify-end border border-[var(--line)] bg-[var(--bg-2)] p-5 transition-colors duration-500 hover:border-[var(--accent)] md:p-7">
      <span
        aria-hidden
        className="absolute left-0 top-0 h-0.5 w-8 bg-[var(--accent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <p className="font-anton text-[2rem] leading-none text-[var(--accent)] md:text-[2.8rem]">
        {isCounter && counterTo !== undefined ? (
          <Counter to={counterTo} prefix={prefix} suffix={suffix} duration={2} />
        ) : (
          value ?? null
        )}
      </p>
      <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
        {label}
      </p>
    </div>
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
      className="mx-auto mt-20 max-w-7xl px-5 md:mt-32 md:px-9"
      aria-labelledby="elected-offices-heading"
    >
      {/* Section header */}
      <Reveal>
        <div className="flex items-baseline justify-between border-b border-[var(--fg)] pb-4">
          <div className="flex items-baseline gap-6">
            <span className="eyebrow text-[var(--accent)]">The Offices</span>
            <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
              Elected&nbsp;·&nbsp;Every&nbsp;Year
            </span>
          </div>
          <span className="eyebrow hidden text-[var(--muted)] sm:block">
            Mission San Jose H.S.
          </span>
        </div>
      </Reveal>

      {/* Section headline */}
      <div className="mt-5 md:mt-6" id="elected-offices-heading">
        <KineticHeadline
          as="h2"
          text="The Offices."
          className="font-anton text-[2.8rem] uppercase leading-none tracking-tight text-[var(--fg)] md:text-[5.5rem]"
          delay={0.05}
        />
      </div>

      {/* Highlight cards — ASB President + Class President ×3 */}
      <RevealGroup
        className="mt-10 grid grid-cols-1 gap-4 md:mt-14 md:grid-cols-2 md:gap-6"
        stagger={0.1}
        delayChildren={0.05}
      >
        {highlighted.map((role, i) => (
          <HighlightRoleCard key={role.title} role={role} index={i} />
        ))}
      </RevealGroup>

      {/* The sophomore-loss arc callout — editorial beat between the cards and VP roles */}
      <div className="mt-8 md:mt-10">
        <SophomoreArcCallout />
      </div>

      {/* Numbers + the team — fundraising scale on the left, the ASB officers on the right */}
      <div className="mt-8 md:mt-10">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1.25fr] md:gap-6">
          {/* Stat pills — the two numbers that matter */}
          <RevealGroup className="grid grid-rows-2 gap-px bg-[var(--line)]" stagger={0.08} delayChildren={0.05}>
            <StatPill
              isCounter
              counterTo={15}
              prefix="$"
              suffix="k"
              label="In fundraisers — drives & merch, three years"
            />
            <StatPill value="3×" label="Class President wins" />
          </RevealGroup>

          {/* The ASB officer team — gold-framed, duotone to colour */}
          <Reveal delay={0.1}>
            <div className="group h-full border border-[rgba(212,175,106,0.5)] bg-[var(--bg-2)] p-1.5" data-cursor-hover>
              <div className="relative h-full min-h-[240px] overflow-hidden border border-[rgba(212,175,106,0.25)]">
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
                <div className="absolute inset-x-0 bottom-0 flex items-baseline justify-between px-4 pb-3">
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[var(--accent)]">
                    The ASB Officers
                  </p>
                  <p className="font-mono text-[0.55rem] uppercase tracking-[0.25em] text-[var(--fg)] opacity-80">
                    2026–2027
                  </p>
                </div>
                <span aria-hidden className="absolute left-0 top-0 h-6 w-6 border-l-2 border-t-2 border-[var(--accent)] opacity-70" />
                <span aria-hidden className="absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2 border-[var(--accent)] opacity-70" />
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Supporting roles — VP accordion rows */}
      {supporting.length > 0 && (
        <div className="mt-10 md:mt-14">
          <Reveal>
            <p className="eyebrow mb-6 text-[var(--muted)]">Also on the slate</p>
          </Reveal>
          <RevealGroup
            className="divide-y divide-[var(--line)] border-t border-[var(--line)]"
            stagger={0.08}
            delayChildren={0.05}
          >
            {supporting.map((role, i) => (
              <SupportingRoleRow
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
