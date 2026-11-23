import type { Metadata } from "next";
import { Fraunces, Archivo, Instrument_Serif, JetBrains_Mono, Anton, Caveat } from "next/font/google";
import { MotionConfig } from "motion/react";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Cursor } from "@/components/chrome/Cursor";
import { Nav } from "@/components/chrome/Nav";
import { Grain } from "@/components/chrome/Grain";
import { Develop } from "@/components/chrome/Develop";
import { BASE } from "@/lib/base";
import { PersonJsonLd } from "@/components/chrome/PersonJsonLd";

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
  // Self-referencing canonical per route, so academy.jadonli.com and the
  // GitHub Pages copy point Google at jadonli.com.
  alternates: { canonical: "./" },
  description:
    "Jadon Li, senior in Fremont, CA. Builds tools that connect people: Salwan Central for Mayor Raj Salwan's office, and Rung, 2nd of 81 at a16z SpeedHacks. Chair of Fremont's Youth Advisory Commission and ASB President.",
  openGraph: {
    title: "Jadon Li — Locked In",
    description:
      "Builds tools that connect people: Salwan Central for Mayor Raj Salwan's office, and Rung, 2nd of 81 at a16z SpeedHacks.",
    type: "website",
    images: [{ url: ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    description:
      "Builds tools that connect people: Salwan Central for Mayor Raj Salwan's office, and Rung, 2nd of 81 at a16z SpeedHacks.",
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
        <PersonJsonLd />
        <MotionConfig reducedMotion="user">
          <Grain />
          <Cursor />
          <Nav />
          <Develop />
          <SmoothScroll>{children}</SmoothScroll>
        </MotionConfig>
        <Analytics />
      </body>
    </html>
  );
}
