"use client";

import { useEffect, useRef, useState } from "react";

type M2Payload = {
  asOf: string;
  btcIssued: number;
  blockHeight: number;
  degraded: boolean;
  m2Usd: number | null;
};

export function M2Meter() {
  const [sample, setSample] = useState<M2Payload | null>(null);
  const initialSampleRef = useRef<M2Payload | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchSample = async () => {
      try {
        const response = await fetch("/api/m2", { cache: "no-store" });
        if (!response.ok) return;
        const next = (await response.json()) as M2Payload;
        if (cancelled) return;
        initialSampleRef.current ??= next;
        setSample(next);
      } catch {
        // Keep the last successful sample.
      }
    };

    void fetchSample();
    const interval = window.setInterval(fetchSample, 300_000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  if (!sample) return null;

  const initial = initialSampleRef.current ?? sample;
  const btcDelta = sample.btcIssued - initial.btcIssued;
  const m2Delta =
    sample.m2Usd !== null && initial.m2Usd !== null
      ? sample.m2Usd - initial.m2Usd
      : null;

  return (
    <div
      className="label-mono"
      style={{
        position: "absolute",
        insetBlockEnd: "1rem",
        insetInlineEnd: "1rem",
        padding: "0.75rem 0.9rem",
        background: "rgba(245, 240, 230, 0.84)",
        border: "1px solid var(--rule)",
        borderRadius: "var(--radius-sm)",
        backdropFilter: "blur(8px)",
        maxWidth: "22ch",
      }}
    >
      <div style={{ color: "var(--ink-secondary)" }}>M2 vs BTC since load</div>
      <div style={{ marginTop: "0.4rem", color: "var(--ink-primary)" }}>
        {m2Delta === null ? "M2 unavailable" : formatUsd(m2Delta)}
      </div>
      <div style={{ marginTop: "0.1rem", color: "var(--accent-action)" }}>
        {btcDelta >= 0 ? "+" : ""}
        {btcDelta.toFixed(3)} BTC
      </div>
      <div style={{ marginTop: "0.35rem", color: "var(--ink-tertiary)" }}>
        {sample.degraded ? "Using local fallback data" : `Block ${sample.blockHeight}`}
      </div>
    </div>
  );
}

function formatUsd(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000_000)
    return `${value < 0 ? "-" : "+"}$${(abs / 1_000_000_000_000).toFixed(2)}T`;
  if (abs >= 1_000_000_000)
    return `${value < 0 ? "-" : "+"}$${(abs / 1_000_000_000).toFixed(2)}B`;
  return `${value < 0 ? "-" : "+"}$${(abs / 1_000_000).toFixed(1)}M`;
}
