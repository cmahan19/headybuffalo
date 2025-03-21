"use client"; // Ensure the code is client-side only

import { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { notFound, useParams } from "next/navigation";

const products = [
  { id: "1", name: "Organic Labrador Dog Food", image: "/BuffdogFood.webp", price: 40, salePrice: 32, description: "Premium organic dog food made with natural ingredients.", rating: 4.8, reviews: 120 },
  { id: "2", name: "Mouth Wash Tabs", image: "/mouthWashTabs.webp", price: 35, salePrice: 28, description: "Eco-friendly mouthwash tablets for fresh breath.", rating: 4.5, reviews: 98 },
  { id: "3", name: "Dish Washer Pods", image: "/dishwasherPods.webp", price: 17.99, salePrice: 14.99, description: "Biodegradable dishwasher pods for a spotless clean.", rating: 4.7, reviews: 75 },
  { id: "4", name: "Bar Soap", image: "/barSoap.webp", price: 15.99, salePrice: 12.99, description: "Handcrafted organic soap for a refreshing cleanse.", rating: 4.9, reviews: 150 },
  { id: "5", name: "Lip and Cheek Blush", image: "/buffaloLipCheek.webp", price: 15.99, salePrice: 12.99, description: "Multi-purpose tint for a natural glow.", rating: 4.6, reviews: 85 },
  { id: "6", name: "Laundry Soap", image: "/buffaloLaundrySoap.webp", price: 17.99, salePrice: 13.99, description: "Plant-based detergent for an eco-friendly wash.", rating: 4.8, reviews: 110 },
];

export default function ProductPage() {
  const params = useParams(); // Access dynamic params using useParams
  const { id } = params; // Use dynamic `id` from params

  const product = products.find((p) => p.id === id);
  if (!product) return notFound(); // Handle non-existent products

  // Helper function to render stars for ratings
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;

    return (
      <>
        {[...Array(fullStars)].map((_, idx) => (
          <span key={`full-${idx}`} className="text-yellow-400">&#9733;</span>
        ))}
        {halfStars > 0 && <span className="text-yellow-400">&#9733;</span>}
        {[...Array(emptyStars)].map((_, idx) => (
          <span key={`empty-${idx}`} className="text-gray-300">&#9733;</span>
        ))}
      </>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-lg">
      {/* Product Image */}
      <div className="flex justify-center mb-8">
        <img src={product.image} alt={product.name} className="w-full max-w-md h-auto object-cover rounded-lg shadow-lg" />
      </div>

      {/* Product Info */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
        <p className="text-lg text-gray-700 mt-4">{product.description}</p>

        {/* Price & Sale Info */}
        <div className="mt-6">
          <p className="text-2xl font-semibold">
            {product.salePrice ? (
              <>
                <span className="text-gray-500 line-through mr-2">${product.price.toFixed(2)}</span>
                <span className="text-red-500">${product.salePrice.toFixed(2)}</span> (Subscription Price)
              </>
            ) : (
              <span>${product.price.toFixed(2)}</span>
            )}
          </p>
        </div>

        {/* Star Rating */}
        <div className="mt-4 flex justify-center items-center">
          <div className="flex items-center space-x-1">
            {renderStars(product.rating)}
            <span className="text-lg text-gray-600 ml-2">({product.reviews} reviews)</span>
          </div>
        </div>

        {/* PayPal Script Provider (Initialize PayPal SDK) */}
        <PayPalScriptProvider options={{ "client-id": "Ae4GbmazHZS-iJHo3v0g6Es4fwSoZW4OA80PWD3gy6hraBOk3BDY1aV-ylrKDlOLrMsvjvvJsLx-jgO2", components: "buttons" }}>
          <div className="mt-8 space-x-6 flex justify-center">
            {/* PayPal Credit Card Button */}
            <div>
              <PayPalButtons
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: product.salePrice || product.price,
                        },
                        description: product.name,
                      },
                    ],
                  });
                }}
                onApprove={(data, actions) => {
                  actions.order.capture().then((details) => {
                    alert(`Payment completed using Credit Card! Transaction ID: ${details.id}`);
                  });
                }}
                style={{
                  layout: "horizontal",
                  color: "blue",
                  shape: "pill",
                  label: "checkout",
                }}
              />
            </div>

            {/* PayPal Subscription Button */}
            {product.salePrice && (
              <div>
                <PayPalButtons
                  style={{
                    layout: "horizontal",
                    color: "gold",
                    shape: "pill",
                    label: "subscribe",
                  }}
                  createSubscription={(data, actions) => {
                    return actions.subscription.create({
                      plan_id: "YOUR_PAYPAL_PLAN_ID", // Replace with actual subscription plan ID from PayPal
                    });
                  }}
                  onApprove={(data, actions) => {
                    alert("Subscription created successfully!");
                  }}
                />
              </div>
            )}

            {/* Pay Later Button */}
            <div>
              <PayPalButtons
                style={{
                  layout: "horizontal",
                  color: "silver",
                  shape: "pill",
                  label: "pay", // Use the 'pay' label for compatibility
                }}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: product.salePrice || product.price,
                        },
                        description: product.name,
                      },
                    ],
                  });
                }}
                onApprove={(data, actions) => {
                  actions.order.capture().then((details) => {
                    alert(`Payment completed using Pay Later! Transaction ID: ${details.id}`);
                  });
                }}
              />
            </div>
          </div>
        </PayPalScriptProvider>
      </div>
    </div>
  );
}
