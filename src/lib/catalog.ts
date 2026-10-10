import { handmadeProducts } from "../data/handmade-products";
import { flags } from "./flags";
import { site } from "./site";

// Single source of truth for products and categories.
//
// Rules for editing this file (see docs/OWNER_REVIEW.md and docs/LAUNCH_GUIDE.md):
// - Only record facts the business can substantiate. No invented ingredients, materials,
//   certifications, eco/health claims, ratings, reviews, discounts, or stock levels.
// - `ownerVerified` stays false until the owner has confirmed every field AND supplied an accurate,
//   authorized photo. Unverified (draft) products are not rendered anywhere public: no listing,
//   no route, no sitemap. Set SHOW_DRAFT_PRODUCTS=true locally to preview them (never in production).
// - Handmade products (src/data/handmade-products.ts) also need a complete launch checklist
//   (price, real photos, materials, size, care, shipping weight, fulfillment, shop shipping rate).
// - External products use `offer.kind = "external"`. They are never added to the cart; the UI labels
//   them, links out with rel="sponsored noopener noreferrer", and shows a disclosure next to the CTA.

export type CategorySlug = "cleaning" | "beauty" | "pet-products" | "craft" | "home" | "gifts" | "carry";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  /** Optional owner-approved collection photo. Without one, the collection's generated banner art is used. */
  image?: { src: string; alt: string; width: number; height: number };
}

export type Offer =
  | { kind: "own"; priceCents: number | null }
  | { kind: "digital"; priceCents: number | null }
  | {
      kind: "external";
      url: string;
      merchant: string;
      /** "affiliate" = we may earn a commission; "partner" = curated, no commission. */
      relationship: "affiliate" | "partner";
      priceCents?: number;
    };

export interface ProductImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

/** Owner-supplied launch details for products the business makes. Every field starts empty. */
export interface LaunchInfo {
  /** Real photos of the actual item (public/products/<slug>/…). Never generated art. */
  photos: ProductImage[];
  /** As documented by the supplier or maker, e.g. "Cotton canvas tote; water-based textile ink". */
  materials: string | null;
  /** Measured finished size, e.g. "15 x 16 in, 22 in handles". */
  size: string | null;
  /** Tested care instructions, e.g. "Hand wash cold, line dry". */
  care: string | null;
  /** Packed shipping weight in ounces (needed for shipping costs). */
  shippingWeightOz: number | null;
  fulfillment:
    | { kind: "made-to-order"; leadTimeBusinessDays: number | null }
    | { kind: "in-stock"; quantity: number | null }
    | null;
}

export interface Product {
  slug: string;
  /** Legacy numeric id from the previous site. */
  legacyId?: string;
  name: string;
  category: CategorySlug;
  /** Plain description with no unverified claims. */
  summary: string;
  /** Primary image. Handmade products show an illustration until a real photo is added. */
  image: ProductImage;
  /** True when `image` is an illustration rather than a photo of the actual item. */
  imageIsPlaceholder?: boolean;
  /**
   * How a handmade product is offered while it isn't checkout-ready:
   * "request" = listed publicly as made to order, ordered through a request (contact form or phone);
   * "hidden" = not shown. Products become cart-purchasable once their launch checklist is complete.
   */
  listing?: "request" | "hidden";
  offer: Offer;
  /** Owner-supplied facts (size, ingredients, materials, usage). Rendered only when present. */
  details?: { label: string; value: string }[];
  /** Present for products the business makes by hand. */
  handmade?: LaunchInfo;
  ownerVerified: boolean;
  featured?: boolean;
}

/** Local preview of draft products. Server-only env var, so it is always false in client bundles. */
export const showDrafts = process.env.SHOW_DRAFT_PRODUCTS === "true";

export const categories: Category[] = [
  { slug: "craft", name: "Craft & Patches", description: "Embroidered patches, hand-bound notebooks, and craft kits, made by hand to order." },
  { slug: "home", name: "Home", description: "Macramé, woven wall pieces, rope baskets, and towels for the rooms you live in." },
  { slug: "gifts", name: "Gifts", description: "Cards, bookmarks, ornaments, and sets that are easy to give." },
  { slug: "carry", name: "Totes & Carry", description: "Stamped totes, pouches, bandanas, and keychains for days out." },
  {
    slug: "cleaning",
    name: "Home Cleaning",
    description: "Laundry and dish essentials for everyday cleaning routines.",
  },
  {
    slug: "beauty",
    name: "Beauty & Personal Care",
    description: "Bar soap, color, and oral care for your daily routine.",
  },
  {
    slug: "pet-products",
    name: "Pet",
    description: "Everyday essentials for the animals in your life.",
  },
];

const square = { width: 1024, height: 1024 };

