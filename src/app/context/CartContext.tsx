"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Define types for cart items and context
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string; // Optional image property for cart items
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  addItemToCart: (item: CartItem) => void;
  removeItemFromCart: (id: string) => void;
  changeItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setCartItems: (items: CartItem[]) => void; // Optionally allow direct modification of cart
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0); // Track the number of items
  const [cartTotal, setCartTotal] = useState(0); // Track the total cost

  // Load cart from localStorage on component mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        const parsedCart: CartItem[] = JSON.parse(storedCart);
        setCartItems(parsedCart);
        updateCartSummary(parsedCart);
      } catch (error) {
        console.error("Failed to load cart from localStorage", error);
        localStorage.removeItem("cart");
        setCartItems([]);
      }
    }
  }, []);

  // Helper function to update the cart summary (item count and total price)
  const updateCartSummary = (updatedCart: CartItem[]) => {
    const totalItems = updatedCart.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = updatedCart.reduce((total, item) => total + item.price * item.quantity, 0);

    setCartCount(totalItems);
    setCartTotal(totalPrice);
  };

  // Add item to the cart, if it exists, increase quantity, else add new item
  const addItemToCart = (item: CartItem) => {
    const updatedCart = [...cartItems];
    const existingItem = updatedCart.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      updatedCart.push(item);
    }

    updateLocalStorage(updatedCart);
  };

  // Remove item from the cart by its ID
  const removeItemFromCart = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    updateLocalStorage(updatedCart);
  };

  // Change the quantity of an item in the cart (can be positive or negative)
  const changeItemQuantity = (id: string, quantityChange: number) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === id) {
        const newQuantity = item.quantity + quantityChange;
        // Prevent quantity from being less than 1
        if (newQuantity >= 1) {
          return { ...item, quantity: newQuantity };
        }
      }
      return item;
    });

    updateLocalStorage(updatedCart);
  };

  // Clear the cart entirely
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
    setCartCount(0);
    setCartTotal(0);
  };

  // Update localStorage and state to reflect changes
  const updateLocalStorage = (updatedCart: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    updateCartSummary(updatedCart);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addItemToCart,
        removeItemFromCart,
        changeItemQuantity,
        clearCart,
        setCartItems, // Optional: Allows direct modification of the cart from anywhere
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
