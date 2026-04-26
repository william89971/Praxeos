import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { essayMDXComponents } from "@/components/mdx/MDXComponents";
import { BuiltNote } from "./components/BuiltNote";
import { Legend } from "./components/Legend";
import Essay from "./essay.mdx";
import { metadata } from "./metadata";
import Sketch from "./sketch";
import { sources } from "./sources";

export { metadata, sources };

export default function CoordinationEngineModule() {
  return (
    <ModuleLayout
      metadata={metadata}
      sources={sources}
      sketch={<Sketch />}
      sketchCaption="Forty-two agents linked by signal edges. The slider drives every visual property; coherence is what coordination looks like."
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
