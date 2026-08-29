import type { Metadata } from "next";
import { Fraunces, Archivo, Instrument_Serif, JetBrains_Mono, Anton, Caveat } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Cursor } from "@/components/chrome/Cursor";
import { Nav } from "@/components/chrome/Nav";
import { Grain } from "@/components/chrome/Grain";
import { Develop } from "@/components/chrome/Develop";
import { BASE } from "@/lib/base";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });
const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton", display: "swap" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat", display: "swap" });

const ogImage = `${BASE}/og.png`;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://jadonli.com"),
  title: {
    default: "Jadon Li — Locked In",
    template: "%s · Jadon Li",
  },
  description:
    "Jadon Li — senior at Mission San Jose High School, Class of 2027. Student leader, civic storyteller, researcher, builder, and athlete. One person, locked in — a portfolio in seven worlds.",
  openGraph: {
    title: "Jadon Li — Locked In",
    description:
      "Jadon Li — senior, Class of 2027. Student leader · civic storyteller · researcher · builder · athlete. One person, locked in.",
    type: "website",
    images: [{ url: ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    description:
      "Jadon Li — senior, Class of 2027. Student leader · civic storyteller · researcher · builder · athlete. One person, locked in.",
    images: [ogImage],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        data-cursor="on"
        className={`${fraunces.variable} ${archivo.variable} ${instrument.variable} ${jetbrains.variable} ${anton.variable} ${caveat.variable} antialiased`}
      >
        <Grain />
        <Cursor />
        <Nav />
        <Develop />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
