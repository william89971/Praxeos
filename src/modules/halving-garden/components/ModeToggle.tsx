"use client";

import type { CSSProperties } from "react";

export type GardenMode = "guided" | "explore";

interface Props {
  readonly mode: GardenMode;
  readonly onChange: (mode: GardenMode) => void;
}

/**
 * Segmented Guided / Explore control. Reads as a quiet pair of label-mono
 * buttons matching the rest of the module's chrome.
 */
export function ModeToggle({ mode, onChange }: Props) {
  return (
    <div
      aria-label="Halving Garden mode"
      style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}
    >
      <Button active={mode === "guided"} onClick={() => onChange("guided")}>
        Guided
      </Button>
      <Button active={mode === "explore"} onClick={() => onChange("explore")}>
        Explore
      </Button>
    </div>
  );
}

interface ButtonProps {
  readonly active: boolean;
  readonly onClick: () => void;
  readonly children: string;
}

function Button({ active, onClick, children }: ButtonProps) {
  return (
    <button
      type="button"
      data-interactive
      className="label-mono"
      aria-pressed={active}
      onClick={onClick}
      style={buttonStyle(active)}
    >
      {children}
    </button>
  );
}

function buttonStyle(active: boolean): CSSProperties {
  return {
    padding: "0.42rem 0.85rem",
    border: `1px solid ${active ? "var(--ink-secondary)" : "var(--rule)"}`,
    borderRadius: "var(--radius-sm)",
    background: active ? "var(--paper)" : "transparent",
    color: active ? "var(--ink-primary)" : "var(--ink-secondary)",
    transition:
      "background var(--dur-micro) var(--ease-organic), color var(--dur-micro) var(--ease-organic)",
  };
}
