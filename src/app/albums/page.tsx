import type { Metadata } from "next";
import { World } from "@/components/chrome/World";
import { Footer } from "@/components/chrome/Footer";
import { AlbumsHero } from "@/components/albums/AlbumsHero";
import { AlbumGallery } from "@/components/albums/AlbumGallery";

export const metadata: Metadata = {
  title: "Albums — Jadon Li",
  description:
    "The photo archive — every original frame from the court, the podium, the lens, the lab, and the climb, in one place.",
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

      {/* 2. Six albums, masonry at natural aspect */}
      <AlbumGallery />

      {/* 3. Footer (no next-world handoff — the archive sits outside the spine) */}
      <Footer />
    </World>
  );
}
