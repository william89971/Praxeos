import type { LabSlug } from "@/labs/types";
import type { SourcePacket } from "@/lib/source-packets";

export type GuideProviderMode = "claude" | "deterministic";

export interface GuideCitation {
  sourceId: string;
  title: string;
  url: string;
  locator: string;
  citedText?: string;
}

export interface GuideBlock {
  category: "observation" | "distinction" | "source-note" | "next-step";
  text: string;
  citations: GuideCitation[];
}

export interface GuideTurn {
  providerMode: GuideProviderMode;
  question: string;
  blocks: GuideBlock[];
  citations: GuideCitation[];
  whyThisFeedback: string;
  insufficiency:
    | "none"
    | "needs-more-evidence"
    | "provider-unavailable"
    | "invalid-response";
  retryAfterSeconds: number | null;
}

export interface GuideRequest {
  labSlug: LabSlug;
  reasoning: string;
  evidence: {
    observationIds: string[];
    actionIds: string[];
    assumptionIds: string[];
  };
}

export interface GuideProviderRequest extends GuideRequest {
  sourcePackets: readonly SourcePacket[];
}

export interface GuideProvider {
  readonly mode: GuideProviderMode;
  respond(request: GuideProviderRequest, signal?: AbortSignal): Promise<GuideTurn>;
}
