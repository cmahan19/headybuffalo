"use client";

import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext"; // Import the useCart hook for cart data
import { CardElement, useStripe, useElements, Elements, PaymentRequestButtonElement } from "@stripe/react-stripe-js"; // Import required hooks
import { loadStripe } from "@stripe/stripe-js"; // Import loadStripe to initialize Stripe

// Define a simple type for the shipping form data
interface ShippingInfo {
  name: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
}

// Load the Stripe object with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!); // Replace with your Stripe publishable key

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart(); // Get cart data from context
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [paymentRequest, setPaymentRequest] = useState<any>(null);

  const stripe = useStripe(); // Use the stripe hook
  const elements = useElements(); // Use the elements hook

  // Validate form fields
  const validateForm = () => {
    const { name, email, address, city, postalCode } = shippingInfo;
    if (!name || !email || !address || !city || !postalCode) {
      setIsFormValid(false);
      return false;
    }
    setIsFormValid(true);
    return true;
  };

  // Set up payment request for Google Pay / Apple Pay
  useEffect(() => {
    if (!stripe) return;

    const pr = stripe.paymentRequest({
      country: "US",
      currency: "usd",
      total: {
        label: "Total",
        amount: cartTotal * 100, // Convert to cents
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment().then((result) => {
      if (result?.applePay || result?.googlePay) {
        setPaymentRequest(pr); // PaymentRequest object available if user can pay via Apple/Google Pay
      }
    });
  }, [stripe, cartTotal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return; // Stop if the form is not valid

    setIsSubmitting(true);

    try {
      // Create payment intent on the backend
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: cartTotal * 100 }), // Amount in cents
      });

      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }

      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
    } catch (error) {
      console.error("Error creating payment intent", error);
      setIsSubmitting(false);
      alert("An error occurred. Please try again.");
    }
  };

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      console.error(error.message);
      alert(error.message);
      setIsSubmitting(false);
    } else if (paymentIntent?.status === "succeeded") {
      alert("Payment successful! Your order is on the way.");
      clearCart(); // Clear the cart after successful checkout
      setIsSubmitting(false);
    }
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold">Checkout</h1>

        {/* Cart Summary */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold">Cart Summary</h2>
          <ul className="mt-4">
            {cartItems.length === 0 ? (
              <p>Your cart is empty. Please add some items before proceeding to checkout.</p>
            ) : (
              cartItems.map((item) => (
                <li key={item.id} className="flex justify-between items-center mt-4">
                  <div className="flex items-center">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-gray-600 text-sm">
                      ${Number(item.price).toFixed(2)} each x {item.quantity}
                    </p>
                  </div>
                </li>
              ))
            )}
          </ul>

          <div className="mt-4 text-xl font-semibold">
            <p>Total: ${cartTotal.toFixed(2)}</p>
          </div>
        </div>

        {/* Shipping Info Form */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold">Shipping Information</h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={shippingInfo.name}
                onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={shippingInfo.email}
                onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-semibold">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={shippingInfo.address}
                onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-semibold">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={shippingInfo.city}
                onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label htmlFor="postalCode" className="block text-sm font-semibold">
                Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={shippingInfo.postalCode}
                onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <CardElement className="w-full p-2 border border-gray-300 rounded-md" />
            </div>

            {/* Payment Request Button (Google Pay / Apple Pay) */}
            {paymentRequest && (
              <div className="mt-4">
                <PaymentRequestButtonElement
                  paymentRequest={paymentRequest}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  style={{ paymentRequestButton: { theme: "dark", height: "40px" } }}
                />
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 text-white px-6 py-2 rounded-md"
              >
                {isSubmitting ? "Processing..." : "Proceed to Payment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Elements>
  );
};

export default CheckoutPage;
