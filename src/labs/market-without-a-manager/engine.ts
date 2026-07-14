import type { LabEngine, LabExplanation } from "@/labs/types";

export type Good = "apples" | "bread" | "cloth" | "tea" | "tools";

export interface MarketAssumptions {
  participantCount: 4 | 5;
  initialInformation: "full" | "limited";
  allowMoney: boolean;
}

export interface Participant {
  id: string;
  name: string;
  role: string;
  inventory: Record<Good, number>;
  money: number;
  priorities: Good[];
  reservePrices: Partial<Record<Good, number>>;
}

export interface MarketOffer {
  id: string;
  from: string;
  to: string;
  offeredGood: Good | null;
  offeredQuantity: number;
  offeredMoney: number;
  requestedGood: Good;
  requestedQuantity: number;
  status: "accepted" | "rejected" | "blocked";
  reason: string;
}

export interface MarketTrade {
  id: string;
  offerId: string;
  buyerId: string;
  sellerId: string;
  good: Good;
  quantity: number;
  moneyPrice: number | null;
}

export type MarketEventKind =
  | "arrival"
  | "priority"
  | "offer"
  | "trade"
  | "rejection"
  | "information"
  | "shortage"
  | "rule";

export interface MarketEvent {
  id: string;
  actionId: string;
  kind: MarketEventKind;
  title: string;
  detail: string;
  participantIds: string[];
  good?: Good;
  moneyPrice?: number;
}

export type MarketAction =
  | { id: "meet-market"; type: "meet" }
  | { id: "inspect-priorities"; type: "inspect-priorities" }
  | {
      id: string;
      type: "barter-offer";
      from: string;
      to: string;
      offeredGood: Good;
      requestedGood: Good;
    }
  | { id: "introduce-money"; type: "introduce-money" }
  | {
      id: string;
      type: "money-offer";
      from: string;
      to: string;
      requestedGood: Good;
      amount: number;
    }
  | { id: "limit-information"; type: "limit-information" }
  | { id: "bread-shortage"; type: "shortage"; good: Good; quantity: number }
  | { id: "bread-ceiling"; type: "price-ceiling"; good: Good; limit: number }
  | { id: "complete-guided"; type: "complete-guided" };

export interface MarketState {
  seed: string;
  assumptions: MarketAssumptions;
  guidedStep: number;
  participants: Participant[];
  offers: MarketOffer[];
  trades: MarketTrade[];
  events: MarketEvent[];
  moneyIntroduced: boolean;
  information: "full" | "limited";
  priceCeilings: Partial<Record<Good, number>>;
  externalRemovals: Partial<Record<Good, number>>;
  completed: boolean;
}

export interface MarketMetrics {
  attemptedOffers: number;
  completedTrades: number;
  rejectedOffers: number;
  blockedOffers: number;
  displayedPrices: Partial<Record<Good, number>>;
  remainingSupply: Record<Good, number>;
  unmetFirstPriorities: number;
  coordinationRate: number;
  shortages: Good[];
}

export const DEFAULT_MARKET_ASSUMPTIONS: MarketAssumptions = {
  participantCount: 5,
  initialInformation: "full",
  allowMoney: true,
};

export const MARKET_GUIDED_ACTIONS: readonly MarketAction[] = [
  { id: "meet-market", type: "meet" },
  { id: "inspect-priorities", type: "inspect-priorities" },
  {
    id: "barter-ada-cleo",
    type: "barter-offer",
    from: "ada",
    to: "cleo",
    offeredGood: "apples",
    requestedGood: "cloth",
  },
  { id: "introduce-money", type: "introduce-money" },
  {
    id: "low-offer-bread",
    type: "money-offer",
    from: "ada",
    to: "ben",
    requestedGood: "bread",
    amount: 2,
  },
  {
    id: "accepted-offer-bread",
    type: "money-offer",
    from: "ada",
    to: "ben",
    requestedGood: "bread",
    amount: 4,
  },
  { id: "limit-information", type: "limit-information" },
  { id: "bread-shortage", type: "shortage", good: "bread", quantity: 1 },
  { id: "bread-ceiling", type: "price-ceiling", good: "bread", limit: 2 },
  { id: "complete-guided", type: "complete-guided" },
] as const;

