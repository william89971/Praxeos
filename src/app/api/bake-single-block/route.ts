import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { loadHistoricalBlocks } from "@/modules/halving-garden/lib/data";
import { EPOCHS } from "@/modules/halving-garden/lib/epochs";
import { computePanels, positionOfBlock } from "@/modules/halving-garden/lib/layout";
import {
  mergeUniqueBlocks,
  normalizeBlock,
} from "@/modules/halving-garden/lib/normalize";
import { renderTileSvg, tileIndexForPoint } from "@/modules/halving-garden/lib/tile";
import {
  MAX_ZOOM,
  WORLD_HEIGHT,
  WORLD_TOP_PADDING,
  WORLD_WIDTH,
} from "@/modules/halving-garden/lib/viewport";

export const runtime = "nodejs";

const PANELS = computePanels(
  WORLD_WIDTH,
  WORLD_HEIGHT,
  WORLD_TOP_PADDING,
  EPOCHS.length,
);
const canWriteLocalTiles =
  process.env.NODE_ENV !== "production" ||
  process.env.PRAXEOS_ENABLE_LOCAL_TILE_BAKE === "1";

/** Simple in-memory rate limiter: max 10 requests per 60s per IP. */
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;

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

export async function POST(request: Request): Promise<Response> {
  if (!canWriteLocalTiles) {
    return Response.json(
      { ok: false, error: "Local tile baking is disabled in this environment" },
      { status: 403 },
    );
  }

  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  if (isRateLimited(ip)) {
    return new Response("Too Many Requests", { status: 429 });
  }

  let body: unknown;
  try {
    body = (await request.json()) as unknown;
  } catch {
    return Response.json(
      { ok: false, error: "Request body must be valid JSON" },
      { status: 400 },
    );
  }

  const block = normalizeBlock(body);
  if (!block) {
    return Response.json(
      { ok: false, error: "Invalid block payload" },
      { status: 400 },
    );
  }

  const allBlocks = mergeUniqueBlocks(await loadHistoricalBlocks(), [block], 3_400);
  const positioned = positionOfBlock(block.height, PANELS, 7);
  if (!positioned) {
    return Response.json(
      { ok: false, error: "Block could not be positioned" },
      { status: 400 },
    );
  }

  const touched: Array<{ z: number; x: number; y: number }> = [];
  for (let zoom = 0; zoom <= MAX_ZOOM; zoom++) {
    const tile = tileIndexForPoint(positioned.x, positioned.y, zoom);
    touched.push({ z: zoom, ...tile });
  }

  for (const tile of touched) {
    const dir = path.join(process.cwd(), "data", "tiles", `${tile.z}`, `${tile.x}`);
    await mkdir(dir, { recursive: true });
    await writeFile(
      path.join(dir, `${tile.y}.svg`),
      renderTileSvg(tile.z, tile.x, tile.y, allBlocks),
      "utf8",
    );
  }

  return Response.json({
    ok: true,
    blockHeight: block.height,
    writtenTiles: touched.length,
  });
}
