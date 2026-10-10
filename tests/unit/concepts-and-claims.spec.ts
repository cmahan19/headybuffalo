import { existsSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import manifest from "../../src/lib/art-manifest.json";
import { isPublished, isPurchasable, products } from "../../src/lib/catalog";
import { findClaims } from "../../src/lib/claims";
import { CONCEPT_LABELS, concepts } from "../../src/lib/concepts";

test.describe("product concepts", () => {
  test("exactly 30 products with unique ids and numbers 1-30", () => {
    expect(concepts).toHaveLength(30);
    expect(new Set(concepts.map((c) => c.id)).size).toBe(30);
    expect(concepts.map((c) => c.number).sort((a, b) => a - b)).toEqual(Array.from({ length: 30 }, (_, i) => i + 1));
  });

  test("the original 10 requested concepts are present", () => {
    const names = concepts.map((c) => c.internalName.toLowerCase());
    for (const key of ["produce-bag", "tote", "pantry label", "refill-station", "utensil and straw", "gift-wrap", "plant-label", "beverage-sleeve", "digital kit", "starter bundle"]) {
      expect(names.some((n) => n.includes(key)), key).toBe(true);
    }
  });

  test("concepts carry no price, stock, or rating fields and start as concept-only", () => {
    for (const c of concepts) {
      const keys = Object.keys(c);
      for (const banned of ["price", "priceCents", "offer", "inventory", "stock", "rating", "reviews"]) expect(keys).not.toContain(banned);
      expect(["IDEA_ONLY", "CONCEPT_ONLY"]).toContain(c.initialStatus);
    }
  });

  test("public concept copy has no unsupported claims (strict concept mode)", () => {
    for (const c of concepts) {
      const text = `${c.publicName} ${c.publicDescription}`;
      expect(findClaims(text, { concept: true }), `${c.id}: ${text}`).toEqual([]);
    }
    for (const label of Object.values(CONCEPT_LABELS)) expect(findClaims(label, { concept: true })).toEqual([]);
  });

  test("every product is listed for request but not checkout-ready until launched", () => {
    for (const c of concepts) {
      const p = products.find((x) => x.slug === c.id);
      expect(p, c.id).toBeDefined();
      expect(isPublished(p!), c.id).toBe(true);
      expect(isPurchasable(p!), c.id).toBe(false);
    }
  });

  test("every concept has a generated abstract background registered", () => {
    for (const c of concepts) {
      const a = manifest.find((m) => m.id === c.backgroundId);
      expect(a?.kind).toBe("concept-background");
    }
  });
});

test.describe("claim validator", () => {
  test("flags broad environmental, health, and marketing claims", () => {
    expect(findClaims("An eco-friendly, non-toxic, biodegradable best seller").map((m) => m.term)).toEqual([
      "eco-friendly",
      "non-toxic",
      "biodegradable",
      "best seller",
    ]);
  });
  test("does not flag neutral copy or substrings", () => {
    expect(findClaims("A colorful fabric pouch for errands. Greenish-blue print.")).toEqual([]);
    expect(findClaims("organized shelves")).toEqual([]);
  });
  test("concept mode also blocks unproven material claims", () => {
    expect(findClaims("A reusable bag", { concept: true }).map((m) => m.term)).toEqual(["reusable"]);
    expect(findClaims("A reusable bag")).toEqual([]);
  });
});

test.describe("generated art", () => {
  test("at least 8 generated decorative assets exist on disk with required metadata", () => {
    expect(manifest.length).toBeGreaterThanOrEqual(8);
    const kinds = new Set(manifest.map((m) => m.kind));
    for (const k of ["hero-background", "collection-banner", "glow", "concept-background", "social-background"]) {
      expect(kinds.has(k), k).toBe(true);
    }
    expect(manifest.filter((m) => m.kind === "collection-banner").length).toBeGreaterThanOrEqual(4);
    expect(manifest.filter((m) => m.kind === "concept-background")).toHaveLength(20);
    for (const m of manifest) {
      expect(existsSync(join(process.cwd(), "public", m.file)), m.file).toBe(true);
      expect(m.source).toBe("generated");
      expect(m.decorative_only).toBe(true);
      expect(m.product_proof).toBe(false);
      expect(m.purpose.length).toBeGreaterThan(5);
      expect(m.routes.length).toBeGreaterThan(0);
      expect(m.width).toBeGreaterThan(0);
      expect(m.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  test("illustrations and generated art only appear as flagged placeholders on products that can't be checked out", () => {
    for (const p of products) {
      if (p.image.src.startsWith("/art/") || p.image.src.includes("/illustrations/")) {
        expect(p.imageIsPlaceholder, p.slug).toBe(true);
        expect(isPurchasable(p), p.slug).toBe(false);
      }
      for (const photo of p.handmade?.photos ?? []) expect(photo.src.startsWith("/art/"), p.slug).toBe(false);
    }
  });
});

test.describe("hand-made DIY concepts", () => {
  test("products 11-30 are hand-made DIY products with complete build guides", () => {
    const diy = concepts.filter((c) => c.number > 10);
    expect(diy).toHaveLength(20);
    for (const c of diy) {
      expect(c.isDiy, c.id).toBe(true);
      expect(c.diy, c.id).toBeDefined();
      expect(c.diy!.materials.length, c.id).toBeGreaterThan(0);
      expect(c.diy!.tools.length, c.id).toBeGreaterThan(0);
      expect(c.diy!.steps.length, c.id).toBeGreaterThanOrEqual(3);
      expect(c.diy!.safety.length, c.id).toBeGreaterThan(0);
    }
  });

  test("no excluded categories (cosmetics, food, cleaners, candles, children's products)", () => {
    const banned = /soap|lotion|balm|cosmetic|candle|cleaner|detergent|food|snack|supplement|toy for|children's|kids'/i;
    for (const c of concepts) expect(`${c.internalName} ${c.publicDescription}`, c.id).not.toMatch(banned);
  });
});

test("art metadata and concept copy never use the old style name", () => {
  const text = JSON.stringify(manifest) + JSON.stringify(concepts);
  expect(text).not.toMatch(/tie.?dye/i);
});
