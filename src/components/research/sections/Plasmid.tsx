import { FUS_REPORTER } from "../lab/content";
import { PlasmidRing } from "../viz/PlasmidRing";
import { Section, P } from "./Section";

export function Plasmid() {
  return (
    <Section id="plasmid" kicker="The construct" heading="What goes in.">
      <P>
        The plasmid carries two things that matter: the reporter that makes the fungus visible, and
        the resistance gene that makes a successful transformation selectable. Hover any feature to
        read it.
      </P>
      <div className="mt-8">
        <PlasmidRing />
      </div>
      <div className="mt-10 max-w-[64ch] border-l-2 border-[var(--accent)] pl-5">
        <h3 className="mb-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[var(--accent)]">
          {FUS_REPORTER.heading}
        </h3>
        <p className="text-[1.02rem] leading-[1.72] text-[var(--muted)]">{FUS_REPORTER.body}</p>
      </div>
    </Section>
  );
}
