import type { ModuleMetadata } from "@/types/module";

export const metadata: ModuleMetadata = {
  slug: "calculation-labyrinth",
  title: "The Calculation Labyrinth",
  subtitle:
    "Mises's 1920 argument made literal: try to plan without prices, and watch the map disappear.",
  concept: "economic-calculation",
  thinkers: ["mises", "hayek", "rothbard", "salerno"],
  complexity: 4,
  readingTimeMin: 10,
  publishedAt: "2026-04-26",
  fascicle: 1,
  moduleNumber: 3,
  bestOn: "desktop",
  hasMath: false,
  hasAudio: false,
  posterSrc: "/posters/calculation-labyrinth.svg",
  sketchDescription:
    "A top-down 3D maze. A small octahedral pawn — the planner — starts at one corner; a glowing torus-knot goal sits at the opposite corner. A chain of price markers shimmers in amber along the canonical shortest path. Toggle 'Without market prices' and the markers vanish, the walls flicker oxblood, and the pawn wanders aimlessly within a small radius of the start, unable to compute its route. Toggle back and the path lights up and the pawn glides across it. The point of the contrast is Mises's 1920 thesis: prices are not incentives but the only available method of comparing alternative production plans.",
  discussionPrompt:
    "Mises's claim is that even an honest, omniscient planner cannot compute. What about a planner with arbitrary computing power but no prices?",
  learningOutcomes: [
    "Understand Mises's 1920 calculation argument as a problem of computation, not motivation.",
    "See market prices as the necessary medium of comparison between production plans.",
    "Distinguish technical efficiency from economic efficiency.",
    "Recognize central planning as an information problem, not just a values problem.",
  ],
};
