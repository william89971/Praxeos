import type { ModuleMetadata } from "@/types/module";

export const metadata: ModuleMetadata = {
  slug: "signal-orchard",
  title: "The Signal Orchard",
  subtitle:
    "Human action, made visible. Coordination is the residue of private choices.",
  concept: "spontaneous-order",
  thinkers: ["mises", "hayek", "kirzner", "lachmann"],
  complexity: 3,
  readingTimeMin: 9,
  publishedAt: "2026-04-26",
  fascicle: 1,
  moduleNumber: 2,
  bestOn: "any",
  hasMath: false,
  hasAudio: false,
  posterSrc: "/posters/signal-orchard.svg",
  sketchDescription:
    "A circular orchard of slim cypresses arranged in three concentric rings. Each cypress represents an individual actor; faint lines connect each tree to its three nearest neighbours. Choose buy, sell, wait, or discover, then click a tree to make that actor act. A distinct pulse radiates outward through the network, neighbors update, and an action log records the private choice becoming public order. In Guided mode, actions auto-fire in a slow rotation so the orchard reorganizes continuously.",
  discussionPrompt:
    "If no-one is in charge of the orchard, what makes the pulses meaningful? What makes them mean the same thing to everyone receiving them?",
  learningOutcomes: [
    "See human action as the elementary unit of economic life.",
    "Understand spontaneous order as the unintended consequence of intended choices.",
    "Recognize coordination as something that is observed, not designed.",
    "Distinguish action from behaviour; preference from prediction.",
  ],
};
