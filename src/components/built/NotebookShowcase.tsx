"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { BookOpen, Highlighter, MessageCircle, ScanText, NotebookPen, X } from "lucide-react";
import { PAPER } from "@/lib/demos/notebookli";
import { GLOSSARY, normalizeWord, READER_TEXT } from "@/lib/demos/notebook-glossary";
import { EASE_OUT } from "@/lib/fluid";
import styles from "./NotebookShowcase.module.css";

const FEATURES = [
  { title: "Auto-annotate", line: "Find the claims, methods, results, and caveats.", icon: Highlighter },
  { title: "Ask the paper", line: "Answers that point back to the evidence.", icon: MessageCircle },
  { title: "Break down jargon", line: "Unpack a whole paragraph in plain language.", icon: ScanText },
  { title: "Build your worksheet", line: "Turn your reading into a journal-club discussion.", icon: NotebookPen },
];

function Words({ text }: { text: string }) {
  return text.split(/([A-Za-z0-9]+(?:-[A-Za-z0-9]+)*)/g).map((part, i) =>
    /^[A-Za-z0-9]/.test(part)
      ? <span key={i} data-word={part} className={styles.word}>{part}</span>
      : part,
  );
}

/** A local, interactive reader for the fixed UMass excerpt. */
export function NotebookShowcase() {
  const [annotate, setAnnotate] = useState(false);
  const [revealed, setRevealed] = useState(0);
  const [query, setQuery] = useState("");
  const [definition, setDefinition] = useState<{word: string; top: number; left: number} | null>(null);
  const readerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!annotate) return;
    const timers = [1, 2].map((n) => window.setTimeout(() => setRevealed(n), reduce ? 0 : 160 + (n - 1) * 420));
    return () => timers.forEach(window.clearTimeout);
  }, [annotate, reduce]);

  useEffect(() => {
    if (!definition) return;
    const dismiss = (event: PointerEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest('[data-definition], [data-word], [data-lookup]')) setDefinition(null);
    };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setDefinition(null); };
    const resized = () => setDefinition(null);
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    window.addEventListener("resize", resized);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
      window.removeEventListener("resize", resized);
    };
  }, [definition]);

  function define(word: string, anchor: Element) {
    const reader = readerRef.current;
    if (!reader) return;
    const bounds = reader.getBoundingClientRect();
    const rect = anchor.getBoundingClientRect();
    setDefinition({
      word,
      left: Math.max(12, Math.min(rect.left - bounds.left, bounds.width - 292)),
      top: Math.max(64, Math.min(rect.bottom - bounds.top + 10, bounds.height - 225)),
    });
  }

  function defineTarget(target: EventTarget) {
    if (!(target instanceof Element)) return;
    const word = target.closest<HTMLElement>("[data-word]");
    if (word?.dataset.word) define(word.dataset.word, word);
  }

  const methodOn = annotate && revealed >= 1;
  const resultOn = annotate && revealed >= 2;

  return (
    <div className={styles.showcase}>
      <div className={styles.features}>
        {FEATURES.map(({ title, line, icon: Icon }) => (
          <div key={title} className={styles.feature}>
            <Icon size={19} strokeWidth={1.6} aria-hidden />
            <span><strong>{title}</strong><span>{line}</span></span>
          </div>
        ))}
      </div>

      <div ref={readerRef} id="notebook-preview" className={styles.reader} role="region" aria-label="Interactive NotebookLI reader"
        onKeyDown={(event) => { if (event.key === "Escape") setDefinition(null); }}>
        <div className={styles.toolbar}>
          <span className={styles.wordmark}>NotebookLI</span>
          <button type="button" role="switch" aria-checked={annotate} aria-label="Auto-annotate" className={styles.toggle}
            onClick={() => { setRevealed(0); setAnnotate(!annotate); }}>
            <Highlighter size={15} aria-hidden /><span>Auto-annotate</span>
            <span className={styles.track} aria-hidden><span /></span>
          </button>
        </div>
        <div className={styles.paper}
          onDoubleClick={(event) => defineTarget(event.target)}
          onPointerUp={(event) => { if (event.pointerType === "touch") defineTarget(event.target); }}>
          <p className={styles.source}>From my UMass research</p>
          <h3><Words text={PAPER.title} /></h3>
          <p className={styles.passage}>
            <Words text={READER_TEXT.before} />
            <mark className={`${styles.mark} ${methodOn ? styles.method : ""}`}><Words text={READER_TEXT.method} /></mark>
            <Words text={READER_TEXT.after} />
          </p>
          <div className={styles.noteSlot}>
            <motion.p className={styles.marginNote} initial={false} animate={{ opacity: methodOn ? 1 : 0 }} transition={{ duration: .16, ease: EASE_OUT }} aria-hidden={!methodOn}>
              <span className={styles.methodDot} />Method<span>A fluorescent tag makes the strains visible.</span>
            </motion.p>
          </div>
          <p className={styles.passage}>
            <mark className={`${styles.mark} ${resultOn ? styles.result : ""}`}><Words text={READER_TEXT.result} /></mark>
            <Words text={READER_TEXT.conclusion} />
          </p>
          <div className={styles.noteSlot}>
            <motion.p className={styles.marginNote} initial={false} animate={{ opacity: resultOn ? 1 : 0 }} transition={{ duration: .16, ease: EASE_OUT }} aria-hidden={!resultOn}>
              <span className={styles.resultDot} />Result<span>Two checks support the transformation.</span>
            </motion.p>
          </div>
        </div>
        <div className={styles.footnote}>
          <p className={styles.desktopHint}>Double-click any word to define it.</p>
          <p className={styles.touchHint}>Tap any word to define it.</p>
          <form data-lookup className={styles.lookup} onSubmit={(event) => {
            event.preventDefault();
            if (query.trim()) define(query.trim(), event.currentTarget);
          }}>
            <input aria-label="Word to define" placeholder="Look up a word" value={query} onChange={(event) => setQuery(event.target.value)} />
            <button type="submit" aria-label="Define word"><BookOpen size={17} /></button>
          </form>
        </div>
        <span className="sr-only" role="status">{annotate ? `${revealed} of 2 passages annotated` : "Auto-annotation off"}</span>
        <AnimatePresence>
          {definition && (
            <motion.aside key={definition.word} data-definition className={styles.definition}
              style={{ top: definition.top, left: definition.left }} aria-label={`Definition of ${definition.word}`} role="status"
              initial={{ opacity: 0, scale: reduce ? 1 : .97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: .16, ease: EASE_OUT }}>
              <div className={styles.definitionHead}><strong>{definition.word}</strong><button type="button" aria-label="Close definition" onClick={() => setDefinition(null)}><X size={16} /></button></div>
              <p>{Object.hasOwn(GLOSSARY, normalizeWord(definition.word)) ? GLOSSARY[normalizeWord(definition.word)] : "This word isn’t in the excerpt’s glossary. Try a word from the paper."}</p>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
