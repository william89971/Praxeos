import Anthropic from "@anthropic-ai/sdk";
import { AnthropicGuideProvider } from "./anthropic-provider";
import { DeterministicGuideProvider } from "./deterministic-provider";
import type { GuideProvider } from "./types";

export function createGuideProvider(): GuideProvider {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  return apiKey
    ? new AnthropicGuideProvider(new Anthropic({ apiKey }))
    : new DeterministicGuideProvider();
}
