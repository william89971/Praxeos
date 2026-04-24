import { BeforeAfterPanel } from "@/components/interactive/BeforeAfterPanel";
import { ConceptSlider } from "@/components/interactive/ConceptSlider";
import { ExplorePrompt } from "@/components/interactive/ExplorePrompt";
import { KeyIdeaCard } from "@/components/interactive/KeyIdeaCard";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { essayMDXComponents } from "@/components/mdx/MDXComponents";
import Essay from "./essay.mdx";
import { metadata } from "./metadata";
import Sketch from "./sketch";
import { sources } from "./sources";

export { metadata, sources };

export default function CalculationProblemModule() {
  return (
    <ModuleLayout
      metadata={metadata}
      sources={sources}
      sketch={<Sketch />}
      sketchCaption="Two economies — identical agents, identical technology, one with prices and one without. Drag the complexity slider to watch the Misesian argument unfold."
      postlude={<Postlude />}
    >
      <Essay components={essayMDXComponents} />
    </ModuleLayout>
  );
}

function Postlude() {
  return (
    <>
      <h3 style={{ marginBlockStart: "2rem" }}>Explore the argument</h3>

      <ConceptSlider
        title="Number of goods in the economy"
        accent="action"
        steps={[
          {
            value: 2,
            label: "2 goods",
            description:
              "With only two goods, a planner can more or less guess. The problem is visible but not yet fatal — there are only two prices to get wrong.",
          },
          {
            value: 5,
            label: "5 goods",
            description:
              "Five goods means twenty-five possible cross-ratios. The planner still thinks in terms of direct exchange, but the combinatorics have already outpaced intuition.",
          },
          {
            value: 10,
            label: "10 goods",
            description:
              "A hundred cross-ratios. The market panel is still converging; the planned panel is already accumulating shortages and surpluses that no single mind can track.",
          },
          {
            value: 20,
            label: "20 goods",
            description:
              "Four hundred cross-ratios. The market coordinates locally; the planner allocates globally, and every arbitrary recipe choice makes the next one more costly. This is the Misesian point.",
          },
          {
            value: 50,
            label: "50 goods",
            description:
              "In a real economy with thousands of goods, the planner is not merely overwhelmed — the concept of a 'plan' loses its meaning. There is no common unit without market prices.",
          },
        ]}
        defaultIndex={2}
      />

      <BeforeAfterPanel
        beforeLabel="Market prices"
        afterLabel="Planned allocation"
        defaultSplit={50}
        before={
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "var(--step-1)",
              lineHeight: 1.5,
              color: "var(--ink-primary)",
            }}
          >
            <p style={{ margin: 0, fontWeight: 500 }}>Prices emerge.</p>
            <p
              style={{ margin: 0, marginTop: "0.5rem", color: "var(--ink-secondary)" }}
            >
              Producers post asks; consumers choose by preference weighted against
              price. Adaptive signals converge, noisily, on relative scarcities.
            </p>
          </div>
        }
        after={
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "var(--step-1)",
              lineHeight: 1.5,
              color: "var(--ink-primary)",
            }}
          >
            <p style={{ margin: 0, fontWeight: 500 }}>No prices exist.</p>
            <p
              style={{ margin: 0, marginTop: "0.5rem", color: "var(--ink-secondary)" }}
            >
              The planner picks recipes by deterministic but economically meaningless
              rules. Shortages pile up; surpluses decay; coordination fails.
            </p>
          </div>
        }
      />

      <KeyIdeaCard accent="action">
        The failure of socialist planning is not a failure of data or computing power.
        It is a failure of <em>economic meaning</em> — without market prices for
        producer goods, there is no common unit by which to compare alternative
        production plans. Mises proved this in 1920, before any planner had tried.
      </KeyIdeaCard>

      <ExplorePrompt label="A question to sit with">
        If a planner cannot compute the relative economy of alternative production plans
        without market prices, what does it mean to say that such a planner has a "plan"
        at all?
      </ExplorePrompt>
    </>
  );
}
