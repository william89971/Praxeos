import type { GuideBlock, GuideTurn } from "./types";

const QUESTION_END = /\?/g;

export function validateGuideTurn(
  turn: GuideTurn,
): { ok: true } | { ok: false; reason: string } {
  const questionMarks = turn.question.match(QUESTION_END)?.length ?? 0;
  if (questionMarks !== 1 || !turn.question.trim().endsWith("?")) {
    return { ok: false, reason: "Guide must ask exactly one question." };
  }
  if (turn.blocks.length === 0)
    return { ok: false, reason: "Guide needs an explanation block." };
  const uncitedClaim = turn.blocks.some(
    (block) =>
      block.category !== "observation" &&
      block.text.trim().length > 0 &&
      block.citations.length === 0,
  );
  if (uncitedClaim)
    return { ok: false, reason: "Every factual concept explanation must be cited." };
  return { ok: true };
}

export function classifyBlock(text: string, index: number): GuideBlock["category"] {
  if (index === 0 || /you (wrote|noticed|identified)/i.test(text)) return "observation";
  if (/try|revise|next|consider/i.test(text)) return "next-step";
  return "concept";
}
