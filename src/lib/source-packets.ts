export interface SourcePacket {
  id: string;
  title: string;
  author: string;
  url: string;
  locator: string;
  claims: readonly string[];
}

export const SOURCE_PACKETS: readonly SourcePacket[] = [
  {
    id: "mises-human-action-action",
    title: "Human Action",
    author: "Ludwig von Mises",
    url: "https://oll.libertyfund.org/titles/mises-human-action-a-treatise-on-economics",
    locator: "Part One, Chapter I, sections 1–2",
    claims: [
      "Human action is purposeful behavior directed toward chosen ends.",
      "Actors use means because they expect those means to replace a less satisfactory state with a more satisfactory one.",
    ],
  },
  {
    id: "mises-calculation-1920",
    title: "Economic Calculation in the Socialist Commonwealth",
    author: "Ludwig von Mises",
    url: "https://mises.org/library/book/economic-calculation-socialist-commonwealth",
    locator: "Sections II–IV",
    claims: [
      "Money prices for factors of production permit unlike production plans to be compared in a common unit.",
      "Without exchange in productive resources, a planner lacks market prices for those resources.",
    ],
  },
  {
    id: "hayek-knowledge-1945",
    title: "The Use of Knowledge in Society",
    author: "F. A. Hayek",
    url: "https://www.econlib.org/library/Essays/hykKnw.html",
    locator: "American Economic Review 35(4), sections I–VI",
    claims: [
      "Knowledge relevant to economic coordination is dispersed among many people.",
      "Price changes can communicate information that participants do not possess in its complete form.",
    ],
  },
  {
    id: "menger-principles-value",
    title: "Principles of Economics",
    author: "Carl Menger",
    url: "https://mises.org/library/book/principles-economics",
    locator: "Chapter III, sections 1–3",
    claims: [
      "A good has value because a person recognizes that satisfaction of a need depends on command of that good.",
      "Value is tied to the importance of the satisfactions a person expects a good to secure.",
    ],
  },
] as const;

export function sourcePacket(id: string): SourcePacket | undefined {
  return SOURCE_PACKETS.find((packet) => packet.id === id);
}

