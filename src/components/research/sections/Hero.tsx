"use client";

import { asset } from "@/lib/base";
import { RESEARCH } from "@/lib/data";
import { jumpTo } from "../lab/bus";
import { FUS_PANELS } from "../lab/content";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[88dvh] flex-col justify-center overflow-hidden px-6 pb-16 pt-24 lg:pl-64 lg:pr-10"
    >
      {/* Brightfield hyphae — grey, no red. The glow is not spent here. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset(FUS_PANELS.t8996.bf)}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.14] [mask-image:radial-gradient(70%_60%_at_50%_45%,#000,transparent)]"
      />
      <div className="relative mx-auto w-full max-w-5xl">
        <p className="mb-8 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-[var(--muted)]">
          <span className="inline-flex items-center gap-2 text-[var(--accent)]">
            <span className="h-[7px] w-[7px] rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]" />
            Summer 2026
          </span>
          <span>{RESEARCH.umass.lab}</span>
        </p>
        <h1 className="mb-7 font-serif text-[clamp(3rem,10vw,8rem)] leading-[0.92] tracking-[-0.02em] text-balance">
          We made the fungus{" "}
          <em className="not-italic text-[var(--accent)] [text-shadow:0_0_42px_rgba(255,61,94,0.55),0_0_90px_rgba(255,61,94,0.28)]">
            glow.
          </em>
        </h1>
        <p className="max-w-[60ch] text-[clamp(1.02rem,1.5vw,1.3rem)] leading-[1.62] text-[var(--muted)]">
          <i className="italic text-[var(--fg)]">Fusarium oxysporum</i> blinds people and it kills
          bananas — the same fungus, crossing kingdoms. Its human clinical strains slip past the
          mammalian immune system better than the plant ones do. You can&rsquo;t study a fight you
          can&rsquo;t see, so we engineered a red fluorescent protein into three of them.
        </p>
        <p className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--muted)]">
          <span aria-hidden="true">↓</span>
          <button
            type="button"
            onClick={() => jumpTo("strains")}
            className="hover:text-[var(--fg)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            the strains
          </button>
          <span aria-hidden="true">·</span>
          <button
            type="button"
            onClick={() => jumpTo("protocol")}
            className="hover:text-[var(--fg)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            the protocol
          </button>
          <span aria-hidden="true">·</span>
          <button
            type="button"
            onClick={() => jumpTo("evidence")}
            className="text-[var(--accent)] hover:brightness-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            the evidence
          </button>
        </p>
      </div>
    </section>
  );
}
