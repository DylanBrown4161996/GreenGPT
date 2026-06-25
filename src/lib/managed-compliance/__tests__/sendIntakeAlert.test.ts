import { describe, expect, it } from "vitest";
import { formatIntakeAlertText } from "../sendIntakeAlert";
import type { IntakeFormData } from "../intake";

const sample: IntakeFormData = {
  company: "Acme Chemical",
  contact: "Jane Doe",
  email: "jane@acme.com",
  phone: "555-0100",
  title: "EHS Manager",
  address: "100 Plant Rd",
  city: "Newark",
  state: "New Jersey",
  zip: "07102",
  industry: "chemical_mfg",
  naics: "325199",
  employees: "142",
  shifts: "2",
  permits: ["title_v", "tier2"],
  hazards: ["confined"],
  chemicals: "toluene",
  waste_streams: "",
  equipment: "",
  current_system: "Excel",
  pain_points: "Missed Tier II",
  audit_history: "",
  goals: "Audit-ready",
};

describe("formatIntakeAlertText", () => {
  it("includes key facility fields and admin link", () => {
    const text = formatIntakeAlertText(sample, "https://example.com/admin/intakes");
    expect(text).toContain("Acme Chemical");
    expect(text).toContain("jane@acme.com");
    expect(text).toContain("Chemical Manufacturing");
    expect(text).toContain("title_v");
    expect(text).toContain("Missed Tier II");
    expect(text).toContain("https://example.com/admin/intakes");
  });
});
