import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Rise } from "@/components/built/Rise";
import { AcademyBar } from "@/components/academy/AcademyBar";
import { CycleTabs } from "@/components/academy/CycleTabs";
import { PhotoDeck } from "@/components/academy/PhotoDeck";
import { asset } from "@/lib/base";
import { PROFILE } from "@/lib/data";

/**
 * The Academy edition: Jadon's personal site cut for the Horowitz Andreessen
 * Academy reviewers. academy.jadonli.com rewrites its root here (vercel.json);
 * the full site stays at jadonli.com, one press away in the bar and footer.
 *
 * Order is importance: Jadon first, then his work biggest-first (Salwan
 * Central, Rung, AcornPrep, Hermes), each shown with its own product, then the
 * smaller builds, the roles, and contact. Every project picture is the product
 * itself or Jadon; nobody else is the subject of a large image.
 * Figures are Jadon's own as of 2026-11-17.
 */
export const metadata: Metadata = {
  title: { absolute: "Jadon Li · Builder in Fremont" },
  description:
    "Jadon Li builds tools that connect people with their city: Salwan Central for Fremont Mayor Raj Salwan's office, Rung (2nd of 81 at a16z SpeedHacks), AcornPrep (2,000+ users) and Hermes.",
};

const FULL_SITE = "https://jadonli.com";

function Facts({ items, cols = 2 }: { items: { v: string; l: string }[]; cols?: 2 | 4 }) {
  return (
    <dl className={`mt-7 grid grid-cols-2 gap-x-6 gap-y-5 ${cols === 4 ? "sm:grid-cols-4" : ""}`}>
      {items.map((x) => (
        <div key={x.l}>
          <dt className="sr-only">{x.l}</dt>
          <dd className="font-anton text-[2.6rem] leading-none text-[var(--accent)]">{x.v}</dd>
          <dd className="mt-1 text-[1rem] leading-tight text-[var(--muted)]">{x.l}</dd>
        </div>
      ))}
    </dl>
  );
}

function Open({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      data-cursor-hover
      className="mt-8 inline-flex min-h-14 items-center gap-2 bg-[var(--accent)] px-6 text-[1.05rem] font-semibold text-[var(--accent-ink)] transition-[background-color,translate] duration-300 hover:-translate-y-0.5 hover:brightness-110"
    >
      {children} <ArrowUpRight className="size-5" aria-hidden />
    </a>
  );
}

const ROADMAP = [
  { when: "Summer 2025", what: "Interned for Mayor Salwan, 50 calls a week" },
  { when: "Sept 2026", what: "Started Matcha with the Mayor" },
  { when: "Oct 11", what: "Rung: 2nd of 81 at a16z SpeedHacks" },
  { when: "Oct 18", what: "Salwan Central goes live for the Mayor's office" },
  { when: "Nov 2026", what: "Named Chair of Fremont's Youth Advisory Commission", now: true },
];

const HERMES = ["2026-09-04", "2026-09-08", "2026-09-09", "2026-09-10", "2026-09-11", "2026-09-14", "2026-09-15", "2026-09-16", "2026-09-17", "2026-09-18", "2026-10-20", "2026-10-21"];

const SMALLER = [
  { tool: "NotebookLI", where: "UMass Amherst lab", what: "A reader for dense research papers; my labmates used it too." },
  { tool: "CueSheet", where: "Editing the Mayor's reels", what: "Picks a song from a clip; now a fixed step in my edits." },
  { tool: "Email script", where: "Climbing Club", what: "Automated the fundraiser's outreach; $1,300+ raised." },
  { tool: "Milk fridges", where: "Freshman year", what: "School milk kept spoiling. I traced why and pushed until fridges went in." },
];

