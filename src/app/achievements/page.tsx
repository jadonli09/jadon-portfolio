import type { Metadata } from "next";
import { World } from "@/components/chrome/World";
import { Footer } from "@/components/chrome/Footer";
import { ClimbGame } from "@/components/achievements/climb/ClimbGame";

export const metadata: Metadata = {
  title: "Achievements",
  description:
    "Every achievement, on the way up Mission Peak — NCS Champions, a UMass research summer, ASB President, Youth Advisory Commission Chair, AcornPrep, SAT 1540, ACT 35, eleven AP fives, and more.",
};

/** Achievements: a walkable climb up Mission Peak, 2021 → the summit. */
export default function AchievementsPage() {
  return (
    <World id="achievements">
      <ClimbGame />
      <Footer />
    </World>
  );
}
