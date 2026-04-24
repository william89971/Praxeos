import type { ModuleMetadata } from "@/types/module";

export const metadata: ModuleMetadata = {
  slug: "time-preference-forest",
  title: "The Time Preference Forest",
  subtitle:
    "Austrian capital theory as an eighteenth-century woodcut. Roots go where saving goes; the canopy is only as real as the roots.",
  concept: "time-preference",
  thinkers: ["bohm-bawerk", "mises", "rothbard", "hayek"],
  complexity: 4,
  readingTimeMin: 12,
  publishedAt: "2026-04-23",
  fascicle: 1,
  moduleNumber: 2,
  bestOn: "any",
  hasMath: false,
  hasAudio: false,
  posterSrc: "/posters/time-preference-forest.svg",
  sketchDescription:
    "A woodcut-style generative forest. The reader controls three parameters: time preference (how patient the agents are), central-bank intervention (how aggressively credit is expanded), and — once the reader has experienced one correction cycle — the savings rate. Low time preference and high savings produce tall trees with deep roots and a visible mycorrhizal network. High time preference produces stumps and shallow soil. When intervention is active an orange glow appears beneath the canopy; the canopy inflates but the root system does not change. Pressing 'market correction' plays an eight-second cascade: the orange dissipates, the artificially grown branches blacken, and the trees fall — revealing that the real capital depth was always the root system.",
  discussionPrompt:
    "If the central bank can make the canopy look any shape it likes, how does the economy come to know what shape its capital structure actually has?",
  learningOutcomes: [
    "Understand time preference as the root of interest rates and capital depth.",
    "See why low time preference enables roundabout production and economic growth.",
    "Recognize how credit expansion distorts the capital structure without increasing real savings.",
    "Trace the Austrian business cycle from artificial boom to necessary correction.",
  ],
};
