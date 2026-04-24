# MODULE_IDEAS — The Backlog

Each entry is a seed. The first three modules (`halving-garden`, `time-preference-forest`, `calculation-problem`) ship in Fascicle I; the remainder are candidates for Fascicle II and beyond. Order below is approximately my own priority; re-order as fit develops.

Entries include: concept summary, thinkers, suggested mechanic, rough reading time, and what would need to exist to build it.

---

## Fascicle II candidates

### 1. The Cantillon Effect

**Concept.** Newly-created money does not reach the economy uniformly — it enters at specific points (central banks → primary dealers → banks → first borrowers → late holders), and prices rise *as the money ripples outward*. Early recipients buy at old prices; late recipients pay the new ones. Redistribution masquerades as inflation.

**Thinkers.** Richard Cantillon (1755), Mises (*Theory of Money and Credit*, 1912), Rothbard (*What Has Government Done*, 1963).

**Mechanic.** A ripple visualization. Money issued at the center expands outward in concentric rings; prices for goods held by agents rise with radius. User can shift the issuance point, change the ripple speed (velocity), and watch Gini-style inequality emerge. The argument is visual: inflation is not neutral.

**~10 min read.** Needs: particle physics simulation, wealth-percentile tracking.

### 2. Subjective Value

**Concept.** The same good is worth different amounts to different people. Menger's 1871 shift away from labor theory to subjective valuation was one of the three simultaneous marginalist revolutions. Value does not inhere in goods; it is conferred by valuing minds.

**Thinkers.** Menger, Jevons, Walras, Mises, Rothbard.

**Mechanic.** Two-agent simulation. The same good appears with two different visual representations — rendered in the color grade of each agent's preferences. Hover on agent A: the good looks a certain way. Hover on agent B: it looks another. Swap either agent's utility function with sliders and watch the goods shimmer. A market price emerges as a *compromise* of valuations, not a revelation of intrinsic worth.

**~8 min.** Needs: two-agent preference engine, double-rendering system.

### 3. Menger's Origin of Money

**Concept.** Money did not emerge by decree. It emerged as the most *saleable* commodity in barter networks — and sell-ability begets sell-ability, producing a winner-take-most dynamic. Menger's 1892 essay is the canonical account; Mises's regression theorem (1912) extended it to explain why fiat money retains purchasing power.

**Thinkers.** Menger, Mises, Rothbard.

**Mechanic.** Evolutionary simulation. 200 agents begin with heterogeneous goods; they can trade bilaterally. Agents develop preferences based on trade history — they accept goods they believe they can trade onward. After ~2,000 rounds, one commodity emerges as universal medium. Run it again with a different seed: different commodity wins, but the same topology. The reader sees convergence without any top-down rule.

**~12 min.** Needs: agent-based market simulator with history-conditioned acceptance.

### 4. The Knowledge Problem

**Concept.** The economic problem is not "allocate known resources to known ends." It is the coordination of **dispersed, tacit, locally-owned knowledge** across millions of minds. Prices are the signal mechanism that lets this work without any central observer.

**Thinkers.** Hayek (*Use of Knowledge in Society*, 1945), Polanyi on tacit knowledge, Sowell (*Knowledge and Decisions*, 1980).

**Mechanic.** Two-panel agent-based model. Left: agents have local knowledge (price + immediate neighbors); right: central planner has aggregate statistics. A supply shock hits. The price system adjusts within seconds as local agents respond. The planner, relying on stale aggregates, reacts 48 ticks later and wrong. Shares engine with `calculation-problem`.

**~10 min.** Needs: reuse engine from Calculation Problem with different observation model.

### 5. Spontaneous Order

**Concept.** Complex order can arise without anyone designing it. Hayek distinguishes *cosmos* (grown order, like a language or a market) from *taxis* (made order, like a factory). The city, the common law, currency, prices, queues at an amusement park — all cosmos.

**Thinkers.** Hayek (*Law, Legislation and Liberty*), Ferguson (*Essay on the History of Civil Society*, 1767), Adam Smith, Jane Jacobs.

