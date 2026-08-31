import { FUS_IMAGES, FUS_PROTOCOL, FUS_WHY } from "../lab/content";
import { Photo } from "@/components/primitives/Photo";
import { Section, P, aspectFrom } from "./Section";

/** FUS_PROTOCOL.step -> FUS_WHY key. Step I's reasoning is about the linearization it ends on. */
const WHY_FOR: Record<string, keyof typeof FUS_WHY> = {
  plasmid_extraction: "linearize",
  protoplast_generation: "protoplast",
  peg_transformation: "peg",
  selection: "hygromycin",
};

/** Steps that have a diagram on the poster. */
const FIGURE_FOR: Record<string, keyof typeof FUS_IMAGES> = {
  protoplast_generation: "protoplast",
  peg_transformation: "transformation",
};

export function Protocol() {
  return (
    <Section id="protocol" kicker="Methodology" heading="Four steps, six weeks.">
      <P>Each step exists for a reason. The reason is the part worth reading.</P>
      <ol className="mt-8 flex list-none flex-col gap-px bg-[var(--line)] p-0">
        {FUS_PROTOCOL.map((s) => {
          const why = FUS_WHY[WHY_FOR[s.step]];
          const figKey = FIGURE_FOR[s.step];
          const fig = figKey ? FUS_IMAGES[figKey] : null;
          return (
            <li key={s.step} className="bg-[var(--bg-2)] p-6 sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row">
                <p className="shrink-0 font-serif text-[2.4rem] leading-none text-[var(--accent)] sm:w-16">
                  {s.n}
                </p>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 text-[1.05rem] font-semibold text-[var(--fg)]">{s.title}</h3>
                  <p className="mb-4 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                    {s.step}
                  </p>
                  <ul className="mb-5 flex list-none flex-col gap-1.5 p-0">
                    {s.detail.map((d) => (
                      <li key={d} className="text-[0.92rem] leading-[1.6] text-[var(--muted)]">
                        {d}
                      </li>
                    ))}
                  </ul>
                  {why ? (
                    <p className="max-w-[62ch] border-l-2 border-[var(--accent)] pl-4 text-[0.95rem] leading-[1.65] text-[var(--fg)]">
                      {why}
                    </p>
                  ) : null}
                </div>
              </div>
              {fig ? (
                <figure className="mt-6 m-0 border border-[var(--line)]">
                  <div className="relative w-full" style={aspectFrom(fig.dims)}>
                    <Photo src={fig.src} alt={fig.alt} />
                  </div>
                  <figcaption className="border-t border-[var(--line)] px-3 py-2 font-mono text-[0.65rem] leading-[1.5] text-[var(--muted)]">
                    {fig.caption}
                  </figcaption>
                </figure>
              ) : null}
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
