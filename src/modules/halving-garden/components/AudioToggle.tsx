"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "praxeos-halving-audio";

export function AudioToggle({
  onToggle,
}: {
  onToggle: (enabled: boolean) => void;
}) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) === "1";
    setEnabled(stored);
    onToggle(stored);
  }, [onToggle]);

  return (
    <button
      type="button"
      data-interactive
      aria-pressed={enabled}
      onClick={() => {
        const next = !enabled;
        setEnabled(next);
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
        onToggle(next);
      }}
      className="label-mono"
      style={{
        padding: "0.45rem 0.8rem",
        border: "1px solid var(--rule)",
        borderRadius: "var(--radius-sm)",
        color: enabled ? "var(--accent-action)" : "var(--ink-secondary)",
      }}
    >
      Audio {enabled ? "on" : "off"}
    </button>
  );
}
