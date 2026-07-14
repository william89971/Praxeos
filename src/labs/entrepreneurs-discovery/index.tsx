import { LabFoundation } from "@/labs/components/LabFoundation";
import { getLab } from "@/labs/registry";

export default function EntrepreneursDiscovery() {
  return <LabFoundation lab={getLab("entrepreneurs-discovery")} />;
}
