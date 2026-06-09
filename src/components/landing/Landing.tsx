"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown } from "lucide-react";
import { HeroStage } from "@/components/hero/HeroStage";
import { Preloader } from "@/components/hero/Preloader";
import { WorldIndex } from "./WorldIndex";
import { Marquee } from "@/components/primitives/Marquee";
import { Footer } from "@/components/chrome/Footer";
import { PROFILE } from "@/lib/data";
import { EASE } from "@/lib/motion";

const ROLES = PROFILE.roles;

function RoleRotator() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % ROLES.length), 2200);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="relative inline-block h-[1.15em] w-[8.5em] overflow-hidden align-top text-left">
      {ROLES.map((r, idx) => (
        <motion.span
          key={r}
          className="absolute left-0 top-0 text-[var(--accent)]"
          initial={false}
          animate={{ y: idx === i ? "0%" : idx < i ? "-110%" : "110%", opacity: idx === i ? 1 : 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {r}.
        </motion.span>
      ))}
    </span>
  );
}

export function Landing() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 160]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  const stats = [
    "NCS Champions 2026",
    "500+ AcornPrep users",
    "USABO Honorable Mention",
    "$35M+ Car Meet",
    "13,000 MCQs practiced",
    "SAT 1530",
    "Mayor's videographer",
    "ASB President",
  ];

  return (
    <main className="relative w-full overflow-clip bg-[#07070a] text-[#f4f1ea]">
      <Preloader />

      {/* HERO */}
      <section className="relative flex h-[100svh] min-h-[640px] w-full flex-col justify-end overflow-hidden">
        <HeroStage />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 px-5 pb-[14vh] md:px-9">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.9, ease: EASE }}
            className="eyebrow mb-5"
          >
            {PROFILE.school} · {PROFILE.city} · {PROFILE.gradeNote}
          </motion.p>

          <h1 className="font-anton leading-[0.82] tracking-tight">
            <span className="block overflow-hidden">
              <motion.span className="block text-[22vw] md:text-[16vw]" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: 0.3, duration: 1, ease: EASE }}>
                JADON
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                className="block bg-gradient-to-r from-[#e8b15a] via-[#f4f1ea] to-[#d9603f] bg-clip-text text-[22vw] text-transparent md:text-[16vw]"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.42, duration: 1, ease: EASE }}
              >
                LI
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 1 }}
            className="mt-6 max-w-xl font-display text-lg text-[#cfc9bd] md:text-2xl"
          >
            I am a <RoleRotator />
            <span className="mt-1 block text-[#8a8a99]">{PROFILE.tagline}</span>
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="absolute bottom-6 right-5 z-10 flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-widest text-[#8a8a99] md:right-9"
        >
          Scroll <ArrowDown className="size-3.5 animate-bounce" />
        </motion.div>
      </section>

      {/* STAT MARQUEE */}
      <div className="relative z-10 border-y border-white/10 bg-[#0a0a0f] py-4 font-display text-xl text-[#cfc9bd] md:py-6 md:text-3xl">
        <Marquee items={stats} durationSec={34} sep="✦" />
      </div>

      <WorldIndex />

      <Footer />
    </main>
  );
}
