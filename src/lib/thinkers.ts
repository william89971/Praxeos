import type { ThinkerSlug } from "@/types/module";
import type { MDXComponents } from "mdx/types";
import type { ComponentType } from "react";

type BioComponent = ComponentType<{ components?: MDXComponents }>;

/**
 * Static import map of thinker bio MDX files.
 * Keeps the dynamic route free of `dynamic()` + Turbopack edge cases.
 */
const THINKER_LOADERS: Record<ThinkerSlug, () => Promise<{ default: BioComponent }>> = {
  menger: () => import("@/content/thinkers/menger.mdx"),
  "bohm-bawerk": () => import("@/content/thinkers/bohm-bawerk.mdx"),
  mises: () => import("@/content/thinkers/mises.mdx"),
  hayek: () => import("@/content/thinkers/hayek.mdx"),
  rothbard: () => import("@/content/thinkers/rothbard.mdx"),
  kirzner: () => import("@/content/thinkers/kirzner.mdx"),
  lachmann: () => import("@/content/thinkers/lachmann.mdx"),
  hoppe: () => import("@/content/thinkers/hoppe.mdx"),
  salerno: () => import("@/content/thinkers/salerno.mdx"),
  ammous: () => import("@/content/thinkers/ammous.mdx"),
};

export async function loadThinkerBio(slug: ThinkerSlug) {
  const loader = THINKER_LOADERS[slug];
  const mod = await loader();
  return mod.default;
}

export interface ThinkerMeta {
  slug: ThinkerSlug;
  name: string;
  dates: string;
  group: "Foundations" | "Praxeology" | "Process" | "Money";
  contribution: string;
  shortHistory: string;
  praxeologySignificance: string;
  praxeosRelevance: string;
  keyWorks: readonly string[];
  primaryLinks: readonly {
    title: string;
    url: string;
  }[];
}

