"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "praxeos-halving-audio";

/**
 * The parent callback receives both the enabled state and a live
 * AudioContext when enabled. We create the context inside the click
 * handler (a user gesture) so Safari and Chrome will allow playback.
 */
type OnToggle = (enabled: boolean, ctx: AudioContext | null) => void;

export function AudioToggle({ onToggle }: { onToggle: OnToggle }) {
  const [mounted, setMounted] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Persist the visual state across reloads, but do NOT create an
    // AudioContext here — that must come from a user gesture (see click
    // handler below). A refresh therefore shows "Audio on" visually but
    // will require one click to actually produce sound. That is
    // intentional: browsers will throw otherwise.
    const stored = window.localStorage.getItem(STORAGE_KEY) === "1";
    setEnabled(stored);
    setMounted(true);
    onToggle(stored, null);
    return () => {
      // Clean up any context this component created.
      ctxRef.current?.close().catch(() => {
        /* already closed */
      });
      ctxRef.current = null;
    };
  }, [onToggle]);

  return (
    <button
      type="button"
      data-interactive
      aria-pressed={enabled}
      onClick={async () => {
        const next = !enabled;
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
        setEnabled(next);

        if (next) {
          // Lazy-construct the context inside the gesture.
          if (!ctxRef.current) {
            try {
              ctxRef.current = new AudioContext({ latencyHint: "interactive" });
            } catch {
              ctxRef.current = null;
            }
          }
          // If it had been suspended on a prior tab switch, this gesture
          // is the right moment to resume.
          try {
            await ctxRef.current?.resume();
          } catch {
            /* ignore */
          }
          onToggle(true, ctxRef.current ?? null);
        } else {
          onToggle(false, null);
        }
      }}
      className="label-mono"
      style={{
        padding: "0.45rem 0.8rem",
        border: "1px solid var(--rule)",
        borderRadius: "var(--radius-sm)",
        color: mounted && enabled ? "var(--accent-action)" : "var(--ink-secondary)",
        // Reserve space before mount so layout doesn't shift when state resolves.
        visibility: mounted ? "visible" : "hidden",
      }}
    >
      Audio {mounted && enabled ? "on" : "off"}
    </button>
  );
}
