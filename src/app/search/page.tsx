// app/search/page.tsx
"use client";  // Add this line at the very top

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const allProducts = [
  { id: 1, name: 'Featured Product 1', image: '/featured1.jpg', price: '$40' },
  { id: 2, name: 'Featured Product 2', image: '/featured2.jpg', price: '$45' },
  { id: 3, name: 'Eco-friendly Bottle', image: '/bottle.jpg', price: '$30' },
  { id: 4, name: 'Organic Cotton Shirt', image: '/shirt.jpg', price: '$25' },
];

const SearchResults: React.FC = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (query) {
      const searchQuery = query.toLowerCase();
      const results = allProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery)
      );
      setFilteredProducts(results);
    }
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Search Results for "{query}"</h2>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white shadow-md rounded-lg p-4">
              <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded" />
              <h3 className="mt-2 text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600">{product.price}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No products found for "{query}".</p>
      )}
    </div>
  );
};

export default SearchResults;
