import { LabFoundation } from "@/labs/components/LabFoundation";
import { findLab } from "@/labs/registry";

export default function EntrepreneursDiscovery() {
  return <LabFoundation lab={findLab("entrepreneurs-discovery")!} />;
}
