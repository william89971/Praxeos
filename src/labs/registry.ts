import type { LabRegistryEntry, LabSlug } from "./types";

export const LAB_REGISTRY: readonly LabRegistryEntry[] = [
  {
    slug: "choice-machine",
    position: 1,
    title: "The Choice Machine",
    shortTitle: "Choice Machine",
    centralQuestion: "What does one choice reveal—and what does it leave unseen?",
    familiarSituation:
      "Your afternoon is open, but your time, money, attention, and energy are not.",
    duration: "6–8 minutes",
    sourceIds: ["mises-human-action-action", "menger-principles-value"],
    lessonSlugs: ["man-acts", "choice-and-tradeoff", "opportunity-cost"],
    visualAsset: "/images/labs/choice-machine.webp",
    accent: "action",
    load: () => import("@/labs/choice-machine"),
  },
  {
    slug: "market-without-a-manager",
    position: 2,
    title: "Market Without a Manager",
    shortTitle: "Market",
    centralQuestion: "How can strangers coordinate without one person directing them?",
    familiarSituation:
      "A small market opens with different goods, priorities, knowledge, and no central plan.",
    duration: "8–10 minutes",
    sourceIds: [
      "menger-money-origin",
      "hayek-knowledge-1945",
      "mises-calculation-1920",
      "price-controls-openstax",
    ],
    lessonSlugs: ["exchange", "prices-and-knowledge", "subjective-value"],
    visualAsset: "/images/labs/market-without-a-manager.webp",
    accent: "money",
    flagship: true,
    load: () => import("@/labs/market-without-a-manager"),
  },
  {
    slug: "entrepreneurs-discovery",
    position: 3,
    title: "The Entrepreneur’s Discovery",
    shortTitle: "Discovery",
    centralQuestion: "How do you act when the opportunity cannot be known in advance?",
    familiarSituation:
      "People keep abandoning a task halfway through. You see a possible service—but not certainty.",
    duration: "7–9 minutes",
    sourceIds: ["kirzner-competition", "lachmann-market-process"],
    lessonSlugs: ["ends-and-means", "choice-and-tradeoff", "apply-it-to-your-life"],
    visualAsset: "/images/labs/entrepreneurs-discovery.webp",
    accent: "capital",
    load: () => import("@/labs/entrepreneurs-discovery"),
  },
  {
    slug: "money-time-machine",
    position: 4,
    title: "The Money Time Machine",
    shortTitle: "Money & Time",
    centralQuestion:
      "Who experiences a monetary change first—and who experiences it later?",
    familiarSituation:
      "Six people begin in different positions before the monetary rule changes.",
    duration: "8–10 minutes",
    sourceIds: [
      "mises-money-credit",
      "cantillon-essay-trade",
      "fed-monetary-transmission",
    ],
    lessonSlugs: ["time-preference", "prices-and-knowledge", "apply-it-to-your-life"],
    visualAsset: "/images/labs/money-time-machine.webp",
    accent: "money",
    load: () => import("@/labs/money-time-machine"),
  },
] as const;

export function findLab(slug: string): LabRegistryEntry | undefined {
  return LAB_REGISTRY.find((lab) => lab.slug === slug);
}

export function adjacentLabs(slug: LabSlug) {
  const index = LAB_REGISTRY.findIndex((lab) => lab.slug === slug);
  return {
    previous: index > 0 ? (LAB_REGISTRY[index - 1] ?? null) : null,
    next: index >= 0 ? (LAB_REGISTRY[index + 1] ?? null) : null,
  };
}
