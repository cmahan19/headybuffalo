# Affiliate and partner plan

**Status: built, OFF.** `AFFILIATE_PRODUCTS_ENABLED=false`, and there are no partner products in the catalog.

## Source types
`FIRST_PARTY` (Heady Buffalo sells it) · `MARKETPLACE_SELLER` (independent seller) · `PARTNER` (curated,
no commission) · `AFFILIATE` (we may earn a commission). External items use
`offer: { kind: "external", url, merchant, relationship: "affiliate" | "partner" }` in `src/lib/catalog.ts`.

## Behavior (code)
- External items are **never** purchasable or cartable (`isPurchasable` is false; checkout rejects them).
- They're hidden unless the flag is on **and** the product is owner-verified.
- The card is labeled "Curated partner product". The CTA reads "View partner product at {merchant}" and uses
  `rel="sponsored noopener noreferrer"`.
- The disclosure sits right next to the CTA, not only in the footer:
  - affiliate: "Affiliate disclosure: Heady Buffalo may earn a commission if you purchase through this partner link."
  - partner: "This is a curated partner product. It is sold and shipped by the partner, not by Heady Buffalo."
- Clicks go through `/go/[slug]`. It redirects **only** to the stored https URL for that product (no open
  redirect) and records a click event (time, product, merchant, referring path; no personal data). **Sales
  are never recorded** without verified partner conversion data.
- `checkLink()` in `src/lib/affiliate.ts` provides HEAD/GET health checks for admin use.
- Admin → Subscriptions & affiliates lists external offers and click counts. Commission data is never public.

## Partner selection criteria
Relevant to the shop; a durable, well-documented product; a reputable merchant with clear shipping and returns;
the program terms allow our use; we'd recommend it without a commission.

## Before listing any partner product
- [ ] Program acceptance confirmed (for affiliate), terms saved
- [ ] Destination URL verified (https) and link health check passing
- [ ] Image rights: partner-provided asset or written permission (no scraped images)
- [ ] Description written by us or licensed from the partner (no copied copy)
- [ ] Price display policy: show a price only if it can be kept current, otherwise omit it
- [ ] Claim review: no unsupported environmental or performance claims, including claims copied from the merchant
- [ ] `relationship` set truthfully; disclosure renders next to the CTA
- [ ] Expiration or availability re-check scheduled (monthly)

## High-ticket items (home systems, outdoor gear, furniture, tools)
Extra review of warranty terms and return windows, a price that stays accurate, and specifications taken from
the manufacturer's documentation (not marketing copy). No savings or efficiency claims without published data.

## Analytics
Track `affiliate_outbound_click` only. Revenue comes from partner dashboards and is reconciled manually. Never
estimate commissions on the site.

## Legal and tax
FTC endorsement guides (clear, conspicuous, proximate disclosure). Affiliate income is reportable; talk to your
accountant. Check each program's rules on paid ads, coupon sites, and email use.
