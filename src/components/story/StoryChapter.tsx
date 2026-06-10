"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import type { Chapter } from "@/lib/data";
import { Photo } from "@/components/primitives/Photo";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { Magnetic } from "@/components/primitives/Magnetic";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * One beat of the story. Alternating image / narrative, with a parallax image and
 * a "dig deeper" doorway into the matching world. Reads as a connected chapter,
 * not a standalone page.
 */
export function StoryChapter({ chapter, index }: { chapter: Chapter; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const flip = index % 2 === 1;

  return (
    <section
      ref={ref}
      id={chapter.id}
      data-chapter={chapter.id}
      className="relative scroll-mt-24 py-14 md:py-20"
    >
      <div
        className={cn(
          "mx-auto grid w-full max-w-6xl items-center gap-10 px-5 md:grid-cols-2 md:gap-16 md:px-9",
          flip && "md:[&>*:first-child]:order-2",
        )}
      >
        {/* IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 1, ease: EASE }}
          className="relative aspect-[3/2] overflow-hidden rounded-sm border border-[var(--line)] bg-[var(--bg-2)] shadow-[0_18px_50px_rgba(32,26,18,0.12)]"
          data-cursor-hover
        >
          {chapter.fit === "contain" ? (
            <div className="absolute inset-0 p-1">
              <Photo src={chapter.image} alt={chapter.kicker} className="h-full w-full object-contain" />
            </div>
          ) : (
            <motion.div style={{ y: imgY }} className="absolute inset-[-6%]">
              <Photo
                src={chapter.image}
                alt={chapter.kicker}
                className="h-full w-full object-cover"
                style={{ objectPosition: chapter.position ?? "center" }}
              />
            </motion.div>
          )}
          {/* accent scrim — lighter on contain shots so the full photo reads */}
          <div
            className="pointer-events-none absolute inset-0 mix-blend-multiply"
            style={{ background: `linear-gradient(160deg, transparent 45%, ${chapter.accent}${chapter.fit === "contain" ? "22" : "40"})` }}
          />
          <div className="pointer-events-none absolute inset-0" style={{ boxShadow: `inset 0 0 0 1px ${chapter.accent}33` }} />
          {/* chapter index, big, riding the image corner */}
          <span
            className="absolute left-4 top-3 font-anton text-5xl leading-none md:text-7xl"
            style={{ color: chapter.accent, opacity: 0.92 }}
          >
            {chapter.num}
          </span>
        </motion.div>

        {/* NARRATIVE */}
        <div className={cn("relative", flip && "md:order-1")}>
          <div className="mb-5 flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.3em]" style={{ color: chapter.accent }}>
              {chapter.kicker}
            </span>
            <span className="h-px flex-1" style={{ background: `${chapter.accent}33` }} />
          </div>

          <KineticHeadline
            as="h2"
            text={chapter.headline}
            className="font-display text-[2.4rem] leading-[1.02] tracking-tight md:text-[4rem]"
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12% 0px" }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
            className="mt-6 max-w-md text-base leading-relaxed text-[var(--muted)] md:text-lg"
          >
            {chapter.lede}
          </motion.p>

          {chapter.stat && (
            <div className="mt-8 flex items-baseline gap-3">
              <span className="font-anton text-4xl leading-none md:text-5xl" style={{ color: chapter.accent }}>
                {chapter.stat.value}
              </span>
              <span className="font-mono text-[0.65rem] uppercase tracking-widest text-[var(--muted)]">
                {chapter.stat.label}
              </span>
            </div>
          )}

          <Magnetic strength={0.35} className="mt-9 inline-block">
            <Link
              href={chapter.href}
              data-cursor-hover
              className="group inline-flex items-center gap-3 rounded-full border px-6 py-3 font-mono text-xs uppercase tracking-widest transition-colors"
              style={{ borderColor: `${chapter.accent}66`, color: chapter.accent }}
            >
              {chapter.cta}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