export const THINKERS: readonly ThinkerMeta[] = [
  {
    slug: "menger",
    name: "Carl Menger",
    dates: "1840–1921",
    group: "Foundations",
    contribution:
      "Founded the Austrian school. Subjective theory of value; origin of money.",
    shortHistory:
      "An Austrian economist whose 1871 Principles of Economics helped launch the marginal revolution and gave the Austrian school its subjectivist starting point.",
    praxeologySignificance:
      "Menger put individual valuation, marginal utility, and causal-realistic analysis at the center of economics, preparing the ground for later praxeological method.",
    praxeosRelevance:
      "Praxeos begins with acting persons, not aggregates. Menger supplies the site’s treatment of subjective value, spontaneous monetary emergence, and goods ordered by human plans.",
    keyWorks: [
      "Principles of Economics",
      "Investigations into the Method of the Social Sciences",
      "On the Origins of Money",
    ],
    primaryLinks: [
      {
        title: "Principles of Economics",
        url: "https://mises.org/library/principles-economics",
      },
    ],
  },
  {
    slug: "bohm-bawerk",
    name: "Eugen von Böhm-Bawerk",
    dates: "1851–1914",
    group: "Foundations",
    contribution:
      "Austrian capital theory; pure time-preference theory of interest; roundaboutness.",
    shortHistory:
      "A student of Menger's generation, Böhm-Bawerk developed Austrian capital and interest theory while also serving in public finance roles in Austria-Hungary.",
    praxeologySignificance:
      "His work explains why production takes time, why capital has structure, and why interest is not an arbitrary price but a feature of intertemporal choice.",
    praxeosRelevance:
      "The site’s capital and time-preference imagery depends on his insight that longer production chains must be coordinated through saving, prices, and expectations.",
    keyWorks: [
      "Capital and Interest",
      "The Positive Theory of Capital",
      "Karl Marx and the Close of His System",
    ],
    primaryLinks: [
      {
        title: "Capital and Interest",
        url: "https://mises.org/library/book/capital-and-interest",
      },
    ],
  },
  {
    slug: "mises",
    name: "Ludwig von Mises",
    dates: "1881–1973",
    group: "Praxeology",
    contribution:
      "Praxeology; economic calculation argument; regression theorem; systematic Austrian economics.",
    shortHistory:
      "An Austrian and later American economist who rebuilt economics around human action and carried the Austrian tradition through war, exile, and postwar academia.",
    praxeologySignificance:
      "Mises named praxeology as the general science of purposeful human action and showed why monetary calculation requires real market prices for capital goods.",
    praxeosRelevance:
      "Praxeos takes its method, its calculation problem, and much of its monetary architecture from Mises’s action-first system.",
    keyWorks: [
      "Human Action",
      "Socialism",
      "The Theory of Money and Credit",
      "Economic Calculation in the Socialist Commonwealth",
    ],
    primaryLinks: [
      {
        title: "Human Action",
        url: "https://mises.org/library/book/human-action",
      },
      {
        title: "Economic Calculation in the Socialist Commonwealth",
        url: "https://mises.org/online-book/economic-calculation-socialist-commonwealth",
      },
    ],
  },
  {
    slug: "hayek",
    name: "F. A. Hayek",
    dates: "1899–1992",
    group: "Process",
    contribution:
      "Knowledge problem; spontaneous order; Austrian business-cycle theory; rule of law.",
    shortHistory:
      "Austrian-born economist and social theorist who worked in Vienna, London, Chicago, Freiburg, and Salzburg and received the 1974 Nobel Memorial Prize in Economics.",
    praxeologySignificance:
      "Hayek emphasized dispersed knowledge, price signals, and orders nobody designs but many people help produce through action.",
    praxeosRelevance:
      "Market Without a Manager uses local priorities, incomplete information, offers, and completed trades to examine how coordination can emerge without a central director.",
    keyWorks: [
      "Prices and Production",
      "The Use of Knowledge in Society",
      "The Road to Serfdom",
      "Law, Legislation and Liberty",
    ],
    primaryLinks: [
      {
        title: "The Use of Knowledge in Society",
        url: "https://www.econlib.org/library/Essays/hykKnw.html",
      },
    ],
  },
  {
    slug: "rothbard",
    name: "Murray Rothbard",
    dates: "1926–1995",
    group: "Praxeology",
    contribution:
      "Systematiser of the tradition; ABCT applied; monetary history; sound money.",
    shortHistory:
      "An American economist and historian who extended Misesian economics into a comprehensive treatise, monetary history, political economy, and libertarian theory.",
    praxeologySignificance:
      "Rothbard sharpened the deductive presentation of praxeology and applied it across monopoly, intervention, banking, and historical episodes.",
    praxeosRelevance:
      "Praxeos borrows Rothbard’s systematic clarity when translating abstract causal chains into interactive mechanisms.",
    keyWorks: [
      "Man, Economy, and State",
      "Power and Market",
      "America's Great Depression",
      "What Has Government Done to Our Money?",
    ],
    primaryLinks: [
      {
        title: "Man, Economy, and State with Power and Market",
        url: "https://mises.org/online-book/man-economy-and-state-power-and-market",
      },
    ],
  },
  {
    slug: "kirzner",
    name: "Israel Kirzner",
    dates: "1930–",
    group: "Process",
    contribution: "Entrepreneurship as alertness; market as process, not state.",
    shortHistory:
      "A Mises student at New York University who became one of the leading postwar interpreters of Austrian market-process economics.",
    praxeologySignificance:
      "Kirzner shows that markets are not static equilibria; they are processes driven by entrepreneurial alertness to unnoticed opportunities.",
    praxeosRelevance:
      "The action mechanics in Praxeos treat choice as discovery, not button-pushing inside a finished model.",
    keyWorks: [
      "Competition and Entrepreneurship",
      "The Meaning of Market Process",
      "Discovery, Capitalism, and Distributive Justice",
    ],
    primaryLinks: [
      {
        title: "Competition and Entrepreneurship",
        url: "https://store.mises.org/Competition-and-Entrepreneurship-P40.aspx",
      },
    ],
  },
  {
    slug: "lachmann",
    name: "Ludwig Lachmann",
    dates: "1906–1990",
    group: "Process",
    contribution: "Heterogeneous capital; subjective expectations; kaleidic economy.",
    shortHistory:
      "A German-born Austrian economist who worked in Britain and South Africa and pushed the tradition toward expectations, uncertainty, and heterogeneous capital.",
    praxeologySignificance:
      "Lachmann stressed that capital goods are complements inside plans and that expectations can shift the whole pattern of coordination.",
    praxeosRelevance:
      "Praxeos uses his capital theory whenever a scene shows structure, fragility, and plan failure rather than a smooth aggregate.",
    keyWorks: [
      "Capital and Its Structure",
      "The Market as an Economic Process",
      "Capital, Expectations, and the Market Process",
    ],
    primaryLinks: [
      {
        title: "Capital and Its Structure",
        url: "https://mises.org/library/book/capital-and-its-structure",
      },
    ],
  },
  {
    slug: "hoppe",
    name: "Hans-Hermann Hoppe",
    dates: "1949–",
    group: "Praxeology",
    contribution:
      "Argumentation ethics; time-preference analysis of political regimes.",
    shortHistory:
      "A German-born economist and philosopher associated with the Mises-Rothbard tradition, known for work on property, argumentation, and political order.",
    praxeologySignificance:
      "Hoppe extends action-based reasoning into argumentation, property norms, and the time-preference incentives created by political institutions.",
    praxeosRelevance:
      "For Praxeos, his significance is methodological: he treats social order as a consequence of action, ownership, and institutional incentives.",
    keyWorks: [
      "A Theory of Socialism and Capitalism",
      "The Economics and Ethics of Private Property",
      "Democracy: The God That Failed",
    ],
    primaryLinks: [
      {
        title: "Democracy: The God That Failed",
        url: "https://hanshoppe.com/democracy/",
      },
    ],
  },
  {
    slug: "salerno",
    name: "Joseph Salerno",
    dates: "1950–",
    group: "Money",
    contribution: "Reconstruction of Mises; Lange–Lerner critique; sound money.",
    shortHistory:
      "An American Austrian economist whose scholarship reconstructs Mises’s calculation argument, monetary theory, and the history of economic thought.",
    praxeologySignificance:
      "Salerno clarifies the Misesian distinction between knowledge and calculation: planners lack not only information, but money prices generated by exchange.",
    praxeosRelevance:
      "The Calculation Labyrinth leans on this distinction by showing why visible data still cannot substitute for appraisable money costs.",
    keyWorks: [
      "Money: Sound and Unsound",
      "Calculation and Socialism",
      "Ludwig von Mises as Social Rationalist",
    ],
    primaryLinks: [
      {
        title: "Money: Sound and Unsound",
        url: "https://mises.org/mises-daily/money-sound-and-unsound",
      },
    ],
  },
  {
    slug: "ammous",
    name: "Saifedean Ammous",
    dates: "1980–",
    group: "Money",
    contribution:
      "Bitcoin as sound money; stock-to-flow; digital realisation of Mengerian monetary tradition.",
    shortHistory:
      "A contemporary economist and author whose work popularized an Austrian account of Bitcoin as hard money for a digital age.",
    praxeologySignificance:
      "Ammous applies Austrian monetary theory to modern fiat systems and to Bitcoin’s fixed-supply, settlement-oriented design.",
    praxeosRelevance:
      "Praxeos uses his work as a modern bridge between Mengerian monetary emergence, Misesian calculation, and Bitcoin-era sound-money debates.",
    keyWorks: ["The Bitcoin Standard", "The Fiat Standard", "Principles of Economics"],
    primaryLinks: [
      {
        title: "The Bitcoin Standard",
        url: "https://saifedean.com/tbs",
      },
      {
        title: "The Fiat Standard",
        url: "https://saifedean.com/tfs",
      },
    ],
  },
];
