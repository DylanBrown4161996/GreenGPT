export type BriefingItemStatus = "action_needed" | "on_track" | "scheduled" | "overdue" | "completed";

export type BriefingUpcoming = {
  name: string;
  due: string;
  category: string;
  authority: string;
  citation: string;
  status: BriefingItemStatus;
  notes: string;
};

export type BriefingCompleted = {
  name: string;
  completed: string;
  notes: string;
};

export type BriefingOverdue = {
  name: string;
  due: string;
  daysLate: number;
  notes: string;
};

export type BriefingRegChange = {
  title: string;
  date: string;
  applies: boolean;
  impact: string;
  action: string;
};

export type BriefingCategory = {
  total: number;
  compliant: number;
  label: string;
};

export type MonthlyBriefingData = {
  company: string;
  contact: string;
  month: string;
  state: string;
  industry: string;
  employees: number;
  score: number;
  prevScore: number;
  upcoming: BriefingUpcoming[];
  completed_last_month: BriefingCompleted[];
  overdue: BriefingOverdue[];
  reg_changes: BriefingRegChange[];
  categories: Record<string, BriefingCategory>;
};

export const SAMPLE_BRIEFING: MonthlyBriefingData = {
  company: "Northeast Chemical Solutions",
  contact: "Sarah Chen",
  month: "July 2026",
  state: "New Jersey",
  industry: "Chemical Manufacturing",
  employees: 142,
  score: 87,
  prevScore: 82,
  upcoming: [
    {
      name: "TRI Form R Submission (EPCRA §313)",
      due: "July 1",
      category: "filing",
      authority: "EPA",
      citation: "40 CFR 372",
      status: "action_needed",
      notes:
        "Pre-filled draft attached based on your chemical inventory. Review quantities for toluene and MEK — verify against 2025 purchase records.",
    },
    {
      name: "Eyewash / Shower Annual Inspection",
      due: "July 15",
      category: "maintenance",
      authority: "ANSI Z358.1",
      citation: "ANSI Z358.1 §5",
      status: "scheduled",
      notes: "Vendor (SafetyFirst Inc.) confirmed for July 12. We'll log completion after their report.",
    },
    {
      name: "Stormwater DMR Submission",
      due: "July 28",
      category: "filing",
      authority: "NJ DEP",
      citation: "N.J.A.C. 7:14A",
      status: "action_needed",
      notes:
        "Q2 sampling results received from lab. Draft DMR attached — review outfall data before we submit.",
    },
    {
      name: "Emergency Generator Monthly Test",
      due: "July 15",
      category: "maintenance",
      authority: "NFPA 110",
      citation: "NFPA 110 §8.4",
      status: "on_track",
      notes: "Recurring — maintenance team has the checklist.",
    },
    {
      name: "Fire Extinguisher Monthly Check",
      due: "July 1",
      category: "inspection",
      authority: "OSHA",
      citation: "29 CFR 1910.157(e)",
      status: "on_track",
      notes: "Recurring — visual inspection of all 23 units.",
    },
  ],
  completed_last_month: [
    {
      name: "Hearing Conservation Audiometric Testing",
      completed: "June 3",
      notes: "All 34 noise-exposed workers tested. 2 STS flags — follow-up letters sent.",
    },
    {
      name: "RMP Plan Annual Review",
      completed: "June 15",
      notes: "No changes to covered process. Plan current through 2028.",
    },
    {
      name: "SPCC Plan Walkthrough",
      completed: "June 20",
      notes: "Annual facility walkthrough completed with PE certification.",
    },
  ],
  overdue: [
    {
      name: "Confined Space Rescue Drill",
      due: "June 15",
      daysLate: 16,
      notes:
        "Rescue team availability issue. Rescheduled for July 8. No regulatory exposure — drill is best practice, not a hard CFR deadline.",
    },
  ],
  reg_changes: [
    {
      title: "OSHA Heat Injury Prevention Standard — Final Rule",
      date: "June 12, 2026",
      applies: true,
      impact:
        "Requires written heat illness prevention plan, acclimatization procedures, and access to water/shade for outdoor and indoor workers where heat index exceeds action level. Training required within 90 days of effective date.",
      action:
        "We'll draft your written program and training materials. Added to your calendar: training deadline Oct 15.",
    },
    {
      title: "NJ DEP PFAS Reporting Rule — Proposed",
      date: "June 28, 2026",
      applies: false,
      impact:
        "Proposed rule would require facilities using or storing PFAS-containing materials to report quantities annually. Comment period open through August 30.",
      action: "Monitoring only. We'll flag if the final rule triggers reporting for your facility.",
    },
  ],
  categories: {
    filing: { total: 8, compliant: 7, label: "Regulatory filings" },
    training: { total: 12, compliant: 10, label: "Training & certifications" },
    inspection: { total: 18, compliant: 17, label: "Inspections & monitoring" },
    maintenance: { total: 14, compliant: 13, label: "Equipment maintenance" },
    permit: { total: 4, compliant: 4, label: "Permits & licenses" },
    reporting: { total: 6, compliant: 5, label: "Reporting & recordkeeping" },
  },
};
