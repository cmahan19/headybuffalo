# Tie-dye failure analysis

## Why no tie-dye was visible

**The visual system was never implemented.** The Phase A deliverables (color tokens, contrast checks,
color map, audit) were completed. The agent then stopped and asked whether to continue with
Phase B instead of building it. As a result:

- `--hb-*` CSS variables existed in `src/app/globals.css` and were mapped to Tailwind `hb-*` classes, but
  **no component on any public route used a single `hb-*` class** (`grep -r "hb-" src/app` found only
  the token definitions).
- `src/lib/colorMap.ts` was **imported by nothing**.
- No decorative assets were generated. The session has no AI image tool, and the fallback wasn't built.
- The homepage (`src/app/page.tsx`) still used the black hero, forest-green panel, and ember buttons.

It was not a stale build, purged Tailwind classes, a CSS override, or the wrong layout. The code simply
wasn't written.

## Files that control the public UI

| Route/area | File |
| --- | --- |
| All pages: header, footer, cart drawer | `src/app/layout.tsx`, `src/app/components/Header.tsx`, `Footer.tsx`, `CartDrawer.tsx` |
| Homepage | `src/app/page.tsx` |
| Shop / collections | `src/app/shop/page.tsx`, `src/app/categories/[category]/page.tsx` |
| Product page | `src/app/products/[id]/page.tsx` |
| Cart | `src/app/cart/page.tsx`, `src/app/components/CartLines.tsx` |
| Global styles and tokens | `src/app/globals.css`, `tailwind.config.ts` |

## Baseline (before the fix)

Reproduce with `npm run build && npx next start -p 3130`, then `node scripts/viewport-check.mjs http://localhost:3130 <outDir>`.

- Homepage 1440px: black hero with logo graphic, white "Coming soon" card, forest-green "How we do
  business" panel, black footer. No tie-dye, no multi-color sections.
- Homepage 375px: same, stacked.
- Collection and product pages: **404 in production.** No product is owner-verified, so no collection or
  product page is published. They only render with `SHOW_DRAFT_PRODUCTS=true`.

## Files that will change

- `scripts/generate-art.mjs` (new): seeded procedural generator; writes rasters to `public/art/generated/`
  and metadata to `src/lib/art-manifest.json`.
- `src/app/globals.css`, `tailwind.config.ts`: gradient and shadow tokens, colorful button states.
- `src/app/components/tiedye/*` (new): TieDyeHero, TieDyeBackground, SwirlGradient, ColorBurst,
  RainbowDivider, ColorfulCTA, ColorfulProductFrame, CollectionColorBanner, HandmadeSticker,
  DoodleAccent, ColorfulNewsletterPanel, ColorfulEmptyState, ConceptProductCard, ConceptBadge.
- `src/app/page.tsx`, `shop/`, `categories/`, `products/`, `cart/`, `not-found.tsx`, `Header.tsx`,
  `Footer.tsx`, `opengraph-image.tsx`.
- New: `src/lib/concepts.ts`, `src/lib/readiness.ts`, `/ideas`, `/admin/*`, `src/middleware.ts`, and
  marketplace, subscription, and affiliate modules.

## Acceptance criteria for the visible change

1. The homepage hero shows a raster tie-dye backdrop, with the headline on a solid cream card.
2. At least 3 homepage sections use different color families; rainbow dividers separate sections.
3. The shop, collection, and ideas headers use collection banner art.
4. Empty states, CTA blocks, and the updates panel are visibly colorful.
5. At least 8 generated assets load with no 404s.
6. Cart, checkout, and prices stay on solid, high-contrast surfaces.
7. Automated e2e checks and screenshots at 375, 768, and 1440px prove all of the above
   (see `COLORFUL_MARKETPLACE_VERIFICATION.md`).
