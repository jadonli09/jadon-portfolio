import {
  Atom, Award, BookOpen, Briefcase, Calculator, Clapperboard, Flame, GraduationCap, Handshake,
  Heart, Lightbulb, Medal, Megaphone, Milk, NotebookPen, Plane, Sparkles, Trophy, Users, Vote,
  type LucideIcon,
} from "lucide-react";

/** Entries with no photo anywhere yet get a glowing icon instead (keyed by TROPHIES title). */
export const ENTRY_ICONS: Record<string, LucideIcon> = {
  "ATDP Entrepreneurship — UC Berkeley": Lightbulb,
  "Began journaling": NotebookPen,
  "6× Academic Excellence — Hopkins": Award,
  "Continental Math League — 30/30": Calculator,
  "DECA Headstart — 2nd of 12": Briefcase,
  "Hopkins Basketball A-Team": Trophy,
  "China gym moment — 569k likes": Flame,
  "JP Basketball — co-founded": Users,
  "The milk-fridge crusade": Milk,
  "Tutoring business — founded": BookOpen,
  "City of Fremont Rec Director": Users,
  "Link Crew Leader": Handshake,
  "DECA — top 10 BTDM at SVCDC": Briefcase,
  "Lost ASB President by ~10 votes": Vote,
  "UK Biology Olympiad — Silver": Medal,
  "Varian tour": Atom,
  "Fremont Stories": Clapperboard,
  "HG Nguyen for D7 — social media": Megaphone,
  "Valentine's Scavenger Hunt": Heart,
  "CO26 Graduation — led planning": GraduationCap,
  "Six weeks in China": Plane,
};

export const FALLBACK_ICON = Sparkles;
