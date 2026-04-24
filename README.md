# Praxeos

> *Homo agit.*

A library of interactive, generative, philosophically rigorous explorable explanations of Austrian economics and praxeology. An open-source cultural artifact.

The ideas worth teaching — the action axiom, time preference, subjective value, the Cantillon effect, Mises's calculation argument, Hayek's knowledge problem, roundaboutness, spontaneous order, the regression theorem — are among the most beautiful in the social sciences. They are almost always taught badly: dry prose, ideological posturing, ugly PDFs, no visual imagination. Praxeos is a protest against that.

The site is its own argument. The fact that it exists, looks exceptional, and teaches these ideas clearly is a small demonstration of spontaneous order and purposeful action. The medium is the message.

---

## Fascicle I — Action, Time, and Calculation

Three modules ship together as the first volume.

**The Halving Garden** — A living, generative manuscript of Bitcoin's history. Every block from genesis to tip rendered as a Haeckel-style botanical organism on a Hilbert curve, arranged in four illuminated halving-epoch pages. New blocks ghost in live via `mempool.space`. A quiet argument about fixed supply, sound money, and emergent monetary order. *(Menger, Mises, Hayek, Ammous)*

**The Time Preference Forest** — Austrian capital theory made visceral. A generative woodcut forest whose morphology reads time preference and central-bank intervention; a "market correction" reveals actual capital depth. Built from L-systems and the one orange accent that appears only under intervention. *(Böhm-Bawerk, Rothbard, Mises, Hayek)*

**The Calculation Problem** — Mises's 1920 argument rendered as a two-panel typographic particle system. Prices emerge in the market panel as visible supply chains; in the planned panel, shortages pile up and surpluses rot. A love letter to type as information. *(Mises, Hayek, Salerno)*

---

## Philosophy

Every module does four things:

1. **Teaches a real concept with scholarly rigor** — citing primary sources, never paraphrasing past an idea.
2. **Produces a generative or interactive piece beautiful enough to be shared as art on its own**, independent of the essay.
3. **Includes a 500–1200 word MDX essay with footnotes and citations.**
4. **Is permanently linkable, permanently shareable, permanently archivable.**

Craft lineage: Bret Victor, Nicky Case, Bartosz Ciechanowski, The Pudding, Stripe Press, Edward Tufte, Robin Sloan, Observable. If it does not belong on that shortlist, it does not ship.

---

## Stack

Next.js 15 · React 19 · TypeScript (strict) · Tailwind CSS v4 · Motion · p5.js · regl · MDX · Vercel · Supabase (newsletter only) · Upstash Redis · Biome · Vitest · Playwright.

Full rationale in `/docs/ARCHITECTURE.md`.

---

## Develop

```bash
git clone https://github.com/william89971/praxeos
cd praxeos
npm install
npm run dev
```

Then open `http://localhost:3000`. See `CLAUDE.md` for conventions and the ship-a-module recipe.

---

## Contributing

Closed during Fascicle I. Opens after launch via a proposal-first process — see `/docs/CONTRIBUTING.md`. The quality bar is Bartosz / Nicky Case. Mediocre additions lower the site's ceiling.

---

## License

- **Code:** [MIT](./LICENSE)
- **Essays, modules, generated artworks:** [CC BY 4.0](./LICENSE-CONTENT.md)

Translate, remix, quote, classroom-use freely — with attribution.

---

## Colophon

Written and built by William Menjivar. Set in Fraunces, Inter, and JetBrains Mono. Designed under the influence of Christopher Alexander, Edward Tufte, and Ernst Haeckel's *Kunstformen der Natur*.

*Homo agit.*
