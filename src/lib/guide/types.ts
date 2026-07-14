import type { LabState } from "@/lib/learning-store";
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
  category: "observation" | "concept" | "next-step";
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
  reasoning: string;
  labState: LabState;
  sourcePackets: readonly SourcePacket[];
}

export interface GuideProvider {
  readonly mode: GuideProviderMode;
  respond(request: GuideRequest, signal?: AbortSignal): Promise<GuideTurn>;
}
