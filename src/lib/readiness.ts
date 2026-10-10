// Product readiness gate. Nothing becomes ACTIVE (sellable) until every requirement is recorded as met
// and owner approval is logged. Applies to first-party DIY products, kits, bundles, and concepts.

import { findClaims } from "./claims";

export const PRODUCT_STATUSES = [
  "IDEA_ONLY",
  "CONCEPT_ONLY",
  "NEEDS_SUPPLIER",
  "NEEDS_SAMPLE",
  "NEEDS_COSTING",
  "NEEDS_MATERIAL_FACTS",
  "NEEDS_PHOTOGRAPHY",
  "NEEDS_PACKAGING",
  "NEEDS_FULFILLMENT",
  "NEEDS_CLAIM_REVIEW",
  "READY_FOR_OWNER_REVIEW",
  "ACTIVE",
  "ARCHIVED",
] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

/** Requirements for ACTIVE. Keys are stored per product; each needs a truthy value recorded by an admin. */
export const ACTIVATION_REQUIREMENTS = {
  supplierConfirmed: "Supplier is real and confirmed",
  materialsConfirmed: "Materials confirmed (documented)",
  claimsReviewed: "All product claims reviewed",
  sampleApproved: "Product sample approved",
  sourcingCostKnown: "Sourcing cost known",
  shippingDimensionsKnown: "Shipping weight and dimensions known",
  retailPriceApproved: "Retail price owner-approved",
  realPhotoApproved: "Real product photo approved",
  inventoryConfigured: "Inventory/availability configured",
  fulfillmentConfigured: "Fulfillment method configured",
  shippingReturnsConfigured: "Shipping and returns configured",
  taxConfigured: "Tax behavior configured",
  factualDescription: "Product page has a factual description",
  checkoutTested: "Cart and checkout tested with this product",
  ownerApproval: "Owner approval recorded",
} as const;

/** Extra requirements for DIY kits (non-hazardous craft/organization kits only). */
export const DIY_REQUIREMENTS = {
  materialsList: "Actual materials list",
  safetyInstructions: "Safety instructions",
  usageSuitability: "Age/usage suitability stated",
  requiredWarnings: "Required warnings included",
  directions: "Step-by-step directions",
  packageContents: "Package contents listed",
  designRights: "Rights to included designs/content",
  legalReviewFlagResolved: "Legal review flag resolved (or not required)",
} as const;

export type RequirementKey = keyof typeof ACTIVATION_REQUIREMENTS | keyof typeof DIY_REQUIREMENTS;

export interface ReadinessRecord {
  status: ProductStatus;
  isDiy: boolean;
  /** Requirement key → true once satisfied (with evidence recorded elsewhere). */
  checks: Partial<Record<RequirementKey, boolean>>;
  /** Public-facing copy that will appear on the product page. */
  publicCopy: string;
  priceCents: number | null;
  photoIsGenerated: boolean;
}

export interface ReadinessResult {
  ready: boolean;
  missing: string[];
}

export function evaluateReadiness(r: ReadinessRecord): ReadinessResult {
  const missing: string[] = [];
  const reqs: Record<string, string> = { ...ACTIVATION_REQUIREMENTS, ...(r.isDiy ? DIY_REQUIREMENTS : {}) };
  for (const [key, label] of Object.entries(reqs)) {
    if (!r.checks[key as RequirementKey]) missing.push(label);
  }
  if (r.priceCents === null || r.priceCents <= 0) missing.push("A real, owner-approved price");
  if (r.photoIsGenerated) missing.push("Primary image must be a real photo, not generated art");
  const claims = findClaims(r.publicCopy);
  if (claims.length) missing.push(`Unsupported claims in copy: ${[...new Set(claims.map((c) => c.term))].join(", ")}`);
  return { ready: missing.length === 0, missing };
}

export interface TransitionResult {
  ok: boolean;
  error?: string;
}

/** Server-side guard for every status change. */
export function canTransition(r: ReadinessRecord, to: ProductStatus): TransitionResult {
  if (!PRODUCT_STATUSES.includes(to)) return { ok: false, error: `Unknown status ${to}` };
  if (r.status === to) return { ok: false, error: "Already in that status" };
  if (r.status === "ARCHIVED" && to !== "IDEA_ONLY" && to !== "CONCEPT_ONLY") {
    return { ok: false, error: "Archived items can only be reopened as IDEA_ONLY or CONCEPT_ONLY" };
  }
  if (to === "ACTIVE") {
    const { ready, missing } = evaluateReadiness(r);
    if (!ready) return { ok: false, error: `Cannot activate. Missing: ${missing.join("; ")}` };
    if (r.status !== "READY_FOR_OWNER_REVIEW") return { ok: false, error: "Must pass READY_FOR_OWNER_REVIEW first" };
  }
  if (to === "READY_FOR_OWNER_REVIEW") {
    const { missing } = evaluateReadiness({ ...r, checks: { ...r.checks, ownerApproval: true } });
    if (missing.length) return { ok: false, error: `Not ready for owner review. Missing: ${missing.join("; ")}` };
  }
  return { ok: true };
}

/** Anything not ACTIVE is never purchasable, indexable, featured, or given a price/availability. */
export const isSellableStatus = (s: ProductStatus) => s === "ACTIVE";
