import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { essayMDXComponents } from "@/components/mdx/MDXComponents";
import Essay from "./essay.mdx";
import { metadata } from "./metadata";
import Sketch from "./sketch";
import { sources } from "./sources";

export { metadata, sources };

export default function TimePreferenceForestModule() {
  return (
    <ModuleLayout
      metadata={metadata}
      sources={sources}
      sketch={<Sketch />}
      sketchCaption="Drag time preference and central-bank intervention. When the canopy inflates past what the roots can hold, press the correction button."
    >
      <Essay components={essayMDXComponents} />
    </ModuleLayout>
  );
}
