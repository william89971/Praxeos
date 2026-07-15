import { isLabSlug } from "@/labs/types";
import { createGuideProvider } from "@/lib/guide/provider";
import { checkGuideRateLimit } from "@/lib/guide/rate-limit";
import type { GuideProviderRequest, GuideRequest, GuideTurn } from "@/lib/guide/types";
import { sourcePacketsForLab } from "@/lib/source-packets";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const MAX_BODY_BYTES = 12_000;
const MAX_REASONING = 2_400;
const SAFE_ID = /^[a-z0-9][a-z0-9-]{0,63}$/;

export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store, max-age=0" };
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "Request is too large." },
      { status: 413, headers },
    );
  }

  const networkId =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const rate = await checkGuideRateLimit(networkId);
  if (!rate.success) {
    return NextResponse.json(
      { error: "Guide limit reached.", retryAfterSeconds: rate.retryAfterSeconds },
      {
        status: 429,
        headers: { ...headers, "Retry-After": String(rate.retryAfterSeconds) },
      },
    );
  }

  let body: Partial<GuideRequest>;
  try {
    body = (await request.json()) as Partial<GuideRequest>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400, headers });
  }
  if (
    !isLabSlug(body.labSlug) ||
    typeof body.reasoning !== "string" ||
    body.reasoning.trim().length < 12 ||
    body.reasoning.length > MAX_REASONING
  ) {
    return NextResponse.json(
      { error: "Choose a valid Lab and add a concise reasoning attempt first." },
      { status: 400, headers },
    );
  }
  const evidence = normalizeEvidence(body.evidence);
  if (!evidence) {
    return NextResponse.json(
      {
        error:
          "Evidence must contain only bounded observation, action, and assumption IDs.",
      },
      { status: 400, headers },
    );
  }

  const guideRequest: GuideProviderRequest = {
    labSlug: body.labSlug,
    reasoning: body.reasoning.trim(),
    evidence,
    sourcePackets: sourcePacketsForLab(body.labSlug).slice(0, 4),
  };

  try {
    const turn = await createGuideProvider().respond(guideRequest, request.signal);
    return NextResponse.json(turn, { headers });
  } catch (error) {
    if (request.signal.aborted) return new Response(null, { status: 499, headers });
    const status = statusFromError(error);
    const retryAfterSeconds = status === 429 ? 60 : null;
    const fallback: GuideTurn = await import("@/lib/guide/deterministic-provider").then(
      ({ DeterministicGuideProvider }) =>
        new DeterministicGuideProvider().respond(guideRequest),
    );
    return NextResponse.json(
      { ...fallback, retryAfterSeconds },
      {
        status: 200,
        headers: {
          ...headers,
          ...(retryAfterSeconds ? { "Retry-After": String(retryAfterSeconds) } : {}),
        },
      },
    );
  }
}

function normalizeEvidence(value: unknown): GuideRequest["evidence"] | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  const observationIds = normalizeIds(input.observationIds, 16);
  const actionIds = normalizeIds(input.actionIds, 40);
  const assumptionIds = normalizeIds(input.assumptionIds, 16);
  return observationIds && actionIds && assumptionIds
    ? { observationIds, actionIds, assumptionIds }
    : null;
}

function normalizeIds(value: unknown, limit: number): string[] | null {
  if (
    !Array.isArray(value) ||
    value.length > limit ||
    !value.every((item) => typeof item === "string" && SAFE_ID.test(item))
  ) {
    return null;
  }
  return [...new Set(value)];
}

function statusFromError(error: unknown): number | null {
  if (!error || typeof error !== "object") return null;
  const status = (error as { status?: unknown }).status;
  return typeof status === "number" ? status : null;
}
