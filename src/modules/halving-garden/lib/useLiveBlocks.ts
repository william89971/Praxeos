"use client";

import { useEffect, useRef, useState } from "react";
import { mergeUniqueBlocks, normalizeBlock } from "./normalize";
import type { Block } from "./types";

type ApiPayload = {
  blocks?: unknown[];
};

export function useLiveBlocks(limit = 16) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [source, setSource] = useState<"websocket" | "polling" | "fallback">(
    "fallback",
  );
  const seenHeightsRef = useRef(new Set<number>());

  useEffect(() => {
    let cancelled = false;
    let socket: WebSocket | null = null;

    const applyIncoming = (incoming: readonly Block[], nextSource: typeof source) => {
      if (incoming.length === 0 || cancelled) return;
      setSource(nextSource);
      setBlocks((current) => mergeUniqueBlocks(current, incoming, limit));
      for (const block of incoming) {
        seenHeightsRef.current.add(block.height);
      }
    };

    const fetchRecent = async () => {
      try {
        const response = await fetch(`/api/blocks?limit=${limit}`, {
          cache: "no-store",
        });
        if (!response.ok) return;
        const payload = (await response.json()) as ApiPayload;
        const incoming = (payload.blocks ?? [])
          .map((entry) => normalizeBlock(entry))
          .filter((block): block is Block => block !== null);
        applyIncoming(incoming, "polling");
      } catch {
        // Ignore transient polling failures.
      }
    };

    const startWebSocket = () => {
      try {
        const endpoint =
          process.env.NEXT_PUBLIC_MEMPOOL_WS ?? "wss://mempool.space/api/v1/ws";
        socket = new WebSocket(endpoint);
        socket.addEventListener("open", () => {
          socket?.send(JSON.stringify({ action: "want", data: ["blocks"] }));
        });
        socket.addEventListener("message", (event) => {
          const incoming = extractLiveBlocks(event.data);
          if (incoming.length > 0) {
            applyIncoming(incoming, "websocket");
          }
        });
      } catch {
        // Polling fallback will keep the module alive.
      }
    };

    void fetchRecent();
    startWebSocket();
    const interval = window.setInterval(fetchRecent, 30_000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      socket?.close();
    };
  }, [limit]);

  const newest = blocks[0] ?? null;
  const unseenCount = blocks.filter(
    (block) => !seenHeightsRef.current.has(block.height),
  ).length;

  return { blocks, newest, source, unseenCount };
}

function extractLiveBlocks(payload: string): Block[] {
  try {
    const parsed = JSON.parse(payload) as unknown;
    const candidates = collectBlockCandidates(parsed);
    return candidates
      .map((entry) => normalizeBlock(entry))
      .filter((block): block is Block => block !== null);
  } catch {
    return [];
  }
}

function collectBlockCandidates(value: unknown, depth = 0): unknown[] {
  if (depth > 3 || value === null || value === undefined) return [];
  if (Array.isArray(value)) {
    return value.flatMap((entry) => collectBlockCandidates(entry, depth + 1));
  }
  if (typeof value !== "object") return [];

  const record = value as Record<string, unknown>;
  if (
    typeof record.height === "number" &&
    (typeof record.id === "string" || typeof record.hash === "string")
  ) {
    return [record];
  }

  return Object.values(record).flatMap((entry) =>
    collectBlockCandidates(entry, depth + 1),
  );
}
