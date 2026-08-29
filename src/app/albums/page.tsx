import type { Metadata } from "next";
import { World } from "@/components/chrome/World";
import { Footer } from "@/components/chrome/Footer";
import { AlbumsHero } from "@/components/albums/AlbumsHero";
import { AlbumGallery } from "@/components/albums/AlbumGallery";
import { SelfieMatchCut } from "@/components/albums/SelfieMatchCut";

export const metadata: Metadata = {
  title: "Albums",
  description:
    "The photo archive — every original frame from the court, the podium, the lens, the lab, the climb, and the summer before senior year, plus a 45-selfie match cut.",
};

/**
 * Albums world — a darkroom contact sheet. The hero scatters frames behind the
 * cursor (image trail); below it, every original photo sits in six titled albums.
 */
export default function AlbumsPage() {
  return (
    <World id="albums">
      {/* 1. Cursor-trail hero over the ALBUMS headline */}
      <AlbumsHero />

      {/* 2. The selfie match cut — summer 2026, one face, hard cuts */}
      <SelfieMatchCut />

      {/* 3. Seven albums, masonry at natural aspect */}
      <AlbumGallery />

      {/* 3. Footer */}
      <Footer />
    </World>
  );
}
