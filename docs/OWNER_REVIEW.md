# Owner review checklist

The site is built so it **won't sell anything or make any product claim until you confirm it**.
Work through this list, then edit the files named in each step.

## 1. Before any product can be sold (blocking)

Every product is currently `ownerVerified: false` in [`src/lib/catalog.ts`](../src/lib/catalog.ts).
Unverified products are **not shown anywhere on the live site**: no page, no listing, no sitemap
entry. Collections with no published products are hidden too. To preview drafts locally, run with
`SHOW_DRAFT_PRODUCTS=true` (never in production). For each product:

- [ ] **Is it real, and does Heady Buffalo sell it (or have rights to sell it)?** If not, remove it.
- [ ] **Name.** The old site used different names in different places. For example, product #1 was both
      "Ashley Cosmetics It Girl Glow oil" and "Organic Labrador Dog Food", and three items were labeled
      "Ashley Cosmetics". If any product is made by another brand, confirm you're an authorized reseller
      or set it up as an affiliate product (see section 4).
- [ ] **Price.** The old data disagreed. Current values use the product-page price:

      | Product | Current price | Other value found in old code |
      | --- | --- | --- |
      | Dog Food | $40.00 | "sale" $32.00 |
      | Mouthwash Tablets | $15.00 | $35.00 (sale $28.00) |
      | Dishwasher Pods | $17.99 | "sale" $14.99 / "15% off" |
      | Bar Soap | $15.99 | "sale" $12.99 |
      | Lip & Cheek Tint | $15.99 | "sale" $12.99 |
      | Laundry Soap | $17.99 | "sale" $13.99 / "10% off" |

      All "sale" prices, percent-off badges, and "subscription prices" were removed because they weren't
      real offers. Add a sale only if you actually sold the item at the higher price first.
- [ ] **Product photos. This is the most important item.** The current images are AI-generated mockups.
      The printed packaging shows claims like **"ORGANIC"**, **"BIODEGRADABLE"**, and
      **"SUSTAINABLE & PLANET-FRIENDLY"**, and has misspelled text. A photo of a label counts as a claim.
      Replace them with photos of the real product before selling, unless you can document each claim
      (for example, USDA Organic certification, or biodegradability test results with the conditions tested).
- [ ] **Details (optional).** Add size, ingredients, materials, and directions to `details` only from
      the real label or spec sheet.
- [ ] Then set `ownerVerified: true`.

## 2. Claims removed from the old site

These appeared on the old site and were removed because nothing in the code or business data
backs them up. Add any of them back only with documentation you can show a regulator:

- "Made with 100% recycled materials"
- "Supporting local artisans and small businesses"
- "Every purchase helps fund environmental initiatives" and "charity-giving"
- "Eco-friendly packaging and carbon-conscious shipping"
- "Organic", "biodegradable", "plant-based", "natural ingredients", "premium", "handcrafted"
- Star ratings and review counts (4.5–4.9 stars, 75–150 reviews): **fake**
- Two customer testimonials ("Sarah", "Jason"): **fake**
- "30-day returns" and "track your order in your account" (no account system exists)

General eco wording ("eco-friendly", "sustainable", "green") is risky under the FTC Green Guides unless
it's qualified and substantiated. The site now calls the *shop* "eco-minded". That describes your
intent, not a product benefit.

## 3. Brand assets

- [ ] **Logo.** `public/logo.png` is actually a JPEG with a black background. Please supply a
      transparent SVG or PNG.
- [ ] **Real photography.** All current lifestyle images (hero, category, and about images) are
      AI-generated and are no longer used. The site shows a branded logo graphic instead. Photos of
      your real products, workspace, or team can replace it.

## 4. Policies and business info

- [ ] **Shipping & returns.** Add real text to `site.policies.shippingAndReturns` in
      [`src/lib/site.ts`](../src/lib/site.ts). Include costs, carriers or timing, return window,
      condition requirements, and who pays return shipping. Until then, the page tells customers to call.
- [ ] **Terms of sale.** Add to `site.policies.terms`, ideally reviewed by a lawyer.
- [ ] **Privacy policy** ([`src/app/privacy-policy/page.tsx`](../src/app/privacy-policy/page.tsx))
      describes what the code does today. Have it reviewed, and update it before adding analytics,
      ad pixels, or email marketing.
- [ ] **Shipping countries.** Checkout accepts US addresses only (`site.shippingCountries`).
- [ ] **Social links.** Confirm the Facebook, Instagram, and X accounts `/HeadyBuffalo` exist and are yours.
- [ ] **Phone (888) 509-8502** is live across the site. Make sure it's answered, or has voicemail,
      during the hours customers will call.
- [ ] **Support email (optional).** Set `NEXT_PUBLIC_SUPPORT_EMAIL`. The old site listed
      `support@headybuffalo.com`. Only use it if that inbox exists.
- [ ] **About page.** Add your real founding story and any commitments you can back up.

## 5. Adding affiliate or partner products

In `catalog.ts`, set `offer: { kind: "external", url, merchant, relationship }`. Use
`relationship: "affiliate"` only if you are in that partner's commission program, and `"partner"` for
curated items with no commission. The site then:

- shows a **Curated partner product** label and a "View partner product at {merchant}" button with
  `rel="sponsored noopener noreferrer"` (never Add to cart),
- shows a disclosure next to the button whose wording matches the relationship, linked to
  `/affiliate-disclosure`.

Only list partner programs you've actually been accepted into. Don't state commission rates publicly.

## 6. Go-live configuration

Copy `.env.example` to `.env.local` locally, and add the same values in your host's settings:

- [ ] `STRIPE_SECRET_KEY`: until this is set, checkout shows "unavailable, please call".
- [ ] Stripe webhook pointing to `https://headybuffalo.com/api/stripe/webhook`, plus `STRIPE_WEBHOOK_SECRET`.
      Order fulfillment isn't automated yet. See the `OWNER-REVIEW` note in that file.
- [ ] Stripe Dashboard → Settings → Customer emails → turn on **successful payments** receipts.
      The order confirmation page says a receipt will be emailed.
- [ ] SMTP settings for the contact form (`SMTP_*`, `CONTACT_TO_EMAIL`). Send a test message.
- [ ] Submit `https://headybuffalo.com/sitemap.xml` in Google Search Console.
