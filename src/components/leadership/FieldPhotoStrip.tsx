"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { SlotPhoto } from "@/components/leadership/SlotPhoto";
import { Reveal } from "@/components/primitives/Reveal";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";

/**
 * A single photo card with hover-reveal caption and grayscale → color treatment.
 * Fixed aspect ratio, object-cover.
 */
function FieldPhoto({
  src,
  alt,
  caption,
  sub,
  wide = false,
}: {
  src: string;
  alt: string;
  caption: string;
  sub?: string;
  wide?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      className={`group relative flex-shrink-0 overflow-hidden border border-[rgba(212,175,106,0.18)] ${
        wide ? "w-[340px] md:w-[440px]" : "w-[240px] md:w-[300px]"
      }`}
      style={{ aspectRatio: wide ? "16/10" : "3/4" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor-hover
      whileHover={{ y: -6, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
    >
      {/* Photo — grayscale → color */}
      <motion.div
        className="absolute inset-0"
        animate={{ filter: hovered ? "grayscale(0%)" : "grayscale(70%)" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <SlotPhoto src={src} alt={alt} monogram="ASB" note="photo en route" className="object-cover" />
      </motion.div>

      {/* Bottom gradient scrim */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
        style={{
          background: "linear-gradient(to top, rgba(12,10,8,0.90) 0%, transparent 100%)",
        }}
        aria-hidden
      />

      {/* Caption block — slides up on hover */}
      <motion.div
        className="absolute inset-x-0 bottom-0 px-4 pb-4"
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: hovered ? 0 : 8, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="font-grotesk text-sm font-semibold leading-tight text-[var(--fg)]">
          {caption}
        </p>
        {sub && (
          <p className="mt-0.5 font-mono text-[0.58rem] uppercase tracking-widest text-[var(--accent)]">
            {sub}
          </p>
        )}
      </motion.div>

      {/* Gold top-left corner accent on hover */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-px w-12 bg-[var(--accent)]"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-12 w-px bg-[var(--accent)]"
        initial={{ scaleY: 0, originY: 0 }}
        animate={{ scaleY: hovered ? 1 : 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      />
    </motion.div>
  );
}

const PHOTOS: {
  src: string;
  alt: string;
  caption: string;
  sub?: string;
  wide?: boolean;
}[] = [
  {
    src: "/img/gw-06.jpg",
    alt: "Leadership II 2026–2027 — the whole class in green at the Green & White Assembly",
    caption: "Leadership II",
    sub: "2026–2027 · the whole class",
    wide: true,
  },
  {
    src: "/img/gw-01.jpg",
    alt: "Jadon on the mic at the Green & White Assembly in front of the Warrior Spirit mural",
    caption: "Green & White Assembly",
    sub: "First rally as ASB President",
  },
  {
    src: "/img/gw-04.jpg",
    alt: "Jadon running the Green & White Assembly with a microphone",
    caption: "Running the rally",
    sub: "Teacher intros · engagement · hype",
    wide: true,
  },
  {
    src: "/img/gw-02.jpg",
    alt: "The ASB officers in front of the Let's Get Hyped mural",
    caption: "The ASB Officers",
    sub: "Let's get hyped",
  },
  {
    src: "/img/asb-officers.jpg",
    alt: "ASB Officers — Mission San Jose High School",
    caption: "ASB Officers",
    sub: "Associated Student Body",
    wide: true,
  },
  {
    src: "/img/seniorbreakfast-spread.jpg",
    alt: "Seniors serving themselves at the catered Senior Breakfast buffet",
    caption: "Senior Breakfast",
    sub: "$4.8k · 500 servings",
  },
  {
    src: "/img/speaking-at-rally.jpg",
    alt: "Jadon speaking at the school rally",
    caption: "At the Rally",
    sub: "On the mic",
    wide: true,
  },
  {
    src: "/img/classofficer-junior.jpg",
    alt: "Junior class officers with the Never Second 2027 sign",
    caption: "Class Officers · 11th",
    sub: "Never second",
    wide: true,
  },
  {
    src: "/img/prom-calacademy.jpg",
    alt: "Students at prom inside the California Academy of Sciences",
    caption: "Prom @ Cal Academy",
    sub: "600+ students",
    wide: true,
  },
  {
    src: "/img/seniorbreakfast-bagels.jpg",
    alt: "Bagel towers and parfaits at the Senior Breakfast",
    caption: "The Bagel Towers",
    sub: "Senior Breakfast",
  },
  {
    src: "/img/freshmenyear-speech.jpg",
    alt: "Jadon giving his freshman-year speech in the gym",
    caption: "The First Speech",
    sub: "Freshman year",
    wide: true,
  },
  {
    src: "/img/classofficer-freshman.jpg",
    alt: "Freshman class officers in Santa hats",
    caption: "Class Officers · 9th",
    sub: "The freshman slate",
    wide: true,
  },
  {
    src: "/img/seniorbreakfast-baskets.jpg",
    alt: "Pastry baskets at the Senior Breakfast",
    caption: "Pastry Baskets",
    sub: "Senior Breakfast",
  },
  {
    src: "/img/classofficer-sophomore.jpg",
    alt: "Sophomore class officers on the rally stage",
    caption: "Class Officers · 10th",
    sub: "On the rally stage",
    wide: true,
  },
  {
    src: "/img/highschoolpanel-wide.jpg",
    alt: "High school student leadership panel — wide view",
    caption: "Student Leadership Panel",
    sub: "Interdistrict conference",
  },
  {
    src: "/img/school-fundraising1.jpg",
    alt: "School fundraising event",
    caption: "Fundraising Drive",
    sub: "Community giving",
  },
  {
    src: "/img/asb-with-other-schools.jpg",
    alt: "ASB leaders with delegates from other schools",
    caption: "ASB Inter-School Summit",
    sub: "Fremont Unified",
    wide: true,
  },
  {
    src: "/img/climbingclub-all1.jpg",
    alt: "Climbing Club — all members",
    caption: "Climbing Club",
    sub: "Co-founded",
  },
  {
    src: "/img/school-fundraising2.jpg",
    alt: "School fundraising — students volunteering",
    caption: "Community Fundraiser",
    sub: "Student-led",
  },
  {
    src: "/img/highschoolpanel-close.jpg",
    alt: "High school leadership panel — close view",
    caption: "Panel Discussion",
    sub: "Student voice",
  },
  {
    src: "/img/climbingclub-officers.jpg",
    alt: "Climbing Club officers",
    caption: "Climbing Club Officers",
    sub: "Founder",
  },
  {
    src: "/img/school-fundraising3.jpg",
    alt: "School fundraising — event day",
    caption: "Fundraiser Drive",
    sub: "MSJ Community",
  },
  {
    src: "/img/climbingclub-all2.jpg",
    alt: "Climbing Club full group photo",
    caption: "Climbing Club",
    sub: "2024–2025",
  },
];

/** Horizontal auto-scrolling photo marquee — the "in the field" section. */
export function FieldPhotoStrip() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start end", "end start"],
  });
  // Parallax: nudge the track slightly left as user scrolls down
  const trackX = useTransform(scrollYProgress, [0, 1], ["0%", "-4%"]);

  return (
    <section
      ref={trackRef}
      className="relative mt-20 overflow-hidden md:mt-32"
      aria-label="In the Field — ASB, climbing club, fundraising, and panel photos"
    >
      {/* Top gold rule */}
      <motion.div
        className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1 }}
        aria-hidden
      />

      {/* Section header */}
      <div className="relative z-10 mx-auto max-w-7xl px-5 pt-16 md:px-9 md:pt-20">
        <Reveal>
          <div className="flex items-baseline gap-6 border-b border-[var(--line)] pb-4">
            <span className="eyebrow text-[var(--accent)]">In the Field</span>
            <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
              ASB · Green & White · Events · Class Officers · Climbing · Fundraising
            </span>
          </div>
        </Reveal>

        <div className="mt-5 md:mt-6" id="field-strip-heading">
          <KineticHeadline
            as="h2"
            text="In the Field."
            className="font-anton text-[2.2rem] uppercase leading-none tracking-tight text-[var(--fg)] md:text-[4rem]"
            delay={0.05}
          />
        </div>
      </div>

      {/* Scrolling photo strip with subtle scroll-parallax offset */}
      <motion.div
        style={{ x: trackX }}
        className="mt-8 md:mt-10"
      >
        {/* Inner track — drag-scrollable overflow */}
        <div
          className="marquee-track"
          style={{ animationDuration: "100s" }}
          aria-label="Photo strip — ASB, climbing club, fundraising, panels"
        >
          {[...PHOTOS, ...PHOTOS].map((p, i) => (
            <span key={i} className="mx-1.5 inline-flex md:mx-2">
              <FieldPhoto
                src={p.src}
                alt={p.alt}
                caption={p.caption}
                sub={p.sub}
                wide={p.wide}
              />
            </span>
          ))}
        </div>
      </motion.div>

      {/* Fade edges */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 md:w-32"
        style={{ background: "linear-gradient(to right, var(--bg) 0%, transparent 100%)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 md:w-32"
        style={{ background: "linear-gradient(to left, var(--bg) 0%, transparent 100%)" }}
        aria-hidden
      />

      {/* Bottom hint */}
      <Reveal delay={0.2}>
        <p className="mx-auto mt-6 max-w-7xl px-5 pb-10 font-mono text-[0.6rem] uppercase tracking-[0.28em] text-[var(--muted)] md:px-9 md:pb-14">
          Class President three years running · ASB President 2026–2027 · Climbing Club Founder
        </p>
      </Reveal>

      {/* Bottom gold rule */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, delay: 0.15 }}
        aria-hidden
      />
    </section>
  );
}
