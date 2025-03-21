"use client";

import React from "react";
import Link from "next/link";

const NewArrivals: React.FC = () => {
  // Example product list - Replace with real data from an API or database
  const products = [
    { id: 1, name: "Eco-Friendly T-Shirt", image: "/eco-shirt.jpg", price: "$20" },
    { id: 2, name: "Recycled Jeans", image: "/recycled-jeans.jpg", price: "$35" },
    { id: 3, name: "Organic Dog Food", image: "/dog-food.jpg", price: "$25" },
    { id: 4, name: "Sustainable Cat Toy", image: "/cat-toy.jpg", price: "$15" },
    { id: 5, name: "Organic Lip Balm", image: "/lip-balm.jpg", price: "$10" },
    { id: 6, name: "Natural Face Wash", image: "/face-wash.jpg", price: "$18" },
    { id: 7, name: "Eco Laundry Detergent", image: "/laundry-detergent.jpg", price: "$22" },
    { id: 8, name: "Bamboo Cutting Board", image: "/cutting-board.jpg", price: "$30" },
    { id: 9, name: "Handmade Ceramic Mug", image: "/ceramic-mug.jpg", price: "$12" },
    { id: 10, name: "Reusable Coffee Cup", image: "/coffee-cup.jpg", price: "$15" },
    { id: 11, name: "Wooden Comb", image: "/wooden-comb.jpg", price: "$8" },
    { id: 12, name: "Natural Body Lotion", image: "/body-lotion.jpg", price: "$20" },
    { id: 13, name: "Eco Yoga Mat", image: "/yoga-mat.jpg", price: "$50" },
    { id: 14, name: "Reusable Tote Bag", image: "/tote-bag.jpg", price: "$12" },
    { id: 15, name: "Sustainable Notebooks", image: "/notebooks.jpg", price: "$8" },
    { id: 16, name: "Plant-Based Candle", image: "/candle.jpg", price: "$18" },
    { id: 17, name: "Vegan Chocolate", image: "/chocolate.jpg", price: "$6" },
    { id: 18, name: "Organic Tea", image: "/tea.jpg", price: "$10" },
  ];

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sales</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <Link href={`/products/${product.id}`} key={product.id}>
            <div className="bg-white shadow rounded-lg p-4 cursor-pointer hover:shadow-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="mt-2 text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600">{product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default NewArrivals;
