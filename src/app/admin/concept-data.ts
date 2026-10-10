import "server-only";
import { concepts, type ProductConcept } from "@/lib/concepts";
import { evaluateReadiness, type ReadinessRecord } from "@/lib/readiness";
import { readStore, type ConceptState } from "@/lib/store";

export const CONCEPT_FIELDS: { key: string; label: string; long?: boolean; hint?: string }[] = [
  { key: "supplierName", label: "Supplier name" },
  { key: "supplierContact", label: "Supplier contact" },
  { key: "materials", label: "Materials (as documented by supplier)", long: true },
  { key: "materialEvidence", label: "Material evidence (spec sheet, test report, link)", long: true },
  { key: "sampleStatus", label: "Sample status" },
  { key: "cogs", label: "Cost of goods (per unit)" },
  { key: "moq", label: "Minimum order quantity" },
  { key: "shippingWeightDims", label: "Shipping weight and dimensions" },
  { key: "proposedRetailPriceCents", label: "Proposed retail price (cents, internal only)", hint: "Never shown publicly until ACTIVE" },
  { key: "packagingNotes", label: "Packaging and labeling notes", long: true },
  { key: "fulfillmentPlan", label: "Fulfillment plan" },
  { key: "returnPolicyNotes", label: "Return policy notes" },
  { key: "safetyCareNotes", label: "Safety and care instructions", long: true },
  { key: "realPhotoUrl", label: "Approved real product photo URL", hint: "Concept art can never be used" },
  { key: "ownerDecision", label: "Owner decision", long: true },
  { key: "ownerNotes", label: "Owner notes", long: true },
];

export const SCORECARD: { key: string; label: string }[] = [
  { key: "customerInterviews", label: "Customer interviews completed" },
  { key: "supplierQuotes", label: "Supplier quotes received" },
  { key: "cogsKnown", label: "Cost of goods known" },
  { key: "shippingCostKnown", label: "Shipping cost known" },
  { key: "fulfillmentFeasible", label: "Fulfillment feasibility confirmed" },
  { key: "safetyReview", label: "Product safety review done" },
  { key: "claimReview", label: "Product claim review done" },
  { key: "sampleTested", label: "Sample ordered and tested" },
  { key: "moqKnown", label: "Minimum order quantity known" },
  { key: "marginCalculated", label: "Contribution margin calculated" },
  { key: "returnRiskAssessed", label: "Return risk assessed" },
  { key: "imageReady", label: "Product image ready" },
  { key: "listingReady", label: "Product listing ready" },
];

export function stateFor(concept: ProductConcept, saved: ConceptState | undefined): ConceptState {
  return saved ?? { status: concept.initialStatus, checks: {}, fields: {}, scorecard: {} };
}

export function readinessRecord(concept: ProductConcept, s: ConceptState): ReadinessRecord {
  const price = Number(s.fields.proposedRetailPriceCents);
  return {
    status: s.status,
    isDiy: concept.isDiy,
    checks: s.checks,
    publicCopy: `${concept.publicName}. ${concept.publicDescription}`,
    priceCents: Number.isInteger(price) && price > 0 ? price : null,
    photoIsGenerated: !s.fields.realPhotoUrl?.trim(),
  };
}

export async function loadConcepts() {
  const store = await readStore();
  return {
    audit: store.audit.filter((e) => e.target.startsWith("concept:")),
    items: concepts.map((c) => {
      const state = stateFor(c, store.concepts[c.id]);
      return { concept: c, state, readiness: evaluateReadiness(readinessRecord(c, state)) };
    }),
  };
}
