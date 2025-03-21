"use client";

import React from "react";
import Link from "next/link";

const products = [
  { id: 1, name: "Ashley Cosmetics It Girl Glow oil", image: "/BuffdogFood.webp", price: 40 },
  { id: 2, name: "Mouth Wash Tabs", image: "/mouthWashTabs.webp", price: 15 },
  { id: 3, name: "Dish Washer Pods", image: "/dishwasherPods.webp", price: 17.99 },
  { id: 4, name: "Ashley Cosmetics Bar Soap", image: "/barSoap.webp", price: 15.99 },
  { id: 5, name: "Ashley Cosmetics Lip and Cheek Blush", image: "/buffaloLipCheek.webp", price: 15.99 },
  { id: 6, name: "Laundry Soap", image: "/buffaloLaundrySoap.webp", price: 17.99 },
];

const discounts = {
  "Mouth Wash Tabs": 5,
  "Laundry Soap": 10,
  "Dish Washer Pods": 15,
  "Bar Soap": 10,
  default: 20,
};

const FeaturedProducts: React.FC = () => {
  return (
    <div className="flex overflow-x-auto space-x-6 p-4">
      {products.map((product) => {
        const discountPercent = discounts[product.name] || discounts.default;
        const salePrice = (product.price * (1 - discountPercent / 100)).toFixed(2);

        return (
          <Link href={`/products/${product.id}`} key={product.id}>
            <div className="bg-white shadow-md rounded-lg p-4 min-w-[200px] cursor-pointer hover:shadow-lg transition-shadow">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="mt-2 text-lg font-semibold text-center">{product.name}</h3>

              {discountPercent > 0 ? (
                <div className="text-center mt-2">
                  <p className="text-gray-500 line-through">${product.price.toFixed(2)}</p>
                  <p className="text-red-500 font-bold text-lg">
                    SALE {discountPercent}% OFF
                  </p>
                  <p className="text-red-600 font-bold text-xl">${salePrice}</p>
                </div>
              ) : (
                <p className="text-gray-600 text-center mt-2">${product.price.toFixed(2)}</p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default FeaturedProducts;
