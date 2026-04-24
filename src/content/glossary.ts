import type { Concept, ThinkerSlug } from "@/types/module";

/**
 * Glossary entries — one per concept referenced anywhere on the site.
 * Each entry carries a short headword, a 40–80 word definition in the
 * project's register, and cross-refs to thinkers and modules.
 */

export interface GlossaryEntry {
  slug: Concept;
  headword: string;
  sortKey: string;
  definition: string;
  thinkers: readonly ThinkerSlug[];
  /** Slugs of modules that treat the concept. */
  modules: readonly string[];
}

export const GLOSSARY: readonly GlossaryEntry[] = [
  {
    slug: "action-axiom",
    headword: "Action axiom",
    sortKey: "action axiom",
    definition:
      "The proposition, foundational to praxeology, that human beings engage in purposive behaviour — employing means to reach ends. Mises held it to be a priori true: the denial of the axiom is itself an action. All of economics is, on the Misesian account, implication of the axiom.",
    thinkers: ["mises", "hoppe", "rothbard"],
    modules: [],
  },
  {
    slug: "abct",
    headword: "Austrian business-cycle theory (ABCT)",
    sortKey: "austrian business-cycle theory",
    definition:
      "Mises and Hayek's account of booms and busts: when the central bank suppresses interest rates below the rate that would equate saving and investment, entrepreneurs are misled into initiating production structures too long for the available real capital. The boom is the misallocation; the bust is the correction.",
    thinkers: ["mises", "hayek", "rothbard"],
    modules: ["time-preference-forest"],
  },
  {
    slug: "cantillon-effect",
    headword: "Cantillon effect",
    sortKey: "cantillon effect",
    definition:
      "Newly-created money does not reach the economy uniformly — it enters at specific points (central banks, primary dealers, first borrowers) and prices rise as the money ripples outward. Early recipients buy at old prices; late recipients pay the new ones. Inflation is not neutral.",
    thinkers: ["rothbard", "mises"],
    modules: [],
  },
  {
    slug: "capital-theory",
    headword: "Capital theory",
    sortKey: "capital theory",
    definition:
      "The Austrian account of capital as a heterogeneous, time-structured arrangement of produced means of production. Capital goods are specific, complementary, and embedded in plans; they cannot be measured in a common unit without already having market prices for them.",
    thinkers: ["bohm-bawerk", "hayek", "lachmann"],
    modules: ["time-preference-forest"],
  },
  {
    slug: "economic-calculation",
    headword: "Economic calculation",
    sortKey: "economic calculation",
    definition:
      "The practical ability of an economic actor — firm or society — to compare alternative uses of scarce means by a common unit of valuation. Mises's 1920 argument: socialism cannot calculate because it lacks markets for capital goods, hence no prices for them, hence no unit.",
    thinkers: ["mises", "salerno", "hayek"],
    modules: ["calculation-problem"],
  },
  {
    slug: "entrepreneurship",
    headword: "Entrepreneurship (alertness)",
    sortKey: "entrepreneurship",
    definition:
      "Kirzner's reframing: the entrepreneur does not primarily invent; she notices a previously unnoticed price discrepancy or gain. Entrepreneurship is alertness — a cognitive act of perceiving, not a technological act of creation.",
    thinkers: ["kirzner", "mises"],
    modules: [],
  },
  {
    slug: "knowledge-problem",
    headword: "Knowledge problem",
    sortKey: "knowledge problem",
    definition:
      "Hayek's 1945 reframing of the economic problem: not 'allocate known resources to known ends' but coordinate the dispersed, tacit, locally-owned knowledge that no central observer can aggregate. Prices are the signal mechanism that lets this coordination happen.",
    thinkers: ["hayek", "mises"],
    modules: ["calculation-problem"],
  },
  {
    slug: "marginal-utility",
    headword: "Marginal utility",
    sortKey: "marginal utility",
    definition:
      "Menger's 1871 insight (simultaneously reached by Jevons and Walras): value arises from the utility of the marginal — last — unit, not from averages or totals. The diamond-water paradox dissolves: water is abundant, so its marginal unit is nearly worthless; diamonds are scarce.",
    thinkers: ["menger"],
    modules: [],
  },
  {
    slug: "regime-uncertainty",
    headword: "Regime uncertainty",
    sortKey: "regime uncertainty",
    definition:
      "Robert Higgs's term for the destruction of economic coordination when policy becomes unpredictable. Even mild policies imposed erratically raise time preference, shorten planning horizons, and suppress long-structure investment, because entrepreneurs cannot commit capital under unknowable future rules.",
    thinkers: ["hoppe"],
    modules: [],
  },
  {
    slug: "regression-theorem",
    headword: "Regression theorem",
    sortKey: "regression theorem",
    definition:
      "Mises's 1912 proof that the purchasing power of any money today must trace, via a chain of prior exchange values, back to some earlier point at which the good was valued for non-monetary reasons. Solves the chicken-and-egg puzzle of monetary value.",
    thinkers: ["mises", "menger", "ammous"],
    modules: ["halving-garden"],
  },
  {
    slug: "roundaboutness",
    headword: "Roundaboutness",
    sortKey: "roundaboutness",
    definition:
      "Böhm-Bawerk's Produktionsumweg — production detour. A capital-rich economy does not make consumer goods directly; it makes tools that make tools that make consumer goods. Longer detours are more productive per unit of labour but depend on the savings required to sustain the intermediate stages.",
    thinkers: ["bohm-bawerk", "hayek", "mises"],
    modules: ["time-preference-forest"],
  },
  {
    slug: "says-law",
    headword: "Say's law",
    sortKey: "says law",
    definition:
      "Supply creates its own demand — properly stated: production is the source of demand, because goods trade against goods. Money mediates but does not create purchasing power. The Keynesian underconsumptionist response denies this by importing a money-supply confusion into a goods-supply phenomenon.",
    thinkers: ["rothbard", "mises"],
    modules: [],
  },
  {
    slug: "sound-money",
    headword: "Sound money",
    sortKey: "sound money",
    definition:
      "Money whose issuance is constrained by something other than a political authority's preference — historically the cost of extracting gold, digitally the cost of mining Bitcoin. The constraint is the point: it prevents the debasement that every unconstrained issuer has, in history, chosen.",
    thinkers: ["rothbard", "ammous", "mises"],
    modules: ["halving-garden"],
  },
  {
    slug: "spontaneous-order",
    headword: "Spontaneous order",
    sortKey: "spontaneous order",
    definition:
      "Hayek's cosmos: order that arises from individual actions without having been designed. Language, common law, cities, prices, queues. Distinguished from taxis — made order, like a factory. Cosmic orders govern themselves by rules; trying to administer them like taxis produces incoherence.",
    thinkers: ["hayek", "menger"],
    modules: [],
  },
  {
    slug: "subjective-value",
    headword: "Subjective value",
    sortKey: "subjective value",
    definition:
      "Menger's claim that economic value resides in the individual valuer, not in the object valued. The same good is worth different amounts to different people; prices emerge as the compromise of these subjective valuations at exchange. Undoes the labour theory of value at the root.",
    thinkers: ["menger", "mises"],
    modules: [],
  },
  {
    slug: "time-preference",
    headword: "Time preference",
    sortKey: "time preference",
    definition:
      "The universal fact that a present good is, ceteris paribus, valued more than an otherwise identical future good. Böhm-Bawerk's pure time-preference theory locates interest here. Time preference is individual-relative; low time preference enables the saving that sustains long production structures.",
    thinkers: ["bohm-bawerk", "mises", "hoppe"],
    modules: ["time-preference-forest"],
  },
];
