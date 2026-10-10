import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { AFFILIATE_DISCLOSURE, isSafeOutboundUrl } from "../../src/lib/affiliate";
import { isPublished, isPurchasable, type Product } from "../../src/lib/catalog";
import { flags } from "../../src/lib/flags";
import { DEFAULT_FEE_CONFIG, FeeNotConfiguredError, buildFeeConfig, calculatePlatformFeeCents } from "../../src/lib/marketplace/fees";
import { transitionListing, transitionSeller, validateListingForSubmission } from "../../src/lib/marketplace/listings";
import { can } from "../../src/lib/marketplace/permissions";
import { mockProviders } from "../../src/lib/marketplace/providers";
import type { Listing, SellerApplication } from "../../src/lib/marketplace/types";
import { applyAction, canStartSubscription, type Subscription, type SubscriptionPlan } from "../../src/lib/subscriptions";

test.describe("feature flags", () => {
  test("all program flags default to OFF", () => {
    expect(flags.SUBSCRIPTIONS_ENABLED).toBe(false);
    expect(flags.AFFILIATE_PRODUCTS_ENABLED).toBe(false);
    expect(flags.MARKETPLACE_ENABLED).toBe(false);
    expect(flags.NEWSLETTER_ENABLED).toBe(false);
  });
});

test.describe("marketplace fees", () => {
  test("default is null / REQUIRES_OWNER_CONFIGURATION and cannot calculate", () => {
    expect(DEFAULT_FEE_CONFIG.platform_fee_percent).toBeNull();
    expect(DEFAULT_FEE_CONFIG.platform_fee_status).toBe("REQUIRES_OWNER_CONFIGURATION");
    expect(() => calculatePlatformFeeCents(DEFAULT_FEE_CONFIG, { amountCents: 10000 })).toThrow(FeeNotConfiguredError);
  });
  test("configuration requires explicit confirmation", () => {
    const base = { percent: "10", fixedCents: "30", actor: "t" };
    expect(buildFeeConfig(DEFAULT_FEE_CONFIG, { ...base, confirm: false, confirmPhrase: "CONFIRM FEES" }).ok).toBe(false);
    expect(buildFeeConfig(DEFAULT_FEE_CONFIG, { ...base, confirm: true, confirmPhrase: "yes" }).ok).toBe(false);
    const r = buildFeeConfig(DEFAULT_FEE_CONFIG, { ...base, confirm: true, confirmPhrase: "CONFIRM FEES" });
    expect(r.ok).toBe(true);
    if (r.ok) expect(calculatePlatformFeeCents(r.config, { amountCents: 10000 })).toBe(1030);
  });
});

const seller: SellerApplication = {
  id: "s1", storeName: "Test Maker", slug: "test-maker", contactName: "T", contactEmail: "t@example.com", categories: [],
  ownershipConfirmed: true, termsAccepted: true, sellerPolicyAccepted: true, verification: "NOT_STARTED",
  status: "PENDING_REVIEW", submittedAt: "2026-01-01",
};
const listing: Listing = {
  id: "l1", sellerId: "s1", title: "Printed pouch", category: "carry", description: "A printed cotton pouch.",
  materialDetails: "Cotton (seller-provided)", photoUrls: ["https://example.com/p.jpg"], photoRightsConfirmed: true,
  priceCents: 1500, inventory: 5, shippingMethod: "USPS", returnPolicy: "30 days (seller)", safetyInfo: "", claimEvidence: "",
  status: "DRAFT", moderation: { claimReview: "PENDING", imageReview: "PENDING" }, updatedAt: "2026-01-01",
};

test.describe("marketplace workflow", () => {
  test("seller approval is never automatic and needs agreements", () => {
    expect(transitionSeller({ ...seller, termsAccepted: false }, "APPROVED").ok).toBe(false);
    expect(transitionSeller(seller, "APPROVED").ok).toBe(true);
    expect(transitionSeller({ ...seller, status: "REJECTED" }, "APPROVED").ok).toBe(false);
  });
  test("listing submission requires all fields, photo rights, and claim evidence", () => {
    expect(validateListingForSubmission(listing).ok).toBe(true);
    expect(validateListingForSubmission({ ...listing, priceCents: null }).ok).toBe(false);
    expect(validateListingForSubmission({ ...listing, photoRightsConfirmed: false }).ok).toBe(false);
    const claimy = { ...listing, description: "A compostable, eco-friendly pouch" };
    expect(validateListingForSubmission(claimy).ok).toBe(false);
    expect(validateListingForSubmission({ ...claimy, claimEvidence: "Certificate #123 (link)" }).ok).toBe(true);
  });
  test("a listing only goes ACTIVE with an approved seller and passed reviews", () => {
    const pending = { ...listing, status: "PENDING_REVIEW" as const };
    expect(transitionListing(pending, "ACTIVE", seller).ok).toBe(false);
    const approved = { ...seller, status: "APPROVED" as const };
    expect(transitionListing(pending, "ACTIVE", approved).ok).toBe(false);
    const reviewed = { ...pending, moderation: { claimReview: "PASSED" as const, imageReview: "PASSED" as const } };
    expect(transitionListing(reviewed, "ACTIVE", approved).ok).toBe(true);
    expect(transitionListing(listing, "ACTIVE", approved).ok).toBe(false); // DRAFT can't skip review
  });
  test("roles: sellers cannot moderate or configure fees", () => {
    expect(can("SELLER", "listing.moderate")).toBe(false);
    expect(can("SELLER", "fees.configure")).toBe(false);
    expect(can("MARKETPLACE_ADMIN", "fees.configure")).toBe(false);
    expect(can("SUPER_ADMIN", "fees.configure")).toBe(true);
    expect(can("MARKETPLACE_MODERATOR", "listing.moderate")).toBe(true);
  });
  test("mock payment providers refuse to move money", async () => {
    await expect(mockProviders.payouts.createPayout({ sellerAccountId: "a", amountCents: 1 })).rejects.toThrow(/not configured/);
    await expect(mockProviders.payments.createSplitPayment({ amountCents: 1, sellerAccountId: "a", platformFeeCents: 0 })).rejects.toThrow();
  });
});

