import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getProduct, isPurchasable } from "@/lib/catalog";
import { site } from "@/lib/site";

// Creates a Stripe Checkout Session. Prices are always taken from the server-side catalog;
// the client only sends product ids and quantities.

const MAX_LINES = 50;
const MAX_QTY = 20;

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Online checkout isn’t available yet. Please contact us to place an order." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const rawItems = (body as { items?: unknown })?.items;
  if (!Array.isArray(rawItems) || rawItems.length === 0 || rawItems.length > MAX_LINES) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  const quantities = new Map<string, number>();
  for (const raw of rawItems) {
    const id = (raw as { id?: unknown })?.id;
    const qty = (raw as { quantity?: unknown })?.quantity;
    if (typeof id !== "string" || typeof qty !== "number" || !Number.isInteger(qty) || qty < 1) {
      return NextResponse.json({ error: "Invalid cart item." }, { status: 400 });
    }
    quantities.set(id, Math.min(MAX_QTY, (quantities.get(id) ?? 0) + qty));
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  let subtotalCents = 0;
  for (const [id, quantity] of quantities) {
    const product = getProduct(id);
    if (!product || !isPurchasable(product)) {
      return NextResponse.json(
        { error: "An item in your cart is no longer available. Please review your cart." },
        { status: 409 }
      );
    }
    subtotalCents += product.offer.priceCents * quantity;
    lineItems.push({
      quantity,
      price_data: {
        currency: "usd",
        unit_amount: product.offer.priceCents,
        product_data: { name: product.name, metadata: { slug: product.slug } },
      },
    });
  }

  // Shipping is a flat rate set by the owner (src/lib/site.ts), free above an optional threshold.
  const { flatRateCents, freeOverCents, label } = site.shipping;
  const shippingCents = flatRateCents === null ? null : freeOverCents !== null && subtotalCents >= freeOverCents ? 0 : flatRateCents;
  const shippingOptions: Stripe.Checkout.SessionCreateParams.ShippingOption[] =
    shippingCents === null
      ? []
      : [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              display_name: shippingCents === 0 ? `${label} (free)` : label,
              fixed_amount: { amount: shippingCents, currency: "usd" },
            },
          },
        ];

  try {
    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      shipping_address_collection: { allowed_countries: [...site.shippingCountries] },
      ...(shippingOptions.length ? { shipping_options: shippingOptions } : {}),
      billing_address_collection: "auto",
      phone_number_collection: { enabled: false },
      success_url: `${site.url}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site.url}/checkout/cancel`,
      metadata: { source: "headybuffalo.com" },
    });
    if (!session.url) throw new Error("Stripe did not return a checkout URL");
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout session error:", error);
    return NextResponse.json(
      { error: "We couldn’t start checkout. Please try again in a moment." },
      { status: 502 }
    );
  }
}
