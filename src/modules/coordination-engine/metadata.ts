import type { ModuleMetadata } from "@/types/module";

export const metadata: ModuleMetadata = {
  slug: "coordination-engine",
  title: "The Coordination Engine",
  subtitle:
    "Money is the shared signal layer that lets millions act as if they had agreed.",
  concept: "spontaneous-order",
  thinkers: ["mises", "hayek", "rothbard", "lachmann"],
  complexity: 4,
  readingTimeMin: 10,
  publishedAt: "2026-04-26",
  fascicle: 1,
  moduleNumber: 4,
  bestOn: "desktop",
  hasMath: false,
  hasAudio: false,
  posterSrc: "/posters/coordination-engine.svg",
  sketchDescription:
    "Forty-two agents arranged on three concentric rings in 3D, connected by curved signal edges. Signal reliability, latency, and shocks drive the network: high reliability locks pulses into a shared phase, while latency and shocks scatter timing, darken links, and reduce throughput. Tapping a node emits a demand or supply pulse through neighboring edges. Guided mode demonstrates synchrony breaking; Explore mode lets the reader tune reliability and latency directly.",
  discussionPrompt:
    "If money is the medium of coordination, what is left of an economy whose money has been engineered to convey something other than the truth?",
  learningOutcomes: [
    "Understand money as an information good, not just a medium of exchange.",
    "See coordination as an emergent property of the price-signal network.",
    "Recognize how monetary distortion propagates as phase decoherence across plans.",
    "Distinguish nominal from real coordination, and synchrony from agreement.",
  ],
};
