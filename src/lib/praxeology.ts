import type { Concept } from "@/types/module";
import type { LabSlug } from "@/labs/types";

export interface ActionAnalyzerSeed {
  readonly actor: string;
  readonly end: string;
  readonly means: string;
  readonly constraint: string;
  readonly tradeoff: string;
  readonly opportunityCost: string;
  readonly revealedPreference: string;
}

export interface ActionAnalyzerSnapshot extends ActionAnalyzerSeed {
  readonly situation: string;
}

export interface PraxeologyLesson {
  readonly slug: string;
  readonly order: number;
  readonly title: string;
  readonly shortTitle: string;
  readonly principle: string;
  readonly durationMin: number;
  readonly scenario: string;
  readonly prompt: string;
  readonly choices: readonly {
    readonly label: string;
    readonly feedback: string;
    readonly strong?: boolean;
  }[];
  readonly analyzerSeed: ActionAnalyzerSeed;
  readonly insight: string;
  readonly applyPrompt: string;
  readonly sourceNote: string;
  readonly concepts: readonly Concept[];
}

export interface PraxeologyCase {
  readonly slug: string;
  readonly title: string;
  readonly domain: string;
  readonly labSlug: LabSlug;
  readonly durationMin: number;
  readonly scenario: string;
  readonly question: string;
  readonly analyzerSeed: ActionAnalyzerSeed;
  readonly insight: string;
  readonly applyPrompt: string;
  readonly concepts: readonly Concept[];
}

export interface PracticalConcept {
  readonly plain: string;
  readonly example: string;
  readonly exercise: string;
}

