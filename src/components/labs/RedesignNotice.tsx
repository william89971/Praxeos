"use client";

import { useEffect, useState } from "react";

const OLD_NAMES: Record<string, string> = {
  "monetary-garden": "Monetary Garden",
  "signal-orchard": "Signal Orchard",
  "calculation-labyrinth": "Calculation Labyrinth",
  "coordination-engine": "Coordination Engine",
};

export function RedesignNotice({ oldSlug }: { oldSlug: string }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  const oldName = OLD_NAMES[oldSlug] ?? "That earlier Lab";
  return (
    <aside className="page-section redesign-notice" aria-label="Lab redesign notice">
      <div>
        <p className="label-mono">The Lab system changed</p>
        <p>
          <strong>{oldName}</strong> is now part of a four-Lab progression built around
          choice, exchange, discovery, and money across time. Your earlier writing
          remains available as a read-only Notebook record when it exists in this
          browser.
        </p>
      </div>
      <button type="button" className="text-button" onClick={() => setVisible(false)}>
        Dismiss
      </button>
    </aside>
  );
}

export function RedesignNoticeFromUrl() {
  const [oldSlug, setOldSlug] = useState<string | null>(null);

  useEffect(() => {
    setOldSlug(new URLSearchParams(window.location.search).get("redesigned"));
  }, []);

  return oldSlug ? <RedesignNotice oldSlug={oldSlug} /> : null;
}
