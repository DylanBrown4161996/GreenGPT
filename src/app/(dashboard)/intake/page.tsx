import type { Metadata } from "next";
import ManagedComplianceIntakeForm from "@/app/components/managed-compliance/ManagedComplianceIntakeForm";

export const metadata: Metadata = {
  title: "Managed Compliance Intake | The Green Executive Briefing",
  description:
    "One-time facility intake for managed EHS compliance — we map your obligations and deliver your compliance program.",
};

export default function IntakePage() {
  return <ManagedComplianceIntakeForm />;
}
