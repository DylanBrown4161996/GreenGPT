import { describe, expect, it } from "vitest";
import { isAdminEmail } from "../allowlist";

describe("isAdminEmail", () => {
  it("allows owner emails case-insensitively", () => {
    expect(isAdminEmail("DylanBrown416@gmail.com")).toBe(true);
    expect(isAdminEmail("Dylan.Brown@BodiiBrand.com")).toBe(true);
    expect(isAdminEmail("dylan.brown@greengptadvisory.com")).toBe(true);
  });

  it("rejects other emails", () => {
    expect(isAdminEmail("stranger@example.com")).toBe(false);
    expect(isAdminEmail(null)).toBe(false);
    expect(isAdminEmail("")).toBe(false);
  });
});
