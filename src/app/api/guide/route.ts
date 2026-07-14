import { NextResponse } from "next/server";
import { createGuideProvider } from "@/lib/guide/provider";
import { checkGuideRateLimit } from "@/lib/guide/rate-limit";
import type { GuideRequest, GuideTurn } from "@/lib/guide/types";
import type { LabState } from "@/lib/learning-store";
import { SOURCE_PACKETS } from "@/lib/source-packets";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const MAX_BODY_BYTES = 12_000;
const MAX_REASONING = 2_400;

export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store, max-age=0" };
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request is too large." }, { status: 413, headers });
  }

  const networkId = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const rate = await checkGuideRateLimit(networkId);
  if (!rate.success) {
    return NextResponse.json(
      { error: "Guide limit reached.", retryAfterSeconds: rate.retryAfterSeconds },
      { status: 429, headers: { ...headers, "Retry-After": String(rate.retryAfterSeconds) } },
    );
  }

  let body: { reasoning?: unknown; labState?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400, headers });
  }
  if (typeof body.reasoning !== "string" || body.reasoning.trim().length < 12 || body.reasoning.length > MAX_REASONING) {
    return NextResponse.json({ error: "Add a concise reasoning attempt first." }, { status: 400, headers });
  }

  const labState = normalizeLabState(body.labState);
  const guideRequest: GuideRequest = {
    reasoning: body.reasoning.trim(),
    labState,
    sourcePackets: SOURCE_PACKETS.slice(0, 3),
  };

  try {
    const turn = await createGuideProvider().respond(guideRequest, request.signal);
    return NextResponse.json(turn, { headers });
  } catch (error) {
    if (request.signal.aborted) return new Response(null, { status: 499, headers });
    const status = statusFromError(error);
    const retryAfterSeconds = status === 429 ? 60 : null;
    const fallback: GuideTurn = await import("@/lib/guide/deterministic-provider").then(({ DeterministicGuideProvider }) =>
      new DeterministicGuideProvider().respond(guideRequest),
    );
    return NextResponse.json(
      { ...fallback, retryAfterSeconds },
      { status: 200, headers: { ...headers, ...(retryAfterSeconds ? { "Retry-After": String(retryAfterSeconds) } : {}) } },
    );
  }
}

function normalizeLabState(value: unknown): LabState {
  const input = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    priced: input.priced === true,
    path: Array.isArray(input.path)
      ? input.path.filter((item): item is string => typeof item === "string").slice(0, 12)
      : [],
    waste: typeof input.waste === "number" ? Math.max(0, Math.min(99, input.waste)) : 0,
    uncertainty: typeof input.uncertainty === "number" ? Math.max(0, Math.min(99, input.uncertainty)) : 0,
  };
}

function statusFromError(error: unknown): number | null {
  if (!error || typeof error !== "object") return null;
  const status = (error as { status?: unknown }).status;
  return typeof status === "number" ? status : null;
}
