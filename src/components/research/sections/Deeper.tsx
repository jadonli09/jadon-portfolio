import { BENCH, FUS_IMAGES, FUS_REPORTER, FUS_RESULTS, FUS_SETBACK } from "../lab/content";
import { Disclosure } from "../viz/Disclosure";
import { PlasmidRing } from "../viz/PlasmidRing";
import { Photo } from "@/components/primitives/Photo";
import { Caption, P, Section, aspectFrom } from "./Section";

/** Non-science log entries stay off the public research page. */
const SKIP = /ice-rink|team bonding|Lab Olympics|organize/i;

/**
 * The parts a reader either wants badly or not at all: the construct, the
 * contamination, the next experiment, the daily log. Open what you want.
 */
export function Deeper() {
  const future = FUS_RESULTS.find((r) => r.heading === "Future applications");
  const log = BENCH.log.filter((e) => !SKIP.test(e.msg));

  return (
    <Section id="deeper" heading="The rest of it, if you want it.">
      <div className="border-t border-[var(--line)]">
        <Disclosure
          title="The construct"
          hint="What went into the fungus, and why it had to be red."
        >
          <p className="mb-8 max-w-[58ch] text-[1.06rem] leading-[1.65] text-[var(--muted)]">
            Two features matter: the reporter that makes the fungus visible, and the resistance gene
            that makes a successful transformation selectable. Hover any feature to read it.
          </p>
          <PlasmidRing />
          <div className="mt-10 max-w-[62ch] border-l-2 border-[var(--accent)] pl-5">
            <h4 className="mb-2 font-serif text-[1.35rem] leading-[1.2] text-[var(--fg)]">
              {FUS_REPORTER.heading}
            </h4>
            <p className="text-[1.06rem] leading-[1.7] text-[var(--muted)]">{FUS_REPORTER.body}</p>
          </div>
        </Disclosure>

        <Disclosure
          title="What went wrong"
          hint="Selection came back contaminated, and the obvious fix fails."
        >
          <div className="flex max-w-[64ch] flex-col gap-5">
            {FUS_SETBACK.paras.map((p) => (
              <p key={p.slice(0, 32)} className="text-[1.06rem] leading-[1.7] text-[var(--muted)]">
                {p}
              </p>
            ))}
          </div>
        </Disclosure>

        <Disclosure
          title="Where it goes next"
          hint="Watching a macrophage eat something you can finally see."
        >
          {future ? <P>{future.body}</P> : null}
          <figure className="m-0 mt-8 border border-[var(--line)]">
            <div className="relative w-full bg-black" style={aspectFrom(FUS_IMAGES.macrophage.dims)}>
              <Photo src={FUS_IMAGES.macrophage.src} alt={FUS_IMAGES.macrophage.alt} />
            </div>
            <Caption>{FUS_IMAGES.macrophage.caption}</Caption>
          </figure>
        </Disclosure>

        <Disclosure title="The log" hint="Dated entries out of the bench notebook, in order.">
          <ol className="list-none border-l border-[var(--line)] p-0">
            {log.map((e) => (
              <li key={e.hash} className="relative py-3 pl-6">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-[1.45rem] h-px w-3 bg-[var(--line)]"
                />
                <span className="mr-3 font-mono text-[0.9rem] text-[var(--accent)]">{e.date}</span>
                <span className="text-[1.02rem] leading-[1.6] text-[var(--muted)]">{e.msg}</span>
              </li>
            ))}
          </ol>
        </Disclosure>
      </div>
    </Section>
  );
}
