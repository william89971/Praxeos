# Praxeos

> *Homo agit.*

A library of interactive, generative, philosophically rigorous explorable explanations of Austrian economics and praxeology. An open-source cultural artifact.

The ideas worth teaching — the action axiom, time preference, subjective value, the Cantillon effect, Mises's calculation argument, Hayek's knowledge problem, roundaboutness, spontaneous order, the regression theorem — are among the most beautiful in the social sciences. They are almost always taught badly: dry prose, ideological posturing, ugly PDFs, no visual imagination. Praxeos is a protest against that.

The site is its own argument. The fact that it exists, looks exceptional, and teaches these ideas clearly is a small demonstration of spontaneous order and purposeful action. The medium is the message.

---

## Fascicle I — Action, Signals, and Calculation

Four modules ship together as the first volume.

**The Monetary Garden** — A living model of credit expansion, savings backing, malinvestment, and correction. Growth is separated from real funding so the boom and its correction can be seen instead of asserted. *(Mises, Hayek, Rothbard, Lachmann)*

**The Signal Orchard** — Human choices made visible as pulses through an orchard of actors. Buy, sell, wait, and discover actions show how private decisions become coordinated order. *(Menger, Hayek, Kirzner)*

**The Calculation Labyrinth** — Mises's calculation argument as a maze exercise. With prices, legal exits carry comparable cost markers; without prices, wrong turns and backtracking accumulate visible waste. *(Mises, Hayek, Salerno)*

**The Coordination Engine** — A signal network focused on synchrony. Reliability, latency, shocks, and node pulses change coherence, throughput, failed links, and missed plans. *(Hayek, Lachmann, Mises)*

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
