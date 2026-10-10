import { NextResponse } from "next/server";
import Stripe from "stripe";

// Stripe webhook endpoint. Configure in the Stripe dashboard to point at /api/stripe/webhook
// and set STRIPE_WEBHOOK_SECRET. Signature verification requires the raw request body.

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = new Stripe(secretKey);
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await request.text(), signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object;
      if (session.payment_status === "paid") {
        // OWNER-REVIEW: connect fulfillment here (order email, inventory, shipping label).
        // Stripe also emails receipts when enabled in Dashboard → Settings → Customer emails.
        console.info("Order paid", { session: session.id, amount: session.amount_total });
      }
      break;
    }
    case "checkout.session.async_payment_failed":
      console.warn("Async payment failed", { session: event.data.object.id });
      break;
  }

  return NextResponse.json({ received: true });
}
