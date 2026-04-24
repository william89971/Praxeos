import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { essayMDXComponents } from "@/components/mdx/MDXComponents";
import Essay from "./essay.mdx";
import { metadata } from "./metadata";
import Sketch from "./sketch";
import { sources } from "./sources";

export { metadata, sources };

export default function HalvingGardenModule() {
  return (
    <ModuleLayout
      metadata={metadata}
      sources={sources}
      sketch={<Sketch />}
      sketchCaption="The baked manuscript forms the base layer; newly arrived blocks ghost in live, then settle into the local tile field."
    >
      <Essay components={essayMDXComponents} />
    </ModuleLayout>
  );
}
