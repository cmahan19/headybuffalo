import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with your secret key (this should be kept private)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

// POST request to create payment intent
export async function POST(request: Request) {
  try {
    const { amount } = await request.json();
    
    // Validate amount (ensure it's a positive number)
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be a positive number." },
        { status: 400 }
      );
      
    }

    // Create a payment intent with the provided amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd", // You can modify the currency as needed
      payment_method_types: ["card"], // We are only accepting card payments
    });

    // Return the client secret for Stripe to the frontend
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    
    // Return a meaningful error message to the client
    return NextResponse.json(
      { error: "Failed to create payment intent." },
      { status: 500 }
    );
  }
}
