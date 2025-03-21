// Filename: components/ProductCarousel.tsx

"use client"; // Mark this as a client component

import React from "react";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  image: string;
  price: string;
}

const ProductCarousel: React.FC = () => {
  // Sample data - you can fetch this from an API or dynamic source
  const products: Product[] = [
    { id: 1, name: "Organic Cotten T-Shirt", image: "/shirt.webp", price: "$20" },
    { id: 2, name: "Recycled Jeans", image: "/recycled-jeans.jpg", price: "$35" },
    { id: 3, name: "Organic Dog Food", image: "/dog-food.jpg", price: "$25" },
    { id: 4, name: "Sustainable Cat Toy", image: "/cat-toy.jpg", price: "$15" },
    { id: 5, name: "Organic Lip Balm", image: "/lip-balm.jpg", price: "$10" },
    { id: 6, name: "Natural Face Wash", image: "/face-wash.jpg", price: "$18" },
    { id: 7, name: "Eco Laundry Detergent", image: "/laundry-detergent.jpg", price: "$22" },
    { id: 8, name: "Bamboo Cutting Board", image: "/cutting-board.jpg", price: "$30" },
    { id: 9, name: "Handmade Ceramic Mug", image: "/ceramic-mug.jpg", price: "$12" },
  ];

  return (
    <div className="flex overflow-x-scroll space-x-4 py-4 scrollbar-hide">
      {products.map((product) => (
        <Link href={`/products/${product.id}`} key={product.id}>
          <div className="w-60 bg-white shadow-lg rounded-lg p-4 cursor-pointer hover:shadow-xl transition-shadow duration-200 ease-in-out">
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
  );
};

export default ProductCarousel;
