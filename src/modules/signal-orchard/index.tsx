import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { essayMDXComponents } from "@/components/mdx/MDXComponents";
import { BuiltNote } from "./components/BuiltNote";
import { Legend } from "./components/Legend";
import Essay from "./essay.mdx";
import { metadata } from "./metadata";
import Sketch from "./sketch";
import { sources } from "./sources";

export { metadata, sources };

export default function SignalOrchardModule() {
  return (
    <ModuleLayout
      metadata={metadata}
      sources={sources}
      sketch={<Sketch />}
      sketchCaption="Click any cypress to make that actor act. Watch how the network reorganizes — coordination is the residue."
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
