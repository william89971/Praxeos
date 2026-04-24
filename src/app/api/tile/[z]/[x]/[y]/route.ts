import { readFile } from "node:fs/promises";
import path from "node:path";
import { loadHistoricalBlocks } from "@/modules/halving-garden/lib/data";
import { renderTileSvg, tileCounts } from "@/modules/halving-garden/lib/tile";

export const runtime = "nodejs";

type Params = Promise<{ z: string; x: string; y: string }>;

export async function GET(
  _request: Request,
  context: { params: Params },
): Promise<Response> {
  const { z, x, y } = await context.params;
  const zoom = Number(z);
  const tileX = Number(x);
  const tileY = Number(y);

  if (!Number.isInteger(zoom) || !Number.isInteger(tileX) || !Number.isInteger(tileY)) {
    return new Response("Invalid tile coordinates", { status: 400 });
  }

  const limits = tileCounts(zoom);
  if (tileX < 0 || tileY < 0 || tileX >= limits.x || tileY >= limits.y) {
    return new Response("Tile out of range", { status: 404 });
  }

  const localPath = path.join(process.cwd(), "data", "tiles", z, x, `${y}.svg`);
  try {
    const svg = await readFile(localPath, "utf8");
    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    const blocks = await loadHistoricalBlocks();
    const svg = renderTileSvg(zoom, tileX, tileY, blocks);
    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  }
}
