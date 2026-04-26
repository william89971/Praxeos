import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { essayMDXComponents } from "@/components/mdx/MDXComponents";
import { BuiltNote } from "./components/BuiltNote";
import { Legend } from "./components/Legend";
import Essay from "./essay.mdx";
import { metadata } from "./metadata";
import Sketch from "./sketch";
import { sources } from "./sources";

export { metadata, sources };

export default function CalculationLabyrinthModule() {
  return (
    <ModuleLayout
      metadata={metadata}
      sources={sources}
      sketch={<Sketch />}
      sketchCaption="Toggle 'With market prices' and the pawn glides; toggle them off and the map disappears."
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
