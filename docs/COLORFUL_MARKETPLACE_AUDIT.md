# Colorful marketplace audit (Phase A)

Date: 2026-09-29. Scope: the current state of the codebase against the "colorful marketplace" brief,
and what has to change to get there.

## 1. Documents the brief expects

| Document | Exists? |
| --- | --- |
| `IMPLEMENTATION_PLAN.md`, `OWNER_REVIEW.md` | ✅ |
| `SITE_AUDIT`, `ECOMMERCE_AUDIT`, `SEO_AUDIT`, `IMAGE_AUDIT`, `PRODUCT_CATALOG_AUDIT`, `CLAIMS_REVIEW`, `PRODUCT_LAUNCH_REQUIREMENTS`, `CONVERSION_BACKLOG`, `QA_CHECKLIST`, `FINAL_REPORT` | ❌ Never created. Their Phase 1–2 content is summarized in `IMPLEMENTATION_PLAN.md`. `IMAGE_AUDIT` is created in Phase C. |
| `COLORFUL_MARKETPLACE_AUDIT.md` (this file), `IMAGE_GENERATION_AND_ASSET_POLICY.md` | ✅ Created in Phase A |
| `PRODUCT_CONCEPT_CATALOG`, `SUBSCRIPTION_PLAN`, `MARKETPLACE_SELLER_PLAN`, `AFFILIATE_PARTNER_PLAN` | ⏳ Written in Phases D, E, F, and G. Their architecture depends on the database/auth decision in §6, so writing them now would mean rewriting them later. |

## 2. Current stack

- **Framework:** Next.js 15.1 (App Router), React 18, TypeScript (strict), Tailwind 3.4. Probably hosted
  on Vercel (`.vercel` is in `.gitignore`); unconfirmed.
- **Catalog:** a static TypeScript file (`src/lib/catalog.ts`). **No database, no CMS, no admin UI.**
- **Auth/users:** **none.** There are no accounts, roles, or sessions. (The old in-memory `/api/signup`
  is retired and returns 410.)
- **Cart:** browser `localStorage`, re-validated against the catalog; line items only (id + quantity).
- **Checkout:** Stripe Checkout Session, priced server-side from the catalog (`/api/checkout`). The
  webhook at `/api/stripe/webhook` verifies signatures; fulfillment isn't automated.
- **Email:** SMTP via nodemailer, used by the contact form only. It works with the existing
  `EMAIL_USER`/`EMAIL_PASS` Gmail settings.
- **Tests:** none yet. Phase A adds `@playwright/test` (driving installed Chrome, no browser download),
  `scripts/viewport-check.mjs`, and `scripts/check-contrast.mjs`.

## 3. Products and status

| Product | Status | Why |
| --- | --- | --- |
| Laundry Soap, Dishwasher Pods, Bar Soap, Lip & Cheek Tint, Mouthwash Tablets, Dog Food | **Draft, hidden** | Conflicting names and prices in the old data. Photos are AI mockups printing "ORGANIC", "BIODEGRADABLE". Nothing is owner-verified. |

**Active/purchasable products: 0.** All collections are hidden (none has a published product). The
public site runs in an honest pre-launch state with phone and contact CTAs.

## 4. Checkout state

- Works end-to-end in code. It correctly rejects unverified products (409) before calling Stripe.
- **Never exercised with a real product**, because none is verified. `.env.local` has a
  `STRIPE_SECRET_KEY`; whether it's a test or live key is unknown. A real test purchase needs one
  verified product and a **test-mode** key.
- PayPal was removed (its hardcoded client ID and fake "subscription price" button were part of the
  placeholder code).

## 5. Existing capabilities against the brief

| Capability | Exists today? | Notes |
| --- | --- | --- |
| Subscriptions | **No** | No recurring billing, plans, consent records, or management portal. |
| Marketplace sellers | **No** | No accounts, roles, seller records, listings, moderation, or payouts. |
| Affiliate / partner products | **Partly** | The catalog supports `offer.kind: "external"` with `relationship: "affiliate" \| "partner"`, labels, a disclosure, and `rel="sponsored noopener noreferrer"`. **No click tracking, link health checks, or admin.** No partner products exist. |
| DIY / digital products | **Partly** | `offer.kind: "digital"` exists in the type, but there is no delivery mechanism and no readiness gate. |
| Claim guardrails | **Process only** | The owner-verification gate hides products. There's no automated claim validator yet (Phase D). |

## 6. Architecture changes required, and the owner decision that blocks them

Subscriptions, sellers, moderation, audit logs, click tracking, and admin screens all need three
things the site doesn't have: a **database**, **authentication with roles**, and **file storage**
for seller uploads. Choosing them is a platform decision with cost and vendor lock-in, so it's the
owner's call.

**Recommended:** Supabase (Postgres + Auth + Storage + row-level security in one service), with
Stripe for money:

| Need | Recommended provider | Alternative |
| --- | --- | --- |
| Database, auth, roles, file storage | Supabase | Neon Postgres + Auth.js + S3/R2 |
| Marketplace split payments, seller payouts, 1099s | Stripe Connect (Express accounts) | none that fits the existing Stripe setup as well |
| Subscriptions and customer portal | Stripe Billing + Customer Portal | — |
| Sales tax | Stripe Tax (needs accountant review) | TaxJar |
| Transactional email (subscription and seller notices) | Resend or Postmark | continue with SMTP (poor deliverability at volume) |

