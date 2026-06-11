"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { PINBOARD, PIN_LETTER_TEXT, type PinItem } from "@/lib/data";
import { asset } from "@/lib/base";
import { cn } from "@/lib/cn";

/**
 * The record, pinned: a dense overlapping collage of achievements in physical
 * styles (polaroids, plaques, seals, tickets, notes, newsprint…). Hover lifts
 * an object above its neighbours and reveals where it links. Desktop is an
 * absolutely-placed board; mobile reflows into a tight 2-column collage.
 */
export function Pinboard() {
  return (
    <section id="record" className="relative scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-9">
        <p className="eyebrow mb-3 text-center text-[#e8b15a]">The record · pinned</p>
        <h2 className="font-display mx-auto mb-12 max-w-xl text-center text-2xl leading-snug text-[#f4f1ea] md:text-3xl">
          Everything below links somewhere. Pull a pin.
        </h2>

        {/* desktop board */}
        <div
          className="relative hidden rounded-lg border border-white/10 md:block"
          style={{
            height: 530,
            background:
              "radial-gradient(circle at 20% 30%, #11111a 0%, transparent 60%), radial-gradient(circle at 80% 70%, #10101a 0%, transparent 55%), repeating-linear-gradient(0deg, transparent 0 39px, rgba(255,255,255,0.02) 39px 40px), repeating-linear-gradient(90deg, transparent 0 39px, rgba(255,255,255,0.02) 39px 40px), #0a0a0f",
          }}
        >
          {PINBOARD.map((it, i) => (
            <Pinned key={i} item={it} index={i} />
          ))}
        </div>

        {/* mobile collage */}
        <div className="md:hidden">
          <div className="mb-3" style={{ transform: "rotate(-1deg)" }}>
            <PinBody item={PINBOARD[0]} />
          </div>
          <div className="columns-2 gap-3">
            {PINBOARD.slice(1).map((it, i) => (
              <MobilePin key={i} item={it} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Pinned({ item, index }: { item: PinItem; index: number }) {
  const [hot, setHot] = useState(false);
  const reduce = useReducedMotion();
  const body = (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 26, rotate: item.rot * 2.2 }}
      whileInView={{ opacity: 1, y: 0, rotate: item.rot }}
      viewport={{ once: true, margin: "-8% 0px" }}
      whileHover={reduce ? undefined : { rotate: 0, scale: 1.09 }}
      transition={{ type: "spring", stiffness: 220, damping: 19, delay: index * 0.035 }}
      className="relative"
      onHoverStart={() => setHot(true)}
      onHoverEnd={() => setHot(false)}
    >
      <span
        aria-hidden
        className="absolute -top-1.5 left-1/2 z-30 size-2.5 -translate-x-1/2 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
        style={{ background: "radial-gradient(circle at 35% 30%, #f0d48a, #8a6312)" }}
      />
      <PinBody item={item} />
      {item.go && (
        <span
          className="pointer-events-none absolute -bottom-5 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#07070a]/90 px-2.5 py-1 font-mono text-[0.55rem] uppercase tracking-[0.14em] text-[#e8b15a] transition-opacity duration-200"
          style={{ opacity: hot ? 1 : 0 }}
        >
          {item.go}
        </span>
      )}
    </motion.div>
  );
  return (
    <div
      className="absolute"
      style={{ left: item.left, top: item.top, zIndex: hot ? 99 : item.z, width: item.w ? `${item.w}px` : undefined }}
    >
      {item.href ? (
        <Link href={item.href} data-cursor-hover className="block">
          {body}
        </Link>
      ) : (
        body
      )}
    </div>
  );
}

function MobilePin({ item, index }: { item: PinItem; index: number }) {
  const inner = (
    <div className="relative" style={{ transform: `rotate(${item.rot / 2}deg)` }}>
      <span
        aria-hidden
        className="absolute -top-1.5 left-1/2 z-30 size-2.5 -translate-x-1/2 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
        style={{ background: "radial-gradient(circle at 35% 30%, #f0d48a, #8a6312)" }}
      />
      <PinBody item={item} />
    </div>
  );
  return (
    <div className={cn("mb-3 break-inside-avoid", index % 3 === 1 && "-mt-1")}>
      {item.href ? (
        <Link href={item.href} className="block">
          {inner}
        </Link>
      ) : (
        inner
      )}
    </div>
  );
}

/** Renders one physical object. */
function PinBody({ item }: { item: PinItem }) {
  switch (item.kind) {
    case "letter":
      return (
        <div className="font-display bg-[#f7f3e8] p-4 text-[#2a2722] shadow-[0_10px_26px_rgba(0,0,0,0.66)]">
          <p className="font-mono text-[0.5rem] uppercase tracking-[0.18em] text-[#8a6312]">In sixty words</p>
          <p className="mt-2 text-[0.72rem] leading-[1.7]">{PIN_LETTER_TEXT}</p>
          <p className="font-hand mt-2 text-lg leading-none">— Jadon</p>
        </div>
      );
    case "polaroid":
      return (
        <div className="bg-[#f4f1ea] p-1.5 pb-4 text-[#1a1a20] shadow-[0_10px_26px_rgba(0,0,0,0.66)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset(item.img!)} alt={item.caption ?? ""} loading="lazy" className="aspect-[3/2] w-full object-cover" />
          <p className="font-hand mt-1.5 text-center text-sm leading-tight">{item.caption}</p>
        </div>
      );
    case "plaque":
      return (
        <div className="rounded border border-[#e8b15a66] bg-gradient-to-br from-[#15151d] to-[#0e0e14] px-4 py-3 shadow-[0_10px_26px_rgba(0,0,0,0.6),inset_0_0_18px_rgba(232,177,90,0.05)]">
          <p className="font-anton text-2xl leading-none" style={{ color: item.accent }}>{item.value}</p>
          <p className="mt-1 font-mono text-[0.5rem] uppercase tracking-[0.12em] text-[#9a9aa8]">{item.label}</p>
        </div>
      );
    case "seal":
      return item.accent === "silver" ? (
        <div
          className="font-display flex aspect-square w-full flex-col items-center justify-center rounded-full text-center font-bold text-[#26231d] shadow-[0_10px_26px_rgba(0,0,0,0.66),inset_0_0_0_3px_rgba(0,0,0,0.13),inset_0_0_0_6px_rgba(255,255,255,0.16)]"
          style={{ background: "radial-gradient(circle at 35% 30%, #e8e4da, #9a948a)" }}
        >
          <span className="text-base leading-none">{item.value}</span>
          <span className="mt-0.5 px-2 font-mono text-[0.42rem] tracking-[0.1em]">{item.text}</span>
        </div>
      ) : (
        <div
          className="font-display flex aspect-square w-full items-center justify-center rounded-full p-3 text-center text-[0.56rem] font-bold leading-[1.45] text-[#241a04] shadow-[0_10px_26px_rgba(0,0,0,0.66),inset_0_0_0_3px_rgba(0,0,0,0.13),inset_0_0_0_6px_rgba(255,255,255,0.16)]"
          style={{ background: "radial-gradient(circle at 35% 30%, #d9a83f, #7d5a10)" }}
        >
          {item.text}
        </div>
      );
    case "ticket":
      return (
        <div className="rounded-sm border-[1.5px] border-dashed bg-[#14141b] px-3 py-2.5 shadow-[0_10px_26px_rgba(0,0,0,0.6)]" style={{ borderColor: `${item.accent}88` }}>
          <p className="font-mono text-[0.62rem] font-bold tracking-wide" style={{ color: item.accent }}>{item.text}</p>
          <p className="mt-0.5 font-mono text-[0.54rem] text-[#9a9aa8]">{item.label}</p>
        </div>
      );
    case "note":
      return (
        <div
          className="font-hand p-3 text-[0.95rem] leading-snug shadow-[0_10px_26px_rgba(0,0,0,0.6)]"
          style={{ background: item.accent, color: item.accent === "#ffd0e2" ? "#4a1228" : "#3c3208" }}
        >
          {item.text}
        </div>
      );
    case "news":
      return (
        <div className="bg-[#ece6d8] px-3.5 py-3 text-[#23211c] shadow-[0_10px_26px_rgba(0,0,0,0.66)]">
          <p className="font-display text-[0.84rem] font-bold leading-[1.25]">{item.hed}</p>
          <p className="mt-1.5 border-t border-[#c9c2b0] pt-1 font-mono text-[0.46rem] uppercase tracking-[0.14em] text-[#6a6458]">{item.src}</p>
        </div>
      );
    case "receipt":
      return (
        <div className="bg-[#fbf8ef] px-3 py-2.5 font-mono text-[0.55rem] leading-[1.8] text-[#2a2722] shadow-[0_10px_26px_rgba(0,0,0,0.6)]">
          {item.lines!.map((l, i) => (
            <p key={i} className="whitespace-pre">{l}</p>
          ))}
        </div>
      );
    case "ribbon":
      return (
        <div
          className="bg-[#2fc4ad] px-3 pb-5 pt-2 text-center text-[#06302a] shadow-[0_10px_26px_rgba(0,0,0,0.6)]"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 72%, 50% 100%, 0 72%)" }}
        >
          <p className="font-anton text-lg leading-none">{item.value}</p>
          <p className="mt-0.5 font-mono text-[0.46rem] uppercase tracking-[0.1em]">{item.label}</p>
        </div>
      );
    case "index":
      return (
        <div className="font-display border-t-4 border-[#b07c1e] bg-[#fdfbf4] px-3 py-2.5 text-[0.68rem] leading-[1.65] text-[#26231d] shadow-[0_10px_26px_rgba(0,0,0,0.6)]">
          {item.text}
        </div>
      );
  }
}
