# Implementation plan and progress

## Note on audit documents

The Phase 2+ brief refers to Phase 0/1 audit documents (`SITE_AUDIT.md`, `ECOMMERCE_AUDIT.md`,
`SEO_AUDIT.md`, `IMAGE_AUDIT.md`, `PRODUCT_CATALOG_AUDIT.md`, `CLAIMS_REVIEW.md`, `QA_CHECKLIST.md`).
**These were never created.** Phase 1 produced only [`OWNER_REVIEW.md`](OWNER_REVIEW.md) and the code
changes below. The Phase 1 findings are summarized here instead. The remaining documents are scheduled
for the phases that own them (images → Phase 3, SEO → Phase 5, QA → Phase 8, final report → Phase 9).

## Phase 1 baseline (completed earlier)

- One product catalog (`src/lib/catalog.ts`) replaced five conflicting placeholder lists and about 30
  broken image paths.
- Removed fabricated content: star ratings and review counts, testimonials, sale badges and percentages,
  "100% recycled", "funds environmental initiatives", and a 30-day return policy.
- Three competing payment implementations were replaced with one server-priced Stripe Checkout.
  Endpoints that trusted a client-supplied amount (`/api/order`, `/api/create-payment-intent`) and an
  in-memory password store (`/api/signup`) now return 410.
- Pages that crashed (`next/router` in the App Router) were fixed. Webhook moved to
  `/api/stripe/webhook` with signature verification. The contact form previously could never submit;
  it now uses a honeypot, a rate limit, and server-side validation.
- Metadata, sitemap, robots, JSON-LD, redirects for old URLs, and security headers.
- Phone call-to-action (888) 509-8502 → `tel:+18885098502` across the site.

**Baseline checks at the start of Phase 2:** `next build` passed, the type-check passed, lint had 0 errors.
There is no test framework yet (Phase 8).

