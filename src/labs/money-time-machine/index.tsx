import { LabFoundation } from "@/labs/components/LabFoundation";
import { findLab } from "@/labs/registry";

export default function MoneyTimeMachine() {
  return <LabFoundation lab={findLab("money-time-machine")!} />;
}
