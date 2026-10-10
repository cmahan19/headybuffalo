"use client";

import { useState } from "react";
import { MAX_QTY, useCart } from "../context/CartContext";

export default function AddToCart({ slug }: { slug: string; name?: string }) {
  const { addItemToCart, cartItems, openCart } = useCart();
  const [qty, setQty] = useState(1);
  const inCart = cartItems.find((i) => i.id === slug)?.quantity ?? 0;
  const remaining = MAX_QTY - inCart;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="qty" className="sr-only">
          Quantity
        </label>
        <div className="inline-flex items-center rounded-full border border-hb-ink/20 bg-white">
          <button
            type="button"
            className="h-11 w-11 rounded-l-full text-lg disabled:opacity-40"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <input
            id="qty"
            type="number"
            inputMode="numeric"
            min={1}
            max={Math.max(1, remaining)}
            value={qty}
            onChange={(e) => setQty(Math.min(Math.max(1, remaining), Math.max(1, Math.floor(Number(e.target.value) || 1))))}
            className="h-11 w-12 border-x border-hb-ink/10 text-center [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            type="button"
            className="h-11 w-11 rounded-r-full text-lg disabled:opacity-40"
            onClick={() => setQty((q) => Math.min(remaining, q + 1))}
            disabled={qty >= remaining}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <button
          type="button"
          className="btn-primary btn-lg flex-1 sm:flex-none"
          disabled={remaining < 1}
          onClick={() => {
            addItemToCart({ id: slug, quantity: Math.min(qty, remaining) });
            setQty(1);
            // The drawer confirms the add and offers checkout; the cart context announces it to screen readers.
            openCart();
          }}
        >
          {remaining < 1 ? "Maximum quantity in cart" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}