**Mechanic.** A city simulation. Begin with a blank gridded plane. Agents with individual needs (live near water, near food, near friends) move and settle. Streets emerge where feet wear them. Commerce clusters where crossings occur. No planner. After 3000 ticks the reader sees a visible city — with districts, flows, centers.

**~15 min.** Needs: grid-based agent system, emergent pathing.

### 6. Roundaboutness

**Concept.** Böhm-Bawerk's *Produktionsumweg* — "production detour." A capital-rich economy does not produce consumer goods directly; it produces tools that produce tools that produce consumer goods. Longer production structures are more productive but also more fragile — they depend on saving, low time preference, and stable expectations.

**Thinkers.** Böhm-Bawerk, Hayek, Mises.

**Mechanic.** Visible cascade of production stages. Starting goods on the left; consumer goods on the right. The reader drags a "roundaboutness" slider. Short: one or two stages; modest output. Long: five or six stages; explosive output — but visually fragile. A random break in stage 3 (supply shock) cascades downstream. The reader sees what "interest rate" means in physical-capital terms.

**~9 min.** Needs: staged production simulation, breakage cascade logic.

### 7. Regime Uncertainty

**Concept.** Erratic policy destroys coordination even when individual policies are mild. Robert Higgs coined the term for the New-Deal-era slowdown: entrepreneurs refused to commit capital because the rules kept changing. The market requires stable expectations — not specific rules, but *knowable* ones.

**Thinkers.** Robert Higgs (*Depression, War, and Cold War*, 2006), Hayek on the rule of law.

**Mechanic.** Market simulation where every N ticks a policy changes (tax rate, import quota, price control). Agents who have committed to long production must sink costs at the old regime; costs become waste when the regime flips. Reader can tune regime volatility and watch coordination collapse.

**~10 min.** Needs: stateful-policy extension of Calculation Problem engine.

### 8. Entrepreneurship as Alertness

**Concept.** Kirzner's reframing. The entrepreneur does not invent; she *notices* a price discrepancy. The profit opportunity was there; she saw it. This is cognitively radical — entrepreneurship is perception, not creation.

**Thinkers.** Kirzner (*Competition and Entrepreneurship*, 1973).

**Mechanic.** A visual perception game. The canvas shows 200 trading agents with price postings. Most discrepancies are invisible or subtle. The reader's job: click a discrepancy. The interface rewards perception with a tiny "profit" counter. Over ten minutes, the reader learns to see price gaps that did not register at first.

**~7 min plus optional extended play.** Needs: price-discrepancy generator, perception-score tracker.

### 9. Say's Law

**Concept.** Supply creates its own demand — properly stated: *production is the source of demand, because goods trade against goods*. Money mediates, but does not create purchasing power. Keynesian underconsumptionism is the denial of Say's Law.

