import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const CORE = ["/", "/shop", "/categories/gifts", "/products/macrame-plant-hanger", "/cart", "/contact", "/about"];

async function trackFailures(page: Page) {
  const failed: string[] = [];
  page.on("response", (r) => {
    if (r.status() >= 400 && r.request().resourceType() === "image") failed.push(`${r.status()} ${r.url()}`);
  });
  return failed;
}

async function loadAllImages(page: Page) {
  await page.evaluate(() => document.querySelectorAll<HTMLImageElement>("img[loading=lazy]").forEach((i) => (i.loading = "eager")));
  await page.waitForLoadState("networkidle");
  await page.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 20000 });
  return page.evaluate(() => [...document.images].filter((i) => i.naturalWidth === 0).map((i) => i.currentSrc || i.src));
}

test.describe("visual system", () => {
  test("homepage renders the hero with a loaded generated backdrop", async ({ page }) => {
    await page.goto("/");
    const hero = page.getByTestId("hero");
    await expect(hero).toBeVisible();
    await expect(hero.getByRole("heading", { level: 1 })).toHaveText("Handmade goods for everyday living.");
    const bg = hero.locator('[data-art="hero-landscape"] img');
    await expect(bg).toHaveCount(1);
    await expect.poll(() => bg.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true);
  });

  test("homepage sells: collections, featured products, ordering steps, gifts, and CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('section[aria-labelledby="collections-heading"] li')).toHaveCount(4);
    await expect(page.locator('section[aria-labelledby="featured-heading"] article')).toHaveCount(8);
    const steps = page.locator('[data-art-module="principle-card"]');
    await expect(steps).toHaveCount(3);
    const accents = await steps.evaluateAll((els) => els.map((e) => getComputedStyle(e.querySelector("span")!).backgroundColor));
    expect(new Set(accents).size).toBe(3);
    await expect(page.locator("#gifts-heading")).toBeVisible();
    await expect(page.locator('[data-art-module="cta"]')).toBeVisible();
  });

  for (const route of CORE) {
    test(`no failed image requests on ${route}`, async ({ page }) => {
      const failed = await trackFailures(page);
      await page.goto(route);
      const broken = await loadAllImages(page);
      expect(broken).toEqual([]);
      expect(failed).toEqual([]);
    });
  }

  test("no horizontal overflow at 375px on core pages", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    for (const route of CORE) {
      await page.goto(route);
      const { sw, cw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
      expect(sw, route).toBeLessThanOrEqual(cw);
    }
  });

  for (const route of CORE) {
    test(`no serious or critical accessibility violations on ${route}`, async ({ page }) => {
      test.setTimeout(120_000);
      await page.goto(route);
      await loadAllImages(page);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      const bad = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(bad.map((v) => `${route}: ${v.id} (${v.nodes.length}) ${v.nodes[0]?.target}`)).toEqual([]);
    });
  }
});

test.describe("made-to-order catalog", () => {
  test("the shop lists all 30 handmade pieces with illustrations, labels, and no fake prices", async ({ page }) => {
    await page.goto("/shop");
    const cards = page.locator("main article");
    await expect(cards).toHaveCount(30);
    for (let i = 0; i < 30; i++) {
      const card = cards.nth(i);
      await expect(card).toContainText("Made to order");
      await expect(card).toContainText("Price on request");
      await expect(card.locator("img")).toHaveAttribute("src", /illustrations/);
      await expect(card.locator("img")).toHaveAttribute("alt", /^Illustration of/);
    }
  });

  test("product page offers ordering by request, labels the illustration, and has no Product schema", async ({ page }) => {
    await page.goto("/products/embroidered-patch-set");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Embroidered patch set");
    await expect(page.getByText("Price on request").first()).toBeVisible();
    await expect(page.getByText(/^Illustration\./)).toBeVisible();
    const panel = page.getByTestId("request-panel");
    await expect(panel.getByRole("link", { name: "Request this item" })).toBeVisible();
    await expect(page.getByRole("button", { name: /add to cart/i })).toHaveCount(0);
    const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join(" ");
    expect(ld).not.toContain('"Product"');
    expect(ld).toContain("BreadcrumbList");
  });

  test("request link pre-fills the order form", async ({ page }) => {
    await page.goto("/products/macrame-plant-hanger");
    await page.getByRole("link", { name: "Request this item" }).click();
    await page.waitForURL(/\/contact/);
    await expect(page.getByLabel("Subject")).toHaveValue("Order request: Macramé plant hanger");
    await expect(page.getByLabel("Message")).toHaveValue(/Quantity:/);
  });

  test("request-only items can't be checked out yet", async ({ request }) => {
    const res = await request.post("/api/checkout", { data: { items: [{ id: "embroidered-patch-set", quantity: 1 }] } });
    expect([409, 503]).toContain(res.status());
  });

  test("the old ideas page redirects to the shop", async ({ page }) => {
    await page.goto("/ideas");
    await expect(page).toHaveURL(/\/shop$/);
  });

  test("public pages have no concept or placeholder wording", async ({ page }) => {
    for (const route of ["/", "/shop", "/categories/home", "/products/rope-coil-basket", "/about", "/contact"]) {
      await page.goto(route);
      const text = (await page.locator("body").innerText()).toLowerCase();
      for (const term of ["concept", "not available for purchase", "in development", "ideas we", "draft", "tie-dye", "tie dye"]) {
        expect(text, `${route}: ${term}`).not.toContain(term);
      }
    }
  });

  test("public copy has no broad environmental or popularity claims", async ({ page }) => {
    for (const route of ["/", "/shop", "/about", "/products/stamped-cotton-bandana"]) {
      await page.goto(route);
      const text = (await page.locator("main").innerText()).toLowerCase();
      for (const term of ["eco-friendly", "sustainable", "biodegradable", "compostable", "zero waste", "non-toxic", "plastic-free", "organic", "best seller", "bestseller", "favorite"]) {
        expect(text, `${route}: ${term}`).not.toContain(term);
      }
    }
  });
});

test.describe("seo basics", () => {
  test("homepage metadata and OG image", async ({ page, request }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Heady Buffalo/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{20,}/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /headybuffalo\.com/);
    const og = await page.locator('meta[property="og:image"]').getAttribute("content");
    const res = await request.get(new URL(og!).pathname + new URL(og!).search);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("image/png");
  });

  test("robots and sitemap include the shop and products", async ({ request }) => {
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Disallow: /admin");
    expect(robots).toContain("Sitemap:");
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).toContain("/shop");
    expect(sitemap).toContain("/categories/gifts");
    expect(sitemap).toContain("/products/embroidered-patch-set");
  });
});
