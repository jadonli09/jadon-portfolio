"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowRight, CalendarDays, ScanLine, Users } from "lucide-react";
import { asset } from "@/lib/base";
import { EASE_OUT } from "@/lib/fluid";
import { EXTRACTIONS, RUN_STATS, WATCHED_HANDLES } from "@/lib/demos/hermes";
import styles from "./HermesFlow.module.css";

const STEP_MS = 520;
const HANDLES = WATCHED_HANDLES.slice(0, 6);
const EVENTS = EXTRACTIONS.slice(0, 3);

/** Real inputs and extracted rows lead into the published story. */
export function HermesFlow({ shot }: { shot: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduce = useReducedMotion();
  const [step, setStep] = useState(-1);
  const reached = reduce ? 2 : step;

  useEffect(() => {
    if (!inView || reduce) return;
    const timers = [0, 1, 2].map((i) => window.setTimeout(() => setStep(i), i * STEP_MS));
    return () => timers.forEach(window.clearTimeout);
  }, [inView, reduce]);

  const arrival = (i: number) => ({
    initial: false as const,
    animate: { opacity: reached >= i ? 1 : 0.35, y: reached >= i || reduce ? 0 : 8 },
    transition: { duration: reduce ? 0 : 0.45, ease: EASE_OUT },
  });

  return (
    <div ref={ref} className={styles.flow}>
      <div className={styles.inputs}>
        <motion.div {...arrival(0)}>
          <div className={styles.step}><Users size={18} /><span>01 · Watch the accounts</span></div>
          <div className={styles.accounts}>
            {HANDLES.map((handle) => (
              <div className={styles.account} key={handle}>
                <span aria-hidden className={styles.avatar}>{handle.replace(/^msj/, "").slice(0, 2).toUpperCase()}</span>
                <span>@{handle}</span>
              </div>
            ))}
          </div>
          <p className={styles.note}>{RUN_STATS.clubsProcessed} accounts. New posts collected every weekday.</p>
        </motion.div>

        <div className={styles.connector} aria-hidden><span /><ArrowDown size={18} /></div>

        <motion.div {...arrival(1)}>
          <div className={styles.step}><ScanLine size={18} /><span>02 · Pull out the details</span></div>
          <div className={styles.sheet}>
            <div className={styles.sheetTitle}><CalendarDays size={16} /> Events, ready for the calendar</div>
            <table>
              <caption className="sr-only">Sample events extracted from club posts</caption>
              <thead><tr><th>Club</th><th>When</th><th>Room</th></tr></thead>
              <tbody>{EVENTS.map((event) => (
                <tr key={event.club}>
                  <td>@{event.club}</td>
                  <td><span>{event.date.slice(0, 5)}</span><small>{event.time}</small></td>
                  <td><span className={styles.room}>{event.location}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <p className={styles.note}>Claude finds the event, time, and room.</p>
        </motion.div>
      </div>

      <motion.div className={styles.outputConnector} {...arrival(2)} aria-hidden>
        <span /><ArrowRight size={20} />
      </motion.div>

      <motion.figure className={styles.output} {...arrival(2)}>
        <div className={styles.step}><CalendarDays size={18} /><span>03 · Publish the day</span></div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(shot)} alt="A Hermes daily schedule story as posted to @msjclubs"
          loading="lazy" decoding="async" draggable={false} className={styles.story} />
        <figcaption className={styles.note}>One story. Every meeting at a glance.</figcaption>
      </motion.figure>
    </div>
  );
}
