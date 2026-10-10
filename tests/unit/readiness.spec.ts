import { expect, test } from "@playwright/test";
import { ACTIVATION_REQUIREMENTS, DIY_REQUIREMENTS, canTransition, evaluateReadiness, isSellableStatus, type ReadinessRecord } from "../../src/lib/readiness";

const allChecks = Object.fromEntries([...Object.keys(ACTIVATION_REQUIREMENTS), ...Object.keys(DIY_REQUIREMENTS)].map((k) => [k, true]));
const complete: ReadinessRecord = {
  status: "READY_FOR_OWNER_REVIEW",
  isDiy: true,
  checks: allChecks,
  publicCopy: "Test Kit. A set of colorful labels.",
  priceCents: 1800,
  photoIsGenerated: false,
};

test.describe("readiness gate", () => {
  test("a fresh concept cannot be activated", () => {
    const r: ReadinessRecord = { status: "CONCEPT_ONLY", isDiy: true, checks: {}, publicCopy: "x", priceCents: null, photoIsGenerated: true };
    const t = canTransition(r, "ACTIVE");
    expect(t.ok).toBe(false);
    expect(t.error).toContain("Cannot activate");
    expect(evaluateReadiness(r).missing.length).toBeGreaterThan(15);
  });

  test("every single missing requirement blocks activation", () => {
    for (const key of Object.keys(allChecks)) {
      const r = { ...complete, checks: { ...allChecks, [key]: false } };
      expect(canTransition(r, "ACTIVE").ok, key).toBe(false);
    }
  });

  test("generated art as the product photo blocks activation", () => {
    expect(canTransition({ ...complete, photoIsGenerated: true }, "ACTIVE").ok).toBe(false);
  });

  test("missing price blocks activation", () => {
    expect(canTransition({ ...complete, priceCents: null }, "ACTIVE").ok).toBe(false);
  });

  test("unsupported claims in copy block activation", () => {
    const t = canTransition({ ...complete, publicCopy: "An eco-friendly label kit" }, "ACTIVE");
    expect(t.ok).toBe(false);
    expect(t.error).toContain("eco-friendly");
  });

  test("activation must pass through owner review", () => {
    expect(canTransition({ ...complete, status: "NEEDS_PHOTOGRAPHY" }, "ACTIVE").ok).toBe(false);
    expect(canTransition(complete, "ACTIVE").ok).toBe(true);
  });

  test("only ACTIVE is sellable", () => {
    expect(isSellableStatus("ACTIVE")).toBe(true);
    for (const s of ["IDEA_ONLY", "CONCEPT_ONLY", "READY_FOR_OWNER_REVIEW", "ARCHIVED"] as const) expect(isSellableStatus(s)).toBe(false);
  });
});