export const MARKET_EXPLORE_ACTIONS: readonly MarketAction[] = [
  {
    id: "explore-tea-offer-1",
    type: "money-offer",
    from: "cleo",
    to: "dev",
    requestedGood: "tea",
    amount: 1,
  },
  {
    id: "explore-tea-offer-3",
    type: "money-offer",
    from: "cleo",
    to: "dev",
    requestedGood: "tea",
    amount: 3,
  },
  {
    id: "explore-barter-ben-dev",
    type: "barter-offer",
    from: "ben",
    to: "dev",
    offeredGood: "bread",
    requestedGood: "tea",
  },
] as const;

export const marketEngine: LabEngine<
  MarketState,
  MarketAction,
  MarketMetrics,
  MarketAssumptions
> = {
  create(seed, assumptions) {
    const participants = baseParticipants(seed).slice(0, assumptions.participantCount);
    return {
      seed,
      assumptions,
      guidedStep: 0,
      participants,
      offers: [],
      trades: [],
      events: [],
      moneyIntroduced: false,
      information: assumptions.initialInformation,
      priceCeilings: {},
      externalRemovals: {},
      completed: false,
    };
  },

  reduce(state, action) {
    if (state.events.some((event) => event.actionId === action.id)) return state;
    if (action.type === "meet") {
      return appendEvent(state, action, {
        kind: "arrival",
        title: "Five plans enter one market",
        detail:
          "Each person arrives with different goods, money, and ranked priorities. No participant can see a complete social plan.",
        participantIds: state.participants.map((participant) => participant.id),
      });
    }
    if (action.type === "inspect-priorities") {
      return appendEvent(state, action, {
        kind: "priority",
        title: "Priorities do not line up",
        detail:
          "Ada wants bread first. Ben wants cloth. Cleo wants tea. Dev wants apples. Esme also wants bread.",
        participantIds: state.participants.map((participant) => participant.id),
      });
    }
    if (action.type === "introduce-money") {
      if (!state.assumptions.allowMoney) return state;
      return appendEvent({ ...state, moneyIntroduced: true }, action, {
        kind: "rule",
        title: "Money becomes a possible middle step",
        detail:
          "A participant may now sell to one person and later buy from another. Money does not erase priorities or scarcity.",
        participantIds: state.participants.map((participant) => participant.id),
      });
    }
    if (action.type === "barter-offer") return applyBarterOffer(state, action);
    if (action.type === "money-offer") return applyMoneyOffer(state, action);
    if (action.type === "limit-information") {
      const next = appendEvent({ ...state, information: "limited" }, action, {
        kind: "information",
        title: "A useful offer never reaches its partner",
        detail:
          "Cleo does not see Dev’s willingness to sell tea. The possible exchange remains a missed trade rather than a price.",
        participantIds: ["cleo", "dev"],
        good: "tea",
      });
      return next;
    }
    if (action.type === "shortage") {
      const seller = state.participants.find(
        (participant) =>
          participant.inventory[action.good] > 0 &&
          participant.reservePrices[action.good] !== undefined,
      );
      if (!seller) return state;
      const removed = Math.min(action.quantity, seller.inventory[action.good]);
      const participants = state.participants.map((participant) =>
        participant.id === seller.id
          ? {
              ...participant,
              inventory: {
                ...participant.inventory,
                [action.good]: participant.inventory[action.good] - removed,
              },
              reservePrices: {
                ...participant.reservePrices,
                [action.good]: (participant.reservePrices[action.good] ?? 1) + 1,
              },
            }
          : participant,
      );
      return appendEvent(
        {
          ...state,
          participants,
          externalRemovals: {
            ...state.externalRemovals,
            [action.good]: (state.externalRemovals[action.good] ?? 0) + removed,
          },
        },
        action,
        {
          kind: "shortage",
          title: "One loaf disappears before the next round",
          detail:
            "Bread supply falls while two first-priority wants remain. Ben’s minimum acceptable offer rises in this model.",
          participantIds: [seller.id, "ada", "esme"],
          good: action.good,
        },
      );
    }
    if (action.type === "price-ceiling") {
      let next: MarketState = {
        ...state,
        priceCeilings: { ...state.priceCeilings, [action.good]: action.limit },
      };
      next = appendEvent(next, action, {
        kind: "rule",
        title: `Offers above ${action.limit} tokens are blocked`,
        detail:
          "The posted limit changes which exchanges can complete. It does not create more bread or decide who receives the remaining loaf.",
        participantIds: ["ada", "ben", "esme"],
        good: action.good,
      });
      return applyMoneyOffer(next, {
        id: `${action.id}-blocked-offer`,
        type: "money-offer",
        from: "esme",
        to: "ben",
        requestedGood: action.good,
        amount: Math.max(action.limit + 2, 4),
      });
    }
    if (action.type === "complete-guided") {
      return appendEvent({ ...state, completed: true }, action, {
        kind: "priority",
        title: "The market remains unfinished",
        detail:
          "Trades coordinated some plans, but incomplete information, remaining inventory, and the ceiling left other wants unmet.",
        participantIds: state.participants.map((participant) => participant.id),
      });
    }
    return state;
  },

  derive(state) {
    const displayedPrices: Partial<Record<Good, number>> = {};
    for (const good of GOODS) {
      const prices = state.trades
        .filter((trade) => trade.good === good && trade.moneyPrice !== null)
        .map((trade) => trade.moneyPrice as number);
      if (prices.length) {
        displayedPrices[good] =
          Math.round(
            (prices.reduce((sum, value) => sum + value, 0) / prices.length) * 10,
          ) / 10;
      }
    }
    const remainingSupply = emptyInventory();
    for (const participant of state.participants) {
      for (const good of GOODS) remainingSupply[good] += participant.inventory[good];
    }
    const unmetFirstPriorities = state.participants.filter((participant) => {
      const first = participant.priorities[0];
      return first ? participant.inventory[first] === 0 : false;
    }).length;
    const shortages = GOODS.filter((good) => {
      const firstPriorityDemand = state.participants.filter(
        (participant) =>
          participant.priorities[0] === good && participant.inventory[good] === 0,
      ).length;
      const availableForSale = state.participants
        .filter((participant) => participant.reservePrices[good] !== undefined)
        .reduce((sum, participant) => sum + participant.inventory[good], 0);
      return (
        firstPriorityDemand > availableForSale ||
        ((state.externalRemovals[good] ?? 0) > 0 &&
          firstPriorityDemand >= availableForSale)
      );
    });
    const attemptedOffers = state.offers.length;
    return {
      attemptedOffers,
      completedTrades: state.trades.length,
      rejectedOffers: state.offers.filter((offer) => offer.status === "rejected")
        .length,
      blockedOffers: state.offers.filter((offer) => offer.status === "blocked").length,
      displayedPrices,
      remainingSupply,
      unmetFirstPriorities,
      coordinationRate:
        attemptedOffers === 0
          ? 0
          : Math.round((state.trades.length / attemptedOffers) * 100),
      shortages,
    };
  },

  describeChange(previous, next, action) {
    if (previous === next) return [];
    const latest = next.events.findLast((event) => event.actionId === action.id);
    const explanations: LabExplanation[] = latest
      ? [
          {
            id: latest.id,
            kind: "simulation observation",
            title: latest.title,
            detail: latest.detail,
          },
        ]
      : [];
    if (action.type === "price-ceiling") {
      explanations.push({
        id: "assumption-ceiling-enforcement",
        kind: "assumption",
        title: "The ceiling is fully enforced",
        detail:
          "This model blocks every above-limit monetary offer and does not simulate queues, quality changes, side payments, or evasion.",
      });
    }
    return explanations;
  },

  validate(state) {
    const errors: string[] = [];
    for (const participant of state.participants) {
      for (const good of GOODS) {
        if (participant.inventory[good] < 0) {
          errors.push(`${participant.id} has negative ${good} inventory.`);
        }
      }
      if (participant.money < 0) errors.push(`${participant.id} has negative money.`);
    }
    for (const trade of state.trades) {
      if (
        !state.offers.some(
          (offer) => offer.id === trade.offerId && offer.status === "accepted",
        )
      ) {
        errors.push(`Trade ${trade.id} has no accepted offer.`);
      }
      if (trade.moneyPrice !== null && trade.moneyPrice <= 0) {
        errors.push(`Trade ${trade.id} has an invalid money price.`);
      }
    }
    return errors;
  },
};

