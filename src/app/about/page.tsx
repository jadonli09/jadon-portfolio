import type { Metadata } from "next";
import { World } from "@/components/chrome/World";
import { Footer } from "@/components/chrome/Footer";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { MissionPeak } from "@/components/about/MissionPeak";
import { ABOUT, PROFILE } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description: "The person behind the worlds — li_locked.in, the Mission Peak ritual, and the pursuit of happiness.",
};

export default function AboutPage() {
  return (
    <World id="about">
      {/* HERO — quiet editorial */}
      <section className="mx-auto max-w-5xl px-5 pb-16 pt-36 md:px-9 md:pb-24 md:pt-48">
        <Reveal>
          <p className="eyebrow">06 — The Person</p>
        </Reveal>
        <KineticHeadline
          as="h1"
          text="Documenting the grind."
          className="mt-6 font-display text-[3.2rem] leading-[0.95] tracking-tight md:text-[7rem]"
        />
        <Reveal delay={0.2} className="mt-10 max-w-2xl">
          <p className="font-serif-i text-2xl italic leading-snug md:text-3xl">
            {ABOUT.ethos}
          </p>
        </Reveal>
      </section>

      {/* MISSION PEAK */}
      <section className="border-y border-[var(--line)] bg-[var(--bg-2)]">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-9 md:py-28">
          <Reveal className="mb-12">
            <p className="eyebrow">A ritual</p>
            <h2 className="mt-3 font-display text-4xl md:text-6xl">{ABOUT.missionPeak.title}</h2>
          </Reveal>
          <MissionPeak />
        </div>
      </section>

      {/* THREADS */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-9 md:py-28">
        <Reveal className="mb-12">
          <h2 className="font-display text-3xl md:text-5xl">Off the record</h2>
        </Reveal>
        <RevealGroup className="grid gap-px overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--line)] md:grid-cols-2">
          {ABOUT.threads.map((t, i) => (
            <Reveal key={t.title} className="group bg-[var(--bg)] p-8 transition-colors hover:bg-[var(--bg-2)] md:p-12" delay={i * 0.05}>
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-2xl md:text-3xl">{t.title}</h3>
                <span className="font-mono text-xs text-[var(--muted)]">0{i + 1}</span>
              </div>
              <p className="mt-4 max-w-md text-[var(--muted)]">{t.body}</p>
            </Reveal>
          ))}
        </RevealGroup>
      </section>

      {/* CLOSE */}
      <section className="mx-auto max-w-5xl px-5 py-24 text-center md:px-9 md:py-40">
        <Reveal>
          <p className="eyebrow mb-6">{PROFILE.links.instagramHandle}</p>
          <p className="font-display text-[2.4rem] leading-[1.05] tracking-tight md:text-[5rem]">
            It all points one direction —
            <span className="italic text-[var(--accent-2)]"> the pursuit of happiness.</span>
          </p>
        </Reveal>
      </section>

      <Footer current="about" />
    </World>
  );
}
