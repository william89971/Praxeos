import { readFile } from "node:fs/promises";
import path from "node:path";
import { syntheticBlockForHeight } from "@/modules/halving-garden/lib/synthetic";
import {
  heightsForTile,
  renderTileSvg,
  tileCounts,
} from "@/modules/halving-garden/lib/tile";

export const runtime = "nodejs";

type Params = Promise<{ z: string; x: string; y: string }>;

/** Simple in-memory rate limiter: max 60 requests per 10s per IP. */
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 60;
const RATE_LIMIT_WINDOW_MS = 10_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

export async function GET(
  request: Request,
  context: { params: Params },
): Promise<Response> {
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  if (isRateLimited(ip)) {
    return new Response("Too Many Requests", { status: 429 });
  }

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

  // Build the local tile path from the *parsed integers*, not the raw
  // URL segments, and assert the resolved path stays inside data/tiles.
  // Defense-in-depth against any future refactor that loosens the
  // integer pre-check.
  const tilesRoot = path.resolve(process.cwd(), "data", "tiles");
  const localPath = path.join(tilesRoot, `${zoom}`, `${tileX}`, `${tileY}.svg`);
  if (!path.resolve(localPath).startsWith(`${tilesRoot}${path.sep}`)) {
    return new Response("Invalid tile path", { status: 400 });
  }

  try {
    const svg = await readFile(localPath, "utf8");
    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    // No pre-baked tile file — generate organisms tile-locally.
    // heightsForTile finds which block heights map into this tile's Hilbert
    // bounds; syntheticBlockForHeight gives each a deterministic organism.
    const heights = heightsForTile(zoom, tileX, tileY);
    const blocks = heights.map(syntheticBlockForHeight);
    const svg = renderTileSvg(zoom, tileX, tileY, blocks);
    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  }
}
