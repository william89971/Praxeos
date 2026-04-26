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
    "A circular orchard of slim cypresses arranged in three concentric rings. Each cypress represents an individual actor; faint lines connect each tree to its three nearest neighbours. Click any tree to make that actor 'act'; a pulse of warm amber light radiates outward through the network, lighting nearest neighbours, then theirs, with a brief delay at each hop. In Guided mode, actions auto-fire in a slow rotation, so the orchard reorganizes continuously. The lesson is visible in the residue: coordinated motion that no-one designed.",
  discussionPrompt:
    "If no-one is in charge of the orchard, what makes the pulses meaningful? What makes them mean the same thing to everyone receiving them?",
  learningOutcomes: [
    "See human action as the elementary unit of economic life.",
    "Understand spontaneous order as the unintended consequence of intended choices.",
    "Recognize coordination as something that is observed, not designed.",
    "Distinguish action from behaviour; preference from prediction.",
  ],
};
