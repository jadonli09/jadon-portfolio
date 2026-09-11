import { DEG_COUNTS, IMAGES, PAIN_MEDIATORS, PIPELINE } from "../lab/content";
import { Disclosure } from "../viz/Disclosure";
import { SpotlightRail } from "../viz/SpotlightRail";
import { Photo } from "@/components/primitives/Photo";
import { Caption, Section, aspectFrom } from "./Section";

/**
 * The dry-lab project at the same altitude as the wet-lab one: the finding,
 * then the plots that show it. The chapter re-scopes --accent to the volcano's
 * own encoding, so lime is up-regulated and cyan is down — the colour is data.
 */
const MEDIATORS = PAIN_MEDIATORS.map((m) => ({ key: m.gene, label: m.gene, note: m.role }));

export function ScienceFair() {
  return (
    <div data-chapter="gout" className="bg-[var(--bg)]">
      <div className="border-t border-[var(--line)] px-6 py-[clamp(3.5rem,8vh,6rem)] lg:pl-64 lg:pr-10">
        <p className="mx-auto max-w-5xl font-serif text-[clamp(1.4rem,2.6vw,2rem)] leading-[1.35] text-balance text-[var(--fg)]">
          Both projects are the same problem twice: a pain signal you can only see in the
          transcriptome, and a pathogen you can only see once it&rsquo;s tagged.
        </p>
      </div>

      <Section
        id="gout"
        heading="The pain isn't only in the joint."
        lede="Healthy mice against gouty ones, three tissues, one RNA-seq pipeline in R."
        width="figure"
      >
        <figure className="m-0 border border-[var(--line)]">
          <div className="relative w-full bg-white" style={aspectFrom(IMAGES.volcanos.dims)}>
            <Photo src={IMAGES.volcanos.src} alt={IMAGES.volcanos.alt} />
          </div>
          <Caption>{IMAGES.volcanos.caption}</Caption>
        </figure>

        <ul className="mt-6 grid list-none gap-px border border-[var(--line)] bg-[var(--line)] p-0 sm:grid-cols-3">
          {DEG_COUNTS.map((d) => (
            <li
              key={d.tissue}
              className="bg-[var(--bg-2)] p-6 transition-colors duration-300 hover:bg-[var(--bg-3)]"
            >
              <p className="text-[1.02rem] leading-[1.4] text-[var(--fg)]">{d.tissue}</p>
              <p className="mt-3 font-mono text-[1.25rem] tabular-nums">
                <span className="text-[var(--accent)]">{d.up} up</span>
                <span className="mx-3 text-[var(--muted)]">/</span>
                <span className="text-[var(--accent-2)]">{d.down} down</span>
              </p>
            </li>
          ))}
        </ul>

        <h3 className="mb-4 mt-16 font-serif text-[clamp(1.5rem,2.4vw,2.1rem)] leading-[1.15]">
          Nine mediators, and two of the three tissues are nerves.
        </h3>
        <p className="mb-8 max-w-[62ch] text-[1.08rem] leading-[1.7] text-[var(--muted)]">
          They go up at the inflamed joint, and again in the dorsal root ganglia and spinal cord —
          the pain is amplified somewhere a joint drug never reaches.
        </p>
        <SpotlightRail items={MEDIATORS} label="Pain mediators" columns={3} />

        <figure className="m-0 mt-12 border border-[var(--line)]">
          <div className="relative w-full bg-white" style={aspectFrom(IMAGES.painHeatmap.dims)}>
            <Photo src={IMAGES.painHeatmap.src} alt={IMAGES.painHeatmap.alt} />
          </div>
          <Caption>{IMAGES.painHeatmap.caption}</Caption>
        </figure>

        <div className="mt-14 border-t border-[var(--line)]">
          <Disclosure title="How the pipeline was built" hint="Eight steps in R, dataset to shortlist.">
            <ol className="grid list-none gap-px border border-[var(--line)] bg-[var(--line)] p-0 sm:grid-cols-2">
              {PIPELINE.map((s) => (
                <li key={s.n} className="bg-[var(--bg-2)] p-5">
                  <p className="font-mono text-[1rem] text-[var(--fg)]">{s.step}</p>
                  <p className="mt-2 text-[0.98rem] leading-[1.55] text-[var(--muted)]">
                    {s.detail}
                  </p>
                </li>
              ))}
            </ol>
          </Disclosure>
        </div>
      </Section>
    </div>
  );
}
