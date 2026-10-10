import { expect, test } from "@playwright/test";
import { handmadeProducts } from "../../src/data/handmade-products";
import { isPublished, isPurchasable, isRequestOnly, launchChecklist, type Product } from "../../src/lib/catalog";
import { concepts } from "../../src/lib/concepts";
import { computePrice } from "../../src/lib/pricing";
import { unlaunchedConcepts } from "../../src/lib/showcase";
import { site } from "../../src/lib/site";

// Fictional test data only.
function complete(base: Product): Product {
  return {
    ...base,
    image: { src: "/products/test/1.jpg", alt: "Test photo", width: 1600, height: 1600 },
    imageIsPlaceholder: false,
    offer: { kind: "own", priceCents: 2400 },
    handmade: {
      photos: [{ src: "/products/test/1.jpg", alt: "Test photo", width: 1600, height: 1600 }],
      materials: "Test material",
      size: "10 x 10 in",
      care: "Test care",
      shippingWeightOz: 8,
      fulfillment: { kind: "made-to-order", leadTimeBusinessDays: 5 },
    },
    ownerVerified: true,
  };
}

test.describe("handmade launch", () => {
  test.afterEach(() => {
    site.shipping.flatRateCents = null;
  });

  test("all 30 products are listed as made to order (public, not yet checkout-ready)", () => {
    expect(handmadeProducts).toHaveLength(30);
    expect(new Set(handmadeProducts.map((p) => p.slug))).toEqual(new Set(concepts.map((c) => c.id)));
    for (const p of handmadeProducts) {
      expect(p.listing, p.slug).toBe("request");
      expect(isPublished(p), p.slug).toBe(true);
      expect(isRequestOnly(p), p.slug).toBe(true);
      expect(isPurchasable(p), p.slug).toBe(false);
      expect(p.imageIsPlaceholder, p.slug).toBe(true);
      expect(p.image.src, p.slug).toBe(`/products/illustrations/${p.slug}.webp`);
    }
    expect(unlaunchedConcepts()).toHaveLength(0);
  });

  test("a hidden listing stays off the site until launch-ready", () => {
    const p = { ...handmadeProducts[0], listing: "hidden" as const };
    expect(isPublished(p)).toBe(false);
  });

  test("a fully filled, approved product with shipping set goes live", () => {
    const p = complete(handmadeProducts.find((x) => x.slug === "embroidered-patch-set")!);
    expect(isPurchasable(p)).toBe(false); // shop shipping rate not set yet
    site.shipping.flatRateCents = 500;
    expect(launchChecklist(p).every((c) => c.done)).toBe(true);
    expect(isPurchasable(p)).toBe(true);
    expect(isPublished(p)).toBe(true);
  });

  test("each missing item blocks launch", () => {
    site.shipping.flatRateCents = 500;
    const base = complete(handmadeProducts.find((x) => x.slug === "macrame-plant-hanger")!);
    const variants: Product[] = [
      { ...base, offer: { kind: "own", priceCents: null } },
      { ...base, imageIsPlaceholder: true },
      { ...base, handmade: { ...base.handmade!, photos: [] } },
      { ...base, handmade: { ...base.handmade!, materials: null } },
      { ...base, handmade: { ...base.handmade!, size: " " } },
      { ...base, handmade: { ...base.handmade!, care: null } },
      { ...base, handmade: { ...base.handmade!, shippingWeightOz: null } },
      { ...base, handmade: { ...base.handmade!, fulfillment: null } },
      { ...base, handmade: { ...base.handmade!, fulfillment: { kind: "in-stock", quantity: 0 } } },
      { ...base, ownerVerified: false },
    ];
    for (const v of variants) expect(isPurchasable(v)).toBe(false);
  });

  test("digital products can't launch until delivery exists", () => {
    site.shipping.flatRateCents = 500;
    const digital = complete(handmadeProducts.find((x) => x.slug === "home-organization-digital-kit")!);
    expect(isPurchasable({ ...digital, offer: { kind: "digital", priceCents: 900 } })).toBe(false);
  });
});

test.describe("pricing calculator", () => {
  test("break-even and target price", () => {
    const r = computePrice({ materials: 3, packaging: 1, minutes: 30, hourly: 20, feePct: 2.9, feeFixed: 0.3, profitPct: 30 });
    expect(r.labor).toBeCloseTo(10);
    expect(r.cost).toBeCloseTo(14);
    expect(r.breakEven).toBeCloseTo(14.3 / 0.971, 4);
    expect(r.target).toBeCloseTo(14.3 / 0.671, 4);
  });
  test("impossible margins return null instead of a nonsense price", () => {
    expect(computePrice({ materials: 1, packaging: 0, minutes: 0, hourly: 0, feePct: 50, feeFixed: 0, profitPct: 60 }).target).toBeNull();
  });
});
