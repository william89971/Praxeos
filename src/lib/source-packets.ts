import type { EvidenceKind, LabSlug } from "@/labs/types";

export interface SourcePacket {
  id: string;
  title: string;
  author: string;
  url: string;
  locator: string;
  kind: Extract<
    EvidenceKind,
    "source claim" | "Austrian interpretation" | "credible counterargument"
  >;
  claims: readonly string[];
  labSlugs: readonly LabSlug[];
  verificationNote: string;
}

export const SOURCE_PACKETS: readonly SourcePacket[] = [
  {
    id: "mises-human-action-action",
    title: "Human Action",
    author: "Ludwig von Mises",
    url: "https://oll.libertyfund.org/titles/greaves-human-action-a-treatise-on-economics-fee-ed",
    locator: "Part One, Chapter I, sections 1–2",
    kind: "Austrian interpretation",
    claims: [
      "Mises defines human action as purposeful behavior directed toward chosen ends.",
      "Within this framework, actors use means because they expect action to replace a less satisfactory state with a more satisfactory one.",
    ],
    labSlugs: ["choice-machine"],
    verificationNote:
      "Retained from the original allowlist; locator narrows the claim.",
  },
  {
    id: "menger-principles-value",
    title: "Principles of Economics",
    author: "Carl Menger",
    url: "https://mises.org/library/book/principles-economics",
    locator: "Chapter III, sections 1–3",
    kind: "Austrian interpretation",
    claims: [
      "Menger ties value to a person’s recognition that satisfaction of a need depends on command of a good.",
      "A choice in one moment does not by itself establish a permanent ranking for every future context.",
    ],
    labSlugs: ["choice-machine", "market-without-a-manager"],
    verificationNote:
      "Retained from the original allowlist with a narrower inference boundary.",
  },
  {
    id: "menger-money-origin",
    title: "On the Origin of Money",
    author: "Carl Menger",
    url: "https://mises.org/library/book/origins-money",
    locator:
      "Economic Journal 2 (1892), sections on saleableness and indirect exchange",
    kind: "Austrian interpretation",
    claims: [
      "Menger describes indirect exchange emerging when traders accept a more saleable good to make later exchange easier.",
      "The argument is an account of one market process, not a claim that every historical currency emerged in the same institutional way.",
    ],
    labSlugs: ["market-without-a-manager"],
    verificationNote: "Migrated from the market and money source cluster.",
  },
  {
    id: "hayek-knowledge-1945",
    title: "The Use of Knowledge in Society",
    author: "F. A. Hayek",
    url: "https://www.econlib.org/library/Essays/hykKnw.html",
    locator: "American Economic Review 35(4), sections I–VI",
    kind: "Austrian interpretation",
    claims: [
      "Hayek argues that knowledge relevant to economic coordination is dispersed among many people.",
      "He describes price changes as a way to communicate some information without every participant possessing the complete underlying facts.",
    ],
    labSlugs: ["market-without-a-manager"],
    verificationNote:
      "Retained from the original allowlist and legacy Signal Orchard sources.",
  },
  {
    id: "mises-calculation-1920",
    title: "Economic Calculation in the Socialist Commonwealth",
    author: "Ludwig von Mises",
    url: "https://mises.org/library/book/economic-calculation-socialist-commonwealth",
    locator: "Sections II–IV",
    kind: "Austrian interpretation",
    claims: [
      "Mises argues that exchange-generated money prices permit heterogeneous production plans to be compared in a common monetary unit.",
      "This is a contested argument in the calculation debate; the Lab demonstrates a simplified model rather than proving the full thesis.",
    ],
    labSlugs: ["market-without-a-manager"],
    verificationNote:
      "Migrated from Calculation Labyrinth with a contestability label.",
  },
  {
    id: "price-controls-openstax",
    title: "Price Ceilings and Price Floors",
    author: "OpenStax",
    url: "https://openstax.org/books/principles-economics-3e/pages/3-4-price-ceilings-and-price-floors",
    locator: "Principles of Economics 3e, section 3.4",
    kind: "credible counterargument",
    claims: [
      "A binding price ceiling can create excess quantity demanded in a standard supply-and-demand model.",
      "Real outcomes also depend on enforcement, allocation rules, quality changes, supply response, market power, and the time horizon—details simplified by the Lab.",
    ],
    labSlugs: ["market-without-a-manager"],
    verificationNote:
      "Added to separate the simulation mechanism from universal policy claims.",
  },
  {
    id: "kirzner-competition",
    title: "Competition and Entrepreneurship",
    author: "Israel M. Kirzner",
    url: "https://press.uchicago.edu/ucp/books/book/chicago/C/bo27304815.html",
    locator: "Chapters 1–2",
    kind: "Austrian interpretation",
    claims: [
      "Kirzner presents entrepreneurship as alertness to previously unnoticed opportunities within a competitive market process.",
      "A simulation can model hypothesis and discovery but cannot establish that an opportunity was objectively obvious or riskless.",
    ],
    labSlugs: ["entrepreneurs-discovery"],
    verificationNote: "Migrated from the Signal Orchard source list.",
  },
  {
    id: "lachmann-market-process",
    title: "The Market as an Economic Process",
    author: "Ludwig M. Lachmann",
    url: "https://www.mercatus.org/hayekprogram/research/books/market-economic-process",
    locator: "Chapters 1 and 3",
    kind: "Austrian interpretation",
    claims: [
      "Lachmann emphasizes plans, expectations, and change in an open-ended market process.",
      "Evidence can alter a plan without eliminating uncertainty or revealing a single perfect path.",
    ],
    labSlugs: ["entrepreneurs-discovery"],
    verificationNote: "Migrated from Signal Orchard and Coordination Engine sources.",
  },
  {
    id: "mises-money-credit",
    title: "The Theory of Money and Credit",
    author: "Ludwig von Mises",
    url: "https://mises.org/library/book/theory-money-and-credit",
    locator: "Part II, chapters 6–10; Part III, chapters 19–20",
    kind: "Austrian interpretation",
    claims: [
      "Mises analyzes changes in money through individual exchanges and purchasing-power relationships rather than a single uniform price adjustment.",
      "The Lab uses an illustrative rule set and does not reproduce the book’s full monetary theory.",
    ],
    labSlugs: ["money-time-machine"],
    verificationNote:
      "Migrated from Monetary Garden with a narrowed locator and model boundary.",
  },
  {
    id: "cantillon-essay-trade",
    title: "Essay on the Nature of Trade in General",
    author: "Richard Cantillon",
    url: "https://oll.libertyfund.org/titles/essay-on-the-nature-of-trade-in-general-lf-ed",
    locator: "Part II, chapters 6–8",
    kind: "source claim",
    claims: [
      "Cantillon describes monetary changes reaching people through particular spending channels rather than affecting everyone at once.",
      "The distribution and timing shown in the Lab are model outputs, not measurements of a current economy.",
    ],
    labSlugs: ["money-time-machine"],
    verificationNote:
      "Added as the historical basis for sequence-of-receipt comparisons.",
  },
  {
    id: "fed-monetary-transmission",
    title: "How Has the Monetary Transmission Mechanism Evolved Over Time?",
    author: "Jean Boivin, Michael T. Kiley, and Frederic S. Mishkin",
    url: "https://www.federalreserve.gov/econres/feds/how-has-the-monetary-transmission-mechanism-evolved-over-time.htm",
    locator: "FEDS 2010-26, abstract and introduction",
    kind: "credible counterargument",
    claims: [
      "Institutional accounts of monetary transmission include multiple channels, lags, expectations, and financial conditions.",
      "No small deterministic Lab can forecast the size, timing, or distribution of a real monetary-policy change.",
    ],
    labSlugs: ["money-time-machine"],
    verificationNote:
      "Added to prevent one theoretical tradition from being presented as the only account.",
  },
] as const;

export function sourcePacket(id: string): SourcePacket | undefined {
  return SOURCE_PACKETS.find((packet) => packet.id === id);
}

export function sourcePacketsForLab(labSlug: LabSlug): readonly SourcePacket[] {
  return SOURCE_PACKETS.filter((packet) => packet.labSlugs.includes(labSlug));
}
