// app/categories/[category]/page.tsx
import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";

// Placeholder data - Replace with actual data fetching
const categoryProducts = {
  clothing: [
    { id: 1, name: "Eco-Friendly T-Shirt", image: "/eco-shirt.jpg" },
    { id: 2, name: "Recycled Jeans", image: "/recycled-jeans.jpg" },
  ],
  "pet-products": [
    { id: 3, name: "Organic Dog Food", image: "/dog-food.jpg" },
    { id: 4, name: "Sustainable Cat Toy", image: "/cat-toy.jpg" },
  ],
  beauty: [
    { id: 5, name: "Organic Lip Balm", image: "/lip-balm.jpg" },
    { id: 6, name: "Natural Face Wash", image: "/face-wash.jpg" },
  ],
  cleaning: [
    { id: 7, name: "Eco Laundry Detergent", image: "/laundry-detergent.jpg" },
    { id: 8, name: "Sustainable Cleaning Spray", image: "/cleaning-spray.jpg" },
  ],
  "local-makers": [
    { id: 9, name: "Handmade Ceramic Mug", image: "/ceramic-mug.jpg" },
    { id: 10, name: "Locally Sourced Candle", image: "/candle.jpg" },
  ],
  "home-kitchen": [
    { id: 11, name: "Reusable Food Wrap", image: "/food-wrap.jpg" },
    { id: 12, name: "Bamboo Cutting Board", image: "/cutting-board.jpg" },
  ],
};

const CategoryPage = ({ params }: { params: { category: string } }) => {
  const { category } = params;

  // Get products for the selected category
  const products = categoryProducts[category as keyof typeof categoryProducts];

  // If no products are found, show a 404
  if (!products) {
    notFound(); // Returns a 404 page
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 capitalize">{category.replace("-", " ")}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {products.map((product) => (
          <Link href={`/products/${product.id}`} key={product.id}>
            <div className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-32 object-cover rounded"
              />
              <h3 className="mt-2 text-center text-lg font-semibold">{product.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
