// src/app/checkout/CheckoutWrapper.tsx

"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "./page"; // Import the CheckoutPage component

// Replace with your actual Stripe public key
const stripePromise = loadStripe("your_publishable_key_here");

const CheckoutWrapper = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutPage />
    </Elements>
  );
};

export default CheckoutWrapper;
