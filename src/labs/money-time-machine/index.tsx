import { LabFoundation } from "@/labs/components/LabFoundation";
import { getLab } from "@/labs/registry";

export default function MoneyTimeMachine() {
  return <LabFoundation lab={getLab("money-time-machine")} />;
}