**Thinkers.** J.-B. Say (1803), James Mill, Rothbard, W. H. Hutt (*A Rehabilitation of Say's Law*, 1974).

**Mechanic.** Circular-flow diagram with two modes. "Say mode": production generates wages generate demand generate more production. "Underconsumption mode": the cycle breaks; stagnation is a mysterious shortfall in demand. Reader toggles between views to see how the Keynesian diagnosis imports a money-supply confusion into a goods-supply phenomenon.

**~8 min.** Needs: animated circular-flow diagram with mode toggle.

### 10. The Action Axiom

**Concept.** *Man acts.* Mises's starting point for all of economics. The proposition that humans engage in purposive behavior — employing means to reach ends — is, Mises argues, *a priori* true and cannot be coherently denied (denying it is itself purposive). From this axiom, all of catallactics unfolds.

**Thinkers.** Mises (*Human Action*, 1949), Hoppe (argumentation ethics), Rothbard (*Praxeology: The Method*).

**Mechanic.** An interactive proof walkthrough. The reader is shown a sequence of propositions — action implies ends, ends imply means, means imply scarcity, scarcity implies choice, choice implies time preference. At each step the reader tries to *deny* the proposition and watches their denial require the same structure. Terminates with: "You cannot argue that man does not act without acting."

**~12 min.** Needs: structured dialogue-tree UI, state persistence.

### 11. Bitcoin as Sound Money (extended)

**Concept.** A deeper meditation than `halving-garden`. Why Bitcoin matters as money, not as investment. Saifedean Ammous's stock-to-flow argument, Menger's regression theorem applied to a digital-native good, Hayek's *Denationalisation of Money* (1976) revisited.

**Thinkers.** Mises, Menger, Hayek, Ammous.

**Mechanic.** Interactive stock-to-flow explorer. Reader compares bitcoin to gold, silver, copper, fiat currencies on a stock-to-flow axis with supply-curve visualization. A "monetary evolution timeline" shows how each prior money died or was debased.

**~14 min.** Needs: historical monetary data pipeline, comparative charts.

### 12. The Austrian Theory of the Trade Cycle (extended)

**Concept.** A full treatment of ABCT beyond what fits in `time-preference-forest`. The Wicksellian natural vs. market rate, the Mises-Hayek account of misallocation under credit expansion, Rothbard's application to 1929 and Garrison's capital-based macroeconomic diagrams.

**Thinkers.** Mises, Hayek, Rothbard, Roger Garrison (*Time and Money*, 2001).

**Mechanic.** Garrison's diagrams rendered interactive — the PPF, the loanable funds market, and the Hayekian triangle on a single canvas, all moving together as the reader drags the "central-bank rate" slider. Shows the boom, the malinvestment, the inevitable correction.

**~18 min.** Needs: Garrison-diagram engine (coupled axes), macro slider.

### 13. Hayekian Triangles

**Concept.** A literal visualization of capital structure. Hayek's triangle plots production stages on one axis and value added on the other; its shape *is* the economy's capital structure. Modifying it — extending it via saving, compressing it via interest-rate suppression — is how ABCT is told visually.

**Thinkers.** Hayek, Garrison, Huerta de Soto.

**Mechanic.** An animated, morphing triangle. The reader manipulates saving rate, time preference, and (optionally) central-bank interest rate. The triangle responds. Three canonical states: natural, sustainable growth, inflationary boom-bust. Optionally extend to 3D (z-axis = time, visible capital structure forming and breaking).

**~13 min.** Needs: triangle-morphing WebGL engine; optional three.js upgrade.

### 14. The Regression Theorem

**Concept.** Mises's 1912 proof that any money must have been, at some prior point, a non-money commodity valued for its non-monetary uses. It solves the chicken-and-egg puzzle of money's value: today's monetary demand is grounded in yesterday's exchange value, which traces back, via regression, to commodity utility.

**Thinkers.** Mises (*Theory of Money and Credit*, 1912), Rothbard.

**Mechanic.** A timeline visualization of money's emergence from commodity demand. Reader scrubs backward through history from fiat → gold certificate → gold → bartered gold → gold for its industrial/ornamental uses. The argument becomes visible: there is no such thing as money without a commodity ancestry.

**~10 min.** Needs: timeline UI, asset-lineage data.

---

## Fascicle selection heuristic

Ship a fascicle when ~3 modules cohere thematically. Fascicle II candidates grouped:

- *Calculation & Knowledge cluster*: `knowledge-problem`, `regime-uncertainty`, `entrepreneurship-as-alertness`. A natural sequel to `calculation-problem`.
- *Capital & Cycle cluster*: `roundaboutness`, `hayekian-triangles`, `abct-extended`. Sequel to `time-preference-forest`.
- *Money cluster*: `cantillon-effect`, `menger-origin-of-money`, `regression-theorem`. Sequel to `halving-garden`.
- *Foundations cluster*: `action-axiom`, `subjective-value`, `says-law`. Prequel to the whole.

Any of the four could be Fascicle II. Leave this decision until Fascicle I has shipped and feedback has come in.
