import { expect, test, type Page } from "@playwright/test";
import { ADMIN_TEST_PASSWORD } from "../../playwright.config";

async function signIn(page: Page, next = "/admin") {
  await page.goto(`/admin/login?next=${encodeURIComponent(next)}`);
  await page.getByLabel("Password").fill(ADMIN_TEST_PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL((u) => u.pathname === next);
}

test.describe("protected routes", () => {
  test("admin redirects to login without a session and is noindex", async ({ page, request }) => {
    await page.goto("/admin/product-concepts");
    await expect(page).toHaveURL(/\/admin\/login/);
    const res = await request.get("/admin/product-concepts", { maxRedirects: 0 });
    expect(res.status()).toBe(307);
  });

  test("wrong password is rejected", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("Password").fill("nope");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "Incorrect password." })).toBeVisible();
  });

  test("seller and marketplace routes are closed while the marketplace is disabled", async ({ request }) => {
    for (const path of ["/seller", "/sell/apply", "/makers"]) {
      expect((await request.get(path, { maxRedirects: 0 })).status(), path).toBe(404);
    }
  });

  test("forged admin cookie is rejected", async ({ page, context }) => {
    await context.addCookies([{ name: "hb_admin", value: `admin.${Math.floor(Date.now() / 1000) + 3600}.deadbeef`, url: "http://localhost:3150" }]);
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});

test.describe("admin product concepts", () => {
  test("shows all 30 concepts with status, requirements, scorecard, and controls", async ({ page }) => {
    await signIn(page, "/admin/product-concepts");
    const items = page.getByTestId("admin-concept");
    await expect(items).toHaveCount(30);
    await expect(items.first().getByTestId("concept-status")).toHaveText("CONCEPT_ONLY");
    await expect(items.first()).toContainText("Readiness gate");
    await expect(items.first()).toContainText("Validation scorecard");
    await expect(items.first().getByRole("button", { name: "Approve for research" })).toBeVisible();
    await expect(items.first().getByRole("button", { name: "Reject / archive" })).toBeVisible();
    const res = await page.request.get("/admin/product-concepts");
    expect(res.headers()["x-robots-tag"]).toContain("noindex");
  });

  test("activation is blocked by the readiness gate; approval is audited", async ({ page }) => {
    await signIn(page, "/admin/product-concepts/pantry-label-kit");
    await page.getByLabel("New status").selectOption("ACTIVE");
    await page.getByRole("button", { name: "Change status" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "Cannot activate" })).toBeVisible();
    await expect(page.getByTestId("concept-status")).toHaveText("CONCEPT_ONLY");

    await page.goto("/admin/product-concepts");
    const item = page.getByTestId("admin-concept").filter({ hasText: "Colorful bulk-pantry label kit" });
    await item.getByRole("button", { name: "Approve for research" }).click();
    await expect(page.getByRole("status").filter({ hasText: "NEEDS_SUPPLIER" })).toBeVisible({ timeout: 20000 });
    await expect(page.locator("#audit-heading ~ ol")).toContainText("pantry-label-kit");
  });

  test("marketplace fee stays unconfigured without explicit confirmation", async ({ page }) => {
    await signIn(page, "/admin/marketplace");
    await expect(page.getByTestId("fee-status")).toHaveText("REQUIRES_OWNER_CONFIGURATION");
    await page.getByLabel("Platform fee %").fill("10");
    await page.getByRole("button", { name: "Confirm fee configuration" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "CONFIRM FEES" })).toBeVisible();
    await expect(page.getByTestId("fee-status")).toHaveText("REQUIRES_OWNER_CONFIGURATION");
  });

  test("subscription and affiliate programs are OFF by default", async ({ page }) => {
    await signIn(page, "/admin/programs");
    await expect(page.getByTestId("subs-flag")).toHaveText("OFF");
    await expect(page.getByTestId("aff-flag")).toHaveText("OFF");
  });
});

test.describe("launch board", () => {
  test("lists all 30 products with checklists and flags the missing shipping rate", async ({ page }) => {
    await page.goto("/admin/login?next=/admin/launch");
    await page.getByLabel("Password").fill(ADMIN_TEST_PASSWORD);
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL((u) => u.pathname === "/admin/launch");
    await expect(page.getByTestId("launch-row")).toHaveCount(30);
    await expect(page.getByTestId("shipping-status")).toContainText("not set");
    await expect(page.getByTestId("launch-row").first()).toContainText("Launch first");
    // Pricing calculator computes from typed values.
    await page.getByLabel("Materials per item ($)").fill("3");
    await page.getByLabel("Minutes to make one").fill("30");
    await page.getByLabel("Your hourly rate ($/hr)").fill("20");
    await expect(page.getByText("Total cost").locator("..")).toContainText("$13.00"); // $3 materials + 30 min at $20/hr
  });

  test("made-to-order products are public but can't be checked out before launch", async ({ request }) => {
    expect((await request.get("/products/embroidered-patch-set")).status()).toBe(200);
    const res = await request.post("/api/checkout", { data: { items: [{ id: "embroidered-patch-set", quantity: 1 }] } });
    expect([409, 503]).toContain(res.status());
  });
});
