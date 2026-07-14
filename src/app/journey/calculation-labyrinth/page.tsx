import type { Metadata } from "next";
import { FlagshipJourney } from "@/components/journey/FlagshipJourney";

export const metadata: Metadata = {
  title: "Calculation Labyrinth",
  description: "A 7–10 minute journey through choice, scarcity, prices, and revision.",
};

export default function CalculationLabyrinthPage() {
  return <FlagshipJourney />;
}
