import { DEG_COUNTS, PAIN_MEDIATORS, PIPELINE, PROJECT } from "../lab/content";
import { RESEARCH } from "@/lib/data";
// Current path — Task 13 moves this file to ../viz/ and updates this import (Ruling R2).
import { VolcanoPlot } from "@/components/research/VolcanoPlot";
import { Section, P } from "./Section";

export function GoutChapter() {
  return (
    <div data-chapter="gout" className="bg-[var(--bg)]">
      {/* The hinge between the two projects. Without this the page is two
          adjacent projects; with it, it is one scientist. */}
      <p className="mx-auto max-w-5xl border-t border-[var(--line)] px-6 py-[clamp(3rem,7vh,5rem)] text-[clamp(1.1rem,2vw,1.5rem)] leading-[1.5] text-balance text-[var(--fg)] lg:pl-64 lg:pr-10">
        Both projects are the same problem twice: a pain signal you can only see
        in the transcriptome, and a pathogen you can only see once it&rsquo;s
        tagged.
      </p>
      <Section id="gout-question" kicker="Gout · RNA-seq" heading="Before the bench, the terminal.">
        <P>
          Trained in R and bioinformatics, then set loose on a public dataset to run the analysis
          independently: in gouty mice, which genes and pathways actually drive the pain? The wet-lab
          work proves you can operate in someone else&rsquo;s lab. This one proves you can drive a
          question yourself.
        </P>
        <P className="text-[var(--fg)]">{PROJECT.question}</P>
        <P>{PROJECT.hypothesis}</P>
        <p className="mt-6 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--accent)]">
          {RESEARCH.project.result}
        </p>
      </Section>

      <Section id="pipeline" kicker="Pipeline" heading="Eight steps, self-built.">
        <ol className="grid list-none gap-px bg-[var(--line)] p-0 sm:grid-cols-2">
          {PIPELINE.map((s) => (
            <li key={s.n} className="bg-[var(--bg-2)] p-5">
              <p className="mb-1 font-mono text-[0.7rem] text-[var(--accent)]">{s.n}</p>
              <p className="mb-1 font-mono text-[0.9rem] text-[var(--fg)]">{s.step}</p>
              <p className="text-[0.86rem] leading-[1.55] text-[var(--muted)]">{s.detail}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="volcano" kicker="Differential expression" heading="Every gene, plotted.">
        <P>
          Each point is a gene: fold change across the x-axis, statistical confidence up the y. The
          ones that clear both thresholds are the ones worth chasing.
        </P>
        <div className="mt-8 border border-[var(--line)] bg-[var(--bg-2)] p-4">
          <VolcanoPlot />
        </div>
        <ul className="mt-8 grid list-none gap-px bg-[var(--line)] p-0 sm:grid-cols-3">
          {DEG_COUNTS.map((d) => (
            <li key={d.tissue} className="bg-[var(--bg-2)] p-5">
              <p className="mb-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                {d.tissue}
              </p>
              <p className="font-mono text-[1.1rem] tabular-nums">
                <span className="text-[var(--accent)]">↑ {d.up}</span>
                <span className="mx-2 text-[var(--muted)]">·</span>
                <span className="text-[var(--accent-2)]">↓ {d.down}</span>
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="mediators" kicker="The finding" heading="Nine mediators, three tissues.">
        <P>
          The pain signal is not confined to the inflamed joint — it also shows up in the dorsal root
          ganglia and the spinal cord, which is what makes these targets interesting.
        </P>
        <ul className="mt-8 grid list-none gap-px bg-[var(--line)] p-0 sm:grid-cols-3">
          {PAIN_MEDIATORS.map((m) => (
            <li key={m.gene} className="bg-[var(--bg-2)] p-4">
              <p className="font-mono text-[0.95rem] text-[var(--accent)]">{m.gene}</p>
              <p className="mt-1 text-[0.85rem] leading-[1.5] text-[var(--muted)]">{m.role}</p>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
