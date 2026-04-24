#!/usr/bin/env tsx

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { loadHistoricalBlocks } from "@/modules/halving-garden/lib/data";
import { tileCounts } from "@/modules/halving-garden/lib/tile";
import { MAX_ZOOM } from "@/modules/halving-garden/lib/viewport";
import { bakeTile } from "./bake-worker";

const arg = process.argv.find((entry) => entry.startsWith("--max-zoom="));
const maxZoom = Math.max(0, Math.min(MAX_ZOOM, Number(arg?.split("=")[1] ?? MAX_ZOOM)));

async function main() {
  const blocks = await loadHistoricalBlocks();
  for (let zoom = 0; zoom <= maxZoom; zoom++) {
    const counts = tileCounts(zoom);
    for (let x = 0; x < counts.x; x++) {
      const dir = path.join(process.cwd(), "data", "tiles", `${zoom}`, `${x}`);
      await mkdir(dir, { recursive: true });
      for (let y = 0; y < counts.y; y++) {
        await writeFile(
          path.join(dir, `${y}.svg`),
          bakeTile({ z: zoom, x, y }, blocks),
          "utf8",
        );
      }
    }
  }

  console.log(`Baked Halving Garden tiles through zoom ${maxZoom}.`);
}

void main();
