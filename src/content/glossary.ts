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
  sourceIds?: readonly string[];
  /** framework = a praxeological proposition; interpretation = a school’s argument; contested = a disputed historical or empirical claim. */
  status?: "framework" | "interpretation" | "contested";
}

export const GLOSSARY: readonly GlossaryEntry[] = [
  {
    slug: "action-axiom",
    headword: "Action axiom",
    sortKey: "action axiom",
    definition:
      "Within praxeology, action is purposeful behavior: a person employs means toward an end. Mises treats this as a starting point of the science. On his account, denying the proposition is itself an action, and the economic theorems he defends are implications of it. That is his framework, not a claim that every other school accepts the same starting point.",
    thinkers: ["mises", "hoppe", "rothbard"],
    sourceIds: ["mises-human-action-action"],
    status: "framework",
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
      "Calculation, in this framework, is the comparison of alternative uses of scarce means in a common unit. Mises’s 1920 argument is that a socialist commonwealth lacks markets for capital goods and therefore lacks the money prices those comparisons use. The argument is contested; the market lab demonstrates a small model of prices, not a proof of the full thesis.",
    thinkers: ["mises", "salerno", "hayek"],
    sourceIds: ["mises-calculation-1920"],
    status: "interpretation",
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
      "Robert Higgs’s term for the difficulty of planning when people cannot tell which rules will govern their property. He used it to discuss investment during the Great Depression and the later recovery. Austrian writers sometimes connect that hesitation to shorter plans. The term is Higgs’s, and the further claims about time preference are a separate theoretical step.",
    thinkers: [],
    status: "contested",
    modules: [],
  },
  {
    slug: "regression-theorem",
    headword: "Regression theorem",
    sortKey: "regression theorem",
    definition:
      "Mises’s regression theorem is an argument, first set out in The Theory of Money and Credit (1912), that the purchasing power of a money today depends on a chain of earlier exchange values, ending in a time when the good was valued for a non-monetary use. It is his solution to the question of how a money’s value can be explained without circularity.",
    thinkers: ["mises", "menger", "ammous"],
    sourceIds: ["mises-money-credit"],
    status: "interpretation",
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
      "In Book I, Chapter XV of A Treatise on Political Economy, Say argues that production opens a demand for products: a product affords a market for other products to the extent of its own value, and money is the momentary vehicle of that exchange. The slogan “supply creates its own demand” is Keynes’s description, in chapter 2 of the General Theory, of what he calls the classical doctrine. Keynes rejects that doctrine, taking it to mean that the costs of production are necessarily spent, in aggregate, on the product. The disagreement is about whether production and demand can fall out of joint, not a cartoon of either author.",
    thinkers: ["mises", "rothbard"],
    sourceIds: ["say-treatise-markets", "keynes-general-theory-classical"],
    status: "contested",
    modules: [],
  },
  {
    slug: "sound-money",
    headword: "Sound money",
    sortKey: "sound money",
    definition:
      "In the Misesian framework, sound money is money whose quantity is not set to serve a political authority’s spending. Mises treats purchasing power as emerging from exchange and treats a politically managed expansion as a source of redistribution and calculation error. Historical commodity standards and Bitcoin’s issuance rule are examples writers in this tradition discuss. They are not proof that every unconstrained issuer has debased a currency.",
    thinkers: ["mises", "rothbard", "ammous"],
    sourceIds: ["mises-money-credit"],
    status: "interpretation",
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
      "Praxeology treats a present satisfaction as preferred, other things equal, to the same satisfaction available only later. Böhm-Bawerk and Mises locate the explanation of interest in that ranking. How strong the preference is differs by person and moment. The claim is about the structure of action, not a survey of every historical saver.",
    thinkers: ["bohm-bawerk", "mises", "hoppe"],
    sourceIds: ["mises-money-credit"],
    status: "framework",
    modules: ["time-preference-forest"],
  },
];
