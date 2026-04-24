import type { Block } from "./types";

export function normalizeBlock(raw: unknown): Block | null {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as Record<string, unknown>;

  const hashValue = record.id ?? record.hash;
  const heightValue = record.height;
  const timestampValue = record.timestamp;
  const sizeValue = record.size;
  const txCountValue = record.tx_count ?? record.txCount;

  if (
    typeof hashValue !== "string" ||
    !/^[0-9a-fA-F]{64}$/.test(hashValue) ||
    typeof heightValue !== "number" ||
    typeof timestampValue !== "number" ||
    typeof sizeValue !== "number" ||
    typeof txCountValue !== "number"
  ) {
    return null;
  }

  const feeRate = inferFeeRate(record);

  const miner =
    "pool" in record &&
    record.pool &&
    typeof record.pool === "object" &&
    "name" in record.pool &&
    typeof record.pool.name === "string"
      ? record.pool.name
      : undefined;

  return {
    hash: hashValue,
    height: heightValue,
    timestamp: timestampValue,
    size: sizeValue,
    txCount: txCountValue,
    feeRate,
    ...(miner ? { miner } : {}),
  };
}

export function mergeUniqueBlocks(
  current: readonly Block[],
  incoming: readonly Block[],
  maxItems = 24,
): Block[] {
  const next = new Map<number, Block>();
  for (const block of [...incoming, ...current]) {
    next.set(block.height, block);
  }
  return [...next.values()].sort((a, b) => b.height - a.height).slice(0, maxItems);
}

function inferFeeRate(record: Record<string, unknown>): number {
  if (typeof record.feeRate === "number") return record.feeRate;
  if (typeof record.medianFee === "number") return record.medianFee;

  const extras = record.extras;
  if (!extras || typeof extras !== "object") return 0;
  const feeRange = (extras as Record<string, unknown>).feeRange;
  if (!Array.isArray(feeRange) || feeRange.length === 0) return 0;

  const values = feeRange.filter((value): value is number => typeof value === "number");
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