test.describe("subscriptions", () => {
  const plan: SubscriptionPlan = {
    id: "p", model: "REFILL", name: "Test", productSlugs: ["x"], frequencies: ["MONTHLY"], priceCents: 1000,
    renewalTerms: "Renews monthly.", cancellationPolicy: "Cancel anytime.", refundPolicy: "Refunds per policy.", contentsDisclosure: null, status: "ACTIVE",
  };
  test("cannot start while disabled, even with a complete plan and consent", () => {
    const r = canStartSubscription(plan, { accepted: true, disclosureText: "You'll be charged…", acceptedAt: "now" });
    expect(r.ok).toBe(false);
    expect(r.errors.join(" ")).toContain("SUBSCRIPTIONS_ENABLED=false");
    expect(r.errors.join(" ")).toContain("No billing provider");
  });
  test("consent must be explicit", () => {
    expect(canStartSubscription(plan, null).errors.join(" ")).toContain("consent");
    expect(canStartSubscription(plan, { accepted: false, disclosureText: "x", acceptedAt: "now" }).errors.join(" ")).toContain("consent");
  });
  test("pause, skip, resume, and cancel", () => {
    const s: Subscription = { id: "s", planId: "p", status: "ACTIVE", frequency: "MONTHLY", nextDate: "2026-02-01", skippedDates: [], consent: null, history: [] };
    const paused = applyAction(s, "pause");
    expect(paused.ok && paused.next.status).toBe("PAUSED");
    if (paused.ok) expect(applyAction(paused.next, "cancel").ok).toBe(true);
    const skipped = applyAction(s, "skip", { date: "2026-02-01" });
    expect(skipped.ok && skipped.next.skippedDates).toEqual(["2026-02-01"]);
    const canceled = applyAction(s, "cancel");
    expect(canceled.ok && canceled.next.status).toBe("CANCELED");
  });
});

test.describe("affiliate", () => {
  const affiliate: Product = {
    slug: "test-partner-item", name: "Test partner item", category: "cleaning", summary: "A test item.",
    image: { src: "/partner.jpg", alt: "", width: 1, height: 1 },
    offer: { kind: "external", url: "https://partner.example.com/item", merchant: "Example", relationship: "affiliate" },
    ownerVerified: true,
  };
  test("disclosure text is exact and rendered", () => {
    expect(AFFILIATE_DISCLOSURE).toBe("Affiliate disclosure: Heady Buffalo may earn a commission if you purchase through this partner link.");
    // The component renders AFFILIATE_DISCLOSURE for affiliate links (source-level check; Playwright's JSX
    // transform can't render app components server-side). The product page places it next to the CTA.
    const src = readFileSync("src/app/components/ui/PartnerDisclosure.tsx", "utf8");
    expect(src).toContain('relationship === "affiliate" ? AFFILIATE_DISCLOSURE');
    const pdp = readFileSync("src/app/products/[id]/page.tsx", "utf8");
    expect(pdp).toContain('rel="sponsored noopener noreferrer"');
    expect(pdp).toContain("<PartnerDisclosure relationship={offer.relationship} />");
  });
  test("external items are never purchasable and are hidden while the flag is off", () => {
    expect(isPurchasable(affiliate)).toBe(false);
    expect(isPublished(affiliate)).toBe(false);
  });
  test("outbound URL validation", () => {
    expect(isSafeOutboundUrl("https://partner.example.com/x")).toBe(true);
    for (const bad of ["http://partner.example.com", "javascript:alert(1)", "https://user:pw@example.com", "/local", "https://localhost"]) {
      expect(isSafeOutboundUrl(bad), bad).toBe(false);
    }
  });
});
