# Marketplace seller plan

**Status: built, OFF.** `MARKETPLACE_ENABLED=false`. Seller routes return 404, and money-moving providers
are mocks that refuse to run. See [MARKETPLACE_LAUNCH_REQUIREMENTS.md](MARKETPLACE_LAUNCH_REQUIREMENTS.md)
before turning it on.

## What exists in code

| Piece | Where |
| --- | --- |
| Roles (BUYER, SELLER_APPLICANT, SELLER, SELLER_MANAGER, MARKETPLACE_MODERATOR, MARKETPLACE_ADMIN, SUPER_ADMIN) and server-side permission checks | `src/lib/marketplace/types.ts`, `permissions.ts` |
| Seller application (public, when enabled): store name, contact, categories, ownership confirmation, terms and seller-policy acceptance, honeypot | `/sell/apply`, `src/app/sell/actions.ts` |
| Seller approval workflow: PENDING_REVIEW → APPROVED / REJECTED; APPROVED ↔ SUSPENDED. Never automatic; requires accepted agreements. | `transitionSeller` in `src/lib/marketplace/listings.ts`; Admin → Marketplace |
| Seller dashboard with listing drafts and submission | `/seller` (admin preview until seller accounts exist) |
| Listing workflow: DRAFT → PENDING_REVIEW → ACTIVE / CHANGES_REQUESTED / REJECTED; ACTIVE → SUSPENDED | `transitionListing` |
| Required listing data: title, category, description, material details, real photo, photo-rights confirmation, price, inventory, shipping method, return policy, safety info, and claim evidence whenever the copy makes a claim | `validateListingForSubmission` |
| Claim review, image review, and moderator decisions | Admin → Marketplace moderation queue |
| Automated claim screening | `findClaims` via `ProductModerationProvider` (mock) |
| Seller storefront (APPROVED sellers, ACTIVE listings only; "Material details provided by the seller"; seller shipping and returns) | `/makers`, `/makers/[slug]` |
| Buyer report and resolution | report form on storefront; Admin → Marketplace |
| Seller suspension (also suspends that seller's ACTIVE listings) | Admin → Marketplace |
| Audit events for every status change | `store.audit`, shown in admin |
| Fee configuration: `platform_fee_percent = null`, `platform_fee_status = REQUIRES_OWNER_CONFIGURATION`. Supports percent, fixed, category, and plan override. Activation requires a checkbox plus the typed phrase "CONFIRM FEES". | `src/lib/marketplace/fees.ts`; Admin → Marketplace |
| Provider abstractions: MarketplacePaymentProvider, SellerPayoutProvider, MarketplaceTaxProvider, SellerVerificationProvider, ProductModerationProvider, SellerShippingProvider | `src/lib/marketplace/providers.ts` (mocks) |

## What's intentionally missing, and why

- **Seller logins.** These need the database/auth decision (see `COLORFUL_MARKETPLACE_AUDIT.md` §6).
  Until then only an admin can operate `/seller`.
- **Persistence at scale.** Admin data is a JSON file (`HB_DATA_DIR`). It works on a server with a disk,
  not on read-only serverless hosts, where the UI says so. Move to Postgres before launch.
- **Payments, payouts, tax, and 1099s.** These need Stripe Connect (or similar), a seller agreement, and
  accountant review.
- **Seller ratings or reviews.** None exist, and none may be invented.

## Enabling for a private pilot

1. Complete the launch requirements checklist.
2. Set `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` (long random), and `MARKETPLACE_ENABLED=true`, then rebuild.
3. Approve a test seller, create a draft, submit it, pass claim and image review, then approve it.
