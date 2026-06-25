import { describe, expect, it } from "vitest";
import { parseIntakeBody } from "../intake";

describe("parseIntakeBody", () => {
  const valid = {
    company: "Acme Corp",
    contact: "Jane Doe",
    email: "jane@example.com",
    state: "New Jersey",
    industry: "chemical_mfg",
  };

  it("accepts minimal valid payload", () => {
    const result = parseIntakeBody(valid);
    expect(result.data?.company).toBe("Acme Corp");
    expect(result.error).toBeUndefined();
  });

  it("rejects missing company", () => {
    const result = parseIntakeBody({ ...valid, company: "" });
    expect(result.error).toMatch(/company/i);
  });

  it("rejects invalid email", () => {
    const result = parseIntakeBody({ ...valid, email: "bad" });
    expect(result.error).toMatch(/email/i);
  });
});
