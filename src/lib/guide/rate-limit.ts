import { createHash } from "node:crypto";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export interface RateLimitResult {
  success: boolean;
  retryAfterSeconds: number;
}

export async function checkGuideRateLimit(networkId: string): Promise<RateLimitResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return { success: true, retryAfterSeconds: 0 };

  const id = createHash("sha256")
    .update(`${process.env.GUIDE_RATE_LIMIT_SALT ?? "praxeos-local"}:${networkId}`)
    .digest("hex");
  const redis = new Redis({ url, token });
  const minute = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(6, "1 m"),
    prefix: "guide:min",
  });
  const day = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "1 d"),
    prefix: "guide:day",
  });
  const [minuteResult, dayResult] = await Promise.all([
    minute.limit(id),
    day.limit(id),
  ]);
  if (minuteResult.success && dayResult.success)
    return { success: true, retryAfterSeconds: 0 };
  const reset = Math.max(minuteResult.reset, dayResult.reset);
  return {
    success: false,
    retryAfterSeconds: Math.max(1, Math.ceil((reset - Date.now()) / 1000)),
  };
}
