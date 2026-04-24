import { readFile } from "node:fs/promises";
import path from "node:path";
import { APPROX_CURRENT_HEIGHT } from "./epochs";
import { normalizeBlock } from "./normalize";
import { generateSyntheticBlocks } from "./synthetic";
import type { Block } from "./types";

const DATA_FILE = path.join(process.cwd(), "data", "blocks.jsonl");
const SYNTHETIC_BLOCK_COUNT = 3_200;

let historicalBlocksPromise: Promise<Block[]> | null = null;

export async function loadHistoricalBlocks(): Promise<Block[]> {
  historicalBlocksPromise ??= readHistoricalBlocks();
  return historicalBlocksPromise;
}

export async function getRecentBlocks(limit: number): Promise<Block[]> {
  const result = await getRecentBlocksWithSource(limit);
  return result.blocks;
}

export async function getRecentBlocksWithSource(
  limit: number,
): Promise<{ blocks: Block[]; source: "mempool" | "fallback" }> {
  try {
    const endpoint =
      process.env.NEXT_PUBLIC_MEMPOOL_REST ?? "https://mempool.space/api";
    const response = await fetch(`${endpoint}/blocks`, {
      headers: { accept: "application/json" },
      next: { revalidate: 30 },
    });
    if (!response.ok) throw new Error(`mempool responded ${response.status}`);

    const payload = (await response.json()) as unknown;
    const blocks = extractBlocks(payload).slice(0, limit);
    if (blocks.length > 0) return { blocks, source: "mempool" };
  } catch {
    // Fall through to local fallback data.
  }

  const historical = await loadHistoricalBlocks();
  return {
    blocks: [...historical].sort((a, b) => b.height - a.height).slice(0, limit),
    source: "fallback",
  };
}

async function readHistoricalBlocks(): Promise<Block[]> {
  try {
    const contents = await readFile(DATA_FILE, "utf8");
    const parsed = contents
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => normalizeBlock(JSON.parse(line)))
      .filter((block): block is Block => block !== null);

    if (parsed.length > 0) return parsed.sort((a, b) => a.height - b.height);
  } catch {
    // Fallback to a deterministic synthetic chain sample for local/dev usage.
  }

  return generateSyntheticBlocks({
    seed: "halving-garden-local-fallback-v2",
    count: SYNTHETIC_BLOCK_COUNT,
    tipHeight: APPROX_CURRENT_HEIGHT,
  });
}

function extractBlocks(payload: unknown): Block[] {
  if (!Array.isArray(payload)) return [];
  return payload
    .map((entry) => normalizeBlock(entry))
    .filter((block): block is Block => block !== null);
}
