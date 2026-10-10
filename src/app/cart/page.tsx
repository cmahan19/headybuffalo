"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { CartLineList, CheckoutPanel } from "../components/CartLines";
import EmptyStateGlow from "../components/art/EmptyStateGlow";
import Skeleton from "../components/ui/Skeleton";

export default function CartPage() {
  const { cartItems, hydrated } = useCart();

  return (
    <div className="container-page py-8 sm:py-12">
      <h1 className="text-display-sm sm:text-display-md">Your cart</h1>

      <div className="mt-8">
        {!hydrated ? (
          <Skeleton className="h-40" />
        ) : cartItems.length === 0 ? (
          <EmptyStateGlow
            title="Your cart is empty."
            glow="glow-accent"
            actions={
              <Link href="/shop" className="btn-primary">
                Browse products
              </Link>
            }
          />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="card">
              <CartLineList />
            </div>
            <aside aria-labelledby="summary-heading" className="panel h-fit lg:sticky lg:top-28">
              <h2 id="summary-heading" className="mb-4 text-lg font-semibold">
                Order summary
              </h2>
              <CheckoutPanel />
              <p className="mt-4 text-center text-xs text-hb-ink/60">
                See{" "}
                <Link href="/shipping-returns" className="underline">
                  shipping &amp; returns
                </Link>
                .
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
