# Legacy Lab source migration plan

This ledger prevents the Lab replacement from deleting useful evidence with the old runtimes. A source moves into an active Lab packet only when its claim, locator, stable URL, interpretation label, and counterargument are explicit.

| Legacy source cluster | Destination | Use | Migration state |
| --- | --- | --- | --- |
| Mises, *Human Action*, Part One | Choice Machine | purposeful action, ends, and means | Migrate and verify locator |
| Menger, *Principles of Economics*, Chapter III | Choice Machine | subjective value and ordinal choice | Already packetized; retain |
| Mises, *Human Action*, XVI–XVII | Market Without a Manager | indirect exchange and price formation | Migrate and verify locator |
| Hayek, “The Use of Knowledge in Society” | Market Without a Manager | dispersed knowledge and price communication | Already packetized; retain |
| Mises, *Economic Calculation in the Socialist Commonwealth* | Market Without a Manager | comparison through exchange-generated money prices | Already packetized; retain with narrower wording |
| Hayek, *Collectivist Economic Planning* | Market Without a Manager | calculation-debate context | Migrate as historical context |
| Kirzner, *Competition and Entrepreneurship* | Entrepreneur’s Discovery | alertness, discovery, and competitive process | Migrate; publisher URL is stable but not full text |
| Lachmann, *The Market as an Economic Process* | Entrepreneur’s Discovery | plans, expectations, and open-ended process | Migrate with explicit interpretation label |
| Mises, *The Theory of Money and Credit* | Money Time Machine | money and purchasing-power theory | Migrate and verify exact chapters/pages |
| Rothbard, *Man, Economy, and State*, Chapter 11 | Money Time Machine | money-supply interpretation | Migrate as Austrian interpretation, not neutral fact |
| Rothbard, *What Has Government Done to Our Money?* | Money Time Machine | policy argument | Migrate only as viewpoint, paired with a counterargument |
| Lachmann, *Capital and Its Structure* | Money Time Machine / Entrepreneur’s Discovery | heterogeneous capital and plans | Migrate with scope note |

## Counterargument requirements

- Market Without a Manager must distinguish the simulation’s institutional assumptions from claims about all real markets and include a source representing information, bargaining, market-power, or price-control complications.
- Entrepreneur’s Discovery must state that observed success can be noisy, path-dependent, and confounded; the seeded model does not prove an entrepreneur’s hypothesis.
- Money Time Machine must pair Austrian monetary interpretations with credible mainstream or institutional accounts of monetary transmission and distribution. Bitcoin cannot be presented as a predetermined answer.
- Choice Machine must state that one observed choice under one set of constraints does not reveal a stable total ordering across all contexts.

## Deletion gate

Legacy Lab-specific source files may be removed only after every retained item is either represented in `src/lib/source-packets.ts` with an allowlisted Lab mapping or explicitly marked `not migrated` here with a reason. Git history remains available, but the production bundle must not depend on the old module trees.
