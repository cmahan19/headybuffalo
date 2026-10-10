import { redirect } from "next/navigation";

// Retired: checkout now happens on Stripe Checkout, started from /cart via /api/checkout.
// /checkout is also redirected in next.config.ts. Safe to delete this file and CheckoutWrapper.tsx.
export default function CheckoutPage(): never {
  redirect("/cart");
}
