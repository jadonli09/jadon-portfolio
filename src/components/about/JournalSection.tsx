"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Photo } from "@/components/primitives/Photo";
import { EASE } from "@/lib/motion";
import { LoopArrow, Sparkle } from "@/components/about/Doodles";

/**
 * The journal page — a ruled-paper card that stays private until you hover
 * (the entries blur out like a closed diary), beside the three favorite
 * books standing on a hand-drawn shelf with their real covers.
 */

type Book = {
  title: string;
  author: string;
  covers: { src: string; alt: string }[]; // two covers = a fanned pair
  note: string;
  lean: number; // resting tilt on the shelf
};

const FAVORITES: Book[] = [
  {
    title: "The Three-Body Problem",
    author: "Liu Cixin",
    covers: [{ src: "/img/books/three-body.jpg", alt: "The Three-Body Problem — cover" }],
    note: "no. 1",
    lean: -3,
  },
  {
    title: "Sunrise on the Reaping",
    author: "Suzanne Collins",
    covers: [{ src: "/img/books/sunrise-reaping.jpg", alt: "Sunrise on the Reaping — cover" }],
    note: "no. 2",
    lean: 2,
  },
  {
    title: "The Circle & The Every",
    author: "Dave Eggers",
    covers: [
      { src: "/img/books/the-circle.jpg", alt: "The Circle — cover" },
      { src: "/img/books/the-every.jpg", alt: "The Every — cover" },
    ],
    note: "no. 3 — a double",
    lean: -2,
  },
];

/** One book (or fanned pair) standing on the shelf — lifts when picked up. */
function ShelfBook({ book, index }: { book: Book; index: number }) {
  const pair = book.covers.length > 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: -34, rotate: book.lean * 2 }}
      whileInView={{ opacity: 1, y: 0, rotate: book.lean }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.15 + index * 0.16 }}
      whileHover="lifted"
      className="group relative flex flex-col items-center"
      data-cursor-hover
    >
      {/* number sticker */}
      <span className="absolute -top-3 left-1/2 z-10 flex h-6 w-6 -translate-x-1/2 items-center justify-center bg-[var(--accent)] font-mono text-[0.6rem] text-white shadow-[2px_2px_0_rgba(23,21,17,0.25)]">
        {index + 1}
      </span>

      <motion.div
        variants={{ lifted: { y: -12, rotate: 0, scale: 1.04 } }}
        transition={{ duration: 0.35, ease: EASE }}
        className="relative"
      >
        {/* back cover of a fanned pair */}
        {pair && (
          <motion.div
            variants={{ lifted: { rotate: 9, x: 16 } }}
            transition={{ duration: 0.35, ease: EASE }}
            className="absolute inset-0 origin-bottom-left rotate-[5deg]"
          >
            <Photo
              src={book.covers[1].src}
              alt={book.covers[1].alt}
              className="h-full w-full border border-[rgba(23,21,17,0.25)] object-cover shadow-[4px_5px_0_rgba(23,21,17,0.16)]"
            />
          </motion.div>
        )}
        <div className="relative w-24 sm:w-28" style={{ aspectRatio: "2 / 3" }}>
          <Photo
            src={book.covers[0].src}
            alt={book.covers[0].alt}
            className="h-full w-full border border-[rgba(23,21,17,0.25)] object-cover shadow-[4px_5px_0_rgba(23,21,17,0.16)] transition-shadow duration-300 group-hover:shadow-[7px_9px_0_color-mix(in_srgb,var(--accent)_45%,transparent)]"
          />
        </div>
      </motion.div>

      {/* caption */}
      <p className="mt-4 max-w-[8.5rem] text-center font-anton text-sm uppercase leading-tight tracking-tight">
        {book.title}
      </p>
      <p className="mt-1 font-mono text-[0.52rem] uppercase tracking-widest text-[var(--muted)]">
        {book.author}
      </p>
      <p className="font-hand mt-1 text-lg leading-none text-[var(--accent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {book.note}
      </p>
    </motion.div>
  );
}

