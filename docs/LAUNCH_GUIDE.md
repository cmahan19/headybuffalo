# Launch guide: taking orders and putting products on online checkout

**All 30 products are live in the shop now as "made to order."** Each has its own page with an illustration,
"Price on request", and a **Request this item** button that opens a pre-filled order form (quantity, colors,
ship-to ZIP). Requests arrive in your email inbox.

**How to fill a request:** reply with the price, shipping cost, and timing, plus a **Stripe Payment Link**
(Stripe Dashboard → Payment Links → New, free to create). Make the piece once it's paid.

**Turning on Add to cart for a product:** complete its checklist below. Admin → **Launch board**
(`/admin/launch`) shows exactly what each product is missing. When the checklist is complete, the illustration
is replaced by your photos, the price shows, and the cart button appears automatically.

To hide a product entirely, set `listing: "hidden"` in its block in `src/data/handmade-products.ts`.

Recommended order: **embroidered patches → stamped totes → macramé hangers → pressed-flower bookmarks**, then the rest.

## One time: set your shipping rate

In `src/lib/site.ts`:

```ts
shipping: {
  flatRateCents: 595,   // $5.95 per order
  freeOverCents: 7500,  // optional: free shipping on orders of $75 or more (or null)
  label: "Standard shipping",
},
```

Nothing can launch until this is set. Price it from real postage quotes for your typical package.
Also add your shipping and returns policy text in the same file (`policies.shippingAndReturns`).

## For each product

1. **Make a few and time yourself.** Use the pricing calculator on the Launch board: materials, packaging, minutes,
   your hourly rate, and the profit margin you want. It gives the break-even price and the price at your margin.
2. **Photograph the real item.** At least one clear, square photo, around 1600×1600 px. Natural light, plain
   background, plus a detail shot and one showing scale. Save the photos to `public/products/<slug>/` as
   `1.jpg`, `2.jpg`, and so on. The slug is on the Launch board, e.g. `embroidered-patch-set`.
3. **Fill in the product's block** in `src/data/handmade-products.ts`:

```ts
"embroidered-patch-set": {
  priceCents: 1200,                     // $12.00
  photos: [
    photo("embroidered-patch-set", "1.jpg", "Round embroidered buffalo patch, front"),
    photo("embroidered-patch-set", "2.jpg", "Patch stitching detail"),
  ],
  materials: "Polyester twill, rayon thread, heat-seal backing",   // from your supplier's spec
  size: "3 in diameter",                                           // measured
  care: "Iron on with a pressing cloth; hand wash cold",           // tested
  shippingWeightOz: 1,                                             // packed, weighed
  fulfillment: { kind: "in-stock", quantity: 25 },                 // or { kind: "made-to-order", leadTimeBusinessDays: 5 }
  ownerVerified: true,
  featured: true,
},
```

4. **Rebuild and deploy** (`npm run build`). The product appears in the shop, in its category, in search, and in
   the sitemap, and it leaves the "Ideas" page automatically.

## Rules that keep the shop safe
- Photos must be **your real item**. The generated studio art is only a placeholder and blocks launch.
- Materials come from your supplier's documentation; sizes are measured; care instructions are ones you've tested.
- No eco, health, safety, "natural", or "best seller" claims. The claim checker flags them.
- In-stock quantity is what you actually have. Made-to-order lead time is what you can actually meet.
- Digital products (the organization kit) can't launch until a download-delivery method is connected.

## Not sure what to enter?
Send the price, photos, materials, size, care, weight, and quantity or lead time for any product, and it can be
entered for you.

## Before the first real sale
- [ ] Shipping rate and shipping/returns policy set
- [ ] Stripe in **live** mode, with a test purchase done first in **test** mode
- [ ] Stripe Dashboard → Settings → Customer emails → successful payments on
- [ ] Sales tax: check whether you need to collect it in your state (ask an accountant; Stripe Tax can automate it)
- [ ] Business registration and any local seller's permit your state requires
