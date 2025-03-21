// pages/api/webhook.ts

import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe("your-secret-key-here", { apiVersion: "2020-08-27" });

const endpointSecret = "your-webhook-signing-secret";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sig = req.headers["stripe-signature"];
  const body = req.body;

  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);

    // Handle different event types
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Check payment status and fulfill order (e.g., send email or update DB)
      if (session.payment_status === "paid") {
        // Payment was successful, you can proceed with fulfilling the order
        console.log("Payment was successful!");
        // Optionally send an email, update order status, etc.
      }
    }

    res.status(200).send({ received: true });
  } catch (err) {
    console.log("Error verifying webhook: ", err);
    res.status(400).send(`Webhook error: ${err.message}`);
  }
}
