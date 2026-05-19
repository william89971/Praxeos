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
  moduleNumber: 1,
  bestOn: "desktop",
  hasMath: false,
  hasAudio: false,
  posterSrc: "/posters/monetary-garden.svg",
  sketchDescription:
    "A top-down view of a garden economy. Trees, grass, water, production nodes, and slim paths respond to credit expansion, savings backing, and a correction reveal. Easy credit can produce visible boom growth while draining the reservoir and spreading malinvestment patches. Higher savings keeps the signal clearer and the capital structure steadier. When correction is revealed, unsupported growth collapses, dead zones widen, and output adjusts toward what real saving can sustain.",
  discussionPrompt:
    "If the signal that prices carry is what allows strangers to coordinate, what is left of an economy when the signal can be edited at will?",
  learningOutcomes: [
    "See why prices function as signals carrying dispersed information.",
    "Understand the Cantillon effect — that new money distorts relative prices.",
    "Recognize malinvestment as a structural consequence of corrupted signals.",
    "Distinguish growth funded by saving from growth funded by credit expansion.",
  ],
};
