import { FUS } from "../lab/content";
import { Section, P } from "./Section";

export function Question() {
  return (
    <Section id="question" kicker="The question" heading="One fungus, two kingdoms.">
      <P>{FUS.abstract}</P>
      <P className="text-[var(--fg)]">{FUS.question}</P>
    </Section>
  );
}
