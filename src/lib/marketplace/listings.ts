import { findClaims } from "../claims";
import type { Listing, ListingStatus, SellerApplication } from "./types";

export interface Check {
  ok: boolean;
  errors: string[];
}

/** Everything a seller must provide before a listing can be submitted for review. */
export function validateListingForSubmission(l: Listing): Check {
  const errors: string[] = [];
  const required: [keyof Listing, string][] = [
    ["title", "Title"],
    ["category", "Category"],
    ["description", "Description"],
    ["materialDetails", "Material details"],
    ["shippingMethod", "Shipping method"],
    ["returnPolicy", "Return policy"],
  ];
  for (const [k, label] of required) if (!String(l[k] ?? "").trim()) errors.push(`${label} is required`);
  if (l.photoUrls.length === 0) errors.push("At least one real product photo is required");
  if (!l.photoRightsConfirmed) errors.push("Photo rights must be confirmed");
  if (l.priceCents === null || l.priceCents <= 0) errors.push("Price is required");
  if (l.inventory === null || l.inventory < 0) errors.push("Inventory is required");
  const claims = findClaims(`${l.title} ${l.description} ${l.materialDetails}`);
  if (claims.length && !l.claimEvidence.trim()) {
    errors.push(`Claims need evidence before review: ${[...new Set(claims.map((c) => c.term))].join(", ")}`);
  }
  return { ok: errors.length === 0, errors };
}

const listingAllowed: Record<ListingStatus, ListingStatus[]> = {
  DRAFT: ["PENDING_REVIEW"],
  PENDING_REVIEW: ["ACTIVE", "CHANGES_REQUESTED", "REJECTED"],
  CHANGES_REQUESTED: ["PENDING_REVIEW"],
  ACTIVE: ["SUSPENDED", "PENDING_REVIEW"],
  REJECTED: [],
  SUSPENDED: ["PENDING_REVIEW"],
};

/** Listing workflow guard: sellers submit, moderators decide. There is no automatic approval. */
export function transitionListing(l: Listing, to: ListingStatus, seller: SellerApplication | undefined): Check {
  const errors: string[] = [];
  if (!listingAllowed[l.status].includes(to)) errors.push(`Cannot move a listing from ${l.status} to ${to}`);
  if (to === "PENDING_REVIEW") errors.push(...validateListingForSubmission(l).errors);
  if (to === "ACTIVE") {
    if (!seller || seller.status !== "APPROVED") errors.push("Seller is not approved");
    if (l.moderation.claimReview !== "PASSED") errors.push("Claim review has not passed");
    if (l.moderation.imageReview !== "PASSED") errors.push("Image review has not passed");
    errors.push(...validateListingForSubmission(l).errors);
  }
  return { ok: errors.length === 0, errors };
}

const sellerAllowed: Record<SellerApplication["status"], SellerApplication["status"][]> = {
  PENDING_REVIEW: ["APPROVED", "REJECTED"],
  APPROVED: ["SUSPENDED"],
  REJECTED: [],
  SUSPENDED: ["APPROVED"],
};

export function transitionSeller(s: SellerApplication, to: SellerApplication["status"]): Check {
  const errors: string[] = [];
  if (!sellerAllowed[s.status].includes(to)) errors.push(`Cannot move a seller from ${s.status} to ${to}`);
  if (to === "APPROVED" && (!s.termsAccepted || !s.sellerPolicyAccepted || !s.ownershipConfirmed)) {
    errors.push("Seller must accept terms and the seller policy and confirm product ownership");
  }
  return { ok: errors.length === 0, errors };
}
