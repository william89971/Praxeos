#!/usr/bin/env tsx

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { normalizeBlock } from "@/modules/halving-garden/lib/normalize";

const endpoint = process.env.NEXT_PUBLIC_MEMPOOL_REST ?? "https://mempool.space/api";
const limit = Math.max(1, Math.min(50, Number(process.argv[2] ?? 30)));

async function main() {
  const response = await fetch(`${endpoint}/blocks`);
  if (!response.ok) {
    throw new Error(`mempool responded ${response.status}`);
  }

  const payload = (await response.json()) as unknown[];
  const blocks = payload
    .map((entry) => normalizeBlock(entry))
    .filter((block): block is NonNullable<typeof block> => block !== null)
    .slice(0, limit);

  await mkdir(path.join(process.cwd(), "data"), { recursive: true });
  await writeFile(
    path.join(process.cwd(), "data", "blocks.jsonl"),
    `${blocks.map((block) => JSON.stringify(block)).join("\n")}\n`,
    "utf8",
  );

  console.log(`Wrote ${blocks.length} blocks to data/blocks.jsonl.`);
}

void main();
