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
      sketchCaption="A single distortion control drives every element of the garden — water, grass, trees, production nodes, paths, and the dead zones that spread when signals fail."
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
