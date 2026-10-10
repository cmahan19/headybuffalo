// Feature flags. Every flag defaults to OFF and is only enabled by an explicit "true" env value.
// Server-only (no NEXT_PUBLIC_ prefix), so client bundles always see them as off.

const on = (v: string | undefined) => v === "true";

export const flags = {
  /** Recurring billing. Must stay off until a real provider, products, pricing, and policies exist. */
  SUBSCRIPTIONS_ENABLED: on(process.env.SUBSCRIPTIONS_ENABLED),
  /** Publishes verified external (affiliate/partner) products. */
  AFFILIATE_PRODUCTS_ENABLED: on(process.env.AFFILIATE_PRODUCTS_ENABLED),
  /** Seller applications, storefronts, and seller listings. */
  MARKETPLACE_ENABLED: on(process.env.MARKETPLACE_ENABLED),
  /** Real email-list signup. Requires a connected provider (none today). */
  NEWSLETTER_ENABLED: on(process.env.NEWSLETTER_ENABLED) && Boolean(process.env.NEWSLETTER_PROVIDER_URL),
} as const;

/** Legacy concept showcase (/ideas). Retired: products are listed in the shop as made to order instead. */
export const showConceptShowcase = process.env.CONCEPT_SHOWCASE === "true";

export type FlagName = keyof typeof flags;