export const PRAXEOLOGY_101: readonly PraxeologyLesson[] = [
  {
    slug: "what-is-praxeology",
    order: 1,
    title: "What is praxeology?",
    shortTitle: "Praxeology",
    principle:
      "Praxeology is the study of purposeful human action. It asks what must be true when someone chooses means to reach an end.",
    durationMin: 6,
    scenario:
      "You planned to work out after dinner. Instead, you opened your phone and watched short videos for forty minutes.",
    prompt: "What did the action reveal?",
    choices: [
      {
        label: "The phone forced the outcome.",
        feedback:
          "The phone changed the menu of temptations, but praxeology starts with the acting person choosing among alternatives.",
      },
      {
        label: "The actor preferred immediate relief over the workout in that moment.",
        feedback:
          "Strong answer. The action reveals the preference at the moment of choice, even if the person says they value fitness.",
        strong: true,
      },
      {
        label: "The person has no goals.",
        feedback:
          "Even avoidance is purposeful. The person still acted to replace one state of affairs with another.",
      },
    ],
    analyzerSeed: {
      actor: "The person after dinner",
      end: "Feel relaxed right now",
      means: "Open the phone and watch videos",
      constraint: "Limited evening time and low energy",
      tradeoff: "Immediate comfort instead of training",
      opportunityCost: "The workout and the identity practice attached to it",
      revealedPreference: "In that moment, relief ranked above fitness",
    },
    insight:
      "Praxeology does not begin by judging the action. It begins by seeing its structure: actor, end, means, tradeoff, and chosen improvement.",
    applyPrompt:
      "Pick one thing you did today. Name the end, the means, and the tradeoff without moralizing it.",
    sourceNote:
      "Mises opens economics with the action axiom: human beings act purposefully. The site uses that as a practical lens before it becomes a historical doctrine.",
    concepts: ["action-axiom", "time-preference"],
  },
  {
    slug: "man-acts",
    order: 2,
    title: "Man acts",
    shortTitle: "Action",
    principle:
      "Action means purposeful behavior: using chosen means because the actor expects a more satisfactory state.",
    durationMin: 5,
    scenario:
      "A student says, 'I do not care about grades,' then spends the night writing an essay to avoid failing the class.",
    prompt: "What matters more: the statement or the action?",
    choices: [
      {
        label: "The statement, because words disclose true values.",
        feedback:
          "Words matter, but praxeology treats action as the evidence of preference in the moment of choice.",
      },
      {
        label: "The action, because it shows the preferred state under constraint.",
        feedback:
          "Strong answer. The student may dislike grades, but avoiding failure ranked above leisure that night.",
        strong: true,
      },
      {
        label: "Neither. Only feelings matter.",
        feedback:
          "Feelings may explain motive, but praxeology analyzes the logic of choosing means for ends.",
      },
    ],
    analyzerSeed: {
      actor: "The student",
      end: "Avoid failing the class",
      means: "Write the essay overnight",
      constraint: "Deadline, fatigue, grading rules",
      tradeoff: "Sleep and leisure for a passing chance",
      opportunityCost: "A rested night and whatever else could have been done",
      revealedPreference: "Passing ranked above rest in that moment",
    },
    insight:
      "Action is not the same as a slogan about values. Action is the chosen attempt to improve a situation.",
    applyPrompt:
      "Find one place where your behavior says something different from your stated priorities.",
    sourceNote:
      "For Mises, action is not motion. It is purposeful conduct. That distinction powers the rest of praxeology.",
    concepts: ["action-axiom"],
  },
  {
    slug: "uneasiness-and-improvement",
    order: 3,
    title: "Uneasiness and improvement",
    shortTitle: "Uneasiness",
    principle:
      "Action begins because the actor is not fully satisfied and believes a chosen means can improve the situation.",
    durationMin: 5,
    scenario:
      "A founder rewrites the landing page at midnight because signups are weak and she thinks clearer copy might help.",
    prompt: "Where is the uneasiness?",
    choices: [
      {
        label: "Weak signups create dissatisfaction.",
        feedback:
          "Strong answer. The weak signups are the felt gap between the current state and the desired state.",
        strong: true,
      },
      {
        label: "The landing page itself is the end.",
        feedback:
          "The page is a means. The end is more likely signups, revenue, proof, or confidence.",
      },
      {
        label: "The founder is acting randomly.",
        feedback:
          "Praxeology assumes purposeful action when means are selected toward an expected improvement.",
      },
    ],
    analyzerSeed: {
      actor: "The founder",
      end: "Increase signups and validate the offer",
      means: "Rewrite the landing page",
      constraint: "Limited attention, weak data, limited time",
      tradeoff: "More copy work instead of sleep or outreach",
      opportunityCost: "Direct sales calls, rest, or product work",
      revealedPreference: "A clearer offer seemed worth the late-night effort",
    },
    insight:
      "Uneasiness is not just a feeling to label. It is the practical reason action starts: the actor wants reality to be otherwise.",
    applyPrompt:
      "Name one current uneasiness in your life. What action are you using to remove it?",
    sourceNote:
      "Mises describes action as the attempt to substitute a more satisfactory state for a less satisfactory one.",
    concepts: ["action-axiom", "entrepreneurship"],
  },
  {
    slug: "ends-and-means",
    order: 4,
    title: "Ends and means",
    shortTitle: "Ends/means",
    principle:
      "An end is the desired state. A means is whatever the actor uses to try to reach it.",
    durationMin: 6,
    scenario:
      "Someone says, 'My goal is to make more money.' After questioning, they admit they want control over their schedule.",
    prompt: "What changed in the analysis?",
    choices: [
      {
        label: "Money became a means, not the final end.",
        feedback:
          "Strong answer. The deeper end is schedule control; money is one possible instrument.",
        strong: true,
      },
      {
        label: "Money stopped mattering.",
        feedback: "Money may still matter a lot. It just moved into the means column.",
      },
      {
        label: "The person has no real preference.",
        feedback:
          "The preference became clearer: control over time outranks the money itself.",
      },
    ],
    analyzerSeed: {
      actor: "The person seeking more money",
      end: "Control over their schedule",
      means: "Earn more income",
      constraint: "Bills, current job terms, available skills",
      tradeoff: "Extra work now for more optionality later",
      opportunityCost: "Time spent on other paths to freedom",
      revealedPreference: "Autonomy is the deeper target",
    },
    insight:
      "A lot of confusion disappears when you stop treating means as ends. Praxeology trains that separation.",
    applyPrompt:
      "Write down one goal. Then ask: is this the end, or only a means to a deeper end?",
    sourceNote:
      "The means-ends framework is basic to praxeological reasoning and appears throughout Human Action.",
    concepts: ["action-axiom", "subjective-value"],
  },
  {
    slug: "choice-and-tradeoff",
    order: 5,
    title: "Choice and tradeoff",
    shortTitle: "Tradeoff",
    principle:
      "To choose is to rank alternatives. The chosen option is preferred to what was set aside at that moment.",
    durationMin: 6,
    scenario:
      "You have two free hours: practice a skill, see friends, rest, or take extra work. You choose rest.",
    prompt: "What does the choice show?",
    choices: [
      {
        label: "Rest ranked highest under the circumstances.",
        feedback:
          "Strong answer. That does not mean rest is always highest. It means rest won in that context.",
        strong: true,
      },
      {
        label: "The other options had no value.",
        feedback:
          "They may still have value. They were just ranked below rest in that choice.",
      },
      {
        label: "No cost exists because no money was spent.",
        feedback: "Cost is not only money. The cost is the best forgone alternative.",
      },
    ],
    analyzerSeed: {
      actor: "You with two free hours",
      end: "Recover energy",
      means: "Rest instead of doing another activity",
      constraint: "Only two hours and limited energy",
      tradeoff: "Recovery over skill, social time, or income",
      opportunityCost: "The best alternative use of those two hours",
      revealedPreference: "Recovery was worth more in that moment",
    },
    insight: "Choice is ranking under scarcity. Praxeology makes the ranking visible.",
    applyPrompt:
      "For your next calendar choice, name the best thing you are saying no to.",
    sourceNote:
      "Scarcity and choice are implied by action: if means were unlimited, economizing would not be necessary.",
    concepts: ["action-axiom", "marginal-utility"],
  },
  {
    slug: "opportunity-cost",
    order: 6,
    title: "Opportunity cost",
    shortTitle: "Cost",
    principle:
      "The real cost of an action is the next-best alternative the actor gives up.",
    durationMin: 6,
    scenario:
      "A worker takes a higher-paying job with a longer commute and loses ten hours a week with family.",
    prompt: "What is the cost?",
    choices: [
      {
        label: "Only the gas and train fare.",
        feedback:
          "Those are accounting costs. The praxeological cost includes the best forgone alternative.",
      },
      {
        label: "The family time and energy given up for the higher wage.",
        feedback:
          "Strong answer. The wage has to be compared against the life displaced by the commute.",
        strong: true,
      },
      {
        label: "There is no cost because income went up.",
        feedback: "A higher money income can still carry a high opportunity cost.",
      },
    ],
    analyzerSeed: {
      actor: "The worker",
      end: "Increase income",
      means: "Accept the higher-paying job",
      constraint: "Commute distance, family needs, available offers",
      tradeoff: "More income for less time and energy at home",
      opportunityCost: "The best use of the ten hours lost each week",
      revealedPreference: "The raise seemed worth the displaced time",
    },
    insight:
      "Opportunity cost turns vague tradeoffs into a clear comparison: what did this action displace?",
    applyPrompt:
      "Before your next purchase or commitment, name the best alternative use of the same money, time, or attention.",
    sourceNote:
      "Austrian value theory treats cost through the actor's alternatives, not merely through objective expense.",
    concepts: ["subjective-value", "marginal-utility"],
  },
  {
    slug: "subjective-value",
    order: 7,
    title: "Subjective value",
    shortTitle: "Value",
    principle:
      "Value is not inside the object. Value is assigned by acting people according to their ends.",
    durationMin: 6,
    scenario:
      "A bottle of water is nearly worthless in your kitchen but precious to a stranded hiker.",
    prompt: "What changed?",
    choices: [
      {
        label: "The physical water changed.",
        feedback:
          "The physical good is the same. The actor's situation and ranking changed.",
      },
      {
        label: "The valuing person and circumstances changed.",
        feedback:
          "Strong answer. Value is relational: a good matters because an actor sees it as useful for an end.",
        strong: true,
      },
      {
        label: "Market value is fake.",
        feedback:
          "Market prices are real exchange ratios, but they emerge from subjective valuations.",
      },
    ],
    analyzerSeed: {
      actor: "The stranded hiker",
      end: "Survive and reduce thirst",
      means: "Use the bottle of water",
      constraint: "Heat, distance, scarce supplies",
      tradeoff: "Water use now versus saving it for later",
      opportunityCost: "The future use of the same bottle",
      revealedPreference: "Water ranks very high under survival pressure",
    },
    insight:
      "The same thing can occupy different places in different value scales. That is the doorway into price, exchange, and markets.",
    applyPrompt:
      "Find one object near you. Name three people who would value it differently and why.",
    sourceNote:
      "Menger's marginal revolution located economic value in the relation between goods and human wants.",
    concepts: ["subjective-value", "marginal-utility"],
  },
  {
    slug: "time-preference",
    order: 8,
    title: "Time preference",
    shortTitle: "Time",
    principle:
      "Acting people compare present satisfaction with future satisfaction. Waiting has to be worth it.",
    durationMin: 7,
    scenario:
      "You can spend $80 tonight or save it for a tool that will help you earn more next month.",
    prompt: "What is the core comparison?",
    choices: [
      {
        label: "Present enjoyment versus future capability.",
        feedback:
          "Strong answer. Time preference is visible in how the actor ranks now against later.",
        strong: true,
      },
      {
        label: "Good people save; bad people spend.",
        feedback:
          "Praxeology analyzes ranking. It does not need moral labels to see the tradeoff.",
      },
      {
        label: "The future option has no value because it is not present.",
        feedback:
          "Future goods can matter now, but they are evaluated through uncertainty and waiting.",
      },
    ],
    analyzerSeed: {
      actor: "You deciding what to do with $80",
      end: "Either enjoy tonight or improve future earning power",
      means: "Spend now or save for the tool",
      constraint: "Only one $80 budget and uncertain future benefit",
      tradeoff: "Immediate consumption versus delayed capability",
      opportunityCost: "The option not chosen",
      revealedPreference: "The selected option shows how now and later were ranked",
    },
    insight:
      "Time preference is not an abstract interest-rate topic. It appears in every choice between present use and future gain.",
    applyPrompt:
      "Notice one choice today where future-you is bidding against present-you.",
    sourceNote:
      "Bohm-Bawerk and Mises place time at the center of capital, saving, and interest.",
    concepts: ["time-preference", "capital-theory", "roundaboutness"],
  },
  {
    slug: "exchange",
    order: 9,
    title: "Exchange",
    shortTitle: "Exchange",
    principle:
      "Voluntary exchange happens because each side expects to receive something they value more than what they give.",
    durationMin: 6,
    scenario:
      "You pay $5 for coffee. The shop hands you the coffee. Both sides say yes.",
    prompt: "Who benefits?",
    choices: [
      {
        label: "Only the shop benefits because it got money.",
        feedback:
          "The shop preferred the money. You preferred the coffee. Both expected to improve their situation.",
      },
      {
        label: "Both sides benefit ex ante.",
        feedback:
          "Strong answer. Each side trades because the received good ranks higher than the surrendered good.",
        strong: true,
      },
      {
        label: "Nobody benefits because values are equal.",
        feedback:
          "If values were equal for both parties, there would be no reason to incur the effort of exchange.",
      },
    ],
    analyzerSeed: {
      actor: "You and the coffee shop",
      end: "You want coffee; the shop wants revenue",
      means: "Exchange $5 for the drink",
      constraint: "Limited money, inventory, time, and alternatives",
      tradeoff: "You give up $5; the shop gives up the coffee",
      opportunityCost:
        "Your next-best use of $5 and the shop's next-best use of the inventory",
      revealedPreference: "Each party preferred what they received",
    },
    insight:
      "Exchange is not zero-sum from the actor's point of view. It is mutual improvement as judged before the trade.",
    applyPrompt: "Observe one trade today. State why each side said yes.",
    sourceNote:
      "Austrian price theory begins from subjective rankings and exchange, not from intrinsic value.",
    concepts: ["subjective-value", "marginal-utility"],
  },
  {
    slug: "prices-and-knowledge",
    order: 10,
    title: "Prices and knowledge",
    shortTitle: "Prices",
    principle:
      "Prices are signals created by acting people. They carry knowledge no single mind fully owns.",
    durationMin: 8,
    scenario:
      "The price of eggs rises. Shoppers buy fewer eggs, stores reorder differently, farmers adjust plans, and substitutes get attention.",
    prompt: "What does the price do?",
    choices: [
      {
        label: "It transmits scarcity and preference information.",
        feedback:
          "Strong answer. The price condenses many local facts into a signal actors can use.",
        strong: true,
      },
      {
        label: "It only shows greed.",
        feedback:
          "Greed may exist, but the price also coordinates production and consumption decisions.",
      },
      {
        label: "It replaces all judgment.",
        feedback:
          "Prices guide judgment. They do not remove uncertainty or the need to act.",
      },
    ],
    analyzerSeed: {
      actor: "Shoppers, stores, and producers",
      end: "Adjust plans under changing scarcity",
      means: "Respond to the higher egg price",
      constraint: "Limited supply, budgets, substitutes, production lags",
      tradeoff: "Buy eggs anyway, buy substitutes, or wait",
      opportunityCost: "The next-best use of money and production capacity",
      revealedPreference: "Actors revise plans as the signal changes",
    },
    insight:
      "A price is a social learning device. It lets strangers coordinate without needing the same facts in their heads.",
    applyPrompt:
      "Look at one price today and ask: what knowledge might this number be carrying?",
    sourceNote:
      "Hayek's knowledge problem explains why prices matter: they coordinate dispersed, local, tacit information.",
    concepts: ["knowledge-problem", "economic-calculation", "spontaneous-order"],
  },
  {
    slug: "apply-it-to-your-life",
    order: 11,
    title: "Apply it to your life",
    shortTitle: "Apply",
    principle:
      "Praxeology becomes useful when you can analyze your own action without excuses or slogans.",
    durationMin: 8,
    scenario:
      "Choose a real decision from this week: a purchase, avoidance, habit, conversation, tradeoff, or plan.",
    prompt: "Can you describe it as action?",
    choices: [
      {
        label: "Yes: actor, end, means, constraint, and cost.",
        feedback: "Strong answer. That is the basic praxeological frame.",
        strong: true,
      },
      {
        label: "Only if money is involved.",
        feedback:
          "Money is not required. Praxeology applies to purposeful action generally.",
      },
      {
        label: "Only if the decision was rational.",
        feedback:
          "Praxeology does not require perfect rationality. It analyzes purposeful choice under the actor's beliefs.",
      },
    ],
    analyzerSeed: {
      actor: "Me",
      end: "Name the improvement I was seeking",
      means: "Name what I actually did",
      constraint: "Name the scarce time, money, energy, or knowledge",
      tradeoff: "Name what I accepted to get the end",
      opportunityCost: "Name the best alternative I gave up",
      revealedPreference: "Name what my action showed in that moment",
    },
    insight:
      "When you can describe your own action this way, praxeology stops being a term and becomes a habit you can use.",
    applyPrompt:
      "Save one honest study note. Do not make it flattering. Make it useful.",
    sourceNote:
      "This capstone keeps history brief: Mises gave the method its systematic form, but the practice starts with seeing action clearly.",
    concepts: ["action-axiom", "subjective-value", "time-preference"],
  },
] as const;

