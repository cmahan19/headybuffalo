// Color Map: each collection gets a consistent color family, used for banners, accents, and art.
// A color family is purely visual. It never implies a claim ("green" ≠ eco, etc.), and family names
// are internal: public collection names come from src/lib/catalog.ts.

export type ColorFamilyKey = "home" | "personal-care" | "pet" | "craft" | "refill" | "outdoor" | "gifts" | "partner";

export interface ColorFamily {
  /** Vivid hues for gradients and art (CSS custom property names without the `--hb-` prefix). */
  art: [string, string, string];
  /** Solid fill that carries white text at >= 4.5:1. */
  solid: string;
  /** Text-safe accent for headings/links on cream or white. */
  text: string;
  /** Tailwind classes for the common uses, kept here so contrast-safe pairings are reused. */
  classes: { solid: string; text: string; tint: string };
}

export const colorFamilies: Record<ColorFamilyKey, ColorFamily> = {
  home: {
    art: ["cobalt", "aqua", "blue"],
    solid: "cobalt",
    text: "blue-deep",
    classes: { solid: "bg-hb-cobalt text-white", text: "text-hb-blue-deep", tint: "bg-hb-aqua/15" },
  },
  "personal-care": {
    art: ["coral", "pink", "yellow"],
    solid: "berry",
    text: "pink-deep",
    classes: { solid: "bg-hb-berry text-white", text: "text-hb-pink-deep", tint: "bg-hb-coral/15" },
  },
  pet: {
    art: ["teal", "lime", "violet"],
    solid: "teal-deep",
    text: "teal-deep",
    classes: { solid: "bg-hb-teal-deep text-white", text: "text-hb-teal-deep", tint: "bg-hb-lime/20" },
  },
  craft: {
    art: ["orange", "yellow", "coral"],
    solid: "orange-deep",
    text: "orange-deep",
    classes: { solid: "bg-hb-orange-deep text-white", text: "text-hb-orange-deep", tint: "bg-hb-yellow/25" },
  },
  refill: {
    art: ["teal", "lime", "aqua"],
    solid: "teal-deep",
    text: "teal-deep",
    classes: { solid: "bg-hb-teal-deep text-white", text: "text-hb-teal-deep", tint: "bg-hb-aqua/15" },
  },
  outdoor: {
    art: ["lime", "coral", "teal"],
    solid: "lime-deep",
    text: "lime-deep",
    classes: { solid: "bg-hb-lime-deep text-white", text: "text-hb-lime-deep", tint: "bg-hb-lime/20" },
  },
  gifts: {
    art: ["pink", "violet", "coral"],
    solid: "violet-deep",
    text: "violet-deep",
    classes: { solid: "bg-hb-violet-deep text-white", text: "text-hb-violet-deep", tint: "bg-hb-violet/15" },
  },
  partner: {
    art: ["indigo", "yellow", "violet"],
    solid: "indigo",
    text: "violet-deep",
    classes: { solid: "bg-hb-charcoal text-white", text: "text-hb-violet-deep", tint: "bg-hb-yellow/25" },
  },
};

/** Current catalog collections → color family. */
export const collectionColors: Record<string, ColorFamilyKey> = {
  craft: "craft",
  home: "home",
  gifts: "gifts",
  carry: "refill",
  cleaning: "home",
  beauty: "personal-care",
  "pet-products": "pet",
};

export function familyFor(collectionSlug: string): ColorFamily {
  return colorFamilies[collectionColors[collectionSlug] ?? "home"];
}

/** Generated banner art for each color family (ids in src/lib/art-manifest.json). */
const familyBanners: Record<ColorFamilyKey, string> = {
  home: "banner-home",
  "personal-care": "banner-personal-care",
  pet: "banner-pet",
  craft: "banner-craft",
  refill: "banner-carry",
  outdoor: "banner-carry",
  gifts: "banner-gifts",
  partner: "banner-gifts",
};

export function collectionBanner(collectionSlug: string): string {
  return familyBanners[collectionColors[collectionSlug] ?? "home"];
}
