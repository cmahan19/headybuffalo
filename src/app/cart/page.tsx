"use client";

import { useCart } from "../context/CartContext"; // Import useCart hook
import Image from "next/image"; // Use Next.js image component for better optimization
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // For redirecting to checkout page

const CartPage = () => {
  const { cartItems, removeItemFromCart, changeItemQuantity, clearCart, cartTotal } = useCart();
  const [totalPrice, setTotalPrice] = useState(0);
  const router = useRouter(); // To handle navigation

  const handleRemoveItem = (id: string) => {
    removeItemFromCart(id);
  };

  const handleIncreaseQuantity = (id: string) => {
    changeItemQuantity(id, 1); // Increase quantity by 1
  };

  const handleDecreaseQuantity = (id: string) => {
    changeItemQuantity(id, -1); // Decrease quantity by 1
  };

  const handleClearCart = () => {
    clearCart(); // Clear all items from the cart
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty! Please add some items before proceeding.");
      return;
    }
    router.push("/checkout"); // Redirect to checkout page
  };

  // Group items with the same ID and accumulate quantities
  const groupedItems = cartItems.reduce((acc, item) => {
    const existingItem = acc.find((i) => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      acc.push({ ...item });
    }
    return acc;
  }, []);

  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) => sum + Number(item.price || 0) * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">Your Cart</h1>
      <div className="mt-6">
        {groupedItems.length > 0 ? (
          <div>
            <ul>
              {groupedItems.map((item) => (
                <li key={item.id} className="flex justify-between items-center mt-4">
                  <div className="flex items-center">
                    <Image
                      src={item.image || "/fallback-image.jpg"} // Fallback if no image
                      alt={item.name}
                      width={50}
                      height={50}
                      className="mr-4 object-cover rounded-md"
                    />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-gray-600 text-sm">
                        ${Number(item.price || 0).toFixed(2)} each
                      </p>
                      <p className="text-gray-700 text-sm">x {item.quantity}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleIncreaseQuantity(item.id)}
                      className="bg-green-500 text-white px-2 py-1 rounded-md"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleDecreaseQuantity(item.id)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded-md"
                    >
                      -
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Total Price */}
            <div className="mt-4 text-xl font-semibold">
              <p>Total: ${totalPrice.toFixed(2)}</p>
            </div>

            {/* Checkout button */}
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={handleCheckout}
                className="bg-blue-500 text-white px-6 py-2 rounded-md"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={handleClearCart}
                className="text-red-500 hover:text-red-700"
              >
                Clear Cart
              </button>
            </div>
          </div>
        ) : (
          <p>Your cart is empty!</p>
        )}
      </div>
    </div>
  );
};

export default CartPage;
