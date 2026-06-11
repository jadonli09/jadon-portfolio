import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { World } from "@/components/chrome/World";
import { Reveal } from "@/components/primitives/Reveal";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { Marquee } from "@/components/primitives/Marquee";
import { ContactSpotlight } from "@/components/contact/ContactSpotlight";
import { EmailCopy } from "@/components/contact/EmailCopy";
import { MailtoComposer } from "@/components/contact/MailtoComposer";
import { Channels } from "@/components/contact/Channels";
import { PROFILE, WORLDS } from "@/lib/data";

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
  const idx = WORLDS.findIndex((w) => w.id === "contact");
  const next = idx >= 0 ? WORLDS[(idx + 1) % WORLDS.length] : WORLDS[0];

  return (
    <World id="contact">
      {/* ── ONE FRAME — everything on a single viewport ──────────── */}
      <section className="relative flex min-h-[100svh] flex-col overflow-hidden px-5 pt-[4.5rem] md:h-[100svh] md:px-9 md:pt-24">
        {/* Cursor-tracking spotlight */}
        <ContactSpotlight />

        {/* ── MAIN: hero + composer ──────────────────────────────── */}
        <div className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 content-center gap-6 py-4 md:min-h-0 md:py-6 md:grid-cols-12 md:items-center md:gap-10">
          {/* Corner accent lines — end-credits frame around the main area */}
          <span
            aria-hidden
            className="pointer-events-none absolute -left-1 top-2 h-12 w-px"
            style={{ background: "linear-gradient(180deg, var(--accent) 0%, transparent 100%)" }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -left-1 top-2 h-px w-12"
            style={{ background: "linear-gradient(90deg, var(--accent) 0%, transparent 100%)" }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -right-1 bottom-2 h-12 w-px"
            style={{ background: "linear-gradient(0deg, var(--accent) 0%, transparent 100%)" }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -right-1 bottom-2 h-px w-12"
            style={{ background: "linear-gradient(270deg, var(--accent) 0%, transparent 100%)" }}
          />

          {/* Left — cinematic hero */}
          <div className="md:col-span-7">
            <Reveal>
              <p className="eyebrow">Let&apos;s build something</p>
            </Reveal>

            <KineticHeadline
              as="h1"
              text="Say hello."
              delay={0.05}
              className="mt-2 font-anton md:mt-3 leading-[0.9] tracking-tighter text-[clamp(2.8rem,min(13vh,9.5vw),7.5rem)]"
            />

            <Reveal delay={0.3} className="mt-4 max-w-xl md:mt-5">
              <p className="font-serif-i text-base italic leading-snug text-[var(--muted)] md:text-xl">
                Civic storyteller · bio researcher · builder · student leader.
                <span
                  className="mt-1.5 block not-italic font-mono text-[0.66rem] uppercase tracking-widest"
                  style={{ color: "var(--accent)" }}
                >
                  Mission San Jose · Fremont, CA · Class of 2027
                </span>
              </p>
            </Reveal>

            {/* Email copy affordance — the primary action */}
            <Reveal delay={0.45} className="mt-5 md:mt-7">
              <EmailCopy />
            </Reveal>
          </div>

          {/* Right — mailto composer card */}
          <Reveal delay={0.25} className="md:col-span-5">
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg-2)]/70 p-4 backdrop-blur-sm md:p-6">
              <h2 className="font-display text-xl leading-tight tracking-tight md:text-2xl">
                Have something{" "}
                <span className="italic" style={{ color: "var(--accent)" }}>
                  specific
                </span>{" "}
                in mind?
              </h2>
              <div className="mt-3 md:mt-4">
                <MailtoComposer />
              </div>
            </div>
          </Reveal>
        </div>

        {/* ── MARQUEE DIVIDER (full bleed) ───────────────────────── */}
        <div className="relative z-10 -mx-5 md:-mx-9">
          <div
            className="border-y border-[var(--line)] py-1.5 font-display text-sm text-[var(--muted)] md:py-2.5 md:text-lg"
            style={{ background: "var(--bg-2)" }}
          >
            <Marquee items={MARQUEE_ITEMS} sep="✦" durationSec={38} />
          </div>

          {/* ── CHANNELS STRIP ───────────────────────────────────── */}
          <Channels />

          {/* ── SIGN-OFF BAR ─────────────────────────────────────── */}
          <div className="flex min-h-[3rem] items-center md:min-h-[4.5rem] justify-between gap-4 border-t border-[var(--line)] py-3 pl-40 pr-5 md:pl-48 md:pr-9">
            <p className="hidden font-mono text-[0.6rem] uppercase tracking-[0.25em] text-[var(--muted)] sm:block">
              © 2026 — {PROFILE.school} · Fremont, CA
            </p>
            <p
              className="hidden truncate font-serif-i text-sm italic lg:block"
              style={{ color: "var(--accent-2)" }}
            >
              {PROFILE.links.instagramHandle} — Documenting the grind.
            </p>
            <Link
              href={next.href}
              data-cursor-hover
              className="group inline-flex shrink-0 items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
            >
              Next — {next.title}
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </World>
  );
}
