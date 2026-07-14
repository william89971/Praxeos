import type { GuideProvider, GuideRequest, GuideTurn } from "./types";

export class DeterministicGuideProvider implements GuideProvider {
  readonly mode = "deterministic" as const;

  async respond(request: GuideRequest): Promise<GuideTurn> {
    const source = request.sourcePackets[0];
    const citation = source
      ? {
          sourceId: source.id,
          title: source.title,
          url: source.url,
          locator: source.locator,
        }
      : null;
    const hasScenarioEvidence = /1200|20|budget|volunteer|priced|unpriced|path|waste/i.test(request.reasoning);

    return {
      providerMode: "deterministic",
      question: hasScenarioEvidence
        ? "Which specific path choice best supports the distinction you are making?"
        : "What detail from the budget, volunteer-hours, or labyrinth run could make your interpretation testable?",
      blocks: [
        {
          category: "observation",
          text: hasScenarioEvidence
            ? "Your interpretation names at least one detail from the scenario or run."
            : "Your interpretation needs a concrete scenario or run detail before a concept can be applied confidently.",
          citations: [],
        },
        ...(citation
          ? [
              {
                category: "concept" as const,
                text: source?.claims[0] ?? "Economic reasoning compares chosen means with forgone alternatives.",
                citations: [citation],
              },
            ]
          : []),
      ],
      citations: citation ? [citation] : [],
      whyThisFeedback: "The Guide checks for scenario evidence first, then uses only allowlisted source claims to frame one revision question.",
      insufficiency: hasScenarioEvidence ? "provider-unavailable" : "needs-more-evidence",
      retryAfterSeconds: null,
    };
  }
}