export function marketActionById(id: string): MarketAction | undefined {
  return [...MARKET_GUIDED_ACTIONS, ...MARKET_EXPLORE_ACTIONS].find(
    (action) => action.id === id,
  );
}

export function replayMarket(
  seed: string,
  assumptions: MarketAssumptions,
  actions: readonly MarketAction[],
): MarketState {
  return actions.reduce(marketEngine.reduce, marketEngine.create(seed, assumptions));
}

function applyBarterOffer(
  state: MarketState,
  action: Extract<MarketAction, { type: "barter-offer" }>,
): MarketState {
  const buyer = participantById(state, action.from);
  const seller = participantById(state, action.to);
  if (!buyer || !seller || buyer.inventory[action.offeredGood] < 1) return state;
  const offeredRank = preferenceRank(seller, action.offeredGood);
  const requestedRank = preferenceRank(seller, action.requestedGood);
  const accepted =
    seller.inventory[action.requestedGood] > 0 && offeredRank < requestedRank;
  const offer: MarketOffer = {
    id: action.id,
    from: buyer.id,
    to: seller.id,
    offeredGood: action.offeredGood,
    offeredQuantity: 1,
    offeredMoney: 0,
    requestedGood: action.requestedGood,
    requestedQuantity: 1,
    status: accepted ? "accepted" : "rejected",
    reason: accepted
      ? `${seller.name} ranks ${action.offeredGood} above the ${action.requestedGood} surrendered.`
      : `${seller.name} does not rank ${action.offeredGood} above the ${action.requestedGood} surrendered.`,
  };
  let next = { ...state, offers: [...state.offers, offer] };
  if (accepted) {
    next = transferGoods(
      next,
      buyer.id,
      seller.id,
      action.requestedGood,
      action.offeredGood,
    );
    next = {
      ...next,
      trades: [
        ...next.trades,
        {
          id: `trade-${action.id}`,
          offerId: action.id,
          buyerId: buyer.id,
          sellerId: seller.id,
          good: action.requestedGood,
          quantity: 1,
          moneyPrice: null,
        },
      ],
    };
  }
  return appendEvent(next, action, {
    kind: accepted ? "trade" : "rejection",
    title: accepted ? "The barter completes" : "The barter stalls",
    detail: `${buyer.name} offers ${action.offeredGood} for ${action.requestedGood}. ${offer.reason}`,
    participantIds: [buyer.id, seller.id],
    good: action.requestedGood,
  });
}

