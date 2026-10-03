"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Photo } from "@/components/primitives/Photo";
import { ABOUT } from "@/lib/data";
import { EASE } from "@/lib/motion";
import { LoopArrow, Thread } from "@/components/about/Doodles";

/**
 * The sky desk — five drone prints taped down at angles, with the
 * camera-gear progression drawn underneath as a hand-annotated timeline.
 */

const DRONE_SHOTS = [
  "/img/droneshot1.jpg",
  "/img/droneshot2.jpg",
  "/img/droneshot3.jpg",
  "/img/droneshot4.jpg",
  "/img/droneshot5.jpg",
] as const;

const ROTATIONS = [-2.5, 1.8, -1.2, 2.4, -1.8];

export function SkySection() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="relative border-y border-[var(--line)] bg-[var(--bg-2)]">
      {/* wandering orange thread across the section top */}
      <Thread className="absolute -top-10 left-0 hidden w-full md:block" />

      <div className="mx-auto max-w-6xl px-5 py-20 md:px-9 md:py-28">
        <div className="mb-12 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <h2 className="font-anton text-4xl uppercase leading-[0.95] tracking-tight md:text-6xl">
              Eyes in the sky<span className="text-[var(--accent)]">.</span>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--muted)]">
              Filming since he was a kid on his mom&apos;s iPhone 6 — now an FAA-approved
              pilot flying <span className="marker text-[var(--fg)]">the areas he could only see when he dreamed to fly</span>,
              and an editor who cuts a city podcast and campaign films after school.
            </p>
          </div>
          <p className="font-hand max-w-[16rem] rotate-[1.5deg] text-2xl leading-tight text-[var(--muted)]">
            every print here was shot from a drone he saved up for
          </p>
        </div>

        {/* taped prints — scrollable strip on mobile, spread on desktop */}
        <div className="flex gap-5 overflow-x-auto pb-6 md:grid md:grid-cols-5 md:overflow-visible">
          {DRONE_SHOTS.map((src, i) => (
            <motion.figure
              key={src}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ rotate: 0, scale: 1.04, zIndex: 5 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.65, ease: EASE, delay: i * 0.08 }}
              style={{ rotate: ROTATIONS[i] }}
              className="polaroid relative w-44 shrink-0 p-2 pb-6 md:w-auto"
              data-cursor-hover
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <span className="tape -top-2.5 left-1/2 w-12 -translate-x-1/2 rotate-[3deg]" />
              <div className="overflow-hidden" style={{ aspectRatio: "4 / 3" }}>
                <Photo
                  src={src}
                  alt={`Drone photograph ${i + 1}`}
                  className={[
                    "h-full w-full object-cover transition-[filter] duration-500",
                    active === i ? "grayscale-0" : "grayscale",
                  ].join(" ")}
                />
              </div>
            </motion.figure>
          ))}
        </div>

        {/* gear progression — hand-annotated timeline */}
        <div className="mt-14">
          <div className="flex items-center gap-3">
            <h3 className="font-anton text-2xl uppercase tracking-tight md:text-3xl">
              Gear progression
            </h3>
            <LoopArrow className="w-14 rotate-90" delay={0.3} />
          </div>
          <div className="mt-8 grid grid-cols-2 gap-y-8 sm:grid-cols-4">
            {ABOUT.gear.map((g, i) => (
              <motion.div
                key={g.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ duration: 0.55, ease: EASE, delay: i * 0.1 }}
                className="relative pr-6"
              >
                {/* hand-dashed connector */}
                {i < ABOUT.gear.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute right-0 top-1 hidden w-6 border-t-2 border-dashed border-[var(--muted)] sm:block"
                  />
                )}
                <span
                  aria-hidden
                  className="block h-2.5 w-2.5"
                  style={{ background: i === ABOUT.gear.length - 1 ? "var(--accent)" : "var(--fg)" }}
                />
                <p className="mt-3 font-anton text-lg uppercase leading-none tracking-tight">{g.name}</p>
                <p className="font-hand mt-1.5 text-lg leading-tight text-[var(--muted)]">{g.note}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
