"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";

/** Starts a Stripe Checkout Session from the current cart. Prices are set server-side. */
export function useCheckout() {
  const { cartItems } = useCart();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function checkout() {
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems.map(({ id, quantity }) => ({ id, quantity })) }),
      });
      const data: { url?: string; error?: string } = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.error || "Checkout is unavailable right now.");
      window.location.assign(data.url);
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Checkout is unavailable right now.");
    }
  }

  return { checkout, status, error };
}
