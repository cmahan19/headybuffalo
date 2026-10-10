"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { CartLineList, CheckoutPanel } from "./CartLines";
import Drawer from "./ui/Drawer";

export default function CartDrawer() {
  const { isCartOpen, closeCart, cartItems, cartCount } = useCart();

  return (
    <Drawer
      open={isCartOpen}
      onClose={closeCart}
      title={cartCount > 0 ? `Your cart (${cartCount})` : "Your cart"}
      footer={cartItems.length > 0 ? <CheckoutPanel showPhoneOption={false} /> : undefined}
    >
      {cartItems.length === 0 ? (
        <div className="py-10 text-center">
          <p className="font-semibold">Your cart is empty.</p>
          <Link href="/shop" onClick={closeCart} className="btn-primary mt-6">
            Browse products
          </Link>
        </div>
      ) : (
        <>
          <CartLineList compact onNavigate={closeCart} />
          <Link href="/cart" onClick={closeCart} className="btn-link text-sm">
            View full cart
          </Link>
        </>
      )}
    </Drawer>
  );
}
