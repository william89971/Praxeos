import type { ModuleMetadata } from "@/types/module";

export const metadata: ModuleMetadata = {
  slug: "monetary-garden",
  title: "The Monetary Garden",
  subtitle: "A living model of what happens when the money signal is distorted.",
  concept: "cantillon-effect",
  thinkers: ["mises", "hayek", "rothbard", "lachmann"],
  complexity: 4,
  readingTimeMin: 11,
  publishedAt: "2026-04-25",
  fascicle: 1,
  moduleNumber: 4,
  bestOn: "desktop",
  hasMath: false,
  hasAudio: false,
  posterSrc: "/posters/monetary-garden.svg",
  sketchDescription:
    "A top-down view of a calm garden plot. Trees, grass, water, production nodes, and the slim paths that connect them respond to a single control labelled money supply / signal distortion. At low distortion the scene is steady: water full, trees upright, paths smooth. As the slider rises, grass overgrows then dies in patches, water drains, trees deform and some collapse, paths warp, and dead zones — malinvestment — spread across the ground. A vertical signal beam above the plot shifts from clean amber to oxblood as the unit of account is debased.",
  discussionPrompt:
    "If the signal that prices carry is what allows strangers to coordinate, what is left of an economy when the signal can be edited at will?",
  learningOutcomes: [
    "See why prices function as signals carrying dispersed information.",
    "Understand the Cantillon effect — that new money distorts relative prices.",
    "Recognize malinvestment as a structural consequence of corrupted signals.",
    "Distinguish growth funded by saving from growth funded by credit expansion.",
  ],
};
