"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * Small typographic theme toggle. Cycles: system → light → dark → system.
 * Label reads the NEXT state so the action is legible.
 */
export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const active = mounted ? theme : "system";
  const resolved = mounted ? resolvedTheme : "light";

  const next = active === "system" ? "light" : active === "light" ? "dark" : "system";
  const label =
    active === "system" ? `Auto (${resolved})` : active === "light" ? "Light" : "Dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Theme: ${label}. Click to switch to ${next}.`}
      className="label-mono theme-toggle"
    >
      {label}
    </button>
  );
}
