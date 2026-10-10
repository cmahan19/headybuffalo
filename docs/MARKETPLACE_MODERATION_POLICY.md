# Marketplace moderation policy

## Principles
- Nothing goes live automatically. Every seller and every listing is reviewed by a person.
- The seller is responsible for accuracy; Heady Buffalo is responsible for not publishing what it can't stand behind.
- Moderation decisions are recorded in the audit log with a note.

## Prohibited products
Cosmetics and skincare, food and beverages, supplements, medical or health products, children's products
and toys, homemade cleaning chemicals or disinfectants, pesticides, candles without documented safety review,
weapons, anything requiring a license, counterfeit or unauthorized branded goods, and items the seller doesn't
own or have rights to sell.

## Prohibited claims (unless documented evidence is attached and approved)
Eco-friendly, sustainable, green, planet- or earth-friendly, biodegradable, compostable, recyclable,
plastic-free, zero or low waste, carbon neutral, organic, non-toxic, chemical-free, natural, cruelty-free,
vegan, hypoallergenic, antibacterial, "best seller", "#1", guarantees, health or safety outcomes. The claim
validator (`src/lib/claims.ts`) flags these automatically. A flagged listing can't be submitted without an
evidence entry, and the moderator must still pass claim review.

Acceptable evidence is specific and scoped: a certificate number with issuer, a lab or test report, a supplier
spec sheet for the exact material. The approved wording must match the evidence ("Made with certified organic
cotton (cert #…)", not "organic product").

## Images
- Real photos of the exact item, with photo rights confirmed by the seller
- No generated or stock images, watermarks, eco seals, or badges, and no people without a model release
- Image review must pass before approval

## Review checklist (moderator)
- [ ] Seller APPROVED and not suspended
- [ ] Required fields complete and plausible (price, inventory, shipping, returns)
- [ ] Claim review: no prohibited claims, or approved evidence matching the wording
- [ ] Image review passed
- [ ] Category allowed; not a prohibited product
- [ ] Decision recorded with a note (approve / request changes / reject)

## Reports and enforcement
- Buyer reports appear in Admin → Marketplace. Target a first response within 2 business days.
- Misleading claims: suspend the listing, request changes.
- Repeated or serious issues (prohibited items, IP violations, fraud): suspend the seller, which suspends all
  their listings.

## Staffing
At least one trained moderator with a backup. Review the queue daily during a pilot.
