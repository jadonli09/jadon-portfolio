import { FUS_IMAGES, FUS_RESULTS } from "../lab/content";
import { Photo } from "@/components/primitives/Photo";
import { Section, P, aspectFrom } from "./Section";

export function WhatsNext() {
  const future = FUS_RESULTS.find((r) => r.heading === "Future applications");
  const fig = FUS_IMAGES.macrophage;
  return (
    <Section id="next" kicker="Future applications" heading="Watch it get eaten.">
      {future ? <P>{future.body}</P> : null}
      <figure className="mt-8 m-0 border border-[var(--line)]">
        <div className="relative w-full bg-black" style={aspectFrom(fig.dims)}>
          <Photo src={fig.src} alt={fig.alt} />
        </div>
        <figcaption className="border-t border-[var(--line)] px-3 py-2.5 font-mono text-[0.66rem] leading-[1.55] text-[var(--muted)]">
          {fig.caption}
        </figcaption>
      </figure>
    </Section>
  );
}