export function JournalSection() {
  /* hover reveals the journal; click/focus covers touch + keyboard */
  const [peek, setPeek] = useState(false);

  return (
    <section>
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-9 md:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.55fr_0.45fr] lg:items-start">
          {/* ── the private journal — blurred until hovered ── */}
          <motion.div
            initial={{ opacity: 0, y: 26, rotate: 0 }}
            whileInView={{ opacity: 1, y: 0, rotate: -0.8 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="polaroid relative cursor-pointer p-8 md:p-10"
            style={{
              backgroundImage:
                "repeating-linear-gradient(transparent, transparent 27px, rgba(23,21,17,0.08) 28px)",
            }}
            data-cursor-hover
            tabIndex={0}
            role="button"
            aria-expanded={peek}
            aria-label="The journal — hover or press to peek inside"
            onMouseEnter={() => setPeek(true)}
            onMouseLeave={() => setPeek(false)}
            onFocus={() => setPeek(true)}
            onBlur={() => setPeek(false)}
            onClick={() => setPeek((p) => !p)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setPeek((p) => !p);
              }
            }}
          >
            <span className="tape -top-3 left-8 rotate-[-5deg]" />
            <span className="tape -top-3 right-8 rotate-[4deg]" />

            <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[var(--accent)]">
              The journal · since 8th grade
            </p>

            {/* the entries — private until hovered */}
            <motion.div
              animate={{
                filter: peek ? "blur(0px)" : "blur(7px)",
                opacity: peek ? 1 : 0.55,
              }}
              transition={{ duration: 0.45, ease: EASE }}
              aria-hidden={!peek}
            >
              <p className="font-hand mt-5 text-3xl leading-snug text-[var(--fg)] md:text-4xl">
                &ldquo;At first just summarising events — then releasing the truth and going deeper.&rdquo;
              </p>
              <p className="mt-6 text-sm leading-relaxed text-[var(--muted)]">
                At least one entry a month: trivial events, motivations, purpose, feelings.
                Every Mission Peak climb, every season, every loss worth keeping.
              </p>
            </motion.div>

            {/* the "it's private" hint — fades out on reveal */}
            <motion.p
              animate={{ opacity: peek ? 0 : 1, y: peek ? 6 : 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              aria-hidden={peek}
              className="font-hand pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 rotate-[-2deg] text-center text-3xl text-[var(--fg)]"
            >
              it&apos;s a journal — that means private.
              <br />
              <span className="text-2xl text-[var(--accent)]">(ok fine, hover to peek)</span>
            </motion.p>
          </motion.div>

          {/* ── the favorites shelf ── */}
          <div>
            <div className="flex items-center gap-3">
              <h3 className="font-anton text-2xl uppercase tracking-tight md:text-3xl">On the shelf</h3>
              <LoopArrow className="w-12 -scale-y-100 rotate-180" delay={0.3} />
            </div>
            <p className="font-hand mt-2 rotate-[-1deg] text-2xl text-[var(--muted)]">
              the all-time top 3 — pick one up
            </p>

            <div className="relative mt-12">
              <div className="flex items-start justify-between gap-3 px-1 sm:justify-start sm:gap-10">
                {FAVORITES.map((b, i) => (
                  <ShelfBook key={b.title} book={b} index={i} />
                ))}
              </div>

              {/* the hand-drawn shelf the covers stand on (covers are aspect 2:3) */}
              <svg
                aria-hidden
                viewBox="0 0 420 18"
                className="absolute left-0 top-[143px] w-full max-w-md overflow-visible sm:top-[167px]"
              >
                <motion.path
                  d="M4 8 C 80 5, 180 10, 270 7 S 400 9, 416 7 M10 8 L14 16 M404 7 L410 16"
                  fill="none"
                  stroke="var(--fg)"
                  strokeWidth={2.6}
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 1, ease: "easeInOut", delay: 0.1 }}
                />
              </svg>
            </div>

            <div className="mt-8 flex items-start gap-2">
              <Sparkle className="mt-1 w-5 shrink-0" delay={0.6} />
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.24em] leading-relaxed text-[var(--muted)]">
                Real covers, real rereads — the Eggers pair counts as one obsession.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
