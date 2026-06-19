import { describe, expect, it } from "vitest";
import { citationToEcfrUrl } from "../ecfrUrl";

describe("citationToEcfrUrl", () => {
  it("builds title-29 section URLs for OSHA citations", () => {
    expect(citationToEcfrUrl("29 CFR 1904.32")).toBe(
      "https://www.ecfr.gov/current/title-29/section-1904.32"
    );
    expect(citationToEcfrUrl("29 CFR 1910.119(o)")).toBe(
      "https://www.ecfr.gov/current/title-29/section-1910.119"
    );
    expect(citationToEcfrUrl("29 CFR 1910.178(l)")).toBe(
      "https://www.ecfr.gov/current/title-29/section-1910.178"
    );
  });

  it("builds title-40 part/section URLs for EPA citations", () => {
    expect(citationToEcfrUrl("40 CFR 112.5")).toBe(
      "https://www.ecfr.gov/current/title-40/part-112/section-112.5"
    );
    expect(citationToEcfrUrl("40 CFR 262.41")).toBe(
      "https://www.ecfr.gov/current/title-40/part-262/section-262.41"
    );
  });

  it("builds part-level URLs when no section decimal is present", () => {
    expect(citationToEcfrUrl("40 CFR 370")).toBe(
      "https://www.ecfr.gov/current/title-40/part-370"
    );
    expect(citationToEcfrUrl("40 CFR 68")).toBe(
      "https://www.ecfr.gov/current/title-40/part-68"
    );
  });

  it("builds title-10 section URLs for NRC citations", () => {
    expect(citationToEcfrUrl("10 CFR 19.12")).toBe(
      "https://www.ecfr.gov/current/title-10/section-19.12"
    );
  });

  it("returns undefined for non-CFR and compound citations", () => {
    expect(citationToEcfrUrl("NFPA 10 §7.3")).toBeUndefined();
    expect(citationToEcfrUrl("CA HSC §25249.6")).toBeUndefined();
    expect(citationToEcfrUrl("40 CFR 60/63")).toBeUndefined();
    expect(citationToEcfrUrl(undefined)).toBeUndefined();
  });
});
