# CONTRIBUTING

**Status: closed during Fascicle I.**

Praxeos opens contributions after the launch of Fascicle I. The quality bar is Bartosz Ciechanowski / Nicky Case / The Pudding — not because ordinary contributions are unwelcome, but because a library of explorable explanations has a visible ceiling and a low ceiling is worse than a small library.

## The process (post-launch)

1. **Open a proposal PR** against `/docs/MODULE_IDEAS.md` that adds a 150-word concept note in the format of existing entries. Include: concept, thinkers, mechanic, estimated reading time, what would need to exist to build it.
2. **Editorial review.** A maintainer (initially William Menjivar; eventually a board of 2–3 Austrian-tradition-literate collaborators) responds with "accept," "revise," or "decline with reason." Decisions are documented in-thread.
3. **Only after an accepted proposal** can a module-implementation PR be opened.
4. The implementation PR lands when: the sketch is at craft level, the essay passes the voice guide, Lighthouse scores hold, all primary sources are real and linkable, and the OG card is unique.

## Editorial standards (non-negotiable)

- Every factual claim cites a primary source in `sources.ts`.
- No strawmen. If you characterize Keynes or Lange, quote them.
- Austrian-lineage voice. See `/docs/VOICE.md`.
- No default CSS eases. No `#000`/`#fff`. No Lucide-style iconography.
- Keyboard accessible. Reduced-motion fallback. Poster frame that isn't a placeholder.
- Visual regression and type checking pass.
- Lighthouse targets hold (100/100/100/100 desktop, 95+ mobile).

## Smaller contributions

Typo fixes, citation corrections, dead-link repairs, a11y improvements: open a PR directly. No proposal required.

Stylistic rewrites of essays: open an issue first.

## Non-code contributions

- **Translations.** Encouraged — Spanish (Argentinian, Chilean), Portuguese (Brazilian), German, French. Translations live in `/src/content/translations/<lang>/` and follow the same license (CC BY 4.0). Translators get full attribution.
- **Reviewer-reader.** If you've read *Human Action* cover to cover and have a scholarly eye, email for pre-release review slots.
- **Field-note contributions.** If you discover a subtlety about building one of these visualizations, a `/field-notes/` entry is welcome.

## License

All contributions fall under the project licenses: MIT for code, CC BY 4.0 for content. By opening a PR you agree to license your contribution accordingly.

## Code of conduct

Be rigorous. Be kind. Attack arguments, not authors. If the thing you want to say would not pass the bar of a scholarly seminar, it doesn't belong here.

## Contact

William Menjivar · <squilliam89971@gmail.com> · GitHub issues.
