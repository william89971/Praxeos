import { LabFoundation } from "@/labs/components/LabFoundation";
import { getLab } from "@/labs/registry";

export default function ChoiceMachine() {
  return <LabFoundation lab={getLab("choice-machine")} />;
}
