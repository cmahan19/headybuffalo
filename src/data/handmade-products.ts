// Heady Buffalo products to sell, built from the 20 concepts in src/lib/concepts.ts.
//
// Every product is listed publicly as made to order ("Request this item") unless listing is "hidden".
// Add to cart turns on per product once its launch checklist is complete.
//
// HOW TO LAUNCH A PRODUCT FOR ONLINE CHECKOUT (see docs/LAUNCH_GUIDE.md):
//   1. Put real photos of the actual item in public/products/<slug>/ (e.g. 1.jpg, 2.jpg) and list them below.
//   2. Fill in price, materials, size, care, packed shipping weight, and fulfillment.
//   3. Make sure the shop shipping rate is set in src/lib/site.ts.
//   4. Set ownerVerified: true. The product goes live only when every checklist item is complete
//      (Admin → Launch board shows what's missing).
//
// Only enter facts you can stand behind: measured sizes, supplier-documented materials, care you have tested.
// No eco/health/safety claims. Never use generated art as a product photo.

import type { LaunchInfo, Product, ProductImage } from "../lib/catalog";
import { concepts } from "../lib/concepts";
import illustrations from "./product-illustrations.json";

interface OwnerInput extends LaunchInfo {
  /** "request" = listed as made to order (orders by request); "hidden" = not shown at all. */
  listing: "request" | "hidden";
  /** Your price in cents (e.g. 2400 = $24.00). Use the pricing calculator on the Admin → Launch board. */
  priceCents: number | null;
  ownerVerified: boolean;
  featured?: boolean;
}

const empty = (): OwnerInput => ({
  listing: "request",
  priceCents: null,
  photos: [],
  materials: null,
  size: null,
  care: null,
  shippingWeightOz: null,
  fulfillment: null,
  ownerVerified: false,
});

/** Photo helper: photo("hand-stamped-canvas-tote", "1.jpg", "Canvas tote with a navy buffalo stamp, front view") */
export const photo = (slug: string, file: string, alt: string, width = 1600, height = 1600): ProductImage => ({
  src: `/products/${slug}/${file}`,
  alt,
  width,
  height,
});

// ---------------------------------------------------------------------------------------------
// OWNER INPUT: one block per product. Edit the values; leave the keys alone.
// ---------------------------------------------------------------------------------------------
const launch: Record<string, OwnerInput> = {
  // Hand-made DIY products (recommended first: patches, totes, macramé, bookmarks)
  "embroidered-patch-set": { ...empty(), featured: true },
  "hand-stamped-canvas-tote": { ...empty(), featured: true },
  "macrame-plant-hanger": { ...empty(), featured: true },
  "pressed-flower-bookmarks": { ...empty(), featured: true },
  "rope-coil-basket": empty(),
  "hand-bound-notebook": empty(),
  "woven-wall-hanging": empty(),
  "painted-wood-coasters": empty(),
  "fabric-storage-bin": empty(),
  "jar-display-kit": empty(),
  "macrame-keychain": empty(),
  "braided-cord-bracelet": empty(),
  "block-printed-greeting-cards": empty(),
  "stamped-cotton-bandana": empty(),
  "embroidered-tea-towel": empty(),
  "fabric-scrunchie-set": empty(),
  "canvas-zipper-pouch": empty(),
  "painted-wood-ornaments": empty(),
  "pet-bandana": empty(),
  "hand-lettered-art-print": empty(),
  // Original product ideas
  "produce-bag-starter-set": empty(),
  "fold-up-tote-pouch": empty(),
  "pantry-label-kit": empty(),
  "refill-station-organizer": empty(),
  "utensil-straw-travel-pouch": empty(),
  "cloth-gift-wrap-set": empty(),
  "plant-label-organizer-kit": empty(),
  "beverage-sleeve-set": empty(),
  "home-organization-digital-kit": empty(),
  "everyday-routine-starter-bundle": empty(),
};
// ---------------------------------------------------------------------------------------------

const illustration = (slug: string) => illustrations.find((i) => i.slug === slug);

/** Recommended launch order (cheap to make, light to ship, low breakage). */
export const LAUNCH_PRIORITY = ["embroidered-patch-set", "hand-stamped-canvas-tote", "macrame-plant-hanger", "pressed-flower-bookmarks"];

export const handmadeProducts: Product[] = concepts
  .filter((c) => launch[c.id])
  .sort((a, b) => {
    const pa = LAUNCH_PRIORITY.indexOf(a.id);
    const pb = LAUNCH_PRIORITY.indexOf(b.id);
    return (pa === -1 ? 99 : pa) - (pb === -1 ? 99 : pb) || b.number - a.number;
  })
  .map((c): Product => {
    const o = launch[c.id];
    const hasPhoto = o.photos.length > 0;
    const ill = illustration(c.id);
    const digital = c.formats.length === 1 && c.formats[0] === "digital product";
    return {
      slug: c.id,
      name: c.publicName,
      category: c.category,
      summary: c.publicDescription,
      image: hasPhoto
        ? o.photos[0]
        : { src: ill?.file ?? "/logo.png", alt: `Illustration of the ${c.publicName.toLowerCase()}`, width: 1200, height: 1200 },
      imageIsPlaceholder: !hasPhoto,
      listing: o.listing,
      offer: { kind: digital ? "digital" : "own", priceCents: o.priceCents },
      handmade: {
        photos: o.photos,
        materials: o.materials,
        size: o.size,
        care: o.care,
        shippingWeightOz: o.shippingWeightOz,
        fulfillment: o.fulfillment,
      },
      ownerVerified: o.ownerVerified,
      featured: o.featured,
    };
  });
