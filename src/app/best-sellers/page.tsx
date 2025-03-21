"use client";

import React from "react";

const BestSellers: React.FC = () => {
  const products = [
    { id: 1, name: "Top Product 1", image: "/product1.jpg", price: "$25" },
    // Add more products here
  ];

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Best Sellers</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white shadow rounded-lg p-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover"
            />
            <h3 className="mt-2 text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-600">{product.price}</p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default BestSellers;
