import type { GuideProvider, GuideProviderRequest, GuideTurn } from "./types";

export class DeterministicGuideProvider implements GuideProvider {
  readonly mode = "deterministic" as const;

  async respond(request: GuideProviderRequest): Promise<GuideTurn> {
    const source = request.sourcePackets[0];
    const citation = source
      ? {
          sourceId: source.id,
          title: source.title,
          url: source.url,
          locator: source.locator,
        }
      : null;
    const evidenceCount = request.evidence.observationIds.length;
    const assumptionCount = request.evidence.assumptionIds.length;

    return {
      providerMode: "deterministic",
      question:
        evidenceCount === 0
          ? "Which visible event or observation will you select before comparing your two responses?"
          : assumptionCount === 0
            ? "Which displayed model assumption most limits what you can conclude from the selected evidence?"
            : `How does the selected observation “${request.evidence.observationIds[0]}” change—or fail to change—your initial response?`,
      blocks: [
        {
          category: "observation",
          text: `${evidenceCount} simulation observation${evidenceCount === 1 ? " was" : "s were"} selected and ${assumptionCount} assumption${assumptionCount === 1 ? " was" : "s were"} acknowledged. This count does not evaluate the meaning or quality of the learner’s prose.`,
          citations: [],
        },
        ...(citation
          ? [
              {
                category: "source-note" as const,
                text:
                  source?.claims[0] ?? "A source packet is available for comparison.",
                citations: [citation],
              },
            ]
          : []),
      ],
      citations: citation ? [citation] : [],
      whyThisFeedback:
        "Claude is unavailable, so Praxeos used only explicit evidence selections, acknowledged assumptions, and the allowlisted source packet. It did not interpret semantic correctness.",
      insufficiency:
        evidenceCount === 0 || assumptionCount === 0
          ? "needs-more-evidence"
          : "provider-unavailable",
      retryAfterSeconds: null,
    };
  }
}
