"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getProduct, isPurchasable } from "@/lib/catalog";

// Cart lines store only the product slug (as `id`) and quantity as the source of truth.
// Name/price/image are copied for display but are always re-derived from the catalog,
// and the server re-prices everything at checkout.
export interface CartItem {
  id: string;
  name: string;
  price: number; // dollars, display only
  quantity: number;
  image?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  hydrated: boolean;
  addItemToCart: (item: Pick<CartItem, "id" | "quantity">) => void;
  removeItemFromCart: (id: string) => void;
  changeItemQuantity: (id: string, quantityChange: number) => void;
  setItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setCartItems: (items: CartItem[]) => void;
  /** Cart drawer visibility. */
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  /** Last cart change, announced to screen readers. */
  announcement: string;
}

const STORAGE_KEY = "hb_cart_v2";
export const MAX_QTY = 20;

const CartContext = createContext<CartContextType | undefined>(undefined);

function normalize(items: { id: string; quantity: number }[]): CartItem[] {
  const merged = new Map<string, number>();
  for (const { id, quantity } of items) {
    const q = Math.floor(Number(quantity));
    if (typeof id !== "string" || !Number.isFinite(q) || q < 1) continue;
    merged.set(id, Math.min(MAX_QTY, (merged.get(id) ?? 0) + q));
  }
  const out: CartItem[] = [];
  for (const [id, quantity] of merged) {
    const p = getProduct(id);
    if (!p || !isPurchasable(p)) continue;
    out.push({ id, quantity, name: p.name, price: p.offer.priceCents / 100, image: p.image.src });
  }
  return out;
}

function readStorage(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? normalize(JSON.parse(raw)) : [];
  } catch {
    return [];
  }
}

function writeStorage(items: CartItem[]) {
  try {
    if (items.length) {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(items.map(({ id, quantity }) => ({ id, quantity })))
      );
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Storage unavailable (private mode, blocked); the cart still works for this page view.
  }
}

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  useEffect(() => {
    setItems(readStorage());
    setHydrated(true);
    // Keep multiple tabs in sync.
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setItems(readStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const commit = useCallback((next: { id: string; quantity: number }[], message = "") => {
    const normalized = normalize(next);
    writeStorage(normalized);
    setItems(normalized);
    if (message) setAnnouncement(message);
  }, []);

  const value = useMemo<CartContextType>(() => {
    const nameOf = (id: string) => cartItems.find((i) => i.id === id)?.name ?? getProduct(id)?.name ?? "Item";
    const setItemQuantity = (id: string, quantity: number) =>
      commit(
        quantity < 1
          ? cartItems.filter((i) => i.id !== id)
          : cartItems.map((i) => (i.id === id ? { ...i, quantity: Math.min(MAX_QTY, quantity) } : i)),
        quantity < 1 ? `${nameOf(id)} removed from cart.` : `${nameOf(id)} quantity ${Math.min(MAX_QTY, quantity)}.`
      );

    return {
      cartItems,
      hydrated,
      cartCount: cartItems.reduce((n, i) => n + i.quantity, 0),
      cartTotal: cartItems.reduce((n, i) => n + i.price * i.quantity, 0),
      addItemToCart: (item) =>
        commit([...cartItems, { id: item.id, quantity: item.quantity }], `${nameOf(item.id)} added to cart.`),
      removeItemFromCart: (id) => commit(cartItems.filter((i) => i.id !== id), `${nameOf(id)} removed from cart.`),
      changeItemQuantity: (id, delta) => {
        const current = cartItems.find((i) => i.id === id);
        if (current) setItemQuantity(id, Math.max(1, current.quantity + delta));
      },
      setItemQuantity,
      clearCart: () => commit([]),
      setCartItems: (items) => commit(items),
      isCartOpen,
      openCart,
      closeCart,
      announcement,
    };
  }, [cartItems, hydrated, commit, isCartOpen, openCart, closeCart, announcement]);

  return (
    <CartContext.Provider value={value}>
      {children}
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
