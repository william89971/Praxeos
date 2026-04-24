# VOICE — Editorial Guide

Praxeos is explicitly, unapologetically **Austro-libertarian**. Not neutral pedagogy. Not three-handed economics. The site is the argument that the Austrian tradition is intellectually alive, factually correct in its core theorems, and aesthetically equal to any rival.

That said: the *interactives* are pedagogically austere. The polemic lives in the essays. A reader who only plays with the Halving Garden and never reads a word should not feel preached at. A reader who opens `essay.mdx` should feel they have walked into a room where the authors of *Human Action* and *Prices and Production* are taken seriously on their own terms.

## Register

- Confident, not strident.
- Scholarly, not academic. Academic prose is hedged, passive, ritually polite. Scholarly prose is precise, active, and unafraid of conclusions.
- Rothbard's lucidity + Hazlitt's clarity + a contemporary editorial polish.
- **No snark. No bitterness.** The ideas are strong enough; pettiness diminishes them.

## Vocabulary — prefer / avoid

| Prefer | Avoid |
|---|---|
| *the market* / *catallactics* | *free market capitalism* |
| *central bank intervention* | *monetary stimulus* |
| *roundabout production* | *supply chain* (when precision matters) |
| *time preference* | *patience* or *future-orientation* |
| *entrepreneurial alertness* | *innovation* or *disruption* |
| *calculation* (Mises's sense) | *optimization* |
| *spontaneous order* | *the market's invisible hand* (Smith's phrase, not Hayek's) |
| *homo agens* | *economic agent* |
| *sound money* | *hard money* (colloquial only) |

Never used:

- "Late-stage capitalism" — not an Austrian concept; borrowed from a different tradition.
- "Neoliberal" — imprecise pejorative.
- "Trickle-down" — a caricature, never a position.
- "Free-market capitalism" — redundant; the market IS catallactic exchange.
- "Libertarian" as an aesthetic adjective — it's a political position, not a color.
- "Problematic," "toxic," "gaslight" — contemporary register that will date the essays in two years.

## Latin, em-dashes, semicolons — welcome

*A priori*, *mutatis mutandis*, *ceteris paribus*, *ex ante*, *ex post*, *ordo*, *praxeology*, *catallactics*. Readers of Mises read Latin without blinking. Lean into it.

Em-dashes set off parenthetical arguments; semicolons link related clauses; colons introduce lists and quotes. Punctuate like a 19th-century essayist, not a Twitter thread.

## Author handling

Name thinkers **in full** on first mention in an essay, then shorten by last name. Use `<SmallCaps>` around names in running prose:

> <SmallCaps>Ludwig von Mises</SmallCaps> argued, in *Die Gemeinwirtschaft* (1922)...

Subsequent: "Mises." Book titles in italic. Years in parentheses on first citation. For quotations, always cite page and edition.

### How to treat thinkers with complicated legacies

**Rothbard** — quote his economics freely. *Man, Economy, and State* (1962) and *The Ethics of Liberty* (1982) are the canonical references. When quoting, prefer his technical economic writing over his polemical political writing. If a module's topic is ABCT, cite *America's Great Depression* (1963). Do not quote his editorial pieces from the 60s–70s unless directly relevant to the argument.

**Hoppe** — cite *Democracy: The God That Failed* (2001) on time preference and regime-uncertainty topics where it is load-bearing. Do not cite it outside its argumentative contribution. His argumentation ethics work is more philosophically productive than his political applications.

**Mises, Hayek, Menger, Böhm-Bawerk, Kirzner, Lachmann, Salerno, Ammous** — cite freely in both technical and programmatic registers. These are the central voices.

**Keynes, Samuelson, Lange, Lerner, Piketty** — antagonists. Treat with the respect due to genuine intellectual opponents. Quote them accurately and at their best; rebut them on substance.

## Structure of an essay

500–1200 words. Longer is not braver.

1. **Opening sentence** — arresting. Names the phenomenon. The reader is curious by the end of line one.
2. **Puzzle paragraph** — what did the thinker see that others missed? Sets the stakes.
3. **Development — 3 to 5 paragraphs.** Each does one job: claim, primary-source grounding, handoff.
4. **One pull quote** — from a primary source, pulled to stand alone. Not decorative. It should be the best sentence in the room.
5. **Implication paragraph** — not "so what," but "what now." Connect to a world the reader inhabits.
6. **Closing sentence** — pointed. Does not hedge.

## Citation apparatus

- Every non-trivial factual claim traces to a source in `sources.ts`.
- Inline: `<Citation n={3}>Mises, Human Action, p. 14</Citation>`.
- Marginalia: `<Marginalia>Full sentence of context</Marginalia>` for asides that would otherwise be parentheticals.
- Footnotes: `<Footnote id="regression">...</Footnote>` for scholarly tangents.
- Primary sources in `sources.ts` prefer `mises.org/library/...` or `archive.org/details/...` URLs, which outlive publisher churn. Always include `archiveUrl` when the publisher URL might rot.

## Voice calibration — three passages

### Too hedged (wrong)

> Some Austrian economists argue, though there is debate on this point, that socialist planning may face certain informational challenges that could, in theory, impede efficient resource allocation.

### Too strident (wrong)

> Mises destroyed socialism in 1920. Lange got his ass handed to him. Case closed. Smash that like button.

### Right

> In 1920 Mises showed that socialist planning cannot compute. Without market prices for the means of production, there is no common unit by which to compare one production plan against another; the planner is left with preference and improvisation, not calculation. Lange and Lerner spent two decades proposing solutions that each, in turn, smuggled the market back in.

Clear. Historical. Grounded. Not bashful about its conclusions. This is the register.

## A final test

Read the finished essay aloud. If at any point you would be embarrassed to read the line to a graduate seminar on Austrian economics, rewrite. If at any point you would be embarrassed to read the line to a skeptical HN reader, rewrite. The line that passes both tests is the line that ships.
