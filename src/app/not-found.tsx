import type { Metadata } from "next";
import Link from "next/link";
import { WORLDS } from "@/lib/data";
import { Magnetic } from "@/components/primitives/Magnetic";

export const metadata: Metadata = {
  title: "Off the Map",
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#07070a] px-5 text-[#f4f1ea]">
      <div className="grain" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(60% 50% at 50% 50%, rgba(232,177,90,0.12), transparent 70%)" }}
      />
      <h1 className="font-anton text-[26vw] leading-none tracking-tight md:text-[18rem]">404</h1>
      <p className="mt-4 max-w-md text-center text-[#8a8a99]">
        This corner of the site doesn&apos;t exist — but there are seven doors that do.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Magnetic strength={0.4}>
          <Link
            href="/"
            data-cursor-hover
            className="inline-flex items-center gap-2 rounded-full border border-[#e8b15a] px-7 py-4 text-base font-medium text-[#e8b15a] transition-colors hover:bg-[#e8b15a] hover:text-[#07070a]"
          >
            Back to the start
          </Link>
        </Magnetic>
      </div>
      <ul className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-1 text-base text-[#8a8a99]">
        {WORLDS.map((w) => (
          <li key={w.id}>
            <Link href={w.href} data-cursor-hover className="inline-block py-2 transition-colors hover:text-[#f4f1ea]">
              {w.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
