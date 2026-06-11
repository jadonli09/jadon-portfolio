"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Magnetic } from "@/components/primitives/Magnetic";
import { asset } from "@/lib/base";
import { EASE } from "@/lib/motion";
import { BoardLabel } from "@/components/landing/BoardSurface";

type Peek = "paper" | "photo" | "stamp";
const FOLDERS: { href: string; label: string; note: string; peek: Peek; img?: string; rot: number }[] = [
  { href: "/achievements", label: "Experiences & Achievements", note: "The full archive — every award, role & project, by year", peek: "paper", rot: -1.4 },
  { href: "/albums", label: "Albums", note: "Every frame of the whole story", peek: "photo", img: "/img/ncs-champions.jpg", rot: 0.9 },
  { href: "/contact", label: "Say Hello", note: "Email · Instagram · LinkedIn · GitHub", peek: "stamp", rot: -0.7 },
];

/** The synthesis + the final doorways: three case-file folders pinned to the board. */
export function LandingClose() {
  return (
    <section id="close" className="relative scroll-mt-24 px-5 py-20 md:px-9 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7">
          <BoardLabel>Case summary</BoardLabel>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="font-display max-w-3xl text-[2.2rem] leading-[1.05] tracking-tight text-[#f4f1ea] md:text-[4rem]"
        >
          Seven doors, one direction:{" "}
          <span className="italic text-[#e8b15a]">the pursuit of happiness.</span>
        </motion.p>

        <div className="mt-16 grid gap-9 md:grid-cols-3 md:gap-8">
          {FOLDERS.map((f) => (
            <Folder key={f.href} f={f} />
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Magnetic strength={0.3}>
            <button
              onClick={() => (typeof window !== "undefined" ? window.scrollTo({ top: 0, behavior: "smooth" }) : null)}
              data-cursor-hover
              className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-[#8a8a99] transition-colors hover:text-[#f4f1ea]"
            >
              Back to the top
            </button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}

function Folder({ f }: { f: (typeof FOLDERS)[number] }) {
  return (
    <Link href={f.href} data-cursor-hover className="group relative block">
      <motion.div
        initial={false}
        animate={{ rotate: f.rot }}
        whileHover={{ rotate: 0, y: -7 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="relative pt-2.5"
      >
        {/* pin */}
        <span
          aria-hidden
          className="absolute -top-0.5 left-1/2 z-20 size-2.5 -translate-x-1/2 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
          style={{ background: "radial-gradient(circle at 35% 30%, #f0d48a, #8a6312)" }}
        />
        {/* what's peeking out of the folder */}
        {f.peek === "paper" && (
          <div
            aria-hidden
            className="absolute right-7 top-0 h-6 w-[52%] -rotate-1 bg-[#f4f1ea] shadow-[0_-2px_8px_rgba(0,0,0,0.25)] transition-transform duration-300 group-hover:-translate-y-1.5"
          >
            <div className="mx-2.5 mt-1.5 h-[2px] bg-[#c9c2b0]" />
            <div className="mx-2.5 mt-1 h-[2px] w-2/3 bg-[#d8d2c2]" />
          </div>
        )}
        {f.peek === "photo" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={asset(f.img!)}
            alt=""
            aria-hidden
            className="absolute right-7 top-0 h-7 w-[52%] rotate-[1.2deg] object-cover object-top shadow-[0_-2px_8px_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:-translate-y-1.5"
          />
        )}
        {/* tab */}
        <div className="relative ml-2 h-3.5 w-[44%] rounded-t-[5px] bg-[#c9a767]" />
        {/* body */}
        <div className="relative rounded-[0_6px_6px_6px] bg-gradient-to-b from-[#d9b97c] to-[#c19e58] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.55)] md:p-7">
          <h3 className="font-display pr-8 text-2xl leading-[1.05] text-[#3a2c10] md:text-[1.65rem]">{f.label}</h3>
          <p className="mt-3 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-[#6b5524]">{f.note}</p>
          <span className="mt-7 flex items-center gap-1.5 font-mono text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#7a6228] transition-transform duration-300 group-hover:translate-x-1.5">
            Open the file <span aria-hidden>↗</span>
          </span>
          {f.peek === "stamp" && (
            <span
              aria-hidden
              className="absolute right-5 top-5 rotate-[-8deg] rounded-[3px] border-2 border-[#a8392b]/85 px-2 py-0.5 font-mono text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[#a8392b]/90"
            >
              Case open
            </span>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
