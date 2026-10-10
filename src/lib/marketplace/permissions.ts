import type { Role } from "./types";

export type Action =
  | "seller.apply"
  | "seller.review"
  | "seller.suspend"
  | "listing.create"
  | "listing.submit"
  | "listing.moderate"
  | "listing.suspend"
  | "fees.configure"
  | "reports.create"
  | "reports.resolve"
  | "concepts.manage";

const grants: Record<Role, Action[]> = {
  BUYER: ["seller.apply", "reports.create"],
  SELLER_APPLICANT: ["reports.create"],
  SELLER: ["listing.create", "listing.submit", "reports.create"],
  SELLER_MANAGER: ["listing.create", "listing.submit", "reports.create"],
  MARKETPLACE_MODERATOR: ["listing.moderate", "listing.suspend", "reports.resolve", "reports.create"],
  MARKETPLACE_ADMIN: [
    "seller.review",
    "seller.suspend",
    "listing.moderate",
    "listing.suspend",
    "reports.resolve",
    "reports.create",
    "concepts.manage",
  ],
  SUPER_ADMIN: [
    "seller.review",
    "seller.suspend",
    "listing.moderate",
    "listing.suspend",
    "fees.configure",
    "reports.resolve",
    "reports.create",
    "concepts.manage",
  ],
};

/** Server-side permission check. Never trust a role sent by the client. */
export function can(role: Role, action: Action) {
  return grants[role].includes(action);
}