export const DAILY_CASES: readonly PraxeologyCase[] = [
  {
    slug: "procrastination-revealed",
    title: "The procrastination trade",
    domain: "Habits",
    labSlug: "choice-machine",
    durationMin: 4,
    scenario:
      "You say a certification matters for your career, but every evening you choose entertainment over studying.",
    question: "What does the repeated action reveal?",
    analyzerSeed: {
      actor: "The person avoiding study",
      end: "Get relief after work",
      means: "Choose entertainment",
      constraint: "Limited evening energy and attention",
      tradeoff: "Comfort now instead of credential progress",
      opportunityCost: "Study time and future career optionality",
      revealedPreference: "Immediate relief keeps ranking above the credential",
    },
    insight:
      "The issue may be motivation, but the praxeological fact is ranking: the chosen relief is beating the stated goal.",
    applyPrompt:
      "Lower the cost of the first study action until it can beat the entertainment option.",
    concepts: ["action-axiom", "time-preference"],
  },
  {
    slug: "rent-cap-shortage",
    title: "The rent cap",
    domain: "Markets",
    labSlug: "market-without-a-manager",
    durationMin: 5,
    scenario:
      "A city caps rents below market rates. More people want apartments at the capped price, while fewer owners want to provide or maintain them.",
    question: "Which incentive changed?",
    analyzerSeed: {
      actor: "Renters and property owners",
      end: "Renters seek cheaper housing; owners seek worthwhile returns",
      means: "Use or respond to a legal price ceiling",
      constraint: "Scarce apartments and controlled rent",
      tradeoff:
        "Lower posted prices for less availability and weaker maintenance incentives",
      opportunityCost: "New supply and upkeep that no longer pays",
      revealedPreference: "Actors adjust behavior to the new rule",
    },
    insight:
      "A rule can change the visible price while also changing the actions that produce supply.",
    applyPrompt:
      "When you hear a policy proposal, ask which actor's means and incentives change first.",
    concepts: ["economic-calculation", "knowledge-problem"],
  },
  {
    slug: "free-lunch-office",
    title: "The free office lunch",
    domain: "Work",
    labSlug: "market-without-a-manager",
    durationMin: 4,
    scenario:
      "A company offers free dinner after 7 p.m. Employees appreciate it, and many stay later.",
    question: "What behavior is the company buying?",
    analyzerSeed: {
      actor: "The company and employees",
      end: "The company wants longer presence; employees want food and convenience",
      means: "Offer dinner in the office",
      constraint: "Work hours, commute, hunger, team expectations",
      tradeoff: "Convenience and food for more time near work",
      opportunityCost: "Evening time elsewhere",
      revealedPreference: "Many employees accept dinner as worth the later stay",
    },
    insight:
      "A perk is also an incentive. Praxeology asks what action the perk makes more likely.",
    applyPrompt:
      "Look at one perk in your life and ask what behavior it quietly rewards.",
    concepts: ["entrepreneurship", "time-preference"],
  },
  {
    slug: "surge-pricing-storm",
    title: "The storm ride",
    domain: "Money",
    labSlug: "market-without-a-manager",
    durationMin: 5,
    scenario:
      "During a storm, ride prices rise. Some riders complain; more drivers also become willing to drive.",
    question: "What knowledge is the higher price carrying?",
    analyzerSeed: {
      actor: "Riders and drivers",
      end: "Riders want transport; drivers want compensation for risk and discomfort",
      means: "Use a higher price to ration demand and attract supply",
      constraint: "Bad weather, scarce drivers, urgent trips",
      tradeoff: "Higher fares for more available rides",
      opportunityCost: "Driver safety, time, and alternative uses of the car",
      revealedPreference: "Some trips are urgent enough to pay the higher fare",
    },
    insight:
      "The higher price is not only a burden. It is also a signal that calls forth supply and filters demand.",
    applyPrompt:
      "Ask whether suppressing a disliked price would also suppress the supply response.",
    concepts: ["knowledge-problem", "subjective-value"],
  },
  {
    slug: "side-business-focus",
    title: "The side business split",
    domain: "Entrepreneurship",
    labSlug: "entrepreneurs-discovery",
    durationMin: 5,
    scenario:
      "You split your side-business time across five ideas. None gets enough attention to test demand.",
    question: "What is scarce?",
    analyzerSeed: {
      actor: "The aspiring entrepreneur",
      end: "Find a viable business",
      means: "Try several ideas at once",
      constraint: "Limited attention, time, and feedback cycles",
      tradeoff: "Optionality over depth",
      opportunityCost: "A serious test of the best single idea",
      revealedPreference: "Avoiding commitment feels safer than concentrated learning",
    },
    insight:
      "Attention is a scarce means. Spreading it can preserve comfort while destroying feedback.",
    applyPrompt: "Choose one idea and define the smallest real demand test.",
    concepts: ["entrepreneurship", "time-preference"],
  },
  {
    slug: "cheap-tool-expensive-time",
    title: "The cheap tool",
    domain: "Personal productivity",
    labSlug: "choice-machine",
    durationMin: 4,
    scenario:
      "You refuse to buy a $30 tool and spend five frustrating hours doing the task manually.",
    question: "What cost did the actor miss?",
    analyzerSeed: {
      actor: "The person doing the task manually",
      end: "Save money",
      means: "Avoid buying the tool",
      constraint: "Cash budget and limited time",
      tradeoff: "Keep $30 but spend five hours",
      opportunityCost: "The best use of those five hours",
      revealedPreference: "Cash felt more salient than time",
    },
    insight: "A low money cost can hide a high opportunity cost in time and attention.",
    applyPrompt: "Find one place where saving money is costing too much life.",
    concepts: ["subjective-value", "time-preference"],
  },
  {
    slug: "diet-revealed-preference",
    title: "The snack drawer",
    domain: "Health",
    labSlug: "choice-machine",
    durationMin: 4,
    scenario:
      "You say you want to eat clean, but you keep snacks in the drawer and eat them every afternoon.",
    question: "Which means is shaping the action?",
    analyzerSeed: {
      actor: "The person with the snack drawer",
      end: "Afternoon comfort and stimulation",
      means: "Keep snacks within reach",
      constraint: "Hunger, stress, convenience, willpower",
      tradeoff: "Easy comfort over diet consistency",
      opportunityCost: "The health plan and the confidence from keeping it",
      revealedPreference: "Convenient comfort wins when the means are nearby",
    },
    insight:
      "Praxeology helps separate stated ends from arranged means. The drawer is part of the action system.",
    applyPrompt:
      "Remove or redesign one means that keeps producing an action you dislike.",
    concepts: ["action-axiom", "time-preference"],
  },
  {
    slug: "raise-negotiation",
    title: "The raise negotiation",
    domain: "Work",
    labSlug: "entrepreneurs-discovery",
    durationMin: 5,
    scenario:
      "You want a raise, but your manager has budget limits and needs proof that your work changes outcomes.",
    question: "What means could make agreement easier?",
    analyzerSeed: {
      actor: "The employee",
      end: "Earn higher pay",
      means: "Present evidence of value and alternatives",
      constraint: "Manager budget, company priorities, labor market options",
      tradeoff: "Preparation and risk of asking for a better chance at pay",
      opportunityCost: "Staying silent or using effort elsewhere",
      revealedPreference: "A serious ask requires making value legible",
    },
    insight:
      "Exchange requires both sides to see improvement. A raise request is stronger when it shows the employer's gain too.",
    applyPrompt:
      "For your next ask, write the other party's end before writing your own.",
    concepts: ["entrepreneurship", "subjective-value"],
  },
  {
    slug: "subscription-creep",
    title: "The forgotten subscription",
    domain: "Money",
    labSlug: "choice-machine",
    durationMin: 3,
    scenario:
      "A subscription keeps billing because canceling takes ten annoying minutes.",
    question: "Why does the payment continue?",
    analyzerSeed: {
      actor: "The subscriber",
      end: "Avoid the annoyance of canceling",
      means: "Do nothing",
      constraint: "Attention, friction, small recurring cost",
      tradeoff: "Keep paying to avoid a small task",
      opportunityCost: "The money and the discipline of cleaning up obligations",
      revealedPreference: "Avoiding friction outranks the small monthly savings",
    },
    insight:
      "Inaction can still be action when it preserves a preferred state over an annoying alternative.",
    applyPrompt:
      "Cancel or keep one subscription deliberately. Do not let friction choose.",
    concepts: ["action-axiom", "time-preference"],
  },
  {
    slug: "status-purchase",
    title: "The status purchase",
    domain: "Consumption",
    labSlug: "money-time-machine",
    durationMin: 4,
    scenario:
      "A person buys an expensive item they barely use because it changes how they feel others perceive them.",
    question: "What is the real end?",
    analyzerSeed: {
      actor: "The buyer",
      end: "Gain status, confidence, or belonging",
      means: "Buy the visible item",
      constraint: "Money, social environment, self-image",
      tradeoff: "Cash and future options for perceived status now",
      opportunityCost: "Savings, investment, or another purchase",
      revealedPreference: "Social meaning ranked above practical use",
    },
    insight:
      "Subjective value includes status and identity. The object is a means to a felt social end.",
    applyPrompt:
      "Before a purchase, ask whether you want the thing, the identity, or the reaction.",
    concepts: ["subjective-value", "time-preference"],
  },
] as const;

