import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { essayMDXComponents } from "@/components/mdx/MDXComponents";
import { BuiltNote } from "./components/BuiltNote";
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
      sketchCaption="A 3D manuscript hall of every Bitcoin block, divided by halving epoch. Each gate cuts new issuance in half."
      postlude={<BuiltNote />}
    >
      <Essay components={essayMDXComponents} />
    </ModuleLayout>
  );
}
