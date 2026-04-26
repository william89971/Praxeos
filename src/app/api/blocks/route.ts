import { getRecentBlocksWithSource } from "@/modules/halving-garden/lib/data";

export const runtime = "nodejs";

type CachedPayload = {
  expiresAt: number;
  payload: {
    blocks: Awaited<ReturnType<typeof getRecentBlocksWithSource>>["blocks"];
    source: "mempool" | "fallback";
    cachedAt: string;
  };
};

let cache: CachedPayload | null = null;

/** Simple in-memory rate limiter: max 30 requests per 10s per IP. */
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 30;
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

export async function GET(request: Request): Promise<Response> {
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  if (isRateLimited(ip)) {
    return new Response("Too Many Requests", { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const raw = Number(searchParams.get("limit") ?? 12);
  const limit = Number.isNaN(raw) ? 12 : Math.max(1, Math.min(24, raw));

  if (cache && cache.expiresAt > Date.now() && cache.payload.blocks.length >= limit) {
    return Response.json({
      ...cache.payload,
      blocks: cache.payload.blocks.slice(0, limit),
    });
  }

  const { blocks, source } = await getRecentBlocksWithSource(limit);
  const payload = {
    blocks,
    source,
    cachedAt: new Date().toISOString(),
  } as const;

  cache = {
    expiresAt: Date.now() + 30_000,
    payload,
  };

  return Response.json(payload, {
    headers: {
      "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
    },
  });
}
