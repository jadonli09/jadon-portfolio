import { BENCH } from "../lab/content";
import { Section, P } from "./Section";

/** Non-science log entries stay off the public research page. */
const SKIP = /ice-rink|team bonding|Lab Olympics|organize/i;

export function AtTheBench() {
  const log = BENCH.log.filter((e) => !SKIP.test(e.msg));

  return (
    <Section id="bench" kicker="At the bench" heading="What I ran.">
      <P>{BENCH.cadence}</P>
      <P>{BENCH.reading}</P>

      <ul className="mt-8 flex list-none flex-wrap gap-2 p-0">
        {BENCH.techniques.map((t) => (
          <li
            key={t}
            className="rounded-sm border border-[var(--line)] bg-[var(--bg-2)] px-3 py-1.5 font-mono text-[0.72rem] text-[var(--fg)]"
          >
            {t}
          </li>
        ))}
      </ul>

      <ol className="mt-12 list-none border-l border-[var(--line)] p-0">
        {log.map((e) => (
          <li key={e.hash} className="relative py-2.5 pl-6">
            <span
              aria-hidden="true"
              className="absolute left-0 top-[1.1rem] h-px w-3 bg-[var(--line)]"
            />
            <span className="mr-3 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-[var(--accent)]">
              {e.date}
            </span>
            <span className="text-[0.95rem] text-[var(--muted)]">{e.msg}</span>
          </li>
        ))}
      </ol>
    </Section>
  );
}
