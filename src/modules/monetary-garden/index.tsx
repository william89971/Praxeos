import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { essayMDXComponents } from "@/components/mdx/MDXComponents";
import { BuiltNote } from "./components/BuiltNote";
import { Legend } from "./components/Legend";
import Essay from "./essay.mdx";
import { metadata } from "./metadata";
import Sketch from "./sketch";
import { sources } from "./sources";

export { metadata, sources };

export default function MonetaryGardenModule() {
  return (
    <ModuleLayout
      metadata={metadata}
      sources={sources}
      sketch={<Sketch />}
      sketchCaption="Credit expansion, savings backing, and correction now drive the garden separately — water, grass, trees, production nodes, paths, and malinvestment patches no longer pretend the boom and its reckoning are the same event."
      postlude={
        <>
          <Legend />
          <BuiltNote />
        </>
      }
    >
      <Essay components={essayMDXComponents} />
    </ModuleLayout>
  );
}
