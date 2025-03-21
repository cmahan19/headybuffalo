// components/CategorySection.tsx
import React from "react";
import Link from "next/link";

const CategorySection: React.FC = () => {
  // Updated categories array with combined "Eco-Friendly for Small Spaces" and a new profitable category
  const categories = [
    { id: "clothing", name: "Clothing", image: "/clothing.webp" },
    { id: "pet-products", name: "Pet Products", image: "/pet.webp" },
    { id: "beauty", name: "Beauty", image: "/beauty.webp" },
    { id: "cleaning", name: "Cleaning", image: "/cleaning.webp" },
    { id: "local-makers", name: "Local Makers", image: "/makers.webp" },
    { id: "home-kitchen", name: "Home & Kitchen", image: "/kitchen.webp" },
    { id: "eco-small-spaces", name: "Small Spaces", image: "/small-space.webp" },
    { id: "food", name: "Food", image: "/food.webp" },
  ];

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Link href={`/categories/${category.id}`} key={category.id}>
            <div className="relative h-40 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white">
                <h3 className="text-lg font-bold">{category.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
