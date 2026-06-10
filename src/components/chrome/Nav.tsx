"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { CHAPTERS, PROFILE } from "@/lib/data";
import { EASE } from "@/lib/motion";
import { Magnetic } from "@/components/primitives/Magnetic";

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change.
  useEffect(() => setOpen(false), [pathname]);

  // Lock scroll + Esc to close while the overlay is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference">
        <div className="flex items-center justify-between px-5 py-4 md:px-9 md:py-6 text-white">
          <Magnetic strength={0.5}>
            <Link href="/" aria-label="Home" className="font-anton text-xl leading-none tracking-tight">
              JADON<span className="align-super text-[0.6em]">LI</span>
            </Link>
          </Magnetic>

          <Magnetic strength={0.5}>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="group flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em]"
            >
              <span className="hidden sm:inline">{open ? "Close" : "Menu"}</span>
              <span className="relative flex h-4 w-6 flex-col justify-between">
                <span className={`h-[1.5px] w-full bg-white transition-transform duration-300 ${open ? "translate-y-[7px] rotate-45" : ""}`} />
                <span className={`h-[1.5px] w-full bg-white transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
                <span className={`h-[1.5px] w-full bg-white transition-transform duration-300 ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
              </span>
            </button>
          </Magnetic>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.nav
            className="fixed inset-0 z-40 flex flex-col bg-[#07070a] text-[#f4f1ea]"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(100% 0 0 0)" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="grain" />
            <div className="flex flex-1 flex-col justify-center px-5 pt-24 md:px-9">
              <div className="mb-4 flex items-center gap-3">
                <Link href="/" data-cursor-hover className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-[#8a8a99] transition-colors hover:text-[#f4f1ea]">
                  ↑ The story, from the top
                </Link>
              </div>
              <ul className="flex flex-col">
                {CHAPTERS.map((c, i) => (
                  <motion.li
                    key={c.id}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.18 + i * 0.05, duration: 0.7, ease: EASE }}
                    className="border-b border-white/10"
                  >
                    <Link
                      href={c.href}
                      className="group flex items-baseline justify-between gap-4 py-2.5 md:py-3.5"
                      data-cursor-hover
                    >
                      <span className="flex items-baseline gap-4 md:gap-7">
                        <span className="font-mono text-xs" style={{ color: c.accent }}>{c.num}</span>
                        <span className="font-display text-[1.7rem] leading-none text-[#f4f1ea] transition-transform duration-500 ease-out group-hover:translate-x-3 md:text-[3.4rem]">
                          {c.kicker}
                        </span>
                      </span>
                      <span className="hidden max-w-[40%] text-right font-mono text-[0.62rem] uppercase tracking-widest text-[#8a8a99] md:block">
                        {c.headline}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center gap-x-7 gap-y-2 px-5 pb-8 font-mono text-[0.68rem] uppercase tracking-widest text-[#8a8a99] md:px-9"
            >
              <Link href="/built" className="hover:text-[#f4f1ea]" data-cursor-hover>Built</Link>
              <Link href="/achievements" className="hover:text-[#f4f1ea]" data-cursor-hover>Trophy Case</Link>
              <Link href="/contact" className="hover:text-[#f4f1ea]" data-cursor-hover>Contact</Link>
              <a href={PROFILE.links.instagram} target="_blank" rel="noreferrer" className="ml-auto hover:text-[#f4f1ea]" data-cursor-hover>
                {PROFILE.links.instagramHandle}
              </a>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
