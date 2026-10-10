"use client";

import Image from "next/image";
import Link from "next/link";
import { MAX_QTY, useCart, type CartItem } from "../context/CartContext";
import { formatPrice } from "@/lib/catalog";
import { site } from "@/lib/site";
import Alert from "./ui/Alert";
import { useCheckout } from "./useCheckout";

const lineCents = (i: CartItem) => Math.round(i.price * 100) * i.quantity;

export function cartSubtotalCents(items: CartItem[]) {
  return items.reduce((n, i) => n + lineCents(i), 0);
}

export function CartLineList({ compact = false, onNavigate }: { compact?: boolean; onNavigate?: () => void }) {
  const { cartItems, setItemQuantity, removeItemFromCart } = useCart();
  const thumb = compact ? "h-16 w-16" : "h-20 w-20 sm:h-24 sm:w-24";

  return (
    <ul className="divide-y divide-hb-ink/10">
      {cartItems.map((item) => (
        <li key={item.id} className={`flex gap-4 ${compact ? "py-4" : "p-4 sm:p-5"}`}>
          <Link
            href={`/products/${item.id}`}
            onClick={onNavigate}
            tabIndex={-1}
            aria-hidden="true"
            className={`relative ${thumb} shrink-0 overflow-hidden rounded-xl bg-hb-sand/50`}
          >
            {item.image && <Image src={item.image} alt="" fill sizes="96px" className="object-cover" />}
          </Link>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-start justify-between gap-3">
              <Link href={`/products/${item.id}`} onClick={onNavigate} className="font-semibold hover:underline">
                {item.name}
              </Link>
              <p className="shrink-0 font-semibold">{formatPrice(lineCents(item))}</p>
            </div>
            <p className="text-sm text-hb-ink/60">{formatPrice(Math.round(item.price * 100))} each</p>
            <div className="mt-auto flex items-center justify-between gap-3 pt-2">
              <div className="inline-flex items-center rounded-full border border-hb-ink/20 bg-white" role="group" aria-label={`Quantity for ${item.name}`}>
                <button
                  type="button"
                  className="h-11 w-11 rounded-l-full text-lg"
                  onClick={() => setItemQuantity(item.id, item.quantity - 1)}
                  aria-label={item.quantity === 1 ? `Remove ${item.name}` : `Decrease quantity of ${item.name}`}
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                <button
                  type="button"
                  className="h-11 w-11 rounded-r-full text-lg disabled:opacity-40"
                  onClick={() => setItemQuantity(item.id, item.quantity + 1)}
                  disabled={item.quantity >= MAX_QTY}
                  aria-label={`Increase quantity of ${item.name}`}
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeItemFromCart(item.id)}
                className="min-h-[44px] px-2 text-sm font-medium text-hb-ink/60 underline-offset-2 hover:text-danger hover:underline"
              >
                Remove<span className="sr-only"> {item.name}</span>
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function CheckoutPanel({ showPhoneOption = true }: { showPhoneOption?: boolean }) {
  const { cartItems } = useCart();
  const { checkout, status, error } = useCheckout();

  return (
    <div>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd className="font-semibold">{formatPrice(cartSubtotalCents(cartItems))}</dd>
        </div>
        <div className="flex justify-between text-hb-ink/60">
          <dt>Shipping &amp; tax</dt>
          <dd>Calculated at checkout</dd>
        </div>
      </dl>
      <button type="button" onClick={checkout} disabled={status === "loading" || cartItems.length === 0} className="btn-primary btn-lg mt-4 w-full">
        {status === "loading" ? "Starting secure checkout…" : "Check out securely"}
      </button>
      {status === "error" && (
        <Alert tone="error" className="mt-3">
          {error} You can try again, or order by phone at{" "}
          <a href={site.phone.href} className="font-semibold underline">
            {site.phone.display}
          </a>
          .
        </Alert>
      )}
      <p className="mt-3 text-center text-xs text-hb-ink/60">Payment is completed on Stripe’s secure checkout page.</p>
      {showPhoneOption && (
        <a href={site.phone.href} className="btn-link mx-auto flex w-fit text-sm">
          Prefer to order by phone? {site.phone.display}
        </a>
      )}
    </div>
  );
}
