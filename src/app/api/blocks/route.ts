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

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const limit = Math.max(1, Math.min(24, Number(searchParams.get("limit") ?? 12)));

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