export default function AcademyPage() {
  return (
    <main
      className="academy relative w-full bg-[var(--bg)] font-grotesk text-[var(--ink)]"
      style={
        {
          "--bg": "#10291b",
          "--surface": "#16331f",
          "--ink": "#ffffff",
          "--muted": "#bfd3b8",
          "--accent": "#d5ec9f",
          "--accent-ink": "#10291b",
          "--m": "clamp(1.25rem, 3vw, 3rem)",
        } as React.CSSProperties
      }
    >
      <AcademyBar fullSite={FULL_SITE} />
      <div id="top" />

      {/* ── 1. WHO: Jadon, large, first ── */}
      <section aria-labelledby="hero-title" className="px-[var(--m)] pb-14 pt-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
          <div className="lg:col-span-7">
            <h1 id="hero-title" className="font-anton text-[clamp(4.6rem,13vw,12.5rem)] uppercase leading-[0.86]">
              Jadon Li
            </h1>
            <p className="mt-6 max-w-[30ch] text-[clamp(1.4rem,2.2vw,2rem)] font-semibold leading-[1.2]">
              I built Salwan Central, where Fremont&apos;s Mayor books his conversations with residents and students, then follows
              up on every idea.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <a
                href="#work"
                data-cursor-hover
                className="inline-flex min-h-14 items-center bg-[var(--accent)] px-7 text-[1.05rem] font-semibold text-[var(--accent-ink)] transition-[background-color,translate] duration-300 hover:-translate-y-0.5 hover:bg-white"
              >
                See my work
              </a>
              <a
                href={PROFILE.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-hover
                className="inline-flex min-h-14 items-center gap-3 border border-white/40 px-6 text-[1.05rem] font-semibold transition-[border-color,translate] duration-300 hover:-translate-y-0.5 hover:border-white"
              >
                <svg aria-hidden viewBox="0 0 24 24" className="size-5 fill-current">
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
                </svg>
                LinkedIn
              </a>
              <span className="text-[1rem] text-[var(--muted)]">Senior in Fremont, California · Class of 2027</span>
            </div>
          </div>
          <div className="lg:col-span-5">
            <PhotoDeck
              className="mx-auto w-full max-w-[24rem]"
              photos={[
                { src: "/img/academy/jadon-portrait.jpg", alt: "Jadon Li", caption: "Jadon Li, Fremont, California", pos: "50% 40%" },
                { src: "/img/academy/sh-check-team.jpg", alt: "Jadon, Reid and Conrad holding the Best Use of Dial check at SpeedHacks", caption: "Best Use of Dial at a16z SpeedHacks", pos: "38% 40%" },
                { src: "/img/academy/jadon-pitch.jpg", alt: "Jadon pitching AcornPrep at Stanford", caption: "Pitching AcornPrep at Stanford", pos: "50% 30%" },
                { src: "/img/academy/sh-build-selfie.jpg", alt: "Jadon building Rung with his team", caption: "Building Rung, 12 hours to demo", pos: "30% 50%" },
                { src: "/img/covers/builds.jpg", alt: "Jadon with Mayor Raj Salwan", caption: "With Mayor Raj Salwan", pos: "60% 35%" },
              ]}
            />
          </div>
        </div>

        {/* the roadmap: what actually happened, in order */}
        <ol className="relative mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          <span aria-hidden className="absolute left-0 right-0 top-[7px] hidden h-[3px] bg-[var(--surface)] lg:block" />
          {ROADMAP.map((r) => (
            <li key={r.when} className="relative">
              <span aria-hidden className={`relative block size-[17px] rounded-full ${r.now ? "bg-[var(--accent)]" : "bg-[#3f6a4c]"}`} />
              <p className="mt-4 text-[1rem] font-semibold text-[var(--accent)]">{r.when}</p>
              <p className="mt-1 text-[1.125rem] leading-snug">{r.what}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── 2. WORK, biggest first ── */}
      <section id="work" aria-labelledby="work-title" className="scroll-mt-16">
        <h2 id="work-title" className="sr-only">Work</h2>

        {/* Salwan Central */}
        <article id="salwan-central" aria-labelledby="sc-title" className="scroll-mt-20 bg-[var(--surface)] px-[var(--m)] py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <Rise className="lg:col-span-5">
              <h3 id="sc-title" className="flex items-center gap-4 font-anton text-[clamp(2.8rem,4.4vw,4.2rem)] uppercase leading-[0.9]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset("/img/logos/salwan-central.svg")} alt="" aria-hidden className="h-[0.75em] w-auto" />
                Salwan Central
              </h3>
              <p className="mt-5 text-[1.125rem] leading-relaxed">
                Mayor Raj Salwan&apos;s office runs Sips with Salwan and Matcha with the Mayor on it. Residents and students book a
                conversation, and each one gets a workspace with his team afterward. I built it alone; it went live October 18.
              </p>
              <Facts
                cols={4}
                items={[
                  { v: "40", l: "conversations" },
                  { v: "200", l: "student applications" },
                  { v: "73", l: "on the waitlist" },
                  { v: "36", l: "ideas in follow-up" },
                ]}
              />
              <p className="mt-8 text-[1.0625rem] leading-snug opacity-90">
                At the first session, two students mapping Fremont&apos;s tree canopy asked to meet the City&apos;s Urban Forestry team.
                Getting each idea to the person who can act on it is what the follow-up workspaces are for.
              </p>
              <Open href="https://salwan-central.vercel.app">Open Salwan Central</Open>
            </Rise>
            <Rise delay={0.06} className="lg:col-span-7">
              <CycleTabs
                items={[
                  { label: "Sign up", url: "salwan-central.vercel.app", src: "/embeds/salwan-central/home.jpg", alt: "Salwan Central's home page", line: "Residents book Sips with Salwan with a name and email. Confirmations and reminders send themselves." },
                  { label: "Apply", url: "salwan-central.vercel.app/apply", src: "/embeds/salwan-central/apply.jpg", alt: "The Matcha with the Mayor application", line: "Students apply for Matcha with the Mayor with a topic; the team picks and invites them." },
                  { label: "Sessions", contain: true, url: "salwan-central.vercel.app/staff", src: "/embeds/salwan-central/staff-times.jpg", alt: "The admin panel scheduling five-minute conversation slots", line: "The admin panel lays out every five-minute slot and who has it." },
                  { label: "Follow up", url: "salwan-central.vercel.app/staff/follow-up", src: "/embeds/salwan-central/staff-workspace.jpg", alt: "A follow-up workspace with a recap, files and people (names blurred)", line: "Each person gets a private workspace: the recap, files and next steps." },
                  { label: "Track", url: "salwan-central.vercel.app/staff/follow-up", src: "/embeds/salwan-central/staff-followups.jpg", alt: "Every participant's workspace by program and stage (names blurred)", line: "Every participant in one database, by program and stage. Names blurred here." },
                ]}
              />
            </Rise>
          </div>
        </article>

        {/* Rung */}
        <article id="rung" aria-labelledby="rung-title" className="scroll-mt-20 bg-[#152a6b] px-[var(--m)] py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <Rise className="lg:col-span-5">
              <h3 id="rung-title" className="flex items-center gap-4 font-anton text-[clamp(2.8rem,4.4vw,4.2rem)] uppercase leading-[0.9]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset("/img/logos/rung.svg")} alt="" aria-hidden className="h-[0.75em] w-auto" />
                Rung
              </h3>
              <p className="mt-5 text-[1.125rem] leading-relaxed">
                An AI picks up the support call, verifies the caller and writes a brief, so a person calls back already knowing the
                problem. Built in 12 hours with Reid Mariotti and Conrad Spaudie; I wrote most of the code and gave the pitch.
              </p>
              <Facts
                items={[
                  { v: "2nd", l: "of 81 teams, a16z SpeedHacks" },
                  { v: "Best", l: "Use of Dial" },
                ]}
              />
              <p className="mt-6 text-[1.0625rem] leading-snug">
                Afterward, Dial, the voice platform we built on, asked to partner with us to take Rung to enterprise.
              </p>
              <div className="mt-8 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start gap-6">
                <Open href="https://www.tryrung.today">Open Rung</Open>
                <PhotoDeck
                  aspect="3/2"
                  photos={[
                    { src: "/img/academy/sh-check-team.jpg", alt: "Jadon, Reid and Conrad with the Best Use of Dial check", caption: "Best Use of Dial", pos: "45% 40%" },
                    { src: "/img/academy/sh-build-selfie.jpg", alt: "Jadon taking a selfie with his team mid-build", caption: "Mid-build" },
                    { src: "/img/academy/sh-coding.jpg", alt: "Jadon coding Rung at a laptop", caption: "Writing the code" },
                    { src: "/img/academy/sh-stage.jpg", alt: "The team on stage at SpeedHacks with the check", caption: "On stage" },
                  ]}
                />
              </div>
            </Rise>
            <Rise delay={0.06} className="lg:col-span-7">
              <CycleTabs
                items={[
                  { label: "Pick up", url: "tryrung.today", src: "/embeds/rung/hero.jpg", alt: "Rung's home page", line: "Nobody waits on hold: an AI agent answers on the first ring." },
                  { label: "Verify", url: "tryrung.today", src: "/embeds/rung/verify.jpg", alt: "Rung verifying a caller with a texted code while it writes the brief", line: "A texted code proves who's calling while Rung writes the brief." },
                  { label: "Call back", url: "tryrung.today", src: "/embeds/rung/queue.jpg", alt: "Rung's ranked callback queue", line: "The rep calls back the most urgent caller first, already briefed." },
                ]}
              />
            </Rise>
          </div>
        </article>

        {/* AcornPrep */}
        <article
          id="acornprep"
          aria-labelledby="acorn-title"
          className="scroll-mt-20 bg-[#f3eee4] px-[var(--m)] py-16 text-[#2b1d10] lg:py-20"
          style={{ "--accent": "#b4461a", "--accent-ink": "#ffffff", "--muted": "#5f4e3d" } as React.CSSProperties}
        >
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <Rise className="lg:col-span-5">
              <h3 id="acorn-title" className="flex items-center gap-4 font-anton text-[clamp(2.8rem,4.4vw,4.2rem)] uppercase leading-[0.9]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset("/img/logos/acornprep.png")} alt="" aria-hidden className="h-[0.75em] w-auto" />
                AcornPrep
              </h3>
              <p className="mt-5 text-[1.125rem] leading-relaxed">
                Digital SAT and AP practice, free to start, built with Pradyun Kanuparthi: adaptive mock tests, ten AP courses and
                Sprout, a tutor that teaches instead of giving the answer.
              </p>
              <Facts
                items={[
                  { v: "2,000+", l: "students" },
                  { v: "52,000+", l: "questions answered" },
                ]}
              />
              <div className="mt-8 grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset("/img/academy/jadon-pitch.jpg")} alt="Jadon pitching AcornPrep at Stanford" loading="lazy" className="aspect-[4/5] w-full object-cover object-[50%_25%]" />
                <p className="text-[1.0625rem] leading-snug">I pitched it at Stanford as a top-15 finalist out of 300+.</p>
              </div>
              <Open href="https://acornprep.com">Open AcornPrep</Open>
            </Rise>
            <Rise delay={0.06} className="lg:col-span-7">
              <CycleTabs
                tone="light"
                items={[
                  { label: "SAT", url: "acornprep.com", src: "/img/academy/acorn-sat.jpg", alt: "AcornPrep's home page: small steps, stronger SAT", line: "Digital SAT practice, built by students who just sat the test." },
                  { label: "Practice modes", url: "acornprep.com", src: "/img/academy/acorn-modes.jpg", alt: "Seven ways to practice, including an adaptive mock test", line: "Seven ways to practice, from an adaptive mock test to a timed question rush." },
                  { label: "AP courses", url: "acornprep.com", src: "/img/academy/acorn-ap.jpg", alt: "Ten AP courses, each with its own character", line: "Ten AP courses, each with its own character and study library." },
                  { label: "Sprout", url: "acornprep.com", src: "/img/academy/acorn-practice2.jpg", alt: "SAT and AP practice questions and Sprout the tutor", line: "Sprout gives a hint and asks a question back, never the answer." },
                ]}
              />
            </Rise>
          </div>
        </article>

        {/* Hermes */}
        <article id="hermes" aria-labelledby="hermes-title" className="scroll-mt-20 bg-[#4e6b4f] px-[var(--m)] py-16 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
            <Rise className="lg:col-span-4">
              <h3 id="hermes-title" className="font-anton text-[clamp(3rem,5vw,4.8rem)] uppercase leading-[0.9]">Hermes</h3>
              <p className="mt-6 text-[1.125rem] leading-relaxed">One club schedule for the whole school, posted to @msjclubs every weekday.</p>
              <Facts
                items={[
                  { v: "93", l: "club accounts read nightly" },
                  { v: "Daily", l: "since August" },
                ]}
              />
              <Open href="https://www.instagram.com/msjclubs/">See @msjclubs</Open>
            </Rise>
            <div className="ac-marquee-wrap overflow-hidden lg:col-span-8" aria-label="Hermes stories from September and October">
              <ul className="ac-marquee flex w-max gap-5">
                {[...HERMES, ...HERMES].map((d, k) => (
                  <li key={`${d}-${k}`} className="w-[11rem] shrink-0 md:w-[13rem]" aria-hidden={k >= HERMES.length}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={asset(`/img/academy/hermes-${d}.jpg`)} alt={`Hermes story for ${d}`} loading="lazy" className="aspect-[9/16] w-full object-cover" data-ui />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      </section>

      {/* ── 3. The smaller builds, set as one list ── */}
      <section aria-labelledby="pattern-title" className="px-[var(--m)] py-16 lg:py-24">
        <Rise>
          <h2 id="pattern-title" className="max-w-4xl font-anton text-[clamp(2.6rem,5vw,4.8rem)] uppercase leading-[0.92]">
            Every room I join, I build what it&apos;s missing
          </h2>
          <p className="mt-5 max-w-[52ch] text-[1.125rem] text-[var(--muted)]">Before the projects above, it was smaller things.</p>
        </Rise>
        <ul className="mt-12 flex flex-col gap-6">
          {SMALLER.map((r) => (
            <li key={r.tool} className="grid gap-1 text-[clamp(1.125rem,1.7vw,1.5rem)] leading-snug lg:grid-cols-[1fr_1fr_2fr] lg:gap-8">
              <span className="font-semibold">{r.tool}</span>
              <span className="text-[var(--muted)]">{r.where}</span>
              <span>{r.what}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── 4. The roles ── */}
      <section id="civic" aria-labelledby="civic-title" className="bg-[var(--surface)] px-[var(--m)] py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <Rise className="lg:col-span-4">
            <h2 id="civic-title" className="font-anton text-[clamp(2.6rem,5vw,4.8rem)] uppercase leading-[0.92]">Where I find the problems</h2>
            <p className="mt-6 text-[1.125rem] leading-relaxed">
              I chair Fremont&apos;s Youth Advisory Commission, was one of three lead interns over the Mayor&apos;s 36-person cohort,
              and serve as ASB President at Mission San Jose.
            </p>
          </Rise>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:col-span-8">
            {[
              { src: "/img/yac-chair.jpg", alt: "Jadon with the Fremont Youth Advisory Commission", cap: "Chair, Youth Advisory Commission", pos: "35% 30%" },
              { src: "/img/covers/leads.jpg", alt: "Jadon with ASB officers at a school event", cap: "ASB President", pos: "50% 30%" },
              { src: "/img/mayor-intern-leads.jpg", alt: "Jadon with Mayor Raj Salwan and the other lead interns", cap: "Lead intern, Mayor Salwan's program", pos: "8% 40%" },
            ].map((p, i) => (
              <Rise key={p.src} delay={i * 0.06}>
                <figure>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset(p.src)} alt={p.alt} loading="lazy" className="aspect-[4/5] w-full object-cover" style={{ objectPosition: p.pos }} />
                  <figcaption className="mt-3 text-[1rem]">{p.cap}</figcaption>
                </figure>
              </Rise>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Contact ── */}
      <section id="contact" aria-labelledby="contact-title" className="bg-white px-[var(--m)] py-20 text-[var(--bg)] lg:py-28">
        <h2 id="contact-title" className="text-[1.5rem] font-semibold">Want a demo of either? Write to me.</h2>
        <a
          href={`mailto:${PROFILE.email}`}
          data-cursor-hover
          className="mt-10 block break-words font-anton text-[11vw] uppercase leading-[0.95] transition-colors duration-300 hover:text-[#3f7a4c] lg:text-[7vw]"
        >
          {PROFILE.email.split("@")[0]}
          <wbr />@{PROFILE.email.split("@")[1]}
        </a>
        <div className="mt-12 flex flex-wrap gap-6 text-[1rem]">
          <a href={PROFILE.links.linkedin} target="_blank" rel="noreferrer noopener" className="underline-offset-4 hover:underline">LinkedIn</a>
          <a href={PROFILE.links.github} target="_blank" rel="noreferrer noopener" className="underline-offset-4 hover:underline">GitHub</a>
          <a href={PROFILE.links.instagram} target="_blank" rel="noreferrer noopener" className="underline-offset-4 hover:underline">Instagram</a>
        </div>
      </section>

      {/* ── Footer: the way to the full site ── */}
      <footer className="px-[var(--m)] py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <a href={FULL_SITE} className="group inline-flex items-center gap-3 text-[1.5rem] font-semibold text-[var(--accent)] md:text-[2.4rem]" data-cursor-hover>
              See the full site at jadonli.com
              <ArrowUpRight className="size-6 transition-[translate] duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden />
            </a>
            <p className="mt-2 max-w-[44ch] text-[1.125rem] text-[var(--muted)]">Research, leadership, the films and the court are all there.</p>
          </div>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-[1rem] md:col-span-5 md:col-start-8">
            {[
              ["Leadership", "/leadership/"],
              ["Research", "/research/"],
              ["Civic & films", "/civic/"],
              ["Everything I've built", "/built/"],
              ["Milestones", "/milestones/"],
              ["About", "/about/"],
            ].map(([l, h]) => (
              <li key={h}>
                <a href={`${FULL_SITE}${h}`} className="underline-offset-4 hover:underline">{l}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-14 flex justify-between text-[0.875rem] text-[var(--muted)]">
          <span>Jadon Li · Fremont, California</span>
          <a href="#top" className="underline-offset-4 hover:underline">Back to top</a>
        </div>
      </footer>
    </main>
  );
}
