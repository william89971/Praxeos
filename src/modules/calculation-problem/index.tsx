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
    >
      <Essay components={essayMDXComponents} />
    </ModuleLayout>
  );
}
