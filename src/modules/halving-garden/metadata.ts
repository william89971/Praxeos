import type { ModuleMetadata } from "@/types/module";

export const metadata: ModuleMetadata = {
  slug: "halving-garden",
  title: "The Halving Garden",
  subtitle:
    "Every Bitcoin block from genesis to tip, rendered as a living generative manuscript.",
  concept: "sound-money",
  thinkers: ["menger", "mises", "hayek", "ammous", "rothbard"],
  complexity: 5,
  readingTimeMin: 14,
  publishedAt: "2026-04-23",
  fascicle: 1,
  moduleNumber: 1,
  bestOn: "desktop",
  hasMath: false,
  hasAudio: true,
  posterSrc: "/posters/halving-garden.svg",
  sketchDescription:
    "A sprawling generative manuscript of Bitcoin's history. Each confirmed block is rendered as a small botanical organism in the register of Ernst Haeckel's illustrations: a short pistil, a handful of radiating petals, optional tendrils. The form of every organism is a deterministic function of the block's hash — so the same block always produces the same shape. Block size drives overall radius; transaction count drives petal count; fee rate drives curl and tendril density; and the rare block with an unusually low hash (mined against high difficulty) earns a Bitcoin-orange pistil. The blocks are placed on a Hilbert curve within their halving epoch, so neighbouring blocks stay spatially close and difficulty adjustments appear as visible ripples. The page reads as five illuminated manuscript pages, one per halving epoch, separated by thin typographic plaques.",
  discussionPrompt:
    "What does it mean for a monetary rule to be 'real'? Is a schedule that nobody can change a stronger or weaker kind of law than one enforced by a court?",
  learningOutcomes: [
    "Understand why fixed supply is a monetary rule, not merely a protocol detail.",
    "See how Bitcoin's halving schedule creates a predictable stock-to-flow ratio over time.",
    "Grasp Menger's regression theorem: money emerges from a previously non-monetary good.",
    "Recognize the Cantillon effect — who receives new money first matters.",
  ],
};
