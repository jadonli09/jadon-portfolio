"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useLenis } from "lenis/react";
import { ArrowDown } from "lucide-react";
import { Preloader } from "@/components/hero/Preloader";
import { asset } from "@/lib/base";
import { StorySpine } from "@/components/story/StorySpine";
import { StoryClose } from "@/components/story/StoryClose";
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
  const lenis = useLenis();

  // Returning from a deep dive (/#chapter) → scroll the reader back to that chapter.
  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash.replace("#", "") : "";
    if (!hash) return;
    const tryScroll = (attempt = 0) => {
      const el = document.getElementById(hash);
      if (el) {
        if (lenis) lenis.scrollTo(el, { offset: 0, immediate: attempt === 0, duration: 0.9 });
        else el.scrollIntoView();
      } else if (attempt < 20) {
        setTimeout(() => tryScroll(attempt + 1), 60);
      }
    };
    // wait a frame so the spine is laid out
    const t = setTimeout(() => tryScroll(), 80);
    return () => clearTimeout(t);
  }, [lenis]);

  return (
    <main className="relative w-full overflow-clip bg-[#07070a] text-[#f4f1ea]">
      <Preloader />

      {/* COLD OPEN — the Golden Gate lookout. Name slides in BEHIND the subject:
          photo (back) → ghost watermark → giant name → pixel-aligned cutout (front). */}
      <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
        {/* L0 — the scene */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset("/img/hero-bridge-v2.jpg")}
          alt="Jadon at the Golden Gate Bridge lookout"
          className="absolute inset-0 z-0 h-full w-full object-cover"
          style={{ objectPosition: "40% 32%" }}
        />

        {/* L1 — ghost watermark in the sky, like a whisper of the name */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1.4 }}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[15%] z-[1] hidden text-center font-anton leading-none tracking-tight text-white/40 [text-shadow:0_2px_18px_rgba(13,36,49,0.25)] md:block md:text-[11.5vw]"
        >
          LI_LOCKED.IN
        </motion.div>

        {/* L1.5 — soft scrim band so the name pops (sits under the name + subject) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[9%] z-[1] h-[24%] md:top-auto md:bottom-0 md:h-[38%]"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(13,36,49,0.34) 55%, rgba(13,36,49,0.42))" }}
        />

        {/* L2 — the giant name, lower third (behind the subject) */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="pointer-events-none absolute inset-x-0 top-[13%] z-[2] text-center md:inset-x-auto md:left-[47%] md:right-[2%] md:top-auto md:bottom-[6%] md:text-left"
        >
          <h1 className="font-anton leading-[0.85] tracking-tight text-white [text-shadow:0_2px_6px_rgba(13,36,49,0.45),0_10px_44px_rgba(13,36,49,0.55)]">
            <span className="block overflow-hidden whitespace-nowrap pb-[0.05em]">
              <motion.span
                className="inline-block text-[18vw] md:text-[13.5vw]"
                initial={{ y: "112%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.35, duration: 1.1, ease: EASE }}
              >
                JADON&nbsp;LI
              </motion.span>
            </span>
          </h1>
        </motion.div>

        {/* L3 — the subject, pixel-aligned over the photo (same cover + position) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset("/img/hero-cutout-v2.png")}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[3] h-full w-full object-cover"
          style={{ objectPosition: "40% 32%" }}
        />

        {/* L4 — UI: descriptors at left (inspo-style), scroll cue, soft melt into the story paper */}
        <motion.div
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9, duration: 0.9, ease: EASE }}
          className="absolute bottom-[9%] left-5 z-[4] max-w-[280px] rounded-xl border border-white/15 bg-[rgba(13,36,49,0.48)] px-4 py-3.5 backdrop-blur-md md:bottom-auto md:left-9 md:top-[38%]"
        >
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-white/90">
            {PROFILE.school}
            <br />
            {PROFILE.city} · {PROFILE.gradeNote}
          </p>
          <p className="mt-3 font-display text-lg text-white md:text-xl">
            I am a <RoleRotator />
          </p>
          <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-white/80">
            One story · seven chapters
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="absolute bottom-5 right-5 z-[4] flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-widest text-white/90 [text-shadow:0_2px_10px_rgba(13,36,49,0.5)] md:right-9"
        >
          Begin <ArrowDown className="size-3.5 animate-bounce" />
        </motion.div>

        {/* melt into the cream story paper below */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-16"
          style={{ background: "linear-gradient(to bottom, transparent, #faf5ec)" }}
        />
      </section>

      {/* THE STORY */}
      <StorySpine />

      {/* THE CLOSE */}
      <StoryClose />

      <Footer />
    </main>
  );
}
