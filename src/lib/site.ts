// Site-wide configuration. Anything marked OWNER-REVIEW must be confirmed by the
// business owner before launch — see docs/OWNER_REVIEW.md.

const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://headybuffalo.com";

export const site = {
  name: "Heady Buffalo",
  url: rawUrl.replace(/\/+$/, ""),
  tagline: "Handmade goods for everyday living",
  description:
    "Handmade patches, stamped totes, macramé, cards, and home goods, made to order by Heady Buffalo. Request a piece online or call (888) 509-8502.",
  logo: "/logo.png",
  locale: "en_US",

  // Customer phone line, used as the primary call-to-action across the site.
  phone: {
    display: "(888) 509-8502",
    href: "tel:+18885098502",
    e164: "+1-888-509-8502",
  },

  // Public support inbox. Mail to any @headybuffalo.com address is forwarded by SES to the owner's inbox.
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "hello@headybuffalo.com",

  // OWNER-REVIEW: confirm each account exists and is owned by the business.
  social: [
    { label: "Facebook", href: "https://www.facebook.com/HeadyBuffalo" },
    { label: "Instagram", href: "https://www.instagram.com/HeadyBuffalo" },
    { label: "X (Twitter)", href: "https://twitter.com/HeadyBuffalo" },
  ],

  // OWNER-REVIEW: shipping charged at checkout. Handmade products can't launch until flatRateCents is set.
  // Example: flatRateCents: 595 charges $5.95 per order; freeOverCents: 7500 makes orders of $75+ ship free.
  shipping: {
    flatRateCents: null as number | null,
    freeOverCents: null as number | null,
    label: "Standard shipping",
  },

  // OWNER-REVIEW: countries Stripe Checkout will accept shipping addresses for.
  shippingCountries: ["US"] as const,

  // OWNER-REVIEW: paste the business's real policy text here (plain paragraphs).
  // While a value is null, the page shows an honest interim notice and is excluded from search.
  policies: {
    shippingAndReturns: null as string[] | null,
    terms: null as string[] | null,
  },
};

export function absoluteUrl(path = "/") {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
