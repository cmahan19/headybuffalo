"use client";

import { useEffect } from "react";
import { useCart } from "../../context/CartContext";

export default function ClearCartOnMount() {
  const { clearCart, hydrated } = useCart();
  useEffect(() => {
    if (hydrated) clearCart();
    // Run once after the stored cart has loaded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);
  return null;
}