function applyMoneyOffer(
  state: MarketState,
  action: Extract<MarketAction, { type: "money-offer" }>,
): MarketState {
  if (!state.moneyIntroduced) return state;
  const buyer = participantById(state, action.from);
  const seller = participantById(state, action.to);
  if (!buyer || !seller) return state;
  const ceiling = state.priceCeilings[action.requestedGood];
  const reserve =
    seller.reservePrices[action.requestedGood] ?? Number.POSITIVE_INFINITY;
  const blocked = ceiling !== undefined && action.amount > ceiling;
  const accepted =
    !blocked &&
    seller.inventory[action.requestedGood] > 0 &&
    buyer.money >= action.amount &&
    action.amount >= reserve;
  const status: MarketOffer["status"] = blocked
    ? "blocked"
    : accepted
      ? "accepted"
      : "rejected";
  const reason = blocked
    ? `The ${ceiling}-token ceiling blocks this ${action.amount}-token offer.`
    : seller.inventory[action.requestedGood] <= 0
      ? `${seller.name} has no ${action.requestedGood} left to sell.`
      : buyer.money < action.amount
        ? `${buyer.name} does not have ${action.amount} tokens.`
        : action.amount < reserve
          ? `${seller.name} requires at least ${reserve} tokens under the current conditions.`
          : `${seller.name} accepts ${action.amount} tokens.`;
  const offer: MarketOffer = {
    id: action.id,
    from: buyer.id,
    to: seller.id,
    offeredGood: null,
    offeredQuantity: 0,
    offeredMoney: action.amount,
    requestedGood: action.requestedGood,
    requestedQuantity: 1,
    status,
    reason,
  };
  let next = { ...state, offers: [...state.offers, offer] };
  if (accepted) {
    next = {
      ...next,
      participants: next.participants.map((participant) => {
        if (participant.id === buyer.id) {
          return {
            ...participant,
            money: participant.money - action.amount,
            inventory: {
              ...participant.inventory,
              [action.requestedGood]: participant.inventory[action.requestedGood] + 1,
            },
          };
        }
        if (participant.id === seller.id) {
          return {
            ...participant,
            money: participant.money + action.amount,
            inventory: {
              ...participant.inventory,
              [action.requestedGood]: participant.inventory[action.requestedGood] - 1,
            },
          };
        }
        return participant;
      }),
      trades: [
        ...next.trades,
        {
          id: `trade-${action.id}`,
          offerId: action.id,
          buyerId: buyer.id,
          sellerId: seller.id,
          good: action.requestedGood,
          quantity: 1,
          moneyPrice: action.amount,
        },
      ],
    };
  }
  return appendEvent(next, action, {
    kind: accepted ? "trade" : blocked ? "rule" : "rejection",
    title: accepted
      ? `A ${action.amount}-token price is recorded`
      : blocked
        ? "The offer is blocked before exchange"
        : "The offer is rejected",
    detail: `${buyer.name} offers ${action.amount} tokens for ${action.requestedGood}. ${reason}`,
    participantIds: [buyer.id, seller.id],
    good: action.requestedGood,
    ...(accepted ? { moneyPrice: action.amount } : {}),
  });
}

