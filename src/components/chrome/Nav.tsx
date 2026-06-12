"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "motion/react";
import { Magnetic } from "@/components/primitives/Magnetic";
import { ContactSheet } from "@/components/chrome/ContactSheet";

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
        {open && <ContactSheet onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
