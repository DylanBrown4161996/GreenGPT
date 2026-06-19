import { describe, expect, it } from "vitest";
import { RULES } from "../rulesEngine";

const MULTI_YEAR_FREQUENCIES = new Set(["5-year", "3-year", "biennial", "triennial"]);

describe("RULES regulatory accuracy", () => {
  it("does not use Annual in names when frequency is multi-year", () => {
    for (const rule of RULES) {
      if (rule.frequency && MULTI_YEAR_FREQUENCIES.has(rule.frequency)) {
        expect(rule.name.toLowerCase()).not.toMatch(/\bannual\b/);
      }
    }
  });

  it("assigns sourceUrl to all parseable federal CFR citations", () => {
    const cfrRules = RULES.filter(
      (r) => r.citation && /^\d+\s+CFR\s+/.test(r.citation) && !r.citation.includes("/")
    );
    expect(cfrRules.length).toBeGreaterThan(0);
    for (const rule of cfrRules) {
      expect(rule.sourceUrl, rule.citation).toMatch(/^https:\/\/www\.ecfr\.gov\//);
    }
  });

  it("has corrected SPCC obligation metadata", () => {
    const spcc = RULES.find((r) => r.id === "spcc");
    expect(spcc?.name).toBe("SPCC Plan 5-Year Review Check");
    expect(spcc?.frequency).toBe("5-year");
    expect(spcc?.sourceUrl).toBe(
      "https://www.ecfr.gov/current/title-40/part-112/section-112.5"
    );
  });

  it("has corrected RMP and PSM obligation metadata", () => {
    const rmp = RULES.find((r) => r.id === "rmp");
    expect(rmp?.name).toBe("RMP 5-Year Review Check");
    expect(rmp?.frequency).toBe("5-year");

    const psm = RULES.find((r) => r.id === "psm");
    expect(psm?.name).toBe("PSM 3-Year Compliance Audit Check");
    expect(psm?.frequency).toBe("3-year");
  });
});