**Legacy files the owner still needs to delete** (deletion was blocked in the agent session; each is
stubbed or redirected, so it's harmless):
`src/app/{best-sellers,sales,trending,customer-support}/`, `src/app/checkout/page.tsx`,
`src/app/checkout/CheckoutWrapper.tsx`, `src/app/api/webhook.ts`,
`src/app/api/{order,create-payment-intent,signup}/`,
`src/app/components/{FeaturedProducts,CategorySection,ProductCarousel}.tsx`.
After that: `npm uninstall @paypal/react-paypal-js @stripe/react-stripe-js @stripe/stripe-js bcryptjs formik yup react-google-recaptcha`.

## Phase 2: Premium ecommerce UX and brand polish ✅

### Key decision: unverified products are hidden, not shown as "coming soon"

The product photos are AI-generated mockups whose packaging prints "ORGANIC", "BIODEGRADABLE", and
"SUSTAINABLE & PLANET-FRIENDLY", with misspelled text. Showing them publicly would itself be an
unsubstantiated claim. So in production:

- products with `ownerVerified: false` have no page (404), no listing, and no sitemap entry;
- collections with no published products don't exist (404) and aren't linked;
- the shop, home, and navigation show an honest "products coming soon" state with the phone and
  contact CTAs.

`SHOW_DRAFT_PRODUCTS=true` (server-only env var) previews drafts locally. It adds a banner, "Draft"
badges, and site-wide `noindex, nofollow`. **Never set it in production.**

### Imagery

All existing lifestyle images are AI-generated. `heroBanner.webp` and the category images show
products Heady Buffalo doesn't sell; `about-us.webp` shows an invented team; `pet.webp` prints
"ORGANIC ECO FABRICS". They are no longer used. Replacement: `BrandGraphic`, built only from the real
logo and brand colors, used for the hero, collection tiles (until real photos exist), and the about
page. The social share image (`/opengraph-image`, `/twitter-image`) is generated from the logo.

### Design system

- **Tokens** (`tailwind.config.ts`): colors (ink, cream, kraft, forest, ember, sky-brand, danger),
  display type scale, card/panel radii, card/raised/drawer shadows, page and prose widths, and
  motion that respects `prefers-reduced-motion`.
- **Component classes** (`globals.css`): `.btn-primary`, `.btn-secondary`, `.btn-ember`,
  `.btn-on-dark`, `.btn-link`, `.btn-lg`; `.field` with `aria-invalid` error styling,
  `.field-label`, `.field-error`; `.card`, `.panel`, `.pill`, `.pill-active`, `.eyebrow`; a global
  `:focus-visible` ring.
- **UI components** (`src/app/components/ui/`): `Badge` (factual labels only), `Price` (no compare-at
  price), `PartnerDisclosure` (wording depends on the relationship), `Alert` (icon + text, never
  color alone), `EmptyState`, `Skeleton`/`ProductGridSkeleton`, `Drawer` (native `<dialog>`:
  focus contained, Escape closes, focus returns, scroll lock), and `BrandGraphic`.
- **Commerce components**: `ProductCard` (type/partner/draft label, descriptor, price, CTA hint),
  `CollectionCard`, `CollectionNav`, `CartLines` (shared by the drawer and `/cart`), `CartDrawer`, and
  the `useCheckout` hook.

### UX changes

- **Header:** only published collections; "Help" link; phone number as text on desktop and a
  tap-to-call icon on mobile; cart button opens the cart drawer; mobile menu is now an accessible
  drawer.
- **Add to cart:** opens the cart drawer, with a screen-reader announcement from the cart context.
- **Homepage** follows the brief's order: hero → CTA → featured (published only) → collections
  (non-empty only) → launch panel (only while empty) → principles → final CTA. DIY, partner, and
  newsletter sections are omitted because none of them exist yet.
- **Partner products:** labeled "Curated partner product", CTA "View partner product at {merchant}",
  `rel="sponsored noopener noreferrer"`, and the disclosure next to the CTA.
- **Headings:** unified on the display scale.

### Bugs found and fixed in Phase 2

- `checkout/page.tsx` stub returned `void`, which broke the legacy `CheckoutWrapper` type-check → typed as `never`.
- `/opengraph-image` crashed: the Node build of `next/og` fails on Windows paths → edge runtime. The
  next crash was a Satori multi-child text node, also fixed.
- The layout's `canonical: "/"` and `og:url: "/"` were inherited by every page without its own
  (cart, search, checkout) → moved to the homepage only.
- Pages setting `robots: undefined` overrode the layout's preview `noindex` → they now omit the key.
- Legacy numeric product URLs pointed at unpublished drafts (404) → temporary redirect to `/shop`.
- `public/logo.png` is really a JPEG with a black background → `mix-blend-lighten` so no black
  square shows on colored surfaces. A transparent SVG/PNG is still needed.

### Verification (Phase 2)

- `next build`: passes; 29 routes, type-check clean, lint 0 errors (warnings only in legacy files).
- Production server smoke test: every public route returns the expected 200/307/308/404; exactly
  one `<h1>` per page; all homepage image requests return 200; OG and Twitter images return
  1200×630 PNGs; canonical and robots are correct on sampled pages.
- Draft-preview dev server: product, collection, shop, and search pages render with the banner,
  draft badges, and `noindex`, and without Product JSON-LD.
- **Not yet done:** browser-based tests (Playwright), an axe accessibility scan, Lighthouse, and
  visual checks at 375/768/1440px. There is no browser automation in this environment yet; these are
  scheduled for Phases 3, 6, and 8.

### Owner decisions and assets still needed

See [`OWNER_REVIEW.md`](OWNER_REVIEW.md). The most important: verified product data and real product
photos (nothing can be sold until then), a transparent logo file, and policy text.

## Next: Phase 3, image system and asset audit

Create `docs/IMAGE_AUDIT.md` (every asset: use, dimensions, rights, disposition). Add a
local image-reference validator and a published-product primary-image check. Set up Playwright image
health tests. Document the missing-asset spec list (packshots, collection heroes, logo SVG, founder
photo).

---

# Colorful marketplace brief (Phases A–H)

## Phase A: Audit and color strategy ✅

- **Audit:** [`COLORFUL_MARKETPLACE_AUDIT.md`](COLORFUL_MARKETPLACE_AUDIT.md) covers the stack, products
  (0 active, 6 hidden drafts), checkout, image problems, and the missing capabilities (no subscriptions,
  sellers, or click tracking). **Key blocker:** no database, auth, or storage exists; the owner must
  choose a provider (recommended: Supabase).
- **Asset policy:** [`IMAGE_GENERATION_AND_ASSET_POLICY.md`](IMAGE_GENERATION_AND_ASSET_POLICY.md).
- **Color tokens:** `--hb-*` in `globals.css`, exposed as Tailwind `hb-*` classes. 12 vivid hues,
  6 text-safe `-deep` variants, foundation, and status colors.
- **Contrast:** `npm run check:contrast`. All 31 required pairs pass WCAG AA. Failing pairs are
  documented as "never use".
- **Color map:** `src/lib/colorMap.ts`, 8 families. The 3 current collections are mapped.
- **Tooling:** `@playwright/test` (drives installed Chrome, no browser download);
  `npm run check:viewports` checks overflow, console errors, and failed requests at 375/768/1440px;
  `npm run typecheck`.
- **Baseline:** build ✅, typecheck ✅, lint 0 errors ✅, viewports 18/18 clean ✅.
- **Deferred docs:** the concept catalog, subscription, marketplace, and affiliate plans are written in
  Phases D–G, because they depend on the provider decision.

**Next: Phase B.** Tie-dye visual system as code-generated SVG/CSS art (`TieDyeBackground`,
`SwirlGradient`, `ColorBurst`, `RainbowDivider`, `CollectionColorBanner`, `DoodleAccent`, badges,
colorful empty/loading states). Migrate the homepage, header accents, collection modules, CTAs, and
empty states. Keep shopping surfaces solid and readable.

## Corrective phase: visible tie-dye transformation, concepts, and program foundations ✅

Root cause of "nothing visible": Phase B had never been built (see [TIE_DYE_FAILURE_ANALYSIS.md](TIE_DYE_FAILURE_ANALYSIS.md)).
Delivered:
- **Generated art:** 30 assets from `scripts/generate-art.mjs` (seeded procedural SVG rasterized by sharp;
  metadata in `src/lib/art-manifest.json`). They include the hero, 6 banners, 2 bursts, 10 concept
  backgrounds, the OG background, 9 stickers, and the sticker sheet.
- **Tie-dye components** (`src/app/components/tiedye/`), used on `/`, `/shop`, `/ideas`, `/cart`, 404,
  search, product pages, header, and footer.
- **Exactly 10 concepts** (`src/lib/concepts.ts`), shown publicly on `/ideas` and the homepage module
  (noindex, no purchase paths) and privately at `/admin/product-concepts` (status, gate, fields,
  scorecard, controls, audit).
- **Readiness gate** (`src/lib/readiness.ts`) with 13 statuses and 15 + 8 (DIY) activation requirements.
  The claim validator is `src/lib/claims.ts`.
- **Admin area** protected by middleware and an HMAC session (`ADMIN_PASSWORD`). It's disabled (404) when unset.
- **Marketplace** (roles, application, moderation, storefronts, reports, fee config left null),
  **subscriptions**, and **affiliate click tracking**: all built and all flagged OFF.
- **Tests:** Playwright unit and e2e suites (`npm test`), including an axe scan.

Verification and routes: [COLORFUL_MARKETPLACE_VERIFICATION.md](COLORFUL_MARKETPLACE_VERIFICATION.md).

## Design refresh: black chrome + natural, more DIY products ✅

- Replaced the high-saturation look with a polished system: bone/sand/stone foundation, black-chrome surfaces
  (primary buttons, hero, principle band, CTA), natural sage/moss/olive/clay, and color used as accents only.
- Regenerated all decorative art in the new style (31 assets, including 20 concept pedestals).
- Components moved to `src/app/components/art/` with neutral names; the old style name no longer appears in
  code or public pages (enforced by tests).
- Added 10 hand-made DIY concepts (11–20) with internal build guides, shown in admin and
  `docs/DIY_PRODUCT_CONCEPTS.md`.
- Verified: build ✅, contrast ✅, 67/67 tests ✅. Details are in `COLORFUL_MARKETPLACE_VERIFICATION.md`.

## Shop relaunch: made-to-order catalog, 30 products, illustrations, new copy, AWS hosting ✅

- **30 products** (10 easy DIY additions: macramé keychain, braided cord bracelet, block-printed cards, stamped
  bandana, embroidered tea towel, scrunchie set, canvas zipper pouch, painted ornaments, pet bandana,
  hand-lettered print), each with an internal build guide.
- **Public as "made to order":** `listing: "request"` publishes every product with "Price on request" and a
  "Request this item" flow (pre-filled order form). Cart checkout turns on per product when its launch checklist
  is complete. All "concept" wording is removed from public pages, and `/ideas` redirects to `/shop`.
- **Product illustrations:** 30 vector illustrations (`scripts/generate-product-illustrations.mjs` →
  `public/products/illustrations/`), labeled "Illustration" on product pages and in alt text. Never used in
  Product schema; replaced by real photos at launch.
- **Copy rewritten** for the homepage, shop, collections, about, and metadata (no eco, popularity, or performance
  claims; enforced by tests).
- **Hosting:** AWS Amplify recommended (`amplify.yml`, `docs/HOSTING_AND_COSTS.md`). The social image is now a
  static file, so no edge runtime is required.
- Verified: build ✅, 79/79 tests ✅, no overflow or broken images at 375/768/1440px.
