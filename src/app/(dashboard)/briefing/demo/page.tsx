import type { Metadata } from "next";
import MonthlyComplianceBriefing from "@/app/components/managed-compliance/MonthlyComplianceBriefing";
import { SAMPLE_BRIEFING } from "@/lib/managed-compliance/sampleBriefing";

export const metadata: Metadata = {
  title: "Sample Monthly Briefing | The Green Executive Briefing",
  description: "Preview the monthly compliance briefing delivered to managed compliance clients.",
};

export default function BriefingDemoPage() {
  return <MonthlyComplianceBriefing data={SAMPLE_BRIEFING} />;
}
