# Heady Buffalo

Storefront for [headybuffalo.com](https://headybuffalo.com), built with Next.js 15 (App Router), Tailwind CSS, and Stripe Checkout.

**Before launch, read [docs/OWNER_REVIEW.md](docs/OWNER_REVIEW.md).** No product can be purchased until the owner verifies it.

## Develop

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev
```

## How it fits together

| Area | Where |
| --- | --- |
| Products and categories (single source of truth) | `src/lib/catalog.ts` |
| Site settings: phone, social links, policies | `src/lib/site.ts` |
| Cart (browser storage, re-validated against the catalog) | `src/app/context/CartContext.tsx` |
| Checkout: server-priced Stripe Checkout Session | `src/app/api/checkout/route.ts` |
| Stripe webhook | `src/app/api/stripe/webhook/route.ts` |
| Contact form (SMTP, honeypot, rate limit) | `src/app/api/contact/route.ts` |
| SEO: metadata, JSON-LD, sitemap, robots | `layout.tsx`, `products/[id]/page.tsx`, `sitemap.ts`, `robots.ts` |
| Redirects for old URLs, security headers | `next.config.ts` |

| Generated decorative art (procedural) and its metadata | `scripts/generate-art.mjs`, `public/art/generated/`, `src/lib/art-manifest.json` |
| Visual components (hero, banners, art) | `src/app/components/art/` |
| Product concepts (exactly 10) and readiness gate | `src/lib/concepts.ts`, `src/lib/readiness.ts`, `/ideas`, `/admin/product-concepts` |
| Private admin (needs `ADMIN_PASSWORD`) | `src/middleware.ts`, `src/app/admin/` |
| Marketplace, subscriptions, affiliates (all flagged OFF) | `src/lib/marketplace/`, `src/lib/subscriptions.ts`, `src/lib/affiliate.ts`, `src/lib/flags.ts` |

## Checks

```bash
npm run build          # includes lint + type-check
npm test               # Playwright unit + browser tests (uses installed Chrome; build first)
npm run check:contrast # WCAG contrast for color tokens
```

The same checks run automatically on GitHub for every push to `main` and every pull request (`.github/workflows/ci.yml`).

See [docs/VERIFICATION.md](docs/VERIFICATION.md) for routes to open and test coverage.

Content rules: never add product facts, eco or health claims, reviews, ratings, discounts, or stock levels that the business can't substantiate.
