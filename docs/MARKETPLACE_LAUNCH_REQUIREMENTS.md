# Marketplace launch requirements

Don't set `MARKETPLACE_ENABLED=true` in production until every item is done.

## Legal and accounting (owner, with counsel and an accountant)
- [ ] Seller agreement: responsibilities, prohibited items, claims, IP/photo rights, indemnity, termination
- [ ] Marketplace terms for buyers: who is the merchant of record, disputes, liability
- [ ] Seller policy (published), linked from `/sell/apply`
- [ ] Refunds and returns: seller-set or marketplace-wide minimum; who pays; chargeback handling
- [ ] Sales tax: marketplace facilitator obligations by state; tax provider selected
- [ ] 1099-K / payout reporting handled by the payment provider
- [ ] Privacy policy updated for seller data and buyer reports

## Payments
- [ ] Stripe Connect (Express) or equivalent account created; real `MarketplacePaymentProvider` and `SellerPayoutProvider` implemented
- [ ] Fee confirmed by owner in Admin → Marketplace (status `OWNER_CONFIGURED`)
- [ ] Refund and chargeback flows tested in test mode

## Platform
- [ ] Database and auth chosen and wired (seller accounts, role-based access, row-level isolation)
- [ ] Seller identity/business verification provider (or documented manual process)
- [ ] Image upload storage with size/type limits and moderation
- [ ] Transactional email: application received, approved or rejected, listing decisions, reports
- [ ] Rate limits backed by shared storage (current limits are per-instance)

## Operations
- [ ] Moderation staffing and response targets (see MARKETPLACE_MODERATION_POLICY.md)
- [ ] Dispute and report handling runbook
- [ ] Seller onboarding guide (photos, material details, shipping, returns, claims)

## Verification
- [ ] End-to-end pilot with one real seller in test mode
- [ ] `npm test` passes with `MARKETPLACE_ENABLED=true` added to the e2e scenarios
