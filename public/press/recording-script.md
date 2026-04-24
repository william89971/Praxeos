# 60-second screen recording — storyboard

Target: 60 seconds. 1080p or 1440p capture. No audio track (ambient
room sound OK in raw; edit may add optional Tone.js bell near tick 8).
Twelve shots at ~5 seconds each, a few shorter for punctuation.

Record with Chrome in a clean window at 1440×900, light theme default.
Ensure cursor visibility. Avoid touching the devtools-adjacent corners.

---

## Shots

**01 — 0:00 → 0:03** · Browser address bar. Type `praxeos.org` and press return.
*Notes:* Let the blank viewport show for a beat before the Teleology sketch
blooms in. The bloom is the first thing people should see.

**02 — 0:03 → 0:08** · Homepage hero. Teleology animating in the background,
PRAXEOS title settling, tagline readable. Let agents visibly form clusters.

**03 — 0:08 → 0:12** · Slow scroll to the Manifesto Excerpt section. Pause
on the § I label and the two paragraphs.

**04 — 0:12 → 0:16** · Continue scrolling past the modules teaser. Pause
briefly on the three module titles.

**05 — 0:16 → 0:23** · Click into `/modules/halving-garden`. Let the page
compose; the tile layer should load. Zoom out to see all four epochs,
then zoom into epoch IV (the latest).

**06 — 0:23 → 0:26** · Hover a live block. Let the tooltip / block height
appear if implemented; otherwise let the organism's orange pistil read
for a beat.

**07 — 0:26 → 0:33** · Navigate to `/modules/time-preference-forest`.
Start with defaults (mid time preference, no intervention). Drag the
Central Bank Intervention slider to ~70% — orange glow appears.

**08 — 0:33 → 0:41** · Press **Market correction**. Let the full 8-second
cascade play: orange dissipates, artificial branches blacken, trees
fall. Hold on the final frame for a beat.

**09 — 0:41 → 0:48** · Navigate to `/modules/calculation-problem`. Start
in comparison mode. Bump the complexity slider up so the gap widens.

**10 — 0:48 → 0:54** · Click **Be the Planner →**. Click **Start 45s
arc** quickly, then cut (no need to show the full 45 s). Make a couple
of recipe choices on the producer cards to show the interactivity.

**11 — 0:54 → 0:58** · Return to `/`. Scroll to footer. Show the *Homo
agit.* mark, the MIT + CC BY 4.0 line, the GitHub link.

**12 — 0:58 → 1:00** · End card: black paper, centered italic "Praxeos.
praxeos.org" and tiny "Homo agit." beneath.

---

## Variants

- **30-second cut** for Twitter: shots 01 → 02 → 05 → 08 → 10 → 12.
- **15-second cut** for TikTok/Reels: shots 02 → 06 → 08 (just the
  correction) → 12.
- **Still for HN submission:** final frame of shot 02, cropped tight on
  the title + tagline with the agent cloud behind.

---

## Recording hygiene

- Close all other tabs. Browser window must not cover any system clock
  or personal notifications.
- Disable Dock autohide briefly so the cursor doesn't wake it. Or
  capture only the browser window content area.
- Use Playwright to drive the interactions for a take if manual cursor
  motion is shaky (see `scripts/capture-screenshots.ts` for the page
  navigation recipes).
