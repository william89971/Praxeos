import { LabFoundation } from "@/labs/components/LabFoundation";
import { findLab } from "@/labs/registry";

export default function ChoiceMachine() {
  return <LabFoundation lab={findLab("choice-machine")!} />;
}
