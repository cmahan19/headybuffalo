// Marketplace domain types. Persistence-agnostic; see docs/MARKETPLACE_SELLER_PLAN.md.

export const ROLES = [
  "BUYER",
  "SELLER_APPLICANT",
  "SELLER",
  "SELLER_MANAGER",
  "MARKETPLACE_MODERATOR",
  "MARKETPLACE_ADMIN",
  "SUPER_ADMIN",
] as const;
export type Role = (typeof ROLES)[number];

export type SellerStatus = "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "SUSPENDED";

export interface SellerApplication {
  id: string;
  storeName: string;
  slug: string;
  contactName: string;
  contactEmail: string;
  categories: string[];
  /** Seller confirms they make, own, or are authorized to sell what they list. */
  ownershipConfirmed: boolean;
  termsAccepted: boolean;
  sellerPolicyAccepted: boolean;
  /** Placeholder until a SellerVerificationProvider is connected. */
  verification: "NOT_STARTED" | "PENDING" | "VERIFIED" | "FAILED";
  status: SellerStatus;
  submittedAt: string;
  decidedAt?: string;
  decisionNote?: string;
}

export type ListingStatus = "DRAFT" | "PENDING_REVIEW" | "CHANGES_REQUESTED" | "ACTIVE" | "REJECTED" | "SUSPENDED";

export interface Listing {
  id: string;
  sellerId: string;
  title: string;
  category: string;
  description: string;
  materialDetails: string;
  photoUrls: string[];
  photoRightsConfirmed: boolean;
  priceCents: number | null;
  inventory: number | null;
  shippingMethod: string;
  returnPolicy: string;
  safetyInfo: string;
  /** Required whenever the copy makes an environmental, health, or safety claim. */
  claimEvidence: string;
  status: ListingStatus;
  moderation: {
    claimReview: "PENDING" | "PASSED" | "FAILED";
    imageReview: "PENDING" | "PASSED" | "FAILED";
    note?: string;
  };
  updatedAt: string;
}

export interface BuyerReport {
  id: string;
  sellerId: string;
  listingId?: string;
  reason: string;
  details: string;
  at: string;
  status: "OPEN" | "RESOLVED";
}

export type FeeStatus = "REQUIRES_OWNER_CONFIGURATION" | "OWNER_CONFIGURED";

export interface FeeConfig {
  platform_fee_percent: number | null;
  fixed_fee_cents: number | null;
  category_fee_percent: Record<string, number>;
  seller_plan_override_percent: number | null;
  platform_fee_status: FeeStatus;
  confirmed_by?: string;
  confirmed_at?: string;
}
