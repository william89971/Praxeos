import type { ModuleMetadata } from "@/types/module";

export const metadata: ModuleMetadata = {
  slug: "calculation-problem",
  title: "The Calculation Problem",
  subtitle:
    "Mises's 1920 argument rendered as a two-panel typographic particle system.",
  concept: "economic-calculation",
  thinkers: ["mises", "hayek", "salerno", "rothbard"],
  complexity: 5,
  readingTimeMin: 18,
  publishedAt: "2026-04-23",
  fascicle: 1,
  moduleNumber: 3,
  bestOn: "desktop",
  hasMath: false,
  hasAudio: false,
  posterSrc: "/posters/calculation-problem.svg",
  sketchDescription:
    "Two economies run side by side with identical agents and technology. In the left panel, prices emerge from local bilateral exchange: producers post asks, consumers demand by Cobb-Douglas preference, and price-adjustment loops pull the system toward discovered valuations. Supply chains form as faint lines between agents. In the right panel, there are no prices. The planner allocates by equal share and, when multiple recipes exist for a good, picks among them by a hash of the current tick and producer id — deterministically, but economically meaninglessly. As the complexity slider rises, the right panel's waste grows markedly while the left panel continues to coordinate.",
  discussionPrompt:
    "If a planner cannot compute the relative economy of alternative production plans without market prices, what does it mean to say that such a planner has a 'plan' at all?",
  learningOutcomes: [
    "Understand why prices are a knowledge-compression mechanism, not merely incentives.",
    "See that economic calculation requires a common unit of valuation for producer goods.",
    "Recognize why adding goods to a planned economy is a global problem, not a local one.",
    "Distinguish Mises's argument (impossibility) from Hayek's (impracticality) and Salerno's reconstruction.",
  ],
};
