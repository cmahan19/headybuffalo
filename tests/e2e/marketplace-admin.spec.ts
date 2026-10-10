import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import { ADMIN_TEST_PASSWORD, E2E_DATA_DIR } from "../../playwright.config";

// Seeds the admin JSON store with fictional test data, then drives the real admin buttons.
const storeFile = join(E2E_DATA_DIR, "hb-store.json");

test("seller approval and listing moderation flow through the admin buttons", async ({ page }) => {
  mkdirSync(E2E_DATA_DIR, { recursive: true });
  let current: Record<string, unknown> = {};
  try {
    current = JSON.parse(readFileSync(storeFile, "utf8"));
  } catch {}
  writeFileSync(
    storeFile,
    JSON.stringify({
      ...current,
      version: 1,
      sellers: [
        {
          id: "seller-test", storeName: "Fictional Test Maker", slug: "fictional-test-maker", contactName: "Test", contactEmail: "test@example.com",
          categories: ["carry"], ownershipConfirmed: true, termsAccepted: true, sellerPolicyAccepted: true, verification: "NOT_STARTED",
          status: "PENDING_REVIEW", submittedAt: "2026-01-01T00:00:00Z",
        },
      ],
      listings: [
        {
          id: "listing-test", sellerId: "seller-test", title: "Fictional printed pouch", category: "carry", description: "A printed cotton pouch.",
          materialDetails: "Cotton (seller-provided)", photoUrls: ["https://example.com/test.jpg"], photoRightsConfirmed: true, priceCents: 1500,
          inventory: 3, shippingMethod: "USPS", returnPolicy: "30 days", safetyInfo: "", claimEvidence: "", status: "PENDING_REVIEW",
          moderation: { claimReview: "PENDING", imageReview: "PENDING" }, updatedAt: "2026-01-01T00:00:00Z",
        },
      ],
      reports: [],
    })
  );

  await page.goto("/admin/login?next=/admin/marketplace");
  await page.getByLabel("Password").fill(ADMIN_TEST_PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/admin/marketplace");

  // Listing can't be approved before the seller is approved and reviews pass.
  await page.getByRole("button", { name: "approve", exact: true }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Seller is not approved" })).toBeVisible({ timeout: 20000 });

  await page.getByRole("button", { name: "Approve", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "Seller approved" })).toBeVisible({ timeout: 20000 });
  await expect(page.locator("#sellers-heading ~ ul")).toContainText("APPROVED");

  await page.getByRole("button", { name: "approve", exact: true }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Claim review has not passed" })).toBeVisible({ timeout: 20000 });

  await page.getByRole("button", { name: "claims-pass" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Listing updated" })).toBeVisible({ timeout: 20000 });
  await page.getByRole("button", { name: "images-pass" }).click();
  await expect(page.locator("#queue-heading ~ ul")).toContainText("Image review: PASSED", { timeout: 20000 });
  await page.getByRole("button", { name: "approve", exact: true }).click();
  await expect(page.locator("#queue-heading ~ ul")).toContainText("Fictional printed pouch · ACTIVE", { timeout: 20000 });

  const saved = JSON.parse(readFileSync(storeFile, "utf8"));
  expect(saved.listings[0].status).toBe("ACTIVE");
  expect(saved.audit.some((e: { action: string }) => e.action === "listing.status")).toBe(true);
  expect(saved.feeConfig.platform_fee_status).toBe("REQUIRES_OWNER_CONFIGURATION");
});
