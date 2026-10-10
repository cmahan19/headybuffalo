# Subscription plan

**Status: built, OFF.** `SUBSCRIPTIONS_ENABLED=false`, no billing provider, no plans (`subscriptionPlans = []`).
Nothing can charge a customer.

## Code
`src/lib/subscriptions.ts` includes:
- `SubscriptionPlan` (models: REFILL, SEASONAL_BOX, DIGITAL_MEMBERSHIP, SELLER_PRO)
- `SubscriptionProduct`
- `SubscriptionStatus` (PENDING_CONSENT, ACTIVE, PAUSED, CANCELED, PAST_DUE)
- `SubscriptionFrequency`
- `SubscriptionConsent` (explicit `accepted: true` plus the exact disclosure shown)
- `canStartSubscription` (guard)
- `applyAction` (pause, resume, skip, cancel)
- `recurringDisclosure`

There is deliberately **no discount field**.

`canStartSubscription` requires all of the following:
- the flag ON
- a billing provider configured
- an ACTIVE plan
- a real price
- renewal, cancellation, and refund policies
- real products (except digital membership)
- a contents disclosure for seasonal boxes
- explicit consent

## Models
| Model | Allowed when | Notes |
| --- | --- | --- |
| Refill | A real consumable/refill product is ACTIVE | Frequency selection, pause, skip, cancel, reminders |
| Seasonal maker box | Real curated goods and suppliers exist | State what is and isn't guaranteed; seller/partner disclosure; shipping timeline only when verified; no scarcity claims |
| Digital membership | Real approved guides/templates exist | Clear cancellation; no reward-game mechanics |
| Seller Pro | Marketplace fully launched | Blocked until marketplace payments, tax, and legal review are done |

## Requirements before enabling
- [ ] Billing via Stripe Billing + Customer Portal (never custom card handling)
- [ ] Plan price, frequency, renewal terms, cancellation, and refund policy approved by owner and counsel
- [ ] Automatic-renewal law review (e.g. California ARL: clear disclosure, affirmative consent, easy online cancellation, confirmation email)
- [ ] Sales tax on recurring charges configured
- [ ] Fulfillment cadence tested with real inventory

## UX rules
- [ ] Consent checkbox is **unchecked** by default, placed next to the disclosure from `recurringDisclosure`
- [ ] Price and frequency shown before the charge, in the cart, and in the confirmation email
- [ ] Cancel, pause, and skip in the customer portal, no harder than signing up
- [ ] Emails confirm sign-up, upcoming renewal (where required), and cancellation
- [ ] No "save X%" unless a real, configured price difference exists

## Tests
Unit tests (`tests/unit/programs.spec.ts`) prove: the flag is off, it can't start while disabled, consent must be
explicit, and pause/skip/cancel work. The admin e2e test proves the flag shows OFF.

## Launch blockers
No subscription products exist, there's no billing provider, and there's no legal review of renewal terms.
