import { totalIssuedAtHeight } from "@/modules/halving-garden/lib/chain";
import { getRecentBlocks } from "@/modules/halving-garden/lib/data";

export const runtime = "nodejs";

type M2Payload = {
  asOf: string;
  btcIssued: number;
  blockHeight: number;
  degraded: boolean;
  m2Usd: number | null;
};

/**
 * Live M2-vs-BTC-issuance comparison for the Halving Garden's corner
 * widget. Cache-Control below carries the load; we deliberately do not
 * keep an in-memory singleton — per-instance globals don't share on
 * Vercel and would race under cold starts.
 */
export async function GET(): Promise<Response> {
  const [latestBlock] = await getRecentBlocks(1);
  const blockHeight = latestBlock?.height ?? 0;
  const btcIssued = totalIssuedAtHeight(blockHeight);

  const payload: M2Payload = {
    asOf: new Date().toISOString(),
    btcIssued,
    blockHeight,
    degraded: true,
    m2Usd: null,
  };

  const apiKey = process.env.FRED_API_KEY;
  if (apiKey) {
    try {
      const response = await fetch(
        `https://api.stlouisfed.org/fred/series/observations?series_id=M2SL&api_key=${apiKey}&file_type=json&sort_order=desc&limit=1`,
        { next: { revalidate: 900 } },
      );

      if (response.ok) {
        const data = (await response.json()) as {
          observations?: Array<{ value: string; date: string }>;
        };
        const observation = data.observations?.[0];
        const value = observation ? Number(observation.value) : Number.NaN;
        if (Number.isFinite(value)) {
          // FRED's M2SL series is published in BILLIONS of dollars.
          // Multiply by 1e9 to get raw USD. Earlier code used 1e12 which
          // rendered the meter ~1000× too high. See tests/unit/m2-units.test.ts.
          payload.m2Usd = value * 1_000_000_000;
          payload.asOf = observation?.date
            ? new Date(`${observation.date}T00:00:00.000Z`).toISOString()
            : payload.asOf;
          payload.degraded = false;
        }
      }
    } catch {
      // Keep the degraded payload.
    }
  }

  return Response.json(payload, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=1800",
    },
  });
}