function appendEvent(
  state: MarketState,
  action: MarketAction,
  event: Omit<MarketEvent, "id" | "actionId">,
): MarketState {
  const advancesGuided = MARKET_GUIDED_ACTIONS.some(
    (guidedAction) => guidedAction.id === action.id,
  );
  return {
    ...state,
    guidedStep: advancesGuided ? Math.min(10, state.guidedStep + 1) : state.guidedStep,
    events: [
      ...state.events,
      { ...event, id: `event-${action.id}`, actionId: action.id },
    ],
  };
}

function transferGoods(
  state: MarketState,
  buyerId: string,
  sellerId: string,
  requestedGood: Good,
  offeredGood: Good,
): MarketState {
  return {
    ...state,
    participants: state.participants.map((participant) => {
      if (participant.id === buyerId) {
        return {
          ...participant,
          inventory: {
            ...participant.inventory,
            [requestedGood]: participant.inventory[requestedGood] + 1,
            [offeredGood]: participant.inventory[offeredGood] - 1,
          },
        };
      }
      if (participant.id === sellerId) {
        return {
          ...participant,
          inventory: {
            ...participant.inventory,
            [requestedGood]: participant.inventory[requestedGood] - 1,
            [offeredGood]: participant.inventory[offeredGood] + 1,
          },
        };
      }
      return participant;
    }),
  };
}

function participantById(state: MarketState, id: string): Participant | undefined {
  return state.participants.find((participant) => participant.id === id);
}

function preferenceRank(participant: Participant, good: Good): number {
  const rank = participant.priorities.indexOf(good);
  return rank === -1 ? Number.POSITIVE_INFINITY : rank;
}

function baseParticipants(seed: string): Participant[] {
  const variation = seededNumber(seed) % 2;
  return [
    {
      id: "ada",
      name: "Ada",
      role: "fruit grower",
      inventory: { apples: 4, bread: 0, cloth: 0, tea: 0, tools: 0 },
      money: 7 + variation,
      priorities: ["bread", "tea", "cloth", "tools", "apples"],
      reservePrices: { apples: 2 },
    },
    {
      id: "ben",
      name: "Ben",
      role: "baker",
      inventory: { apples: 0, bread: 3, cloth: 0, tea: 0, tools: 0 },
      money: 2,
      priorities: ["cloth", "apples", "tea", "tools", "bread"],
      reservePrices: { bread: 4 },
    },
    {
      id: "cleo",
      name: "Cleo",
      role: "weaver",
      inventory: { apples: 0, bread: 0, cloth: 3, tea: 0, tools: 0 },
      money: 8,
      priorities: ["tea", "bread", "cloth", "apples", "tools"],
      reservePrices: { cloth: 5 },
    },
    {
      id: "dev",
      name: "Dev",
      role: "tea merchant",
      inventory: { apples: 0, bread: 0, cloth: 0, tea: 4, tools: 0 },
      money: 1,
      priorities: ["apples", "cloth", "bread", "tools", "tea"],
      reservePrices: { tea: 3 },
    },
    {
      id: "esme",
      name: "Esme",
      role: "toolmaker",
      inventory: { apples: 0, bread: 0, cloth: 0, tea: 0, tools: 2 },
      money: 10,
      priorities: ["bread", "tea", "apples", "cloth", "tools"],
      reservePrices: { tools: 6 },
    },
  ];
}

function seededNumber(seed: string): number {
  let value = 2166136261;
  for (const character of seed) {
    value ^= character.charCodeAt(0);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function emptyInventory(): Record<Good, number> {
  return { apples: 0, bread: 0, cloth: 0, tea: 0, tools: 0 };
}

const GOODS: readonly Good[] = ["apples", "bread", "cloth", "tea", "tools"];
