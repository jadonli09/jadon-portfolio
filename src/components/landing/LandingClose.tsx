"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { asset } from "@/lib/base";
import { EASE } from "@/lib/motion";

/** The last three doors, printed as smaller "LOCKED IN" covers to match the hero stack. */
const COVERS: { href: string; title: string; note: string; img: string; pos: string; color: string; accent: string }[] = [
  { href: "/achievements", title: "Achievements", note: "Every award, role, and project, by year.", img: "/img/ironchef-win.jpg", pos: "50% 30%", color: "#d9a83f", accent: "#b07c1e" },
  { href: "/albums", title: "Albums", note: "The court, the podium, the lab, the climb, and a 45-selfie match cut.", img: "/img/ny-01.jpg", pos: "50% 55%", color: "#7c89e8", accent: "#4f5fd6" },
  { href: "/contact", title: "Say hello", note: "Email, Instagram, LinkedIn, or GitHub.", img: "/img/headshot1.jpg", pos: "14% 30%", color: "#e8689c", accent: "#d23f7c" },
];

/** The final doorways, printed as three more covers. */
export function LandingClose() {
  return (
    <section id="close" className="relative scroll-mt-24 px-5 pb-16 pt-16 md:px-9 md:pb-20 md:pt-20">
      <div className="mx-auto max-w-[1360px]">
        <div className="grid gap-8 sm:grid-cols-3 md:gap-7">
          {COVERS.map((c, i) => (
            <Cover key={c.href} c={c} i={i} />
          ))}
        </div>

      </div>
    </section>
  );
}

function Cover({ c, i }: { c: (typeof COVERS)[number]; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ delay: i * 0.08, duration: 0.9, ease: EASE }}
    >
      <Link
        href={c.href}
        data-cursor-hover
        className="group relative block aspect-[3/4] overflow-hidden rounded-[3px] bg-black shadow-[0_24px_60px_rgba(0,0,0,0.55)] transition-[translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2"
        style={{ containerType: "inline-size" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset(c.img)}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-[scale] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          style={{ objectPosition: c.pos }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.32), transparent 30%, transparent 50%, rgba(0,0,0,0.85))" }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 top-[2.6cqw] text-center font-anton text-[23.5cqw] leading-[0.9] tracking-[-0.005em]"
          style={{ color: c.color }}
        >
          LOCKED IN
        </div>
        <div className="absolute inset-x-[6cqw] bottom-[6cqw] text-white">
          <h3 className="font-anton text-[12cqw] uppercase leading-[0.95]">{c.title}</h3>
          <p className="mt-[2cqw] text-balance text-[max(15px,4.6cqw)] leading-snug text-white/90">{c.note}</p>
          <span
            className="mt-[4cqw] inline-flex h-12 items-center rounded-full px-5 text-base font-semibold text-white"
            style={{ background: c.accent }}
          >
            Open →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
