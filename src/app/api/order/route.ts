// Path: app/api/order/route.ts

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2020-08-27' });

interface OrderRequest {
  cartItems: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  shippingInfo: {
    name: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
  };
}

export async function POST(request: Request) {
  const { cartItems, shippingInfo }: OrderRequest = await request.json();

  try {
    // Prepare line items for Stripe Checkout
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: 'usd', // change this to the currency you need
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100, // Stripe expects the amount in cents
      },
      quantity: item.quantity,
    }));

    // Create a Checkout Session with Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.HOST_URL}/checkout/success`,
      cancel_url: `${process.env.HOST_URL}/checkout/cancel`,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      customer_email: shippingInfo.email, // Send customer email to Stripe
      metadata: {
        user_name: shippingInfo.name,
        user_address: shippingInfo.address,
        user_city: shippingInfo.city,
        user_postal_code: shippingInfo.postalCode,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    return NextResponse.json({ error: 'Something went wrong with the payment' }, { status: 500 });
  }
}