export const PRACTICAL_CONCEPTS: Record<Concept, PracticalConcept> = {
  "action-axiom": {
    plain:
      "People act to replace a less satisfactory situation with a more satisfactory one.",
    example: "Opening your phone instead of studying is still purposeful action.",
    exercise: "Describe one action today as actor, end, means, and tradeoff.",
  },
  abct: {
    plain:
      "Artificial credit can make long projects look sustainable before real saving exists to support them.",
    example:
      "A cheap-money boom encourages projects that later cannot be completed profitably.",
    exercise: "Ask which plans depend on easy financing rather than real demand.",
  },
  "cantillon-effect": {
    plain:
      "New money enters through specific people first, so inflation changes relative positions.",
    example:
      "First receivers spend before prices fully adjust; late receivers face higher prices later.",
    exercise: "When money is injected, identify who gets it first and who pays later.",
  },
  "capital-theory": {
    plain:
      "Capital is a structure of specific tools, skills, inventories, and plans, not one generic blob.",
    example:
      "A pizza oven, delivery app, flour contract, and trained cook fit one plan better than another.",
    exercise: "Name the complementary pieces behind one product you use.",
  },
  "economic-calculation": {
    plain: "Actors need prices to compare different uses of scarce means.",
    example:
      "A business needs money prices to know whether steel should become a bridge, machine, or building.",
    exercise:
      "Pick a resource and list three competing uses. What lets people compare them?",
  },
  entrepreneurship: {
    plain:
      "Entrepreneurship is alertness to a possible gain others have not yet acted on.",
    example: "Noticing a service people complain about and offering a better version.",
    exercise:
      "Find one repeated complaint and write the possible opportunity inside it.",
  },
  "knowledge-problem": {
    plain: "Useful knowledge is scattered across people, places, and moments.",
    example:
      "A restaurant owner knows tonight's demand faster than a distant planner can.",
    exercise: "Ask what local knowledge would be lost if a decision were centralized.",
  },
  "marginal-utility": {
    plain: "The value of one more unit depends on the actor's current situation.",
    example: "A first glass of water matters more than a tenth glass.",
    exercise: "Find one thing where the next unit is worth less than the first.",
  },
  "regime-uncertainty": {
    plain:
      "Unpredictable rules shorten planning horizons and make long commitments riskier.",
    example: "A business delays hiring because tax and permit rules keep changing.",
    exercise: "Identify one plan you would avoid if the rules could change next month.",
  },
  "regression-theorem": {
    plain:
      "Money's purchasing power today depends on yesterday's value, tracing back to non-money use.",
    example: "Gold could become money because people first valued it for other uses.",
    exercise:
      "Ask what made a money-like good desirable before it was widely accepted.",
  },
  roundaboutness: {
    plain:
      "Longer production paths can be more productive but need saving and time to sustain them.",
    example: "Building tools first can produce more later, but only if you can wait.",
    exercise: "Name one long-term tool-building action you are tempted to skip.",
  },
  "says-law": {
    plain:
      "Demand is ultimately funded by production; goods exchange against goods through money.",
    example:
      "You buy because you first produced, earned, or traded something valuable.",
    exercise: "Trace one purchase back to the production that funded it.",
  },
  "sound-money": {
    plain: "Sound money is hard to create at political convenience.",
    example:
      "A money with constrained supply resists debasement better than one issued on demand.",
    exercise: "Ask who can create more of the money and under what constraint.",
  },
  "spontaneous-order": {
    plain:
      "Order can emerge from many actions without one designer commanding the pattern.",
    example: "A busy sidewalk self-organizes as people adjust to one another.",
    exercise: "Find one order today that nobody centrally designed.",
  },
  "subjective-value": {
    plain: "Goods matter because acting people value them for their own ends.",
    example:
      "The same laptop is worth more to a remote worker than to someone who never uses computers.",
    exercise:
      "Pick one object and explain why three people would value it differently.",
  },
  "time-preference": {
    plain: "People compare satisfaction now with satisfaction later.",
    example: "Saving for a tool means future capability outranks present spending.",
    exercise: "Spot one choice where present-you and future-you want different things.",
  },
};

export function getPraxeologyLesson(slug: string): PraxeologyLesson | undefined {
  return PRAXEOLOGY_101.find((lesson) => lesson.slug === slug);
}

export function getPraxeologyCase(slug: string): PraxeologyCase | undefined {
  return DAILY_CASES.find((entry) => entry.slug === slug);
}

export const PRAXEOLOGY_TOTAL_MINUTES = PRAXEOLOGY_101.reduce(
  (total, lesson) => total + lesson.durationMin,
  0,
);