// OWNER-REVIEW: every product below came from the previous site's placeholder data, which
// contained conflicting names and prices. Nothing here is verified yet — see docs/OWNER_REVIEW.md.
const legacyProducts: Product[] = [
  {
    slug: "laundry-soap",
    legacyId: "6",
    name: "Laundry Soap",
    category: "cleaning",
    summary: "Heady Buffalo laundry soap for everyday washing.",
    image: { src: "/buffaloLaundrySoap.webp", alt: "Heady Buffalo laundry soap package", ...square },
    offer: { kind: "own", priceCents: 1799 },
    ownerVerified: false,
    featured: true,
  },
  {
    slug: "dishwasher-pods",
    legacyId: "3",
    name: "Dishwasher Pods",
    category: "cleaning",
    summary: "Heady Buffalo dishwasher pods for automatic dishwashers.",
    image: { src: "/dishwasherPods.webp", alt: "Heady Buffalo dishwasher pods", ...square },
    offer: { kind: "own", priceCents: 1799 },
    ownerVerified: false,
    featured: true,
  },
  {
    slug: "bar-soap",
    legacyId: "4",
    name: "Bar Soap",
    category: "beauty",
    summary: "Heady Buffalo bar soap.",
    image: { src: "/barSoap.webp", alt: "Heady Buffalo bar soap", ...square },
    offer: { kind: "own", priceCents: 1599 },
    ownerVerified: false,
    featured: true,
  },
  {
    slug: "lip-and-cheek-tint",
    legacyId: "5",
    name: "Lip & Cheek Tint",
    category: "beauty",
    summary: "A multi-use tint for lips and cheeks.",
    image: { src: "/buffaloLipCheek.webp", alt: "Heady Buffalo lip and cheek tint", ...square },
    offer: { kind: "own", priceCents: 1599 },
    ownerVerified: false,
    featured: true,
  },
  {
    slug: "mouthwash-tablets",
    legacyId: "2",
    name: "Mouthwash Tablets",
    category: "beauty",
    summary: "Heady Buffalo mouthwash tablets.",
    image: { src: "/mouthWashTabs.webp", alt: "Tin of Heady Buffalo mouthwash tablets", ...square },
    offer: { kind: "own", priceCents: 1500 },
    ownerVerified: false,
    featured: true,
  },
  {
    slug: "dog-food",
    legacyId: "1",
    name: "Dog Food",
    category: "pet-products",
    summary: "Heady Buffalo dog food.",
    image: { src: "/BuffdogFood.webp", alt: "Bag of Heady Buffalo dog food", ...square },
    offer: { kind: "own", priceCents: 4000 },
    ownerVerified: false,
    featured: true,
  },
];

export const products: Product[] = [...handmadeProducts, ...legacyProducts];

/** Shop-level shipping is configured when a flat rate is set in src/lib/site.ts. */
export const shippingConfigured = () => site.shipping.flatRateCents !== null;

export interface LaunchCheck {
  key: string;
  label: string;
  done: boolean;
}

/** Launch checklist for handmade products. Empty for other products (they use ownerVerified only). */
export function launchChecklist(p: Product): LaunchCheck[] {
  const h = p.handmade;
  if (!h) return [];
  const price = p.offer.kind !== "external" ? p.offer.priceCents : null;
  const f = h.fulfillment;
  return [
    { key: "price", label: "Price set", done: price !== null && price > 0 },
    { key: "photos", label: "At least one real photo of the actual item", done: h.photos.length > 0 && !p.imageIsPlaceholder },
    { key: "materials", label: "Materials (as documented)", done: Boolean(h.materials?.trim()) },
    { key: "size", label: "Measured size", done: Boolean(h.size?.trim()) },
    { key: "care", label: "Tested care instructions", done: Boolean(h.care?.trim()) },
    { key: "weight", label: "Packed shipping weight", done: h.shippingWeightOz !== null && h.shippingWeightOz > 0 },
    {
      key: "fulfillment",
      label: "Made-to-order lead time or in-stock quantity",
      done:
        f !== null &&
        (f.kind === "made-to-order" ? f.leadTimeBusinessDays !== null && f.leadTimeBusinessDays > 0 : f.quantity !== null && f.quantity > 0),
    },
    { key: "shipping", label: "Shop shipping rate set (src/lib/site.ts)", done: shippingConfigured() },
    { key: "approval", label: "Owner approval (ownerVerified: true)", done: p.ownerVerified },
    // Digital products need a delivery method, which doesn't exist yet.
    ...(p.offer.kind === "digital" ? [{ key: "delivery", label: "Digital download delivery connected", done: false }] : []),
  ];
}

export function isLaunchReady(p: Product) {
  return launchChecklist(p).every((c) => c.done);
}

export function isPublished(p: Product) {
  // External (partner/affiliate) offers additionally require AFFILIATE_PRODUCTS_ENABLED.
  if (p.offer.kind === "external" && !flags.AFFILIATE_PRODUCTS_ENABLED) return false;
  if (showDrafts) return true;
  // Handmade products listed for request are public (made to order); everything else needs full launch.
  if (p.handmade && p.listing === "request") return true;
  return p.ownerVerified && isLaunchReady(p);
}

/** Listed publicly but ordered by request (no checkout yet). */
export const isRequestOnly = (p: Product) => Boolean(p.handmade) && !isPurchasable(p) && isPublished(p);

/** Products visible on the public site. */
export function publishedProducts() {
  return products.filter(isPublished);
}

/** Looks up a product by slug regardless of status (cart/checkout re-check purchasability). */
export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getPublishedProduct(slug: string) {
  const p = getProduct(slug);
  return p && isPublished(p) ? p : undefined;
}

export function productsInCategory(slug: CategorySlug) {
  return publishedProducts().filter((p) => p.category === slug);
}

/** Categories with at least one published product. Empty collections are never shown. */
export function publishedCategories() {
  return categories.filter((c) => productsInCategory(c.slug).length > 0);
}

export function getPublishedCategory(slug: string) {
  return publishedCategories().find((c) => c.slug === slug);
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

/** Can this product be added to the cart and sold through Stripe Checkout? */
export function isPurchasable(p: Product): p is Product & { offer: { kind: "own" | "digital"; priceCents: number } } {
  return (
    p.ownerVerified &&
    p.offer.kind !== "external" &&
    p.offer.priceCents !== null &&
    p.offer.priceCents > 0 &&
    isLaunchReady(p)
  );
}

export function displayPriceCents(p: Product): number | undefined {
  return p.offer.priceCents ?? undefined;
}

export function searchProducts(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return publishedProducts().filter((p) => {
    const cat = getCategory(p.category)?.name ?? "";
    return [p.name, p.summary, cat].some((s) => s.toLowerCase().includes(q));
  });
}

export function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}
