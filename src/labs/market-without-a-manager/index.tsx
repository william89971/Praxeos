import { LabFoundation } from "@/labs/components/LabFoundation";
import { findLab } from "@/labs/registry";

export default function MarketWithoutAManager() {
  return <LabFoundation lab={findLab("market-without-a-manager")!} />;
}
