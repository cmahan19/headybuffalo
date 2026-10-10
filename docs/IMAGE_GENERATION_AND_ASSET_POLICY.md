# Image generation and asset policy

This applies to every image on headybuffalo.com: generated, photographed, seller-supplied, or
partner-supplied. The rule underneath all of it: **an image must never be evidence of something that
isn't true.** That covers a product that doesn't exist, a claim that isn't substantiated, a person
who didn't endorse us, or a result nobody got.

## 1. Asset classes

| Class | Examples | May appear on |
| --- | --- | --- |
| `product-photo` | Real photos of a real, owner-verified product | Product pages, cards, Product structured data, OG for that product |
| `seller-photo` | Seller-supplied photos of their own listing, after moderation | That seller's listing only |
| `partner-asset` | Images a partner has authorized us to use | That partner listing only |
| `decorative` | Tie-dye textures, swirls, color bursts, doodles, patterns, backgrounds | Anywhere, as decoration only |
| `concept-art` | Abstract art for an unlaunched product idea | Only on cards/pages labeled "Concept" and noindexed |
| `brand` | Logo, wordmark, brand graphic | Anywhere |

Generated images may **only** be `decorative` or `concept-art`.

## 2. Allowed uses for generated art

Abstract tie-dye textures, ink and paper backgrounds, color bursts, swirls; neutral display pedestals
with no product on them; abstract packaging-pattern concepts; section and empty-state illustrations;
doodle/sticker icons (sun, swirl, flower, gift bow, plant pot, generic tote, bottle, or home
silhouettes); category banner art; Open Graph backgrounds; moodboard textures; abstract concept-card
backgrounds.

## 3. Prohibited

- Realistic packshots or "product in use" images that suggest a product exists or works
- Any label, packaging text, ingredient list, price, safety statement, or claim in a generated image
- Eco seals, certification marks, "organic", "biodegradable", or similar badges in any image
  (generated or not) without documented substantiation
- People, models, customers, hands holding products, testimonials, creator/UGC-style content, or
  before/after imagery
- Factories, workshops, warehouses, or team photos that don't depict the real business
- Other brands' logos, products, packaging, or trade dress
- Generated images as a product's primary image, in a product gallery, or in Product/Offer
  structured data

## 4. Concept labeling

Every surface that shows `concept-art` must:
- show a visible **"Concept"** badge (text, not color alone) and a line such as "Idea in development, not for sale";
- have **no** price, Add to cart, stock or availability status, countdown, or "pre-order";
- use "Join the waitlist" **only** if a real email capture is connected;
- be `noindex` and excluded from the sitemap.

## 5. Product image requirements (for anything purchasable or listed)

- It's a real photo of the exact item sold (variant, color, contents), taken or licensed by us, the
  seller, or the partner, with written permission on file.
- Any text visible on the packaging matches the verified product facts.
- Minimum 1600×1600 px, square primary image. Additional angles are recommended: detail, scale, and
  packaging.
- sRGB, no watermarks, no added badges or overlays.
- People in photos require a signed model release. User content requires written permission and credit terms.

## 6. Metadata (required for every non-product asset)

Registered in the asset manifest (built in Phase C) with these fields:

```
id, file, class (decorative | concept-art | brand), prompt or source, tool/model,
generated_or_created_date, usage_routes[], approval_status (pending | approved | rejected),
approved_by, approved_date, alt ("" if decorative), width, height, bytes
```

Generated assets live in `public/art/generated/` (metadata: `src/lib/art-manifest.json`), separate from
product photography. Statuses:
- `provisional`: abstract **decorative or concept art only**, produced by the procedural generator
  (`scripts/generate-art.mjs`: seeded SVG with turbulence "dye bleed", rasterized by sharp; no AI model and
  no source imagery). It may be shown publicly until the owner reviews it. All 30 current assets are provisional.
- `approved`: owner reviewed.
- `rejected`: the app refuses to render it (`art()` throws), so it must be replaced.

Any other asset class (photos, people, packaging) must be `approved` before use.

## 7. Approval workflow

1. Generate or create the image. Record the prompt, tool, and date in the manifest (status `pending`).
2. Check it: no text or pseudo-text, no logos, no people, no product likeness, no claim-like symbols.
3. Optimize: WebP/AVIF, sized for its largest render ×2, under about 250 KB for banners and 400 KB for heroes.
4. The owner approves in the manifest (`approved_by`, `approved_date`).
5. Render-test at 375, 768, and 1440px, then publish.

## 8. Alt text

- **Decorative** art: `alt=""` (screen readers skip it). Never describe decoration.
- **Concept art:** describe what it is, e.g. "Abstract swirl artwork for a product idea in development".
- **Product photos:** describe the item factually (name, variant, what's visible), with no claims.
  Write "Heady Buffalo laundry soap, 32 oz bottle", not "Eco-friendly laundry soap".
- **Logo:** `alt=""` when next to the visible brand name; otherwise "Heady Buffalo".

## 9. Image QA checklist

- [ ] Asset class set and allowed for this route
- [ ] Manifest entry complete and `approved`
- [ ] No text, logos, people, product likeness, or claim symbols (generated art)
- [ ] Correct alt text per §8
- [ ] Served via `next/image` with explicit size or aspect-ratio container and correct `sizes`
- [ ] `priority` only on the LCP image; everything below the fold lazy-loaded
- [ ] File size within budget; WebP/AVIF delivered
- [ ] No layout shift; crop looks intentional at 375, 768, and 1440px
- [ ] Never used as a product's primary image or in structured data (generated art)

## 10. Prompts for owner-run generation

Use with any image generator. Save the output to `public/art/`, then register it in the manifest.

- **Tie-dye hero backdrop (16:9):** "Abstract premium tie-dye swirl background, cobalt blue, aqua,
  lime, coral, hot pink, violet, warm cream negative space in the center, fine paper texture, no
  text, no logos, no products, no people."
- **Collection banner (3:1), ×6 palettes:** "Playful abstract psychedelic color burst, [PALETTE],
  hand-inked swirls, soft grain, bold but clean, no text, no logos, no product images, no people."
  Palettes: cobalt+aqua · coral+pink+yellow · teal+lime+violet · orange+yellow+coral ·
  pink+violet+coral · indigo+yellow+violet.
- **Doodle stickers (transparent):** "Set of colorful hand-drawn sticker-style icons: abstract sun,
  swirl, gift bow, tote silhouette, bottle silhouette, plant pot, flower, rainbow arc; flat
  illustration, no text, no logos, transparent background."
- **OG background (1200×630):** "Abstract tie-dye swirl in cobalt, pink, yellow, and violet with a
  calm dark area on the left for text, no text, no logos, no people."

Don't generate hands, people, or anything that could read as a real product. The brief's "maker-market
illustration set with hands" is excluded here for that reason.
