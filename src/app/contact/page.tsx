import type { Metadata } from "next";
import { World } from "@/components/chrome/World";
import { Footer } from "@/components/chrome/Footer";
import { Reveal } from "@/components/primitives/Reveal";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { Magnetic } from "@/components/primitives/Magnetic";
import { Marquee } from "@/components/primitives/Marquee";
import { ContactSpotlight } from "@/components/contact/ContactSpotlight";
import { EmailCopy } from "@/components/contact/EmailCopy";
import { MailtoComposer } from "@/components/contact/MailtoComposer";
import { Channels } from "@/components/contact/Channels";
import { PROFILE } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach Jadon Li — builder, civic storyteller, researcher, and student leader based in Fremont, CA.",
};

const MARQUEE_ITEMS = [
  "Say hello",
  "Let's build something",
  "Open to collabs",
  "Mission San Jose · Fremont CA",
  "li_locked.in",
  "NCS Champions 2026",
  "500+ AcornPrep users",
  "ASB President",
];

export default function ContactPage() {
  return (
    <World id="contact">
      {/* ── 1. CINEMATIC HERO CLOSE ──────────────────────────────── */}
      <section className="relative flex min-h-[90svh] flex-col justify-center overflow-hidden px-5 pt-36 pb-20 md:px-9 md:pt-48 md:pb-28">
        {/* Cursor-tracking spotlight */}
        <ContactSpotlight />

        {/* Corner accent lines — art direction: end-credits frame */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-5 top-20 h-14 w-px md:left-9"
          style={{ background: "linear-gradient(180deg, var(--accent) 0%, transparent 100%)" }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute left-5 top-20 h-px w-14 md:left-9"
          style={{ background: "linear-gradient(90deg, var(--accent) 0%, transparent 100%)" }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-20 right-5 h-14 w-px md:right-9"
          style={{ background: "linear-gradient(0deg, var(--accent) 0%, transparent 100%)" }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-20 right-5 h-px w-14 md:right-9"
          style={{ background: "linear-gradient(270deg, var(--accent) 0%, transparent 100%)" }}
        />

        <div className="relative z-10 mx-auto w-full max-w-5xl">
          <Reveal>
            <p className="eyebrow">Let&apos;s build something</p>
          </Reveal>

          {/* Big kinetic headline */}
          <KineticHeadline
            as="h1"
            text="Say hello."
            delay={0.05}
            className="mt-5 font-anton display-xl leading-[0.88] tracking-tighter"
          />

          {/* Subhead — editorial italic */}
          <Reveal delay={0.3} className="mt-8 max-w-xl">
            <p className="font-serif-i text-xl italic leading-snug text-[var(--muted)] md:text-2xl">
              Civic storyteller · bio researcher · builder · student leader.
              <span
                className="mt-2 block not-italic font-mono text-[0.72rem] uppercase tracking-widest"
                style={{ color: "var(--accent)" }}
              >
                Mission San Jose · Fremont, CA · Class of 2027
              </span>
            </p>
          </Reveal>

          {/* Email copy affordance — the primary hero action */}
          <Reveal delay={0.45} className="mt-12">
            <EmailCopy />
          </Reveal>

          {/* Scroll nudge */}
          <Reveal delay={0.6} className="mt-16 flex items-center gap-3">
            <div
              aria-hidden
              className="h-px flex-1 max-w-[5rem]"
              style={{
                background:
                  "linear-gradient(90deg, var(--accent) 0%, transparent 100%)",
              }}
            />
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-[var(--muted)]">
              or pick a channel below
            </span>
          </Reveal>
        </div>
      </section>

      {/* ── 2. MARQUEE DIVIDER ───────────────────────────────────── */}
      <div
        className="relative border-y border-[var(--line)] py-4 font-display text-lg text-[var(--muted)] md:py-5 md:text-2xl"
        style={{ background: "var(--bg-2)" }}
      >
        <Marquee items={MARQUEE_ITEMS} sep="✦" durationSec={38} />
      </div>

      {/* ── 3. CHANNELS ──────────────────────────────────────────── */}
      <Channels />

      {/* ── 4. MAILTO COMPOSER ───────────────────────────────────── */}
      <section
        className="border-y border-[var(--line)]"
        style={{ background: "var(--bg-2)" }}
      >
        <div className="mx-auto max-w-5xl px-5 py-20 md:px-9 md:py-28">
          <div className="grid gap-16 md:grid-cols-2 md:gap-12 lg:gap-20">
            {/* Left — editorial copy */}
            <div>
              <Reveal>
                <h2 className="font-display text-3xl leading-tight tracking-tight md:text-4xl lg:text-5xl">
                  Have something{" "}
                  <span
                    className="italic"
                    style={{ color: "var(--accent)" }}
                  >
                    specific
                  </span>{" "}
                  in mind?
                </h2>
              </Reveal>
              <Reveal delay={0.1} className="mt-5 max-w-sm">
                <p className="leading-relaxed text-[var(--muted)]">
                  Pick a topic and I&apos;ll get your mail app open with a
                  head-start. No forms, no fuss — just a direct line.
                </p>
              </Reveal>

              {/* Location / sign-off */}
              <Reveal delay={0.2} className="mt-10">
                <div
                  className="inline-block rounded-full border px-5 py-2.5 font-mono text-[0.68rem] uppercase tracking-widest text-[var(--muted)]"
                  style={{ borderColor: "var(--line)" }}
                >
                  {PROFILE.school} · Fremont, CA
                </div>
              </Reveal>
            </div>

            {/* Right — composer */}
            <Reveal delay={0.15}>
              <MailtoComposer />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 5. SIGN-OFF ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-5 py-24 text-center md:px-9 md:py-36">
        <Reveal>
          <p className="eyebrow mb-6">{PROFILE.links.instagramHandle}</p>
        </Reveal>

        {/* Big editorial quote */}
        <KineticHeadline
          as="h2"
          text="Documenting the grind."
          delay={0.08}
          className="font-display text-[2.2rem] leading-[1.05] tracking-tight md:text-[4.2rem]"
        />

        <Reveal delay={0.28} className="mt-6">
          <p
            className="font-serif-i text-xl italic"
            style={{ color: "var(--accent-2)" }}
          >
            {PROFILE.tagline}
          </p>
        </Reveal>

        {/* Magnetic social pill cluster */}
        <Reveal delay={0.4} className="mt-12 flex flex-wrap justify-center gap-4">
          {[
            {
              label: PROFILE.links.instagramHandle,
              href: PROFILE.links.instagram,
            },
            { label: `github/${PROFILE.links.githubUser}`, href: PROFILE.links.github },
            { label: "LinkedIn", href: PROFILE.links.linkedin },
          ].map((l) => (
            <Magnetic key={l.label} strength={0.35} className="inline-block">
              <a
                href={l.href}
                target="_blank"
                rel="noreferrer"
                data-cursor-hover
                className="group inline-flex items-center gap-1.5 rounded-full border px-5 py-2.5 font-mono text-[0.68rem] uppercase tracking-widest text-[var(--muted)] transition-colors duration-300 hover:border-[var(--accent)]/60 hover:text-[var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                style={{ borderColor: "var(--line)" }}
              >
                {l.label}
              </a>
            </Magnetic>
          ))}
        </Reveal>

        {/* Decorative ember lines */}
        <Reveal delay={0.55} className="mt-14 flex justify-center gap-3">
          <div
            aria-hidden
            className="h-px w-20"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--accent))",
            }}
          />
          <div
            aria-hidden
            className="h-px w-20"
            style={{
              background:
                "linear-gradient(90deg, var(--accent-2), transparent)",
            }}
          />
        </Reveal>
      </section>

      {/* ── 6. FOOTER ────────────────────────────────────────────── */}
      <Footer current="contact" />
    </World>
  );
}
