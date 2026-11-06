import type { Metadata } from "next";
import { World } from "@/components/chrome/World";
import { Footer } from "@/components/chrome/Footer";
import { ClimbGame } from "@/components/milestones/climb/ClimbGame";

export const metadata: Metadata = {
  title: "Milestones",
  description:
    "Every milestone on the way up Mission Peak — NCS Champions, a UMass research summer, ASB President, Youth Advisory Commission Chair, AcornPrep, SAT 1540, ACT 35, eleven AP fives, and more.",
};

/** Milestones: a walkable climb up Mission Peak, 2021 → the summit. */
export default function MilestonesPage() {
  return (
    <World id="milestones">
      <ClimbGame />
      <Footer />
    </World>
  );
}