**What can proceed without that decision** (and will, in Phases D–G): provider-agnostic domain models
and state machines (listing status, subscription state, seller roles, fee configuration with
`platform_fee_percent = null`), the claim validator, the disclosure and badge components, feature
flags defaulting to OFF, and unit tests. These all run against in-memory mock providers.
Persistence plugs in once the owner chooses.

## 7. Image issues

| Asset | Problem | Disposition |
| --- | --- | --- |
| 6 product images | AI mockups printing unsupported claims, with misspellings | Unused in production (drafts). Need real photos. |
| `heroBanner.webp`, `eco.webp`, 8 category images, 2 `DALL·E …webp` files | AI lifestyle scenes showing products Heady Buffalo doesn't sell. `pet.webp` prints "ORGANIC ECO FABRICS". | Unused. Recommend deleting from `public/` (owner action; deletes are blocked in the agent session). |
| `about-us.webp` | AI image of an invented team and office | Unused. |
| `logo.png` | Actually a 600×600 JPEG on black | Used, with `mix-blend-lighten`. Need a transparent SVG/PNG. |
| `shirt.webp`, `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` | Leftover scaffolding | Unused. |

**Image generation in this environment:** this agent session has **no image-generation tool**. The
tie-dye system in Phase B is therefore built as **code-generated SVG/CSS art**. It's lighter than
raster images, resolution-independent, and can't depict a fake product. Raster assets (the brief's
7-item set) can be produced by the owner with any image generator, using the prompts in
`IMAGE_GENERATION_AND_ASSET_POLICY.md`, and registered through the asset manifest built in Phase C.

## 8. Baseline checks (start of Phase A)

- `next build`: passes, 29 routes; type-check clean; lint 0 errors (warnings only in 5 legacy files).
- Browser check (`scripts/viewport-check.mjs`, installed Chrome via Playwright) of `/`, `/shop`,
  `/about`, `/contact`, `/cart`, and `/privacy-policy` at **375, 768, and 1440px**: no horizontal
  overflow, no console errors, no failed requests, on all 18 page/width combinations.
- Note: a plain headless-Chrome screenshot at 390px *looked* clipped. That's a known minimum-window
  artifact, disproved by the emulated-viewport check above.

## 9. Color strategy

**Direction:** calm cream/white/ink foundation; tie-dye color reserved for brand moments (hero,
collection banners, promo modules, empty states, illustrations). Shopping surfaces (product cards,
cart, checkout, prices, policies) stay on solid, high-contrast backgrounds. The palette comes from the
real logo, which already has rainbow eye, ember horns, green triangle, blue nodes, and pink nose, so
the psychedelic direction extends the existing identity instead of replacing it.

**Tokens:** `--hb-*` in `src/app/globals.css` (RGB channels), exposed as Tailwind `hb-*` classes.
The vivid hues are blue, cobalt, aqua, teal, lime, yellow, orange, coral, pink, berry, violet, and indigo.
Text-safe `-deep` variants, foundation colors (cream, ink, surface, surface-muted, border), and status
colors (success, warning, error) complete the set.

**Verified contrast** (`node scripts/check-contrast.mjs`, 31 required pairs, all pass):
- ink on cream 16.5:1; `-deep` colors on cream/white 4.9–7.1:1;
- ink text on aqua/lime/yellow/orange/coral fills 6.2–11.6:1;
- white text on cobalt/teal-deep/berry/violet-deep/indigo/pink-deep/orange-deep fills 5.2–11.4:1.

**Never use these (they fail WCAG AA for text):**

| Pair | Ratio |
| --- | --- |
| white on aqua / coral / orange / pink / teal | 1.8 / 2.7 / 2.8 / 3.5 / 3.7:1 |
| white on blue / violet | 4.4 / 4.2:1 (large text only) |
| ink on blue / violet | 4.0 / 4.1:1 |
| lime / yellow / aqua / orange / pink / teal / violet **text** on cream | 1.4–4.0:1 |

**Color map** (`src/lib/colorMap.ts`). Families are visual only and never imply a claim:

| Family | Art hues | Solid (white text) | Text accent | Used by |
| --- | --- | --- | --- | --- |
| home | cobalt · aqua · blue | cobalt | blue-deep | Home Cleaning |
| personal-care | coral · pink · yellow | berry | pink-deep | Beauty & Personal Care |
| pet | teal · lime · violet | teal-deep | teal-deep | Pet |
| craft | orange · yellow · coral | orange-deep | orange-deep | future DIY/craft |
| refill | teal · lime · aqua | teal-deep | teal-deep | future (only if real refill products exist) |
| outdoor | lime · coral · teal | lime-deep | lime-deep | future |
| gifts | pink · violet · coral | violet-deep | violet-deep | future |
| partner | indigo · yellow · violet | indigo | violet-deep | partner/affiliate picks |

## 10. Owner decisions needed

1. **Database/auth/storage provider** (blocks Phases E–G persistence). Recommendation: Supabase.
2. **Stripe Connect and Stripe Billing**: accounts, seller agreement, refund policy, accountant review
   for sales tax and 1099s. These block any live marketplace or subscription billing.
3. **Is the Stripe key in `.env.local` test or live?** Test mode is needed for checkout QA.
4. **Verified product data and real photos** (unchanged from `OWNER_REVIEW.md`). Until then the store
   sells nothing.
5. **Raster art:** generate the decorative set yourself with the provided prompts, or accept the
   code-generated SVG/CSS system from Phase B as the long-term approach.
6. **Delete the legacy files and unused AI images** listed in `IMPLEMENTATION_PLAN.md` and §7.
